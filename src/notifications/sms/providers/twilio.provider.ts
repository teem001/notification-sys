import { Injectable } from '@nestjs/common';
import { Twilio } from 'twilio';
import { SmsProvider } from '../sms.service'; 

@Injectable()
export class TwilioProvider implements SmsProvider {
  private client: Twilio;

  constructor() {
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;

    if (!accountSid || !authToken) {
      throw new Error(
        'Twilio credentials are missing in environment variables',
      );
    }

    this.client = new Twilio(accountSid, authToken);
  }


  async sendSms(to: string, message: string): Promise<void> {
    await this.client.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE_NUMBER,
      to,
    });
  }
}

