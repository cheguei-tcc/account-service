import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { KnexModule } from 'nestjs-knex';
import { AccountModule } from '../account/account.module';
import { NotificationModule } from '../notification/notification.module';
@Module({
  imports: [
    KnexModule.forRoot({
      config: require('../../knexfile'),
    }),
    AccountModule,
    NotificationModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
