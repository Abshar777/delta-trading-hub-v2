import { getCookieConsent } from './cookieConsent'

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[]
  }
}

/* Push a GA4-style event to GTM's dataLayer. Only fires once the visitor has
   accepted analytics cookies (same gate as GTM itself), never throws, and must
   never carry personal data — ids, amounts and page paths only.
   Returns true if the event was pushed. */
export function pushEvent(event: string, params: Record<string, unknown> = {}): boolean {
  if (typeof window === 'undefined') return false
  try {
    if (getCookieConsent()?.analytics !== true) return false
    window.dataLayer = window.dataLayer || []
    window.dataLayer.push({ event, ...params })
    return true
  } catch {
    return false
  }
}
