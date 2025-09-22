import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import configuration from './config/config.service';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.modules';
import { LoggerModule } from './libs/logger/logger.module';
import { NotificationsModule } from './notifications/notification.module';
import { SqsModule } from './sqs/sqs.module';

@Module({
  imports: [
    ConfigModule.forRoot({ load: [configuration], isGlobal: true }),
    DatabaseModule, NotificationsModule, SqsModule, LoggerModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
