import { Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { NotificationService } from '../services/notification.service';

@ApiTags('Notification')
@Controller('notification')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Post()
  @ApiResponse({
    status: 202,
    description: 'The school certain WILL know that the parent is arrived',
  })
  @HttpCode(HttpStatus.ACCEPTED)
  postNotification() {
    return this.notificationService.parentArrived();
  }
}
