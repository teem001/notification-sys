import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('notifications')
export class Notification {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  trackingId: string;

  @Column()
  type: 'SMS' | 'EMAIL' | 'PUSH';

  @Column()
  recipient: string;

  @Column('text')
  message: string;
  
  @Column('text')
  subject: string;

  @Column({ default: false })
  delivered: boolean;

  @CreateDateColumn()
  createdAt: Date;
}
