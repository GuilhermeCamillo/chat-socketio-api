import { IsNotEmpty } from 'class-validator';

export class CreateConversationDto {
  @IsNotEmpty()
  sender: string;

  @IsNotEmpty()
  receiver: string;

  @IsNotEmpty()
  body: string;
}
