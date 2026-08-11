import PDFDocument from 'pdfkit'
import { EVENT } from './event'
import { getLogoBuffer } from './logo'
import { ascii } from './pdfText'
import type { PaymentLink } from './paymentLinks'

const inr = (paise: number) => 'INR ' + (paise / 100).toLocaleString('en-IN')

export function buildReceiptPdf(link: PaymentLink): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ size: 'A4', margin: 50 })
    const chunks: Buffer[] = []
    doc.on('data', (c) => chunks.push(c as Buffer))
    doc.on('end', () => resolve(Buffer.concat(chunks)))
    doc.on('error', reject)

    const W = doc.page.width
    const M = 50
    const cw = W - M * 2

    /* ── Header band ── */
    doc.rect(0, 0, W, 120).fill('#0b0a08')
    doc.rect(0, 120, W, 3).fill('#d4af37')
    let logoDrawn = false
    const logo = getLogoBuffer()
    if (logo) {
      try { doc.image(logo, M, 30, { height: 22 }); logoDrawn = true } catch { /* fall back to text */ }
    }
    if (!logoDrawn) {
      doc.fillColor('#e6c14e').font('Helvetica-Bold').fontSize(10).text('DELTA TRADING ACADEMY', M, 40, { characterSpacing: 2 })
    }
    doc.fillColor('#ffffff').font('Helvetica-Bold').fontSize(23).text('Payment receipt', M, 63)
    doc.fillColor('#b9b4ad').font('Helvetica').fontSize(11).text(ascii(link.description), M, 94)

    /* ── Greeting + body ── */
    doc.fillColor('#1a1a1a').font('Helvetica').fontSize(12).text('Dear ' + ascii(link.customerName || 'Customer') + ',', M, 150)
    doc.moveDown(0.6)
    doc.fillColor('#333333').font('Helvetica').fontSize(10.5).text(
      ascii(`Thank you for your payment. This receipt confirms we've received ${inr(link.totalAmount)} for ${link.description}.`),
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

    doc.fillColor('#b8901f').font('Helvetica-Bold').fontSize(10).text('PAYMENT DETAILS', M, doc.y, { characterSpacing: 1 })
    doc.moveDown(0.6)
    detailRow('Description', link.description)
    detailRow('Amount', inr(link.baseAmount))
    detailRow(`GST (${link.gstPct}%)`, inr(link.gstAmount))
    detailRow('Total paid', inr(link.totalAmount))
    detailRow('Paid at', link.paidAt ? new Date(link.paidAt).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }) : '-')

    doc.moveDown(0.4)
    doc.fillColor('#b8901f').font('Helvetica-Bold').fontSize(10).text('CUSTOMER', M, doc.y, { characterSpacing: 1 })
    doc.moveDown(0.6)
    detailRow('Name', link.customerName || '-')
    detailRow('Email', link.customerEmail || '-')
    detailRow('Phone', link.customerPhone || '-')
    if (link.orderId) detailRow('Order ID', link.orderId)
    if (link.paymentId) detailRow('Payment ID', link.paymentId)

    /* ── Sign-off ── */
    doc.moveDown(0.8)
    doc.fillColor('#333333').font('Helvetica').fontSize(10.5).text('Warm regards,', M, doc.y)
    doc.fillColor('#1a1a1a').font('Helvetica-Bold').fontSize(10.5).text('Team Delta Trading Academy')

    /* ── Footer (positioned safely above the bottom margin so it never spills
       onto a 2nd page) ── */
    doc.fillColor('#9a9a9a').font('Helvetica').fontSize(8.5).text(
      ascii('Delta Trading Academy  |  ' + EVENT.email + '  |  ' + EVENT.phone + '\n' + EVENT.officeAddress),
      M, doc.page.height - 100, { width: cw, align: 'center', lineGap: 2, height: 40 },
    )

    doc.end()
  })
}
