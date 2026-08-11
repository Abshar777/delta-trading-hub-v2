import crypto from 'crypto'
import { getPaymentLink } from '@/lib/paymentLinks'
import { isDbConfigured } from '@/lib/mongodb'

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD

/* Constant-time string comparison to avoid timing attacks. */
function safeEqual(a: string, b: string) {
  const ab = Buffer.from(a)
  const bb = Buffer.from(b)
  if (ab.length !== bb.length) return false
  return crypto.timingSafeEqual(ab, bb)
}

/* Admin-only — full link record including customer details, order id,
   payment id and timestamps (the public GET at /api/payment-links/[id]
   deliberately withholds these). */
export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!ADMIN_PASSWORD) {
    return Response.json({ error: 'Admin access is not configured (set ADMIN_PASSWORD).' }, { status: 503 })
  }
  const provided = request.headers.get('x-admin-key') || ''
  if (!safeEqual(provided, ADMIN_PASSWORD)) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }
  if (!isDbConfigured()) {
    return Response.json({ error: 'Database is not configured (set MONGODB_URI).' }, { status: 503 })
  }

  const { id } = await params
  const link = await getPaymentLink(id)
  if (!link) {
    return Response.json({ error: 'Payment link not found.' }, { status: 404 })
  }
  return Response.json({ link })
}
