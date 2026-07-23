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

/** Mark a registration paid once the payment signature is verified. Best-effort. */
export async function markPaid(orderId: string, paymentId: string) {
  try {
    const db = await getDb()
    if (!db) return
    await db.collection<Registration>(COLLECTION).updateOne(
      { orderId },
      { $set: { status: 'paid', paymentId, paidAt: new Date() } },
    )
  } catch (err) {
    console.error('markPaid failed:', err)
  }
}

/** List registrations for the admin portal, newest first. */
export async function listRegistrations(limit = 500) {
  const db = await getDb()
  if (!db) return null
  const docs = await db
    .collection<Registration>(COLLECTION)
    .find({}, { projection: { _id: 0 } })
    .sort({ createdAt: -1 })
    .limit(limit)
    .toArray()
  return docs
}
