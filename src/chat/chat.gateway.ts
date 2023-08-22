import { Logger } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ConversationsService } from 'src/app/conversations/conversations.service';

@WebSocketGateway({ cors: true })
export class ChatGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server;
  private logger: Logger = new Logger('ChatGateway');
  constructor(private readonly conversationsService: ConversationsService) {}

  @SubscribeMessage('msgToServer')
  handleMessage(
    client: Socket,
    payload: { name: string; text: string; receiver: string },
  ): void {
    this.server.emit('msgToClient', payload, client.id);

    this.conversationsService.create({
      body: payload.text,
      sender: payload.name,
      receiver: payload.receiver,
    });
  }

  afterInit(server: Server) {
    this.logger.log('Init');
  }

  handleConnection(client: Socket) {
    this.logger.log('Cliente connected: ' + client.id);
  }

  handleDisconnect(client: Socket) {
    this.logger.log('Cliente disconnected: ' + client.id);
  }
}
