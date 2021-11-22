import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { KnexModule } from 'nestjs-knex';
import { AccountModule } from '../account/account.module';
import { NotificationModule } from '../notification/notification.module';
import { AuthModule } from '../auth/auth.module';
import { EventsModule } from '../event/events.module';
import { MongooseModule } from '@nestjs/mongoose';
@Module({
  imports: [
    KnexModule.forRoot({
      config: require('../../knexfile'),
    }),
    AccountModule,
    NotificationModule,
    AuthModule,
    EventsModule,
    MongooseModule.forRoot(process.env.MONGO_URI),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
