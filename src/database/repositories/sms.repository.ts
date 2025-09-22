import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Sms } from '../entities/sms.entity';

@Injectable()
export class SmsRepository {
  constructor(
    @InjectRepository(Sms)
    private readonly repo: Repository<Sms>,
  ) {}

  async findByTrackingId(trackingId: string): Promise<Sms | null> {
    return this.repo.findOne({ where: { trackingId } });
  }

  async saveSms(payload: {
    trackingId: string;
    toPhoneNumber: string;
    message: string;
    provider?: string;
    delivered: boolean;
  }): Promise<Sms> {
    const entity = this.repo.create(payload);
    return this.repo.save(entity);
  }
}
