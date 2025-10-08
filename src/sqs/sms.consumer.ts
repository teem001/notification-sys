// import { Injectable } from '@nestjs/common';
// import { NotificationsService } from 'src/notifications/notification.service';

// @Injectable()
// export class SmsConsumer {
//   constructor(private readonly notificationsService: NotificationsService) {}

//   async handle(message: any) {
//     const payload = JSON.parse(message.Body);

//     return this.notificationsService.processSMS(payload);
//   }
// }

import { Injectable } from '@nestjs/common';
import { LoggerService } from 'src/libs/logger/logger.service';
import { NotificationsService } from 'src/notifications/notification.service';

@Injectable()
export class SmsConsumer {
  constructor(
    private readonly notifications: NotificationsService,
    private readonly logger: LoggerService,
  ) {}

  async handle(message: any) {
    this.logger.log('SMS consumer handling message');
    if (!message.Body) {
      this.logger.warn('SMS message has no Body, skipping');
      return;
    }
    const payload = JSON.parse(message.Body);
    // expected: { toPhoneNumber, subject, message, trackingId }
    await this.notifications.processSMS(payload);
  }
}
