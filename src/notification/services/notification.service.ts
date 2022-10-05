import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import { UserService } from '../../account/services/user.service';
import { EventsGateway } from '../../event/events.gateway';

@Injectable()
export class NotificationService {
  constructor(
    private readonly gatewaySocket: EventsGateway,
    private readonly userService: UserService,
    @InjectConnection() private mongo: Connection,
  ) {}

  async parentArrived(cpf: string, cnpj: string) {
    const data = await this.userService.getParentChildren(1);

    await this.mongo.collection('arrived').insertOne({
      ...data,
      schoolCNPJ: cnpj,
      createdAt: Date.now(),
      status: 'WAITING',
    });

    await this.gatewaySocket.notifyStudentArrived(cnpj, data);

    return { implemented: true };
  }
}
