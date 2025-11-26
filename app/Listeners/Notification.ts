import { sendRawMessage } from 'Config/FcmService'
import * as admin from 'firebase-admin'

type Dict = Record<string, any>

function stringifyData(obj: Dict): Record<string, string> {
  const out: Record<string, string> = {}
  for (const [k, v] of Object.entries(obj || {})) {
    if (v === undefined || v === null) continue
    out[k] = typeof v === 'string' ? v : JSON.stringify(v)
  }
  return out
}

export default class Notification {
  static async created(notification: Dict) {
    const { title, text, massage, data } = notification || {}
    const deviceToken: string | undefined = data?.deviceToken
    if (!deviceToken) return { ok: false, error: 'Missing deviceToken' }

    const dataPayload = stringifyData({
      message: massage,
      ...(typeof text === 'object' ? text : { text }),
    })

    const msg: admin.messaging.TokenMessage = {
      token: deviceToken,
      notification: {
        title: String(title ?? ''),
        body: String(massage ?? ''),
      },
      data: dataPayload,
      android: {
        priority: 'high',
        notification: { channelId: 'general', sound: 'default' },
      },
      apns: {
        headers: { 'apns-priority': '10', 'apns-push-type': 'alert' },
        payload: { aps: { sound: 'default', badge: 1 } },
      },
    }

    try {
      const id = await sendRawMessage(msg)
      return { ok: true, id }
    } catch (e: any) {
      console.error('[FCM] send error:', e?.message || e)
      return { ok: false, error: e?.message || 'send failed' }
    }
  }
}
