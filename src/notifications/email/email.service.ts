import { Injectable } from '@nestjs/common';
import { SesProvider } from './providers/ses.provider';
import { NodemailerProvider } from './providers/nodemailer.provider';
import { LoggerService } from '../../libs/logger/logger.service';
import { EmailProvider } from './email.interface';

@Injectable()
export class EmailService {
  private provider: EmailProvider;

  constructor(private readonly logger: LoggerService) {
    const provider = process.env.EMAIL_PROVIDER || 'nodemailer';

    if (provider === 'nodemailer') {
      this.provider = new NodemailerProvider();
    } else {
      this.provider = new SesProvider();
    }
  }

  async send(
    to: string,
    message: string,
    subject: string,
    isHtml = false,
    attachments: any[] = [],
  ): Promise<void> {
    try {
      await this.provider.sendEmail(to, message, subject, isHtml, attachments);
      this.logger.log(`Email sent successfully to ${to}`);
    } catch (err) {
      this.logger.error(`Failed to send email to ${to}`, err.stack);
      throw err;
    }
  }
}
