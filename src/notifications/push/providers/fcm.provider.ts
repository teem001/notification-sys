import * as admin from 'firebase-admin';

export class FcmProvider {
  constructor() {
    if (!admin.apps.length) {
      admin.initializeApp({
        credential: admin.credential.cert(
          JSON.parse(process.env.FCM_CREDENTIALS_JSON),
        ),
      });
    }
  }

  async sendPush(to: string, message: string) {
    await admin.messaging().send({
      token: to,
      notification: {
        title: 'Notification',
        body: message,
      },
    });
  }
}
