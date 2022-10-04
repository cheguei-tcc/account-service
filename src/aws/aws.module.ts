import { Module } from '@nestjs/common';
import { SNS } from 'aws-sdk';
import { AwsSdkModule } from 'nest-aws-sdk';
import { SNSService } from './services/sns';

@Module({
  imports: [AwsSdkModule.forFeatures([SNS])],
  providers: [SNSService],
  exports: [SNSService],
})
export class AWSModule {}