import { countPaidRegistrations } from '@/lib/registrations'

/* Public seat-availability for the /seminar urgency badge.
   "Booked" = the real count of paid registrations + a head-start buffer. */
export const dynamic = 'force-dynamic'

const TOTAL = 60
const BUFFER = -10

export async function GET() {
  const paid = await countPaidRegistrations()
  const booked = Math.min(TOTAL, paid + BUFFER)
  const left = Math.max(0, TOTAL - booked)
  const pct = Math.round((booked / TOTAL) * 100)

  return Response.json(
    { total: TOTAL, booked, left, pct },
    { headers: { 'Cache-Control': 'no-store' } },
  )
}
