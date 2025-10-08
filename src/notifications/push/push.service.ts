import { Injectable } from '@nestjs/common';
import { LoggerService } from 'src/libs/logger/logger.service';
// import { FcmProvider } from './providers/fcm.provider';

@Injectable()
export class PushService {
  // private provider: FcmProvider;

  constructor(
    // private readonly fcm: FcmProvider,
    private readonly logger: LoggerService,
  ) {
    // this.provider = fcm;
  }

  async send(toDeviceToken: string, message: string) {
    try {
      // await this.provider.sendPush(toDeviceToken, message);
      this.logger.log(`Push notification sent to ${toDeviceToken}`);
    } catch (err) {
      this.logger.error(`Failed to send push to ${toDeviceToken}`, err.stack);
      throw err;
    }
  }
}
