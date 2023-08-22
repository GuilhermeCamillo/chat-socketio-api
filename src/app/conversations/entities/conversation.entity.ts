import { UsersEntity } from 'src/app/users/users.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'conversations' })
export class Conversation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => UsersEntity)
  @JoinColumn({ name: 'sender_id' })
  sender: UsersEntity;

  @ManyToOne(() => UsersEntity)
  @JoinColumn({ name: 'receiver_id' })
  receiver: UsersEntity;

  @Column()
  body: string;

  @Column({
    name: 'send_date_time',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  sendDateTime: Date;
}
