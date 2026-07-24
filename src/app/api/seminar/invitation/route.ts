import { getRegistrationByOrderId } from '@/lib/registrations'
import { buildInvitationPdf } from '@/lib/pdf'

/* Serves the invitation-letter PDF for a paid order, inline (viewable in-browser).
   e.g. /api/seminar/invitation?orderId=order_XXXX */
export async function GET(request: Request) {
  const orderId = new URL(request.url).searchParams.get('orderId') || ''
  if (!orderId) {
    return Response.json({ error: 'Missing orderId' }, { status: 400 })
  }

  const reg = await getRegistrationByOrderId(orderId)
  if (!reg || reg.status !== 'paid') {
    return Response.json({ error: 'Invitation not found' }, { status: 404 })
  }

  try {
    const pdf = await buildInvitationPdf(reg)
    return new Response(new Uint8Array(pdf), {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'inline; filename="Delta-Seminar-Invitation.pdf"',
        'Cache-Control': 'no-store',
      },
    })
  } catch (err) {
    console.error('invitation PDF route failed:', err)
    return Response.json({ error: 'Could not generate invitation' }, { status: 500 })
  }
}
