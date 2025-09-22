import * as nodemailer from 'nodemailer';
import { EmailProvider } from '../email.interface';

export class NodemailerProvider implements EmailProvider {
  private transporter = nodemailer.createTransport({
    service: 'gmail', 
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  async sendEmail(
    to: string,
    message: string,
    subject,
    isHtml = false,
    attachments: any[] = [],
  ): Promise<void> {
    await this.transporter.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject,
      [isHtml ? 'html' : 'text']: message,
      attachments,
    });
  }
}
