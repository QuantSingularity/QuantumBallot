# Terraform variables for the backend module

variable "backend_port" {
  description = "Port the backend application listens on"
  type        = number
  default     = 3000
}

variable "vpc_id" {
  description = "VPC ID for deployment"
  type        = string
}

variable "subnet_ids" {
  description = "List of private subnet IDs for ECS tasks"
  type        = list(string)
}

variable "environment_name" {
  description = "Name of the deployment environment (e.g., dev, prod)"
  type        = string
}

variable "docker_image_uri" {
  description = "URI of the backend Docker image in ECR"
  type        = string
}

variable "certificate_arn" {
  description = "ACM certificate ARN for HTTPS listener"
  type        = string
  default     = ""
}
