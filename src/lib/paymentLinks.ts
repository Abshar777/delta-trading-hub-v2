import crypto from 'crypto'
import type { Collection } from 'mongodb'
import { getDb } from './mongodb'

export interface PaymentLink {
  linkId: string
  description: string
  baseAmount: number    // paise, before GST
  gstPct: number
  gstAmount: number     // paise
  totalAmount: number   // paise, what the customer actually pays
  status: 'pending' | 'paid'
  orderId?: string
  paymentId?: string
  customerName?: string
  customerEmail?: string
  customerPhone?: string
  createdAt: Date
  paidAt?: Date
}

const COLLECTION = 'paymentLinks'
export const GST_PCT = 18

/** Base amount (paise) → { gstAmount, totalAmount } (paise). Rounds to the nearest paisa. */
export function computeGst(baseAmount: number, gstPct: number = GST_PCT) {
  const gstAmount = Math.round((baseAmount * gstPct) / 100)
  return { gstAmount, totalAmount: baseAmount + gstAmount }
}

async function generateLinkId(col: Collection<PaymentLink>) {
  for (let i = 0; i < 5; i++) {
    const id = crypto.randomBytes(6).toString('base64url')
    const exists = await col.findOne({ linkId: id }, { projection: { _id: 1 } })
    if (!exists) return id
  }
  throw new Error('Could not generate a unique payment link id')
}

/** Create a new payment link with a fresh id. Amount is in rupees (whole ₹, admin input). */
export async function createPaymentLink({ description, amountRupees }: { description: string; amountRupees: number }) {
  const db = await getDb()
  if (!db) return null
  const col = db.collection<PaymentLink>(COLLECTION)

  const baseAmount = Math.round(amountRupees * 100)
  const { gstAmount, totalAmount } = computeGst(baseAmount)
  const linkId = await generateLinkId(col)

  const doc: PaymentLink = {
    linkId,
    description: description || 'Course payment',
    baseAmount,
    gstPct: GST_PCT,
    gstAmount,
    totalAmount,
    status: 'pending',
    createdAt: new Date(),
  }
  await col.insertOne(doc)
  return doc
}

export async function getPaymentLink(linkId: string): Promise<PaymentLink | null> {
  const db = await getDb()
  if (!db) return null
  const doc = await db.collection<PaymentLink>(COLLECTION).findOne({ linkId }, { projection: { _id: 0 } })
  return (doc as PaymentLink | null) ?? null
}

/** Attach the Razorpay order + who's paying, once the customer starts checkout. Best-effort. */
export async function attachOrderToLink(
  linkId: string,
  { orderId, name, email, phone }: { orderId: string; name: string; email: string; phone: string },
) {
  try {
    const db = await getDb()
    if (!db) return
    await db.collection<PaymentLink>(COLLECTION).updateOne(
      { linkId, status: { $ne: 'paid' } },
      { $set: { orderId, customerName: name, customerEmail: email, customerPhone: phone } },
    )
  } catch (err) {
    console.error('attachOrderToLink failed:', err)
  }
}

/** Atomically mark a payment link paid by its Razorpay order id (idempotent — mirrors
 *  registrations.markPaidOnce). Used by both the client-side /verify call and the webhook,
 *  so a payment is fulfilled exactly once even if both fire for the same order. */
export async function markPaymentLinkPaidOnce(orderId: string, paymentId: string): Promise<PaymentLink | null> {
  try {
    const db = await getDb()
    if (!db) return null
    const doc = await db.collection<PaymentLink>(COLLECTION).findOneAndUpdate(
      { orderId, status: { $ne: 'paid' } },
      { $set: { status: 'paid', paymentId, paidAt: new Date() } },
      { returnDocument: 'after', projection: { _id: 0 } },
    )
    return (doc as PaymentLink | null) ?? null
  } catch (err) {
    console.error('markPaymentLinkPaidOnce failed:', err)
    return null
  }
}

export async function listPaymentLinks(limit = 100): Promise<PaymentLink[]> {
  const db = await getDb()
  if (!db) return []
  const rows = await db
    .collection<PaymentLink>(COLLECTION)
    .find({}, { projection: { _id: 0 } })
    .sort({ createdAt: -1 })
    .limit(limit)
    .toArray()
  return rows as PaymentLink[]
}
