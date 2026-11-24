import { OPENAI_PIXEL_ID, normEmail, normPhone, splitName } from './openaiAds'

/* OpenAI ads pixel helpers (browser).
   `window.oaiq` only exists once <OpenAIPixel /> has loaded, which happens only
   after the visitor allows Marketing cookies — so without consent every call
   here is a silent no-op. Contact details are SHA-256 hashed in the browser
   (after the normalisation OpenAI specifies) — raw values are never sent. */
declare global {
  interface Window {
    oaiq?: (...args: unknown[]) => void
  }
}

async function sha256Hex(value: string): Promise<string> {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(value))
  return Array.from(new Uint8Array(buf), (b) => b.toString(16).padStart(2, '0')).join('')
}

export interface PixelUser { name?: string; email?: string; phone?: string }

/** Give the pixel hashed customer details to improve conversion matching. */
export async function identifyUser({ name, email, phone }: PixelUser): Promise<void> {
  if (typeof window === 'undefined' || !window.oaiq) return
  try {
    const e = email ? normEmail(email) : null
    const p = phone ? normPhone(phone) : null
    const { first, last } = splitName(name ?? '')
    const user: Record<string, string> = {}
    if (e) user.email_sha256 = await sha256Hex(e)
    if (p) user.phone_number_sha256 = await sha256Hex(p)
    if (first) user.first_name_sha256 = await sha256Hex(first)
    if (last) user.last_name_sha256 = await sha256Hex(last)
    if (Object.keys(user).length === 0) return
    window.oaiq('init', { pixelId: OPENAI_PIXEL_ID, user })
  } catch {
    /* tracking must never break the form */
  }
}

export async function trackLeadCreated(user?: PixelUser): Promise<void> {
  if (typeof window === 'undefined') return
  try {
    if (user) await identifyUser(user)
    window.oaiq?.('measure', 'lead_created', { type: 'customer_action' })
  } catch {
    /* tracking must never break the form */
  }
}

/** Confirmed purchase. `orderId` doubles as the event id so the server-side
 *  Conversions API copy of the same order is deduplicated. Amount is in paise. */
export function trackOrderCreated(o: {
  orderId: string
  amount: number
  currency: string
  itemId: string
  itemName: string
}): void {
  if (typeof window === 'undefined') return
  try {
    window.oaiq?.(
      'measure',
      'order_created',
      {
        type: 'contents',
        amount: o.amount,
        currency: o.currency,
        contents: [
          { id: o.itemId, name: o.itemName, content_type: 'product', quantity: 1, amount: o.amount, currency: o.currency },
        ],
      },
      { event_id: o.orderId },
    )
  } catch {
    /* tracking must never break the checkout */
  }
}
