import crypto from 'crypto'
import { markPaidOnce } from '@/lib/registrations'
import { fulfillPaid } from '@/lib/fulfill'

const WEBHOOK_SECRET = process.env.RAZORPAY_WEBHOOK_SECRET

/* Razorpay server-to-server webhook. Fires even if the browser never calls
   /verify (tab closed, network dropped after paying), so no paid registration
   is ever missed. Signature = HMAC-SHA256 of the RAW body with the webhook secret. */
export async function POST(request: Request) {
  if (!WEBHOOK_SECRET) {
    return Response.json({ error: 'Webhook not configured' }, { status: 503 })
  }

  const raw = await request.text()
  const signature = request.headers.get('x-razorpay-signature') || ''
  const expected = crypto.createHmac('sha256', WEBHOOK_SECRET).update(raw).digest('hex')

  const sigBuf = Buffer.from(signature)
  const expBuf = Buffer.from(expected)
  const valid = sigBuf.length === expBuf.length && crypto.timingSafeEqual(sigBuf, expBuf)
  if (!valid) {
    return Response.json({ error: 'Invalid signature' }, { status: 400 })
  }

  try {
    const body = JSON.parse(raw)
    const payment = body?.payload?.payment?.entity
    const orderId: string | undefined = payment?.order_id
    const paymentId: string | undefined = payment?.id

    if ((body.event === 'payment.captured' || body.event === 'order.paid') && orderId && paymentId) {
      const reg = await markPaidOnce(orderId, paymentId)
      if (reg) await fulfillPaid(reg) // only when THIS call marked it paid
    }

    /* Always ack with 200 so Razorpay doesn't retry a handled event */
    return Response.json({ received: true })
  } catch (err) {
    console.error('Razorpay webhook error:', err)
    return Response.json({ received: true })
  }
}
