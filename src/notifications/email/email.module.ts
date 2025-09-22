import { Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { NodemailerProvider } from './providers/nodemailer.provider';
import { SesProvider } from './providers/ses.provider';

@Module({
  providers: [EmailService, SesProvider, NodemailerProvider],
  exports: [EmailService], 
})
export class EmailModule {}
