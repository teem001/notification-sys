import { Module } from '@nestjs/common';
import { SmsModule } from './sms/sms.module';
import { EmailModule } from './email/email.module';
import { PushModule } from './push/push.module';
import { DatabaseModule } from 'src/database/database.modules';
import { NotificationsService } from './notification.service';
import { NotificationRepository } from 'src/database/repositories/notification.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Notification } from 'src/database/entities/notification.entity';

@Module({
  imports: [
    SmsModule,
    EmailModule,
    PushModule,
    DatabaseModule,
    TypeOrmModule.forFeature([Notification]),
  ],
  providers: [NotificationsService, NotificationRepository],
  exports: [NotificationRepository, NotificationsService],
})
export class NotificationsModule {}
