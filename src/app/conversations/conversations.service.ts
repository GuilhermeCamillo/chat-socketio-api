import { Injectable } from '@nestjs/common';
import { CreateConversationDto } from './dto/create-conversation.dto';
import { UpdateConversationDto } from './dto/update-conversation.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Conversation } from './entities/conversation.entity';
import { Repository } from 'typeorm';
import { UsersEntity } from '../users/users.entity';

@Injectable()
export class ConversationsService {
  constructor(
    @InjectRepository(Conversation)
    private readonly conversationsRepository: Repository<Conversation>,
    @InjectRepository(UsersEntity)
    private readonly usersRepository: Repository<UsersEntity>,
  ) {}

  async create(createConversationDto: CreateConversationDto) {

    const [receiver, sender] = await Promise.all([
      await this.usersRepository.findOne({
        where: { id: createConversationDto.receiverId },
      }),
      await this.usersRepository.findOne({
        where: { id: createConversationDto.senderId },
      }),
    ]);

    return this.conversationsRepository.save(
      this.conversationsRepository.create({
        body: createConversationDto.body,
        receiver,
        sender,
      }),
    );
  }

  findAll() {
    return `This action returns all conversations`;
  }

  async findOne({receiverId,senderId,}: {receiverId: string; senderId: string;}): Promise<Conversation[]> {
    return this.conversationsRepository.find({
      relations: ['receiver', 'sender'],
      select: {
        id: true,
        receiver: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
        },
        sender: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
        },
        body: true,
        sendDateTime: true,
      },
      where: [{ receiver: { id: receiverId },sender: { id: senderId },},{receiver: { id: senderId },sender: { id: receiverId }},],
      order: {sendDateTime: 'DESC'},
    });
  }

  update(id: number, updateConversationDto: UpdateConversationDto) {
    return `This action updates a #${id} conversation`;
  }

  remove(id: number) {
    return `This action removes a #${id} conversation`;
  }
}
