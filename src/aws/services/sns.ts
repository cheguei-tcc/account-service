import { Injectable } from '@nestjs/common';
import { InjectAwsService } from 'nest-aws-sdk';
import { SNS } from 'aws-sdk';

@Injectable()
export class SNSService {
  constructor(
    @InjectAwsService(SNS) private readonly sns: SNS,
  ) {
  }

  async publishMessage(message: string, topicArn: string) {
    await this.sns.publish({
      Message: message,
      TopicArn: topicArn
    }).promise();
  }
}