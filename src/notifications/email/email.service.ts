import { Injectable } from '@nestjs/common';
import { SesProvider } from './providers/ses.provider';
import { NodemailerProvider } from './providers/nodemailer.provider';
import { LoggerService } from '../../libs/logger/logger.service';
import { EmailProvider } from './email.interface';
import { EmailRepository } from 'src/database/repositories/email.repository';
import { v4 as uuidv4 } from 'uuid';
import { NotificationRepository } from 'src/database/repositories/notification.repository';

@Injectable()
export class EmailService {
  private provider: EmailProvider;
  private providerName: string;

  constructor(
    private readonly logger: LoggerService,
    private readonly emailRepo: EmailRepository,
    private readonly notificationRepo: NotificationRepository,
  ) {
  this.providerName = process.env.EMAIL_PROVIDER || 'nodemailer';

    this.provider =
      this.providerName === 'nodemailer'
        ? new NodemailerProvider()
        : new SesProvider();
  }
  

  async send(
    to: string,
    message: string,
    subject: string,
    isHtml = false,
    attachments: any[] = [],
  ): Promise<void> {
    const trackingId = uuidv4();

    try {
      await this.provider.sendEmail(to, message, subject, isHtml, attachments);
      this.logger.log(`Email sent successfully to ${to}`);
      await this.emailRepo.saveEmail({
        toEmail: to,
        subject,
        message,
        provider: this.providerName,
        delivered: true,
        trackingId,
        isHtml: false,
      });
      await this.notificationRepo.saveNotification({
        type: 'EMAIL',
        subject,
        recipient: to,
        message,
        delivered: true,
        trackingId,
      });
    } catch (err) {
      this.logger.error(`Failed to send email to ${to}`, err.stack);
      await this.emailRepo.saveEmail({
        toEmail: to,
        subject,
        message,
        provider: this.providerName,
        delivered: false,
        trackingId,
        isHtml: false,
      });
      await this.notificationRepo.saveNotification({
        type: 'EMAIL',
        subject,
        recipient: to,
        message,
        delivered: false,
        trackingId,
      });
      throw err;
    }
  }
}
