import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('emails')
export class Email {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  trackingId: string;

  @Column()
  toEmail: string;

  @Column('text')
  message: string;
  
  @Column('text')
  subject: string;

  @Column({ default: false })
  isHtml: boolean;

  @Column({ nullable: true })
  provider: string; 

  @Column({ default: false })
  delivered: boolean;

  @CreateDateColumn()
  createdAt: Date;
}
