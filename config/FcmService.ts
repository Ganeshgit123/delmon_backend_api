import * as admin from 'firebase-admin'

function initApp() {
  if (admin.apps.length) return admin.app()

  if (process.env.FIREBASE_SERVICE_ACCOUNT) {
    return admin.initializeApp({
      credential: admin.credential.cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT as string)),
    })
  }
  return admin.initializeApp({
    credential: admin.credential.applicationDefault(),
  })
}
initApp()

const messaging = admin.messaging()

export async function sendToToken(
  token: string,
  title: string,
  body: string,
  data: Record<string, string> = {}
) {
  const msg: admin.messaging.TokenMessage = {
    token,
    notification: { title, body },
    data, // must be Record<string, string>
    android: {
      priority: 'high',
      notification: { channelId: 'general', sound: 'default' },
    },
    apns: {
      headers: { 'apns-priority': '10', 'apns-push-type': 'alert' },
      payload: { aps: { sound: 'default', badge: 1 } },
    },
  }
  return messaging.send(msg)
}

// Optional: raw sender but typed for token messages
export async function sendRawMessage(msg: admin.messaging.TokenMessage) {
  return messaging.send(msg)
}
