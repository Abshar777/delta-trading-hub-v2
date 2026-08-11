import crypto from 'crypto'
import { createPaymentLink, listPaymentLinks } from '@/lib/paymentLinks'
import { isDbConfigured } from '@/lib/mongodb'

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD

/* Constant-time string comparison to avoid timing attacks. */
function safeEqual(a: string, b: string) {
  const ab = Buffer.from(a)
  const bb = Buffer.from(b)
  if (ab.length !== bb.length) return false
  return crypto.timingSafeEqual(ab, bb)
}

function checkAuth(request: Request) {
  if (!ADMIN_PASSWORD) return { ok: false, res: Response.json({ error: 'Admin access is not configured (set ADMIN_PASSWORD).' }, { status: 503 }) }
  const provided = request.headers.get('x-admin-key') || ''
  if (!safeEqual(provided, ADMIN_PASSWORD)) return { ok: false, res: Response.json({ error: 'Unauthorized' }, { status: 401 }) }
  return { ok: true as const }
}

export async function GET(request: Request) {
  const auth = checkAuth(request)
  if (!auth.ok) return auth.res

  if (!isDbConfigured()) {
    return Response.json({ error: 'Database is not configured (set MONGODB_URI).' }, { status: 503 })
  }

  try {
    const rows = await listPaymentLinks()
    return Response.json({ rows })
  } catch (err) {
    console.error('admin payment-links list error:', err)
    return Response.json({ error: 'Could not load payment links.' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  const auth = checkAuth(request)
  if (!auth.ok) return auth.res

  if (!isDbConfigured()) {
    return Response.json({ error: 'Database is not configured (set MONGODB_URI).' }, { status: 503 })
  }

  try {
    const body = await request.json().catch(() => ({}))
    const amountRupees = Number(body.amount)
    const description = String(body.description ?? '').trim().slice(0, 200)

    if (!Number.isFinite(amountRupees) || amountRupees <= 0) {
      return Response.json({ error: 'Enter a valid amount.' }, { status: 400 })
    }

    const link = await createPaymentLink({ description, amountRupees })
    if (!link) {
      return Response.json({ error: 'Could not create the payment link.' }, { status: 500 })
    }
    return Response.json({ link })
  } catch (err) {
    console.error('admin payment-links create error:', err)
    return Response.json({ error: 'Could not create the payment link.' }, { status: 500 })
  }
}
