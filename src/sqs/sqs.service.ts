import { Injectable, OnModuleInit } from '@nestjs/common';
import {
  SQSClient,
  ReceiveMessageCommand,
  DeleteMessageCommand,
} from '@aws-sdk/client-sqs';
import { ConfigService } from '@nestjs/config';
import { LoggerService } from '../libs/logger/logger.service';
import { EmailConsumer } from './email.consumer';
import { PushConsumer } from './push.consumer';
import { SmsConsumer } from './sms.consumer';

@Injectable()
export class SqsService implements OnModuleInit {
  private client: SQSClient;
  private smsQueueUrl: string;
  private emailQueueUrl: string;
  private pushQueueUrl: string;

  constructor(
    private readonly config: ConfigService,
    private readonly smsConsumer: SmsConsumer,
    private readonly emailConsumer: EmailConsumer,
    private readonly pushConsumer: PushConsumer,
    private readonly logger: LoggerService,
  ) {
this.client = new SQSClient({
  region: this.config.get('AWS_REGION') || 'us-east-1',
  endpoint: this.config.get('SQS_ENDPOINT'), 
  credentials: {
    accessKeyId: this.config.get('AWS_ACCESS_KEY_ID') || 'test',
    secretAccessKey: this.config.get('AWS_SECRET_ACCESS_KEY') || 'test',
  },
}); 
   this.smsQueueUrl = this.config.get('QUEUE_SMS');
    this.emailQueueUrl = this.config.get('QUEUE_EMAIL');
    this.pushQueueUrl = this.config.get('QUEUE_PUSH');
  }

  async onModuleInit() {
    // Start polling each queue
    if (this.smsQueueUrl)
      this.startPolling(
        this.smsQueueUrl,
        this.smsConsumer.handle.bind(this.smsConsumer),
        'SMS',
      );
    if (this.emailQueueUrl)
      this.startPolling(
        this.emailQueueUrl,
        this.emailConsumer.handle.bind(this.emailConsumer),
        'EMAIL',
      );
    if (this.pushQueueUrl)
      this.startPolling(
        this.pushQueueUrl,
        this.pushConsumer.handle.bind(this.pushConsumer),
        'PUSH',
      );
  }

  private async startPolling(
    queueUrl: string,
    handler: (m: any) => Promise<void>,
    label: string,
  ) {
    this.logger.log(`Starting long-poll for ${label} queue: ${queueUrl}`);
    (async () => {
      while (true) {
        try {
          const cmd = new ReceiveMessageCommand({
            QueueUrl: queueUrl,
            MaxNumberOfMessages: 5,
            WaitTimeSeconds: 20, 
            VisibilityTimeout: 60,
          });
          const resp = await this.client.send(cmd);
          const messages = resp.Messages ?? [];
          if (messages.length > 0) {
            this.logger.log(
              `Received ${messages.length} messages from ${label}`,
            );
            for (const msg of messages) {
              try {
                await handler(msg);
              } catch (err) {
                this.logger.error(
                  `Error processing message: ${err?.message ?? err}`,
                  err,
                );
                continue;
              } finally {
                try {
                  if (msg.ReceiptHandle) {
                    await this.client.send(
                      new DeleteMessageCommand({
                        QueueUrl: queueUrl,
                        ReceiptHandle: msg.ReceiptHandle,
                      }),
                    );
                  }
                } catch (delErr) {
                  this.logger.error(
                    `Failed to delete message: ${delErr?.message ?? delErr}`,
                  );
                }
              }
            }
          }
        } catch (err) {
          this.logger.error(
            `SQS poll error for ${label}: ${err?.message ?? err}`,
          );
          await new Promise((r) => setTimeout(r, 2000));
        }
      }
    })();
  }
}
