import PDFDocument from 'pdfkit'
import { EVENT } from './event'

/* Standard PDF fonts are ASCII/WinAnsi only — normalise fancy glyphs. */
function ascii(s: string) {
  return (s || '')
    .replace(/[‒-―]/g, '-')
    .replace(/[‘’]/g, "'")
    .replace(/[“”]/g, '"')
    .replace(/₹/g, 'INR ')
}

export function buildInvitationPdf(reg: {
  name: string
  orderId: string
  paymentId?: string
  amount: number
}): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ size: 'A4', margin: 50 })
    const chunks: Buffer[] = []
    doc.on('data', (c) => chunks.push(c as Buffer))
    doc.on('end', () => resolve(Buffer.concat(chunks)))
    doc.on('error', reject)

    const W = doc.page.width
    const M = 50
    const cw = W - M * 2
    const rupees = 'INR ' + (reg.amount / 100).toLocaleString('en-IN')

    /* ── Header band ── */
    doc.rect(0, 0, W, 118).fill('#0b0a08')
    doc.rect(0, 118, W, 3).fill('#d4af37')
    doc.fillColor('#e6c14e').font('Helvetica-Bold').fontSize(10).text('DELTA TRADING ACADEMY', M, 38, { characterSpacing: 2 })
    doc.fillColor('#ffffff').font('Helvetica-Bold').fontSize(23).text('Your seat is confirmed', M, 58)
    doc.fillColor('#b9b4ad').font('Helvetica').fontSize(11).text(ascii('Official invitation - ' + EVENT.title + ', ' + EVENT.city), M, 91)

    /* ── Greeting + body ── */
    doc.fillColor('#1a1a1a').font('Helvetica').fontSize(12).text('Dear ' + ascii(reg.name || 'Guest') + ',', M, 150)
    doc.moveDown(0.6)
    doc.fillColor('#333333').font('Helvetica').fontSize(10.5).text(
      ascii(
        'It is our pleasure to invite you to the ' + EVENT.title + ' in ' + EVENT.city +
        '. Your registration is confirmed and your seat is reserved. We look forward to hosting you for a focused day of live trading, practical strategy, and a premium experience at one of ' + EVENT.city + "'s finest venues.",
      ),
      { width: cw, lineGap: 3 },
    )
    doc.moveDown(1)

    /* ── Detail row helper (label | value) ── */
    const detailRow = (label: string, value: string) => {
      const startY = doc.y
      doc.fillColor('#1a1a1a').font('Helvetica').fontSize(10.5).text(ascii(value), M + 130, startY, { width: cw - 130, lineGap: 2 })
      const endY = doc.y
      doc.fillColor('#8a8a8a').font('Helvetica-Bold').fontSize(8.5).text(label.toUpperCase(), M, startY + 1, { width: 120, characterSpacing: 1 })
      doc.y = endY + 9
    }

    doc.fillColor('#b8901f').font('Helvetica-Bold').fontSize(10).text('EVENT DETAILS', M, doc.y, { characterSpacing: 1 })
    doc.moveDown(0.6)
    detailRow('Event', EVENT.title)
    detailRow('Date', EVENT.date)
    detailRow('Time', EVENT.time)
    detailRow('Venue', EVENT.venue)
    detailRow('Address', EVENT.address)

    doc.moveDown(0.4)
    doc.fillColor('#b8901f').font('Helvetica-Bold').fontSize(10).text('YOUR REGISTRATION', M, doc.y, { characterSpacing: 1 })
    doc.moveDown(0.6)
    detailRow('Attendee', reg.name || '-')
    detailRow('Amount paid', rupees)
    detailRow('Order ID', reg.orderId)
    if (reg.paymentId) detailRow('Payment ID', reg.paymentId)

    /* ── Before you arrive ── */
    doc.moveDown(0.4)
    doc.fillColor('#1a1a1a').font('Helvetica-Bold').fontSize(11).text('Before you arrive', M, doc.y)
    doc.moveDown(0.4)
    const bullets = [
      'Please arrive 15 minutes early for check-in.',
      'Carry a valid photo ID and this invitation.',
      'Bring a notebook or laptop for the hands-on sessions.',
      'A premium buffet lunch is included - no need to arrange your own.',
    ]
    doc.font('Helvetica').fontSize(10).fillColor('#444444')
    bullets.forEach((b) => {
      const y = doc.y
      doc.circle(M + 3, y + 5, 1.8).fill('#d4af37')
      doc.fillColor('#444444').text(ascii(b), M + 14, y, { width: cw - 14 })
      doc.moveDown(0.3)
    })

    /* ── Sign-off ── */
    doc.moveDown(0.8)
    doc.fillColor('#333333').font('Helvetica').fontSize(10.5).text('Warm regards,', M, doc.y)
    doc.fillColor('#1a1a1a').font('Helvetica-Bold').fontSize(10.5).text('Team Delta Trading Academy')

    /* ── Footer ── */
    doc.fillColor('#9a9a9a').font('Helvetica').fontSize(8.5).text(
      ascii('Delta Trading Academy  |  ' + EVENT.email + '  |  ' + EVENT.phone + '\n' + EVENT.address),
      M, doc.page.height - 62, { width: cw, align: 'center', lineGap: 2 },
    )

    doc.end()
  })
}
