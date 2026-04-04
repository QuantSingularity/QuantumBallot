# Secrets Directory

**Never commit real secret files to version control.**

This directory holds Docker secrets used by `docker-compose.yml`.
Run `./setup.sh` to auto-generate these files for local development:

- `postgres_password.txt` — PostgreSQL password
- `redis_password.txt` — Redis password
- `jwt_secret.txt` — JWT signing secret
