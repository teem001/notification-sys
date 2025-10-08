import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import configuration from './config/config.service';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseModule } from './database/database.modules';
import { LoggerModule } from './libs/logger/logger.module';
import { NotificationsModule } from './notifications/notification.module';
import { SqsModule } from './sqs/sqs.module';
import { NotificationsController } from './notifications/notification.controller';

@Module({
  imports: [
    ConfigModule.forRoot({ load: [configuration], isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || "localhost",
      port: Number(process.env.DB_PORT) || 5432,
      username: process.env.DB_USERNAME || "apple",
      password: process.env.DB_PASSWORD || "Oselegend1.",
      database: process.env.DB_NAME || "notification_system",
      autoLoadEntities: true,
      synchronize: false,
    }),
    DatabaseModule,
    NotificationsModule,
    SqsModule,
    LoggerModule,
  ],
  controllers: [AppController, NotificationsController],
  providers: [AppService],
})
export class AppModule {}
