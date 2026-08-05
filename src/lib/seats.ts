import { countPaidRegistrations } from './registrations'

/* Venue capacity — the real seat limit. */
export const SEATS_TOTAL = 67

/* Display buffer added to the real paid count for the public "X / 60" figure
   (tune for urgency). Sold-out is ALSO capped at the real paid count, so a
   negative buffer can never let bookings run past the true capacity. */
export const SEATS_BUFFER = -1

export interface SeatAvailability {
  total: number
  booked: number
  left: number
  pct: number
  soldOut: boolean
}

/** Live seat availability for the public page + the order guard.
   Filled when either the shown count (paid + buffer) OR the real paid count
   reaches capacity — so display and payment gating always stay consistent. */
export async function getSeatAvailability(): Promise<SeatAvailability> {
  const paid = await countPaidRegistrations()
  const soldOut = paid >= SEATS_TOTAL || paid + SEATS_BUFFER >= SEATS_TOTAL
  const booked = soldOut ? SEATS_TOTAL : Math.max(0, Math.min(SEATS_TOTAL, paid + SEATS_BUFFER))
  const left = SEATS_TOTAL - booked
  const pct = Math.round((booked / SEATS_TOTAL) * 100)
  return { total: SEATS_TOTAL, booked, left, pct, soldOut }
}
