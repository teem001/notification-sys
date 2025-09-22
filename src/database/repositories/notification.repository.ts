import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification } from '../entities/notification.entity';

@Injectable()
export class NotificationRepository {
  constructor(
    @InjectRepository(Notification)
    private readonly repo: Repository<Notification>,
  ) {}

  async findByTrackingId(trackingId: string): Promise<Notification | null> {
    return this.repo.findOne({ where: { trackingId } });
  }

  async saveNotification(payload: {
    trackingId: string;
    type: 'SMS' | 'EMAIL' | 'PUSH';
    recipient: string;
    message: string;
    subject?: string;
    delivered: boolean;
  }): Promise<Notification> {
    const entity = this.repo.create(payload);
    return this.repo.save(entity);
  }
}
