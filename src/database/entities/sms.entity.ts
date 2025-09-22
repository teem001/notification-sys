import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('sms')
export class Sms {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  trackingId: string;

  @Column()
  toPhoneNumber: string;

  @Column('text')
  message: string;

  @Column({ nullable: true })
  provider: string; 

  @Column({ default: false })
  delivered: boolean;

  @CreateDateColumn()
  createdAt: Date;
}
