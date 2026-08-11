import { EVENT } from './event'
import { getLogoBuffer } from './logo'
import { buildReceiptPdf } from './receiptPdf'
import { createMailTransporter, isMailConfigured, MAIL_FROM as FROM } from './mailer'
import type { PaymentLink } from './paymentLinks'

const inr = (paise: number) => '₹' + (paise / 100).toLocaleString('en-IN')

export function buildReceiptHtml(link: PaymentLink) {
  const name = link.customerName || 'there'
  const detail = (label: string, value: string) => `
    <tr>
      <td style="padding:6px 0;color:#8a8a8a;font-size:12px;text-transform:uppercase;letter-spacing:.08em;width:120px;vertical-align:top;">${label}</td>
      <td style="padding:6px 0;color:#1a1a1a;font-size:14px;line-height:1.5;">${value}</td>
    </tr>`

  return `<!doctype html>
<html><body style="margin:0;background:#f2f1ee;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;">
  <div style="max-width:560px;margin:0 auto;padding:24px 16px;">
    <div style="background:#0b0a08;border-radius:20px 20px 0 0;padding:26px 32px;">
      <img src="cid:delta-logo" alt="Delta Trading Academy" width="128" style="height:24px;width:auto;display:block;margin:0 0 12px;" />
      <p style="margin:0;color:#ffffff;font-size:20px;font-weight:600;">Payment received &#10003;</p>
    </div>

    <div style="background:#ffffff;border-radius:0 0 20px 20px;padding:32px;">
      <p style="margin:0 0 16px;color:#1a1a1a;font-size:15px;line-height:1.7;">Dear ${name},</p>
      <p style="margin:0 0 16px;color:#444;font-size:14.5px;line-height:1.75;">
        Thank you for your payment. This email confirms we've received <strong>${inr(link.totalAmount)}</strong> for
        <strong>${link.description}</strong>. Your receipt is attached as a PDF.
      </p>

      <div style="background:#faf9f6;border:1px solid #ececec;border-radius:14px;padding:18px 20px;margin:22px 0;">
        <table style="width:100%;border-collapse:collapse;">
          ${detail('Description', link.description)}
          ${detail('Amount', inr(link.baseAmount))}
          ${detail(`GST (${link.gstPct}%)`, inr(link.gstAmount))}
          ${detail('Total paid', inr(link.totalAmount))}
          ${link.orderId ? detail('Order ID', link.orderId) : ''}
          ${link.paymentId ? detail('Payment ID', link.paymentId) : ''}
        </table>
      </div>

      <p style="margin:0;color:#666;font-size:13.5px;line-height:1.7;">
        Questions? Reply to this email or reach us at
        <a href="mailto:${EVENT.email}" style="color:#0b0a08;">${EVENT.email}</a> /
        <a href="tel:${EVENT.phone.replace(/\s/g, '')}" style="color:#0b0a08;">${EVENT.phone}</a>.
      </p>
      <p style="margin:18px 0 0;color:#666;font-size:13.5px;">Warm regards,<br/>Team Delta Trading Academy</p>
    </div>

    <p style="text-align:center;color:#9a9a9a;font-size:11px;line-height:1.6;margin:18px 0 0;">
      Delta Trading Academy &middot; ${EVENT.officeAddress}<br/>
      This is a transactional email regarding your payment.
    </p>
  </div>
</body></html>`
}

/** Send the payment receipt (HTML + PDF attachment) to a paid customer. Best-effort. */
export async function sendPaymentReceipt(link: PaymentLink) {
  if (!link.customerEmail) return
  if (!isMailConfigured()) {
    console.warn('[mail] payment receipt skipped — SMTP not configured (set SMTP_HOST / SMTP_USER / SMTP_PASS)')
    return
  }

  type Att = { filename: string; content: Buffer; contentType?: string; cid?: string; contentDisposition?: 'inline' | 'attachment' }
  const attachments: Att[] = []

  const logo = getLogoBuffer()
  if (logo) {
    attachments.push({ filename: 'logo.png', content: logo, contentType: 'image/png', cid: 'delta-logo', contentDisposition: 'inline' })
  }

  try {
    const pdf = await buildReceiptPdf(link)
    attachments.push({ filename: 'Delta-Payment-Receipt.pdf', content: pdf, contentType: 'application/pdf' })
  } catch (err) {
    console.error('[mail] receipt PDF failed — sending email without attachment:', err)
  }

  try {
    const transporter = createMailTransporter()
    const info = await transporter.sendMail({
      from: FROM,
      to: link.customerEmail,
      subject: `Payment receipt — ${link.description}`,
      html: buildReceiptHtml(link),
      attachments,
    })
    console.log('[mail] receipt sent to', link.customerEmail, '·', info.messageId)
  } catch (err) {
    console.error('[mail] sendPaymentReceipt failed:', err)
  }
}
