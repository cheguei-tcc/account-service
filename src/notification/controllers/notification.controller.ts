import {
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Role, Roles } from '../../auth/roles.decorator';
import { NotificationService } from '../services/notification.service';
@ApiTags('Notification')
@UseGuards(RolesGuard)
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('accessToken')
@Controller('notification')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Post()
  @Roles(Role.Parent)
  @ApiResponse({
    status: 202,
    description: 'The school certain WILL know that the parent is arrived',
  })
  @HttpCode(HttpStatus.ACCEPTED)
  async postNotification(@Request() req) {
    return await this.notificationService.parentArrived(
      req.user.cpf,
      req.user.school.cnpj,
    );
  }
}
