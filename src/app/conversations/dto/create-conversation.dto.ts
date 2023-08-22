import { IsNotEmpty } from 'class-validator';

export class CreateConversationDto {
  @IsNotEmpty()
  senderId: string;

  @IsNotEmpty()
  receiverId: string;

  @IsNotEmpty()
  body: string;
}
