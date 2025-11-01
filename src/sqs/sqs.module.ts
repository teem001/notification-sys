import { Module, Global } from '@nestjs/common';
import { SqsService } from './sqs.service';
import { LoggerModule } from '../libs/logger/logger.module';
import { NotificationsModule } from 'src/notifications/notification.module';
import { SmsConsumer } from './sms.consumer';
import { EmailConsumer } from './email.consumer';
import { PushConsumer } from './push.consumer';

@Global()
@Module({
  imports: [ NotificationsModule, LoggerModule],
  providers: [SqsService, SmsConsumer, EmailConsumer, PushConsumer],
  exports: [SqsService],
})
export class SqsModule {}
