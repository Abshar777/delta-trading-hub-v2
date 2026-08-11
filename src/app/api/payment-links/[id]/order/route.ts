import Razorpay from 'razorpay'
import { attachOrderToLink, getPaymentLink } from '@/lib/paymentLinks'

const KEY_ID = process.env.RAZORPAY_KEY_ID
const KEY_SECRET = process.env.RAZORPAY_KEY_SECRET

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!KEY_ID || !KEY_SECRET) {
    return Response.json(
      { error: 'Payments are not set up yet. Add your Razorpay keys to .env.local.' },
      { status: 503 },
    )
  }

  const { id } = await params
  const link = await getPaymentLink(id)
  if (!link) {
    return Response.json({ error: 'This payment link was not found.' }, { status: 404 })
  }
  if (link.status === 'paid') {
    return Response.json({ error: 'This payment has already been completed.', alreadyPaid: true }, { status: 409 })
  }

  try {
    const body = await request.json().catch(() => ({}))
    const name = String(body.name ?? '').trim()
    const email = String(body.email ?? '').trim()
    const phone = String(body.phone ?? '').trim()
    if (!name || !email || !phone) {
      return Response.json({ error: 'Name, email and phone are required.' }, { status: 400 })
    }

    const rzp = new Razorpay({ key_id: KEY_ID, key_secret: KEY_SECRET })
    const order = await rzp.orders.create({
      amount: link.totalAmount,
      currency: 'INR',
      receipt: `paylink_${id}_${Date.now()}`,
      notes: {
        linkId: id,
        description: link.description,
        baseAmount: String(link.baseAmount),
        gstAmount: String(link.gstAmount),
        name,
        email,
        phone,
      },
    })

    await attachOrderToLink(id, { orderId: order.id, name, email, phone })

    return Response.json({
      orderId: order.id,
      amount: link.totalAmount,
      currency: 'INR',
      keyId: KEY_ID,
    })
  } catch (err) {
    console.error('Payment-link order error:', err)
    return Response.json({ error: 'Could not start the payment. Please try again.' }, { status: 500 })
  }
}
