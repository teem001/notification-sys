import { Injectable } from '@nestjs/common';
import { LoggerService } from 'src/libs/logger/logger.service';
import { TwilioProvider } from './providers/twilio.provider';

export interface SmsProvider {
  sendSms(to: string, message: string): Promise<void>;
}

@Injectable()
export class SmsService {
  private provider: SmsProvider;

  constructor(
    private readonly twilioProvider: TwilioProvider,
    private readonly logger: LoggerService,
  ) {
    this.setProvider(process.env.SMS_PROVIDER || 'twilio');
  }

  private setProvider(providerName: string) {
    switch (providerName.toLowerCase()) {
      case 'twilio':
        this.provider = this.twilioProvider;
        break;
      // case 'termii':
      //   this.provider = this.awsSnsProvider;
      //   break;
      default:
        this.logger.warn(
          `Unknown SMS provider "${providerName}", falling back to Twilio`,
        );
        this.provider = this.twilioProvider;
    }
  }

  async send(to: string, message: string) {
    try {
      await this.provider.sendSms(to, message);
      this.logger.log(`SMS sent successfully to ${to}`);
    } catch (err) {
      this.logger.error(`Failed to send SMS to ${to} with provider`, err.stack);
      throw err;
    }
  }
}
