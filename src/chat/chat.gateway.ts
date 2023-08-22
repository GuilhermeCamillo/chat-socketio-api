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
import { UsersService } from 'src/app/users/users.service';
import { getChatRoomId } from 'src/utils/generateRoom';

@WebSocketGateway({ cors: true })
export class ChatGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server;
  private logger: Logger = new Logger('ChatGateway');

  constructor(
    private readonly conversationsService: ConversationsService,
    private readonly usersService: UsersService,
  ) {}

  @SubscribeMessage('joinChat')
  handleJoinChat(client: Socket, chatRoomId: string): void {
    client.join(chatRoomId);
  }

  @SubscribeMessage('leaveChat')
  handleLeaveChat(client: Socket, chatRoomId: string): void {
    client.leave(chatRoomId);
  }

  @SubscribeMessage('msgToServer')
  async handleMessage(client: Socket, payload: {senderId: string;text: string; receiverId: string;}): Promise<void> {
    try {
      const chatRoomId = getChatRoomId(payload.senderId, payload.receiverId);

      const [sender, receiver] = await Promise.all([
        this.usersService.findOneOrFail({ where: { id: payload.senderId } }),
        this.usersService.findOneOrFail({ where: { id: payload.receiverId } }),
      ]);

      client.to(chatRoomId).emit('msgToClient', {
        sender,
        body: payload.text,
        receiver,
      });

      await this.conversationsService.create({
        body: payload.text,
        senderId: payload.senderId,
        receiverId: payload.receiverId,
      });
    } catch (error) {
      this.logger.error('Error handling message:', error);
    }
  }

  afterInit(server: Server) {
    this.logger.log('ChatGateway initialized');
  }

  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }
}
