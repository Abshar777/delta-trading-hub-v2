import { getPaymentLink } from '@/lib/paymentLinks'

/* Public — powers the /pay/[id] checkout page. Only exposes what's safe to
   show a paying customer (no internal ids beyond the link itself). */
export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const link = await getPaymentLink(id)
  if (!link) {
    return Response.json({ error: 'This payment link was not found.' }, { status: 404 })
  }

  return Response.json({
    description: link.description,
    baseAmount: link.baseAmount,
    gstPct: link.gstPct,
    gstAmount: link.gstAmount,
    totalAmount: link.totalAmount,
    status: link.status,
  })
}
