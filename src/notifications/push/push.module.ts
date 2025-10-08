import { Module } from '@nestjs/common';
import { PushService } from './push.service';
// import { FcmProvider } from './providers/fcm.provider';

@Module({
  providers: [PushService,
    // FcmProvider
  ],
  exports: [PushService],
})
export class PushModule {}
