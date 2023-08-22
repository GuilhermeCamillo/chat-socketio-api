import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'conversations' })
export class Conversation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  sender: string;

  @Column()
  receiver: string;

  @Column()
  body: string;

  @Column({
    name: 'send_date_time',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  sendDateTime: Date;
}
