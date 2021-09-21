import { Module } from '@nestjs/common';
import { NotificationController } from './controllers/notification.controller';
import { NotificationService } from './services/notification.service';

@Module({
  imports: [],
  controllers: [NotificationController],
  providers: [NotificationService],
})
export class NotificationModule {}
