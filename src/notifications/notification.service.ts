import { Injectable } from '@nestjs/common';
import { NotificationRepository } from '../database/repositories/notification.repository';
import { SmsService } from './sms/sms.service';
import { EmailService } from './email/email.service';

@Injectable()
export class NotificationsService {
  constructor(
    private readonly repo: NotificationRepository,
    private readonly smsService: SmsService,
    private readonly emailService: EmailService,
    private readonly pushService: EmailService,
  ) {}

  async processSMS(dto: {
    toPhoneNumber: string;
    message: string;
    subject: string;
    trackingId: string;
  }) {
    const exists = await this.repo.findByTrackingId(dto.trackingId);
    if (exists) return;

    await this.smsService.send(dto.toPhoneNumber, dto.message);
    await this.repo.saveNotification({
      trackingId: dto.trackingId,
      type: 'SMS',
      recipient: dto.toPhoneNumber,
      message: dto.message,
      subject: dto.subject,
      delivered: true,
    });
  }

  async processEmail(dto: {
    toEmail: string;
    message: string;
    subject: string;
    trackingId: string;
    isHtml: boolean;
  }) {
    const exists = await this.repo.findByTrackingId(dto.trackingId);
    if (exists) return;

    await this.emailService.send(
      dto.toEmail,
      dto.message,
      dto.subject,
      dto.isHtml,
    );
    await this.repo.saveNotification({
      trackingId: dto.trackingId,
      type: 'EMAIL',
      recipient: dto.toEmail,
      message: dto.message,
      subject: dto.subject,
      delivered: true,
    });
  }

  async processPush(dto: {
    toDeviceId: string;
    subject: string;
    title?: string;
    body?: string;
    trackingId?: string;
  }) {
    // Implement push in similar fashion — left minimal for brevity
    const { trackingId, toDeviceId, title, subject, body } = dto;
    if (trackingId) {
      const exists = await this.repo.findByTrackingId(trackingId);
      if (exists) return;
    }

    // TODO: call push service
    await this.repo.saveNotification({
      trackingId,
      type: 'PUSH',
      recipient: toDeviceId,
      subject,
      message: `${title ?? ''} ${body ?? ''}`,
      delivered: true,
    });
  }
}
