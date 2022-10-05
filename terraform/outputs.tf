output "aws_db_instance_account_service_address" {
  description = "Account Service Database Address"
  value = aws_db_instance.account_service.address
}

output "aws_sns_topic_responsible_updates_arn" {
  description = "SNS Responsible Updates Topic ARN"
  value = aws_sns_topic.responsible_updates.arn
}