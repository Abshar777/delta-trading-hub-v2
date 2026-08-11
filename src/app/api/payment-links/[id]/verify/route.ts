import crypto from 'crypto'
import { markPaymentLinkPaidOnce } from '@/lib/paymentLinks'
import { sendPaymentReceipt } from '@/lib/paymentReceiptMail'

const KEY_SECRET = process.env.RAZORPAY_KEY_SECRET

/* Verify the Razorpay payment signature server-side (HMAC-SHA256) — same
   scheme as /api/seminar/verify. */
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
      /* idempotent — only send the receipt when THIS call transitioned the
         link to paid (the webhook may already have handled it) */
      const link = await markPaymentLinkPaidOnce(razorpay_order_id, razorpay_payment_id)
      if (link) await sendPaymentReceipt(link)
    }
    return Response.json({ verified }, { status: verified ? 200 : 400 })
  } catch (err) {
    console.error('Payment-link verify error:', err)
    return Response.json({ verified: false, error: 'Verification failed' }, { status: 500 })
  }
}
