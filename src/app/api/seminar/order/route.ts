import Razorpay from 'razorpay'
import { saveRegistration } from '@/lib/registrations'
import { getSeatAvailability } from '@/lib/seats'

/* Ticket price in paise (₹299 = 29900). Change here to update the amount. */
export const SEMINAR_AMOUNT = 29_900
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

  /* Sold out → refuse to create an order (server-side gate, so payment can't
     start even if the client is bypassed). */
  const seats = await getSeatAvailability()
  if (seats.soldOut) {
    return Response.json(
      { error: 'Sorry — all seats are filled. Registration for this event is now closed.', soldOut: true },
      { status: 409 },
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

    /* Persist a pending registration (best-effort — never blocks payment) */
    await saveRegistration({
      name: String(body.name ?? ''),
      email: String(body.email ?? ''),
      phone: String(body.phone ?? ''),
      seminar: 'Bangalore',
      amount: SEMINAR_AMOUNT,
      currency: 'INR',
      orderId: order.id,
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
