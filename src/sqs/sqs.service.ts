// import { Injectable, OnModuleInit } from '@nestjs/common';
// import {
//   SQSClient,
//   ReceiveMessageCommand,
//   DeleteMessageCommand,
// } from '@aws-sdk/client-sqs';

// @Injectable()
// export class SqsService implements OnModuleInit {
//   private client = new SQSClient({ region: process.env.AWS_REGION });

//   async onModuleInit() {
//     this.pollQueue(process.env.SMS_QUEUE_URL, 'SMS');
//     this.pollQueue(process.env.EMAIL_QUEUE_URL, 'EMAIL');
//     this.pollQueue(process.env.PUSH_QUEUE_URL, 'PUSH');
//   }

//   private async pollQueue(queueUrl: string, type: 'SMS' | 'EMAIL' | 'PUSH') {
//     while (true) {
//       const command = new ReceiveMessageCommand({
//         QueueUrl: queueUrl,
//         WaitTimeSeconds: 20,
//         MaxNumberOfMessages: 5,
//       });
//       const { Messages } = await this.client.send(command);

//       if (Messages?.length) {
//         for (const msg of Messages) {
//           try {
//             // Dispatch to consumer
//             // (Use NestJS EventEmitter or direct call)
//           } finally {
//             await this.client.send(
//               new DeleteMessageCommand({
//                 QueueUrl: queueUrl,
//                 ReceiptHandle: msg.ReceiptHandle,
//               }),
//             );
//           }
//         }
//       }
//     }
//   }
// }

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
    this.client = new SQSClient({ region: this.config.get('aws.region') });
    this.smsQueueUrl = this.config.get('queues.sms');
    this.emailQueueUrl = this.config.get('queues.email');
    this.pushQueueUrl = this.config.get('queues.push');
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
    // Run poll loop asynchronously (non-blocking)
    (async () => {
      while (true) {
        try {
          const cmd = new ReceiveMessageCommand({
            QueueUrl: queueUrl,
            MaxNumberOfMessages: 5,
            WaitTimeSeconds: 20, // long polling
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
                // leave message for retry / DLQ
                continue;
              } finally {
                // attempt delete to avoid reprocessing (only if handler succeeded ideally)
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
          // small pause on error to avoid tight loop
          await new Promise((r) => setTimeout(r, 2000));
        }
      }
    })();
  }
}
