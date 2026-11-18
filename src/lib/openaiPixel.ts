/* OpenAI ads pixel conversion events.
   `window.oaiq` only exists once <OpenAIPixel /> has loaded, which happens only
   after the visitor allows Marketing cookies — so without consent every call
   here is a silent no-op. */
declare global {
  interface Window {
    oaiq?: (...args: unknown[]) => void
  }
}

export function trackLeadCreated(): void {
  if (typeof window === 'undefined') return
  try {
    window.oaiq?.('measure', 'lead_created', { type: 'customer_action' })
  } catch {
    /* tracking must never break the form */
  }
}
