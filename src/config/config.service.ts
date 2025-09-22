export default () => ({
  aws: {
    region: process.env.AWS_REGION || 'us-east-1',
  },
  queues: {
    sms: process.env.SMS_QUEUE_URL,
    email: process.env.EMAIL_QUEUE_URL,
    push: process.env.PUSH_QUEUE_URL,
  },
  db: {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    username: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASS || 'postgres',
    database: process.env.DB_NAME || 'notifications_db',
  },
  providers: {
    sms: process.env.SMS_PROVIDER || 'twilio',
    email: process.env.EMAIL_PROVIDER || 'ses',
    push: process.env.PUSH_PROVIDER || 'fcm',
  },
});
