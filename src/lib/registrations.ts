import { getDb } from './mongodb'

export interface Registration {
  name: string
  email: string
  phone: string
  seminar: string
  amount: number
  currency: string
  orderId: string
  paymentId?: string
  status: 'created' | 'paid'
  createdAt: Date
  paidAt?: Date
}

const COLLECTION = 'registrations'

/** Insert a pending registration when a payment order is created. Best-effort. */
export async function saveRegistration(reg: Omit<Registration, 'status' | 'createdAt'>) {
  try {
    const db = await getDb()
    if (!db) return
    await db.collection<Registration>(COLLECTION).insertOne({
      ...reg,
      status: 'created',
      createdAt: new Date(),
    })
  } catch (err) {
    console.error('saveRegistration failed:', err)
  }
}

/** Atomically mark a registration paid ONLY if it wasn't already paid.
 *  Returns the updated doc when THIS call transitioned it to paid, or null when
 *  it was already paid / not found. This keeps the verify route and the webhook
 *  idempotent — the confirmation email + sheet write fire exactly once, even if
 *  both fire for the same payment. Best-effort. */
export async function markPaidOnce(orderId: string, paymentId: string): Promise<Registration | null> {
  try {
    const db = await getDb()
    if (!db) return null
    const col = db.collection<Registration>(COLLECTION)
    const doc = await col.findOneAndUpdate(
      { orderId, status: { $ne: 'paid' } },
      { $set: { status: 'paid', paymentId, paidAt: new Date() } },
      { returnDocument: 'after', projection: { _id: 0 } },
    )
    return (doc as Registration | null) ?? null
  } catch (err) {
    console.error('markPaidOnce failed:', err)
    return null
  }
}

/* ── Admin: paginated + filtered query ── */
export interface RegQuery {
  page: number
  limit: number
  status: 'all' | 'created' | 'paid'
  q: string
}

function escapeRegex(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

export async function queryRegistrations({ page, limit, status, q }: RegQuery) {
  const db = await getDb()
  if (!db) return null
  const col = db.collection<Registration>(COLLECTION)

  const filter: Record<string, unknown> = {}
  if (status === 'paid' || status === 'created') filter.status = status
  if (q) {
    const rx = new RegExp(escapeRegex(q), 'i')
    filter.$or = [{ name: rx }, { email: rx }, { phone: rx }, { orderId: rx }]
  }

  const skip = (page - 1) * limit

  const [rows, total, totalLeads, paid, revenueAgg] = await Promise.all([
    col.find(filter, { projection: { _id: 0 } }).sort({ createdAt: -1 }).skip(skip).limit(limit).toArray(),
    col.countDocuments(filter),
    col.countDocuments({}),
    col.countDocuments({ status: 'paid' }),
    col.aggregate<{ sum: number }>([
      { $match: { status: 'paid' } },
      { $group: { _id: null, sum: { $sum: '$amount' } } },
    ]).toArray(),
  ])

  return {
    rows: rows as Registration[],
    total,
    stats: { totalLeads, paid, revenue: revenueAgg[0]?.sum ?? 0 },
  }
}
