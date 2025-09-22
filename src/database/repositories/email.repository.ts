import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Email } from '../entities/email.entity';

@Injectable()
export class EmailRepository {
  constructor(
    @InjectRepository(Email)
    private readonly repo: Repository<Email>,
  ) {}

  async findByTrackingId(trackingId: string): Promise<Email | null> {
    return this.repo.findOne({ where: { trackingId } });
  }

  async saveEmail(payload: {
    trackingId: string;
    toEmail: string;
    message: string;
    subject: string;
    isHtml: boolean;
    provider?: string;
    delivered: boolean;
  }): Promise<Email> {
    const entity = this.repo.create(payload);
    return this.repo.save(entity);
  }
}
