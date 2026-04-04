# Terraform main configuration for the backend module

resource "aws_ecs_cluster" "backend_cluster" {
  name = "${var.environment_name}-QuantumBallot-backend-cluster"

  setting {
    name  = "containerInsights"
    value = "enabled"
  }

  tags = {
    Name        = "${var.environment_name}-QuantumBallot-backend-cluster"
    Environment = var.environment_name
    Project     = "QuantumBallot"
  }
}

# ALB security group — accepts HTTP/HTTPS from the internet
resource "aws_security_group" "alb_sg" {
  name        = "${var.environment_name}-alb-sg"
  description = "Allow HTTP/HTTPS inbound to ALB"
  vpc_id      = var.vpc_id

  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name        = "${var.environment_name}-alb-sg"
    Environment = var.environment_name
    Project     = "QuantumBallot"
  }
}

# Backend service security group — only accepts traffic from the ALB
resource "aws_security_group" "backend_sg" {
  name        = "${var.environment_name}-backend-sg"
  description = "Allow traffic to backend service from ALB only"
  vpc_id      = var.vpc_id

  ingress {
    from_port       = var.backend_port
    to_port         = var.backend_port
    protocol        = "tcp"
    security_groups = [aws_security_group.alb_sg.id]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name        = "${var.environment_name}-backend-sg"
    Environment = var.environment_name
    Project     = "QuantumBallot"
  }
}

resource "aws_ecr_repository" "backend_ecr" {
  name                 = "${var.environment_name}/QuantumBallot-backend"
  image_tag_mutability = "IMMUTABLE"

  image_scanning_configuration {
    scan_on_push = true
  }

  encryption_configuration {
    encryption_type = "KMS"
  }

  tags = {
    Environment = var.environment_name
    Project     = "QuantumBallot"
  }
}

resource "aws_ecr_lifecycle_policy" "backend_ecr_policy" {
  repository = aws_ecr_repository.backend_ecr.name

  policy = jsonencode({
    rules = [
      {
        rulePriority = 1
        description  = "Keep last 10 production images"
        selection = {
          tagStatus     = "tagged"
          tagPrefixList = ["prod-"]
          countType     = "imageCountMoreThan"
          countNumber   = 10
        }
        action = { type = "expire" }
      },
      {
        rulePriority = 2
        description  = "Expire untagged images older than 7 days"
        selection = {
          tagStatus   = "untagged"
          countType   = "sinceImagePushed"
          countUnit   = "days"
          countNumber = 7
        }
        action = { type = "expire" }
      }
    ]
  })
}

resource "aws_iam_role" "ecs_task_execution_role" {
  name = "${var.environment_name}-QuantumBallot-ecs-task-execution-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "ecs-tasks.amazonaws.com"
        }
      }
    ]
  })

  tags = {
    Environment = var.environment_name
    Project     = "QuantumBallot"
  }
}

resource "aws_iam_role_policy_attachment" "ecs_task_execution_role_policy" {
  role       = aws_iam_role.ecs_task_execution_role.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy"
}

resource "aws_ecs_task_definition" "backend_task" {
  family                   = "${var.environment_name}-QuantumBallot-backend"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = "512"
  memory                   = "1024"
  execution_role_arn       = aws_iam_role.ecs_task_execution_role.arn

  container_definitions = jsonencode([
    {
      name      = "QuantumBallot-backend"
      image     = var.docker_image_uri
      essential = true
      portMappings = [
        {
          containerPort = var.backend_port
          hostPort      = var.backend_port
          protocol      = "tcp"
        }
      ]
      environment = [
        {
          name  = "NODE_PORT"
          value = tostring(var.backend_port)
        },
        {
          name  = "SERVER_PORT"
          value = "3002"
        },
        {
          name  = "ENVIRONMENT"
          value = var.environment_name
        }
      ]
      readonlyRootFilesystem = true
      logConfiguration = {
        logDriver = "awslogs"
        options = {
          "awslogs-group"         = "/ecs/${var.environment_name}-QuantumBallot-backend"
          "awslogs-region"        = data.aws_region.current.name
          "awslogs-stream-prefix" = "ecs"
        }
      }
    }
  ])

  tags = {
    Environment = var.environment_name
    Project     = "QuantumBallot"
  }
}

resource "aws_cloudwatch_log_group" "backend_logs" {
  name              = "/ecs/${var.environment_name}-QuantumBallot-backend"
  retention_in_days = 90

  tags = {
    Environment = var.environment_name
    Project     = "QuantumBallot"
  }
}

resource "aws_lb" "backend_alb" {
  name               = "${var.environment_name}-backend-alb"
  internal           = false
  load_balancer_type = "application"
  security_groups    = [aws_security_group.alb_sg.id]
  subnets            = var.subnet_ids

  enable_deletion_protection = true
  drop_invalid_header_fields = true

  tags = {
    Environment = var.environment_name
    Project     = "QuantumBallot"
  }
}

resource "aws_lb_target_group" "backend_tg" {
  name        = "${var.environment_name}-backend-tg"
  port        = var.backend_port
  protocol    = "HTTP"
  vpc_id      = var.vpc_id
  target_type = "ip"

  health_check {
    enabled             = true
    interval            = 30
    path                = "/health"
    port                = "traffic-port"
    healthy_threshold   = 3
    unhealthy_threshold = 3
    timeout             = 5
    protocol            = "HTTP"
    matcher             = "200"
  }

  tags = {
    Environment = var.environment_name
    Project     = "QuantumBallot"
  }
}

# HTTP listener — redirects all traffic to HTTPS
resource "aws_lb_listener" "backend_http_listener" {
  load_balancer_arn = aws_lb.backend_alb.arn
  port              = 80
  protocol          = "HTTP"

  default_action {
    type = "redirect"

    redirect {
      port        = "443"
      protocol    = "HTTPS"
      status_code = "HTTP_301"
    }
  }
}

# HTTPS listener — forwards to the backend target group
resource "aws_lb_listener" "backend_https_listener" {
  load_balancer_arn = aws_lb.backend_alb.arn
  port              = 443
  protocol          = "HTTPS"
  ssl_policy        = "ELBSecurityPolicy-TLS13-1-2-2021-06"
  certificate_arn   = var.certificate_arn

  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.backend_tg.arn
  }
}

resource "aws_ecs_service" "backend_service" {
  name            = "${var.environment_name}-QuantumBallot-backend-service"
  cluster         = aws_ecs_cluster.backend_cluster.id
  task_definition = aws_ecs_task_definition.backend_task.arn
  desired_count   = 2
  launch_type     = "FARGATE"

  network_configuration {
    subnets          = var.subnet_ids
    security_groups  = [aws_security_group.backend_sg.id]
    assign_public_ip = false
  }

  load_balancer {
    target_group_arn = aws_lb_target_group.backend_tg.arn
    container_name   = "QuantumBallot-backend"
    container_port   = var.backend_port
  }

  depends_on = [aws_lb_listener.backend_https_listener]

  tags = {
    Environment = var.environment_name
    Project     = "QuantumBallot"
  }
}

data "aws_region" "current" {}
