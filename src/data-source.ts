import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { Email } from './database/entities/email.entity';
import { Notification } from './database/entities/notification.entity';
import { Sms } from './database/entities/sms.entity';



export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 5432,
  username: process.env.DB_USERNAME || 'apple',
  password: process.env.DB_PASSWORD || 'Oselegend1.',
  database: process.env.DB_NAME || 'notification_system',
  synchronize: false,
  logging: true,
  entities: [Notification, Sms, Email],
  migrations: ['src/database/migrations/*.ts'],
  subscribers: [],
});
