import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  MessageBody,
} from '@nestjs/websockets';
import { Connection } from 'mongoose';
import { Server, Socket } from 'socket.io';

@Injectable()
@WebSocketGateway({ cors: true })
export class EventsGateway implements OnGatewayConnection {
  @WebSocketServer()
  server: Server;

  constructor(@InjectConnection() private mongo: Connection) {}

  @WebSocketServer()
  handleConnection(socket: Socket, ...args: any[]) {
    console.info(
      `Connection Established: SocketId:${socket.id} on Channel/NS: ${socket.nsp.name} from Host: ${socket.request.headers.host}`,
    );
  }

  @SubscribeMessage('login')
  async login(
    socket: Socket,
    data: { cpf: string; schoolRelatedCNPJ: string },
  ): Promise<void> {
    console.info(`SOCKET:${socket.id} -- ROOM: ${data.schoolRelatedCNPJ}`);
    socket.join(data.schoolRelatedCNPJ);
  }

  @SubscribeMessage('delivered')
  async delivered(
    @MessageBody()
    data: {
      relatedParentCPF: string;
      schoolRelatedCNPJ: string;
    },
  ): Promise<void> {
    await this.mongo.collection('arrived').updateOne(
      {
        'parent.cpf': data.relatedParentCPF,
        schoolCNPJ: data.schoolRelatedCNPJ,
      },
      { $set: { status: 'DONE' } },
    );
  }

  @SubscribeMessage('refresh')
  async refresh(
    @MessageBody() data: { schoolRelatedCNPJ: string },
  ): Promise<void> {
    const cursor = this.mongo
      .collection('arrived')
      .find({ schoolCNPJ: data.schoolRelatedCNPJ, status: 'WAITING' });

    const waitingStudents = await cursor.toArray();
    this.server.in(data.schoolRelatedCNPJ).emit(
      'refresh',
      waitingStudents.map((data) => ({
        parent: data.parent,
        children: data.children,
      })),
    );
  }

  async notifyStudentArrived(schoolCNPJ: string, data) {
    this.server.in(schoolCNPJ).emit('arrived', data);
  }
}
