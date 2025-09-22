import { Injectable } from '@nestjs/common';
import { LoggerService } from 'src/libs/logger/logger.service';
import { NotificationsService } from 'src/notifications/notification.service';
// import { NotificationsService } from '../../notifications/notification.service';
// import { LoggerService } from '../../libs/logger/logger.service';

@Injectable()
export class EmailConsumer {
  constructor(
    private readonly notifications: NotificationsService,
    private readonly logger: LoggerService,
  ) {}

  async handle(message: any) {
    this.logger.log('Email consumer handling message');
    if (!message.Body) {
      this.logger.warn('Email message has no Body, skipping');
      return;
    }
    const payload = JSON.parse(message.Body);
    // expected: { toEmail, message, trackingId, isHtml, attachments }
    await this.notifications.processEmail(payload);
  }
}
