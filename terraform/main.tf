terraform {
  backend "s3" {
    bucket = "swarm-machines-tf"
    key    = "terraform-account-service.tfstate"
    region = "sa-east-1"
  }
}

provider "aws" {
  region = "us-east-2"
}

resource "aws_security_group" "account_db_sg" {
  # Outbound to Internet
  ingress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  # Outbound to Internet
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

resource "aws_db_instance" "account_service" {
  identifier = "account-service"
    
  engine               = "postgres"
  engine_version       = "14.4"
  instance_class       = "db.t3.micro"

  username             = "postgres"
  password             = var.account_db_pass
  vpc_security_group_ids  = [aws_security_group.account_db_sg.id]

  allocated_storage    = 20
  skip_final_snapshot  = true
  publicly_accessible    = true
}
