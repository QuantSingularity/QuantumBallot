# Terraform main configuration for the dev environment

terraform {
  required_version = ">= 1.6.0, < 2.0.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = var.aws_region
}

data "aws_caller_identity" "current" {}
data "aws_availability_zones" "available" {}

# --- Networking --- #
resource "aws_vpc" "main" {
  cidr_block           = "10.0.0.0/16"
  enable_dns_support   = true
  enable_dns_hostnames = true

  tags = {
    Name        = "${var.environment_name}-QuantumBallot-vpc"
    Environment = var.environment_name
    Project     = "QuantumBallot"
  }
}

resource "aws_subnet" "public" {
  count                   = 2
  vpc_id                  = aws_vpc.main.id
  cidr_block              = cidrsubnet(aws_vpc.main.cidr_block, 8, count.index)
  availability_zone       = data.aws_availability_zones.available.names[count.index]
  map_public_ip_on_launch = false

  tags = {
    Name        = "${var.environment_name}-QuantumBallot-public-subnet-${count.index}"
    Environment = var.environment_name
    Project     = "QuantumBallot"
  }
}

resource "aws_subnet" "private" {
  count             = 2
  vpc_id            = aws_vpc.main.id
  cidr_block        = cidrsubnet(aws_vpc.main.cidr_block, 8, count.index + 10)
  availability_zone = data.aws_availability_zones.available.names[count.index]

  tags = {
    Name        = "${var.environment_name}-QuantumBallot-private-subnet-${count.index}"
    Environment = var.environment_name
    Project     = "QuantumBallot"
  }
}

resource "aws_internet_gateway" "gw" {
  vpc_id = aws_vpc.main.id

  tags = {
    Name        = "${var.environment_name}-QuantumBallot-igw"
    Environment = var.environment_name
    Project     = "QuantumBallot"
  }
}

resource "aws_route_table" "public" {
  vpc_id = aws_vpc.main.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.gw.id
  }

  tags = {
    Name        = "${var.environment_name}-QuantumBallot-public-rt"
    Environment = var.environment_name
    Project     = "QuantumBallot"
  }
}

resource "aws_route_table_association" "public" {
  count          = length(aws_subnet.public)
  subnet_id      = aws_subnet.public[count.index].id
  route_table_id = aws_route_table.public.id
}

# --- Backend Module --- #
module "backend" {
  source = "../../modules/backend"

  environment_name = var.environment_name
  vpc_id           = aws_vpc.main.id
  subnet_ids       = aws_subnet.private[*].id
  backend_port     = var.backend_port
  certificate_arn  = var.frontend_certificate_arn
  docker_image_uri = "${data.aws_caller_identity.current.account_id}.dkr.ecr.${var.aws_region}.amazonaws.com/${var.environment_name}/QuantumBallot-backend:${var.backend_docker_image_tag}"
}

# --- Frontend Web Module --- #
module "frontend_web" {
  source = "../../modules/frontend_web"

  environment_name = var.environment_name
  domain_name      = var.frontend_domain_name
  certificate_arn  = var.frontend_certificate_arn
  backend_api_url  = module.backend.alb_dns_name
}

# --- Outputs --- #
output "backend_alb_dns_name" {
  description = "DNS name of the backend Application Load Balancer"
  value       = module.backend.alb_dns_name
}

output "backend_ecr_repository_url" {
  description = "URL of the backend ECR repository"
  value       = module.backend.ecr_repository_url
}

output "frontend_website_url" {
  description = "URL of the deployed web frontend"
  value       = module.frontend_web.website_url
}

output "frontend_s3_bucket_id" {
  description = "ID of the S3 bucket for the frontend static files"
  value       = module.frontend_web.s3_bucket_id
}

output "frontend_cloudfront_distribution_id" {
  description = "ID of the CloudFront distribution for the frontend"
  value       = module.frontend_web.cloudfront_distribution_id
}
