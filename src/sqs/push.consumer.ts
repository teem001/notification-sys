import { Injectable } from '@nestjs/common';
import { NotificationsService } from 'src/notifications/notification.service';
import { LoggerService } from 'src/libs/logger/logger.service';

@Injectable()
export class PushConsumer {
  constructor(
    private readonly notifications: NotificationsService,
    private readonly logger: LoggerService,
  ) {}

  async handle(message: any) {
    this.logger.log('Push consumer handling message');
    if (!message.Body) {
      this.logger.warn('Push message has no Body, skipping');
      return;
    }
    const payload = JSON.parse(message.Body);
    // expected: { toDeviceId, title, body, trackingId }
    await this.notifications.processPush(payload);
  }
}
