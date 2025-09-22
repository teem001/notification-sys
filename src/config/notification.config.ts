export default () => ({
  smsProvider: process.env.SMS_PROVIDER || 'twilio',
  emailProvider: process.env.EMAIL_PROVIDER || 'ses',
  pushProvider: process.env.PUSH_PROVIDER || 'fcm',
});
