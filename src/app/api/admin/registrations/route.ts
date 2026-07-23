import crypto from 'crypto'
import { listRegistrations } from '@/lib/registrations'
import { isDbConfigured } from '@/lib/mongodb'

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD

/* Constant-time string comparison to avoid timing attacks. */
function safeEqual(a: string, b: string) {
  const ab = Buffer.from(a)
  const bb = Buffer.from(b)
  if (ab.length !== bb.length) return false
  return crypto.timingSafeEqual(ab, bb)
}

export async function GET(request: Request) {
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

  try {
    const registrations = await listRegistrations()
    return Response.json({ registrations })
  } catch (err) {
    console.error('admin registrations error:', err)
    return Response.json({ error: 'Could not load registrations.' }, { status: 500 })
  }
}
