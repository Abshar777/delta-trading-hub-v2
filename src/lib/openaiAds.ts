/* Shared, dependency-free helpers for OpenAI Ads conversion matching.
   Used by the browser pixel helpers (openaiPixel.ts) and the server-side
   Conversions API sender (openaiConversions.ts). Normalisation rules follow
   https://developers.openai.com/ads/measurement-pixel — each value must be
   normalised first, then SHA-256 hashed; raw values are never sent. */

export const OPENAI_PIXEL_ID = 'G5RhitfM2UuNounPV731Kq'

/** Trim + lowercase. Returns null when it isn't a plausible email. */
export function normEmail(value: string): string | null {
  const s = value.trim().toLowerCase()
  return /^\S+@\S+\.\S+$/.test(s) ? s : null
}

/** Digits only, no leading "+" or zeroes. Needs 8–15 digits (country code included). */
export function normPhone(value: string): string | null {
  const d = value.replace(/[\s().-]/g, '').replace(/^\+/, '').replace(/^0+/, '')
  return /^\d{8,15}$/.test(d) ? d : null
}

/** Lowercase, drop whitespace and ASCII punctuation; keep non-ASCII (accents) as-is. */
export function normName(value: string): string | null {
  const s = value.toLowerCase().replace(/[\s!-/:-@[-`{-~]/g, '')
  return s || null
}

/** "Mary Jane Smith" → first "Mary", last "Jane Smith". Single names have no last name. */
export function splitName(full: string): { first: string | null; last: string | null } {
  const parts = full.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return { first: null, last: null }
  return {
    first: normName(parts[0]),
    last: parts.length > 1 ? normName(parts.slice(1).join(' ')) : null,
  }
}
