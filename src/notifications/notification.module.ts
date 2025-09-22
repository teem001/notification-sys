import { Module } from '@nestjs/common';
import { SmsModule } from './sms/sms.module';
import { EmailModule } from './email/email.module';
import { PushModule } from './push/push.module';
import { DatabaseModule } from 'src/database/database.modules';
import { NotificationsService } from './notification.service';
import { NotificationRepository } from 'src/database/repositories/notification.repository';

@Module({
  imports: [SmsModule, EmailModule, PushModule, DatabaseModule],
  providers: [NotificationsService, NotificationRepository],
  exports: [NotificationsService],
})
export class NotificationsModule {}
