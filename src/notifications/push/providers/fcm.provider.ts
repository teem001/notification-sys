// // import * as admin from 'firebase-admin';

// // export class FcmProvider {
// //   constructor() {
// //     if (!admin.apps.length) {
// //       const creds = process.env.FCM_CREDENTIALS_JSON;
// //       if (!creds) {
// //         throw new Error(
// //           'Missing FCM_CREDENTIALS_JSON in environment variables',
// //         );
// //       }

// //       const parsed = JSON.parse(creds);

// //       // 🔑 Fix private key line breaks
// //       parsed.private_key = parsed.private_key.replace(/\\n/g, '\n');

// //       admin.initializeApp({
// //         credential: admin.credential.cert(parsed),
// //       });
// //     }
// //   }

// //   async sendPush(to: string, message: string) {
// //     await admin.messaging().send({
// //       token: to,
// //       notification: {
// //         title: 'Notification',
// //         body: message,
// //       },
// //     });
// //   }
// // }
// // import * as admin from 'firebase-admin';

// // export class FcmProvider {
// //   constructor() {
// //     if (!admin.apps.length) {
// //       const creds = process.env.FCM_CREDENTIALS_JSON;
// //       if (!creds) {
// //         throw new Error(
// //           'Missing FCM_CREDENTIALS_JSON in environment variables',
// //         );
// //       }

// //       let parsed;
// //       try {
// //         parsed = JSON.parse(creds);
// //       } catch (err) {
// //         throw new Error('Invalid JSON for FCM_CREDENTIALS_JSON');
// //       }

// //       admin.initializeApp({
// //         credential: admin.credential.cert(parsed),
// //       });
// //     }
// //   }

// //   async sendPush(to: string, message: string) {
// //     await admin.messaging().send({
// //       token: to,
// //       notification: {
// //         title: 'Notification',
// //         body: message,
// //       },
// //     });
// //   }
// // }
// import * as admin from 'firebase-admin';
// const serviceAccount = require('../../../../firebase-service-account.json');

// export class FcmProvider {
//   constructor() {
//     if (!admin.apps.length) {
//       admin.initializeApp({
//         credential: admin.credential.cert(
//           serviceAccount as admin.ServiceAccount,
//         ),
//       });
//     }
//   }

//   async sendPush(to: string, message: string) {
//     await admin.messaging().send({
//       token: to,
//       notification: {
//         title: 'Notification',
//         body: message,
//       },
//     });
//   }
// }

