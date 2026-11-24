import crypto from 'crypto'
import { EVENT } from './event'
import { OPENAI_PIXEL_ID, normEmail, normPhone, splitName } from './openaiAds'
import { SITE_URL } from './site'
import type { PaymentLink } from './paymentLinks'
import type { Registration } from './registrations'

/* OpenAI Ads Conversions API (server-to-server) — sends a confirmed purchase
   as an `order_created` event. Docs: https://developers.openai.com/ads/conversions-api

   - Best-effort: never throws and never blocks/fails a payment. Short timeout.
   - No-op unless OPENAI_ADS_CAPI_KEY is set (create it in Ads Manager → Conversions).
   - Dedupes against the browser pixel: the event `id` is the Razorpay order id,
     the same value the pixel sends as `event_id`.
   - Only hashed (SHA-256) contact details are sent, never raw values.
   - Set OPENAI_ADS_VALIDATE_ONLY=true to have OpenAI validate events without saving them. */

const PIXEL_ID = process.env.OPENAI_ADS_PIXEL_ID || OPENAI_PIXEL_ID
const API_KEY = process.env.OPENAI_ADS_CAPI_KEY
const VALIDATE_ONLY = process.env.OPENAI_ADS_VALIDATE_ONLY === 'true'
const ENDPOINT = `https://bzr.openai.com/v1/events?pid=${encodeURIComponent(PIXEL_ID)}`

const sha256 = (v: string) => crypto.createHash('sha256').update(v, 'utf8').digest('hex')

interface Buyer { name?: string; email?: string; phone?: string }

function buildUser({ name, email, phone }: Buyer) {
  const user: Record<string, string[]> = {}
  const e = email ? normEmail(email) : null
  const p = phone ? normPhone(phone) : null
  const { first, last } = splitName(name ?? '')
  if (e) user.emails_sha256 = [sha256(e)]
  if (p) user.phone_numbers_sha256 = [sha256(p)]
  if (first) user.first_names_sha256 = [sha256(first)]
  if (last) user.last_names_sha256 = [sha256(last)]
  return Object.keys(user).length ? user : undefined
}

interface OrderEvent {
  orderId: string
  amount: number // paise
  currency: string
  paidAt?: Date
  sourceUrl: string
  itemId: string
  itemName: string
  buyer: Buyer
}

async function sendOrderCreated(o: OrderEvent): Promise<void> {
  if (!API_KEY) return
  try {
    const event = {
      id: o.orderId, // must equal the pixel's event_id for deduplication
      type: 'order_created',
      timestamp_ms: (o.paidAt instanceof Date ? o.paidAt : new Date()).getTime(),
      source_url: o.sourceUrl,
      action_source: 'web',
      user: buildUser(o.buyer),
      data: {
        type: 'contents',
        amount: o.amount,
        currency: o.currency,
        contents: [
          { id: o.itemId, name: o.itemName, content_type: 'product', quantity: 1, amount: o.amount, currency: o.currency },
        ],
      },
    }
    const res = await fetch(ENDPOINT, {
      method: 'POST',
      headers: { Authorization: `Bearer ${API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ validate_only: VALIDATE_ONLY, events: [event] }),
      signal: AbortSignal.timeout(3000),
    })
    if (!res.ok) {
      console.error('OpenAI Ads CAPI rejected event:', res.status, (await res.text().catch(() => '')).slice(0, 300))
    }
  } catch (err) {
    console.error('OpenAI Ads CAPI send failed:', err)
  }
}

/** A seminar registration that has just been marked paid. */
export function reportSeminarPaid(reg: Registration): Promise<void> {
  return sendOrderCreated({
    orderId: reg.orderId,
    amount: reg.amount,
    currency: reg.currency || 'INR',
    paidAt: reg.paidAt,
    sourceUrl: `${SITE_URL}/seminar/thank-you`,
    itemId: 'seminar',
    itemName: EVENT.title,
    buyer: { name: reg.name, email: reg.email, phone: reg.phone },
  })
}

/** A /pay payment link that has just been marked paid. */
export function reportPaymentLinkPaid(link: PaymentLink): Promise<void> {
  if (!link.orderId) return Promise.resolve()
  return sendOrderCreated({
    orderId: link.orderId,
    amount: link.totalAmount,
    currency: 'INR',
    paidAt: link.paidAt,
    sourceUrl: `${SITE_URL}/pay/${link.linkId}/thank-you`,
    itemId: link.linkId,
    itemName: link.description,
    buyer: { name: link.customerName, email: link.customerEmail, phone: link.customerPhone },
  })
}
