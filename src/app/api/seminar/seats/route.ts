import { getSeatAvailability } from '@/lib/seats'

/* Public seat-availability for the /seminar urgency badge + sold-out state.
   Capacity + buffer live in src/lib/seats.ts (single source of truth). */
export const dynamic = 'force-dynamic'

export async function GET() {
  const seats = await getSeatAvailability()
  return Response.json(seats, { headers: { 'Cache-Control': 'no-store' } })
}
