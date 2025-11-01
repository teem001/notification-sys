import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Email } from 'src/database/entities/email.entity';
import { Notification } from 'src/database/entities/notification.entity';
import { EmailRepository } from 'src/database/repositories/email.repository';
import { NotificationRepository } from 'src/database/repositories/notification.repository';
import { NotificationsModule } from '../notification.module';
import { NotificationsService } from '../notification.service';
import { EmailService } from './email.service';
import { NodemailerProvider } from './providers/nodemailer.provider';
import { SesProvider } from './providers/ses.provider';

@Module({
  imports: [TypeOrmModule.forFeature([Email, Notification])],
  providers: [EmailService, EmailRepository, SesProvider, NotificationRepository, NodemailerProvider],
  exports: [EmailService, EmailRepository],
})
export class EmailModule {}
