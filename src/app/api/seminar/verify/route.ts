import crypto from 'crypto'
import { markPaidOnce } from '@/lib/registrations'
import { fulfillPaid } from '@/lib/fulfill'

const KEY_SECRET = process.env.RAZORPAY_KEY_SECRET

/* Verify the Razorpay payment signature server-side (HMAC-SHA256). */
export async function POST(request: Request) {
  if (!KEY_SECRET) {
    return Response.json({ verified: false, error: 'Not configured' }, { status: 503 })
  }

  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = await request.json()

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return Response.json({ verified: false, error: 'Missing payment fields' }, { status: 400 })
    }

    const expected = crypto
      .createHmac('sha256', KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex')

    const verified = expected === razorpay_signature
    if (verified) {
      /* markPaidOnce is idempotent — fulfill only if THIS call marked it paid
         (the webhook may have already handled it) */
      const reg = await markPaidOnce(razorpay_order_id, razorpay_payment_id)
      if (reg) await fulfillPaid(reg)
    }
    return Response.json({ verified }, { status: verified ? 200 : 400 })
  } catch (err) {
    console.error('Razorpay verify error:', err)
    return Response.json({ verified: false, error: 'Verification failed' }, { status: 500 })
  }
}
