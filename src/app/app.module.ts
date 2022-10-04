import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { KnexModule } from 'nestjs-knex';
import { AccountModule } from '../account/account.module';
import { AuthModule } from '../auth/auth.module';
import { AwsSdkModule } from 'nest-aws-sdk';
import { AWSModule } from '../aws/aws.module'

@Module({
  imports: [
    KnexModule.forRoot({
      config: require('../../knexfile'),
    }),
    AccountModule,
    AuthModule,
    AWSModule,
    AwsSdkModule.forRootAsync({
      defaultServiceOptions: {
        useValue: {
          region: 'sa-east-1'
        }
      }
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
