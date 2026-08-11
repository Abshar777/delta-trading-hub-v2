import { getPaymentLink } from '@/lib/paymentLinks'
import { buildReceiptPdf } from '@/lib/receiptPdf'

/* Serves the payment receipt PDF for a paid link, inline (viewable in-browser).
   e.g. /api/payment-links/[id]/receipt */
export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const link = await getPaymentLink(id)
  if (!link || link.status !== 'paid') {
    return Response.json({ error: 'Receipt not found' }, { status: 404 })
  }

  try {
    const pdf = await buildReceiptPdf(link)
    return new Response(new Uint8Array(pdf), {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'inline; filename="Delta-Payment-Receipt.pdf"',
        'Cache-Control': 'no-store',
      },
    })
  } catch (err) {
    console.error('receipt PDF route failed:', err)
    return Response.json({ error: 'Could not generate receipt' }, { status: 500 })
  }
}
