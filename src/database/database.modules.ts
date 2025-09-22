// database/database.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Notification } from './entities/notification.entity';
import { Sms } from './entities/sms.entity';
import { Email } from './entities/email.entity';

import { NotificationRepository } from './repositories/notification.repository';
import { SmsRepository } from './repositories/sms.repository';
import { EmailRepository } from './repositories/email.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([Notification, Sms, Email]), 
  ],
  providers: [NotificationRepository, SmsRepository, EmailRepository],
  exports: [NotificationRepository, SmsRepository, EmailRepository],
})
export class DatabaseModule {}
