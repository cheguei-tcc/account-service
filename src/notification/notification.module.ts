import { Module } from '@nestjs/common';
import { AccountModule } from '../account/account.module';
import { EventsModule } from '../event/events.module';
import { NotificationController } from './controllers/notification.controller';
import { NotificationService } from './services/notification.service';

@Module({
  imports: [EventsModule, AccountModule],
  controllers: [NotificationController],
  providers: [NotificationService],
})
export class NotificationModule {}
