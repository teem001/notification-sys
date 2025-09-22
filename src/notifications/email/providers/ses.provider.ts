import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';
import { EmailProvider } from '../email.interface';

export class SesProvider implements EmailProvider {
  private client = new SESClient({ region: process.env.AWS_REGION });

  async sendEmail(
    to: string,
    message: string,
    subject: string,
    isHtml = false,
    attachments: any[] = [],
  ): Promise<void> {
    const params = {
      Source: process.env.SES_FROM_EMAIL,
      Destination: { ToAddresses: [to] },
      Message: {
        Subject: { Data: subject },
        Body: isHtml
          ? { Html: { Data: message } }
          : { Text: { Data: message, attachments } },
      },
    };
    await this.client.send(new SendEmailCommand(params));
  }
}
