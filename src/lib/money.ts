/* Currencies a payment link can be created in, plus formatting helpers.
   Safe to import from both client and server code (no Node-only imports).
   All supported currencies have 2 decimal places, so amounts are stored as
   integer minor units (paise / fils / cents) = major × 100. */

export const CURRENCIES = [
  { code: 'INR', label: 'INR — Indian Rupee', locale: 'en-IN' },
  { code: 'AED', label: 'AED — UAE Dirham', locale: 'en-US' },
  { code: 'USD', label: 'USD — US Dollar', locale: 'en-US' },
] as const

export type CurrencyCode = (typeof CURRENCIES)[number]['code']
export const DEFAULT_CURRENCY: CurrencyCode = 'INR'

export function isCurrency(v: unknown): v is CurrencyCode {
  return CURRENCIES.some((c) => c.code === v)
}

/** Currency of a stored link. Links created before currencies existed have none → INR. */
export function linkCurrency(link: { currency?: string | null }): CurrencyCode {
  return isCurrency(link.currency) ? link.currency : DEFAULT_CURRENCY
}

/** 15000.5 → 1500050 (minor units). */
export function toMinor(amount: number): number {
  return Math.round(amount * 100)
}

/** 1500050 + 'INR' → "₹15,000.50"; whole amounts drop the decimals ("₹15,000"). */
export function formatMoney(minor: number, currency?: string | null): string {
  const code = linkCurrency({ currency })
  const locale = CURRENCIES.find((c) => c.code === code)!.locale
  const whole = minor % 100 === 0
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: code,
    minimumFractionDigits: whole ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(minor / 100)
}

/** Plain-ASCII variant for the receipt PDF (its built-in font has no ₹ glyph): "INR 15,000". */
export function formatMoneyAscii(minor: number, currency?: string | null): string {
  const code = linkCurrency({ currency })
  const locale = CURRENCIES.find((c) => c.code === code)!.locale
  const whole = minor % 100 === 0
  return `${code} ${(minor / 100).toLocaleString(locale, {
    minimumFractionDigits: whole ? 0 : 2,
    maximumFractionDigits: 2,
  })}`
}
