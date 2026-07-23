import Razorpay from 'razorpay'

/* Ticket price in paise (₹999 = 99900). Change here to update the amount. */
export const SEMINAR_AMOUNT = 99_900
const KEY_ID = process.env.RAZORPAY_KEY_ID
const KEY_SECRET = process.env.RAZORPAY_KEY_SECRET

export async function POST(request: Request) {
  /* Not configured yet → tell the client clearly instead of crashing. */
  if (!KEY_ID || !KEY_SECRET) {
    return Response.json(
      { error: 'Payments are not set up yet. Add your Razorpay keys to .env.local.' },
      { status: 503 },
    )
  }

  try {
    const body = await request.json().catch(() => ({}))
    const rzp = new Razorpay({ key_id: KEY_ID, key_secret: KEY_SECRET })

    const order = await rzp.orders.create({
      amount: SEMINAR_AMOUNT,
      currency: 'INR',
      receipt: `sem_blr_${Date.now()}`,
      notes: {
        seminar: 'Bangalore',
        name: String(body.name ?? ''),
        email: String(body.email ?? ''),
        phone: String(body.phone ?? ''),
      },
    })

    return Response.json({
      orderId: order.id,
      amount: SEMINAR_AMOUNT,
      currency: 'INR',
      keyId: KEY_ID,
    })
  } catch (err) {
    console.error('Razorpay order error:', err)
    return Response.json({ error: 'Could not start the payment. Please try again.' }, { status: 500 })
  }
}
