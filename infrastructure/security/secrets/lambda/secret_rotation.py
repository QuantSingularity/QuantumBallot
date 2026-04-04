"""
AWS Lambda function for automatic secret rotation
Implements secure password rotation for database credentials
"""

import json
import logging
import os
import secrets
import string

import boto3
import psycopg2
from botocore.exceptions import ClientError
from psycopg2 import sql

logger = logging.getLogger()
logger.setLevel(logging.INFO)

secrets_client = boto3.client("secretsmanager")
rds_client = boto3.client("rds")


def lambda_handler(event, context):
    """
    Main Lambda handler for secret rotation
    """
    try:
        secret_arn = event["SecretId"]
        token = event["ClientRequestToken"]
        step = event["Step"]

        logger.info(f"Starting secret rotation for {secret_arn}, step: {step}")

        if step == "createSecret":
            create_secret(secret_arn, token)
        elif step == "setSecret":
            set_secret(secret_arn, token)
        elif step == "testSecret":
            test_secret(secret_arn, token)
        elif step == "finishSecret":
            finish_secret(secret_arn, token)
        else:
            raise ValueError(f"Invalid step parameter: {step}")

        logger.info(f"Successfully completed step {step} for {secret_arn}")
        send_notification(f"Successfully completed rotation step: {step}", secret_arn)

        return {
            "statusCode": 200,
            "body": json.dumps(
                {"message": f"Successfully completed {step}", "secretArn": secret_arn}
            ),
        }

    except Exception as e:
        logger.error(f"Error in secret rotation: {str(e)}")
        send_notification(
            f"Rotation failed at step {event.get('Step', 'unknown')}: {str(e)}",
            event.get("SecretId", "unknown"),
        )
        raise


def create_secret(secret_arn, token):
    """
    Create a new secret version with a new password
    """
    try:
        current_secret = get_secret_dict(secret_arn, "AWSCURRENT")
        new_password = generate_password()
        new_secret = current_secret.copy()
        new_secret["password"] = new_password

        secrets_client.put_secret_value(
            SecretId=secret_arn,
            ClientRequestToken=token,
            SecretString=json.dumps(new_secret),
            VersionStage="AWSPENDING",
        )

        logger.info(f"Created new secret version for {secret_arn}")

    except ClientError as e:
        if e.response["Error"]["Code"] == "ResourceExistsException":
            logger.info(f"Secret version already exists for {secret_arn}")
        else:
            raise


def set_secret(secret_arn, token):
    """
    Set the new password in the database
    """
    try:
        current_secret = get_secret_dict(secret_arn, "AWSCURRENT")
        pending_secret = get_secret_dict(secret_arn, "AWSPENDING", token)

        connection = get_database_connection(current_secret)

        try:
            with connection.cursor() as cursor:
                username = pending_secret["username"]
                new_password = pending_secret["password"]

                # Use psycopg2.sql to safely compose the identifier (username)
                # while keeping the password as a parameterized value
                cursor.execute(
                    sql.SQL("ALTER USER {} WITH PASSWORD %s").format(
                        sql.Identifier(username)
                    ),
                    (new_password,),
                )

                connection.commit()
                logger.info(f"Successfully updated password for user {username}")

        finally:
            connection.close()

    except Exception as e:
        logger.error(f"Error setting secret in database: {str(e)}")
        raise


def test_secret(secret_arn, token):
    """
    Test the new password by connecting to the database
    """
    try:
        pending_secret = get_secret_dict(secret_arn, "AWSPENDING", token)
        connection = get_database_connection(pending_secret)

        try:
            with connection.cursor() as cursor:
                cursor.execute("SELECT 1")
                result = cursor.fetchone()

                if result[0] != 1:
                    raise Exception("Test query returned unexpected result")

                logger.info(f"Successfully tested new credentials for {secret_arn}")

        finally:
            connection.close()

    except Exception as e:
        logger.error(f"Error testing secret: {str(e)}")
        raise


def finish_secret(secret_arn, token):
    """
    Finalize the rotation by updating version stages
    """
    try:
        current_version_id = get_secret_version_id(secret_arn, "AWSCURRENT")

        secrets_client.update_secret_version_stage(
            SecretId=secret_arn,
            VersionStage="AWSCURRENT",
            MoveToVersionId=token,
            RemoveFromVersionId=current_version_id,
        )

        logger.info(f"Successfully finished rotation for {secret_arn}")

    except Exception as e:
        logger.error(f"Error finishing secret rotation: {str(e)}")
        raise


def get_secret_dict(secret_arn, stage, token=None):
    """
    Get secret as dictionary
    """
    try:
        kwargs = {"SecretId": secret_arn, "VersionStage": stage}

        if token:
            kwargs["VersionId"] = token

        response = secrets_client.get_secret_value(**kwargs)
        return json.loads(response["SecretString"])

    except Exception as e:
        logger.error(f"Error getting secret: {str(e)}")
        raise


def get_secret_version_id(secret_arn, stage):
    """
    Get version ID for a specific stage
    """
    try:
        response = secrets_client.describe_secret(SecretId=secret_arn)

        for version_id, stages in response["VersionIdsToStages"].items():
            if stage in stages:
                return version_id

        raise Exception(f"Version stage {stage} not found for secret {secret_arn}")

    except Exception as e:
        logger.error(f"Error getting version ID: {str(e)}")
        raise


def get_database_connection(secret_dict):
    """
    Create database connection using secret credentials
    """
    try:
        connection = psycopg2.connect(
            host=secret_dict["host"],
            port=secret_dict.get("port", 5432),
            database=secret_dict["dbname"],
            user=secret_dict["username"],
            password=secret_dict["password"],
            sslmode="require",
            connect_timeout=10,
        )
        return connection

    except Exception as e:
        logger.error(f"Error connecting to database: {str(e)}")
        raise


def generate_password(length=32):
    """
    Generate a cryptographically secure random password
    """
    lowercase = string.ascii_lowercase
    uppercase = string.ascii_uppercase
    digits = string.digits
    special_chars = "!@#$%^&*"
    all_chars = lowercase + uppercase + digits + special_chars

    # Guarantee at least one character from each required set
    password = [
        secrets.choice(lowercase),
        secrets.choice(uppercase),
        secrets.choice(digits),
        secrets.choice(special_chars),
    ]

    # Fill remaining characters
    password += [secrets.choice(all_chars) for _ in range(length - 4)]

    # Shuffle using a cryptographically secure method
    password_list = list(password)
    for i in range(len(password_list) - 1, 0, -1):
        j = secrets.randbelow(i + 1)
        password_list[i], password_list[j] = password_list[j], password_list[i]

    return "".join(password_list)


def send_notification(message, secret_arn):
    """
    Send notification about rotation status
    """
    try:
        sns_client = boto3.client("sns")
        topic_arn = os.environ.get("SNS_TOPIC_ARN")

        if topic_arn:
            sns_client.publish(
                TopicArn=topic_arn,
                Subject=f"Secret Rotation Alert - {os.environ.get('ENVIRONMENT', 'unknown')}",
                Message=f"Secret: {secret_arn}\nMessage: {message}",
            )

    except Exception as e:
        logger.error(f"Error sending notification: {str(e)}")
        # Do not re-raise — notification failures must not abort rotation
