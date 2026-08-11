import type { Registration } from './registrations'
import { EVENT } from './event'
import { buildInvitationPdf } from './pdf'
import { getLogoBuffer } from './logo'
import { createMailTransporter, isMailConfigured, MAIL_FROM as FROM } from './mailer'

export { isMailConfigured }

export function buildInvitationHtml(reg: {
  name: string
  orderId: string
  paymentId?: string
  amount: number
}) {
  const rupees = '₹' + (reg.amount / 100).toLocaleString('en-IN')
  const name = reg.name || 'there'
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
      <p style="margin:0;color:#ffffff;font-size:20px;font-weight:600;">Your seat is confirmed &#127881;</p>
    </div>

    <div style="background:#ffffff;border-radius:0 0 20px 20px;padding:32px;">
      <p style="margin:0 0 16px;color:#1a1a1a;font-size:15px;line-height:1.7;">Dear ${name},</p>
      <p style="margin:0 0 16px;color:#444;font-size:14.5px;line-height:1.75;">
        It is our pleasure to invite you to the <strong>${EVENT.title}</strong> in ${EVENT.city}. Your registration is
        confirmed and your seat is reserved. We look forward to hosting you for a focused day of live trading,
        practical strategy, and a premium experience at one of ${EVENT.city}'s finest venues.
      </p>

      <div style="background:#faf9f6;border:1px solid #ececec;border-radius:14px;padding:18px 20px;margin:22px 0;">
        <table style="width:100%;border-collapse:collapse;">
          ${detail('Event', EVENT.title)}
          ${detail('Date', EVENT.date)}
          ${detail('Time', EVENT.time)}
          ${detail('Venue', EVENT.venue)}
          ${detail('Address', EVENT.venueAddress)}
        </table>
      </div>

      <table style="width:100%;border-collapse:collapse;margin:0 0 22px;">
        ${detail('Attendee', reg.name)}
        ${detail('Amount paid', rupees)}
        ${detail('Order ID', reg.orderId)}
        ${reg.paymentId ? detail('Payment ID', reg.paymentId) : ''}
      </table>

      <p style="margin:0 0 8px;color:#1a1a1a;font-size:13px;font-weight:600;">Before you arrive</p>
      <ul style="margin:0 0 22px;padding-left:18px;color:#555;font-size:13.5px;line-height:1.8;">
        <li>Please arrive 15 minutes early for check-in.</li>
        <li>Carry a valid photo ID and this confirmation email.</li>
        <li>Bring a notebook or laptop for the hands-on sessions.</li>
        <li>A premium buffet lunch is included &mdash; no need to arrange your own.</li>
      </ul>

      <p style="margin:0;color:#666;font-size:13.5px;line-height:1.7;">
        Questions? Reply to this email or reach us at
        <a href="mailto:${EVENT.email}" style="color:#0b0a08;">${EVENT.email}</a> /
        <a href="tel:${EVENT.phone.replace(/\s/g, '')}" style="color:#0b0a08;">${EVENT.phone}</a>.
      </p>
      <p style="margin:18px 0 0;color:#666;font-size:13.5px;">Warm regards,<br/>Team Delta Trading Academy</p>
    </div>

    <p style="text-align:center;color:#9a9a9a;font-size:11px;line-height:1.6;margin:18px 0 0;">
      Delta Trading Academy &middot; ${EVENT.officeAddress}<br/>
      This is a transactional email regarding your seminar registration.
    </p>
  </div>
</body></html>`
}

/** Send the confirmation + invitation email to a paid attendee. Best-effort. */
export async function sendInvitationEmail(reg: Registration) {
  if (!reg.email) return
  if (!isMailConfigured()) {
    console.warn('[mail] skipped — SMTP not configured (set SMTP_HOST / SMTP_USER / SMTP_PASS)')
    return
  }

  /* Logo (inline, referenced by cid:delta-logo) + PDF (built separately so a
     PDF failure never blocks the email itself). */
  type Att = { filename: string; content: Buffer; contentType?: string; cid?: string; contentDisposition?: 'inline' | 'attachment' }
  const attachments: Att[] = []

  const logo = getLogoBuffer()
  if (logo) {
    attachments.push({ filename: 'logo.png', content: logo, contentType: 'image/png', cid: 'delta-logo', contentDisposition: 'inline' })
  }

  try {
    const pdf = await buildInvitationPdf(reg)
    attachments.push({ filename: 'Delta-Seminar-Invitation.pdf', content: pdf, contentType: 'application/pdf' })
  } catch (err) {
    console.error('[mail] invitation PDF failed — sending email without attachment:', err)
  }

  try {
    const transporter = createMailTransporter()
    const info = await transporter.sendMail({
      from: FROM,
      to: reg.email,
      subject: `You're confirmed — ${EVENT.title}, ${EVENT.city}`,
      html: buildInvitationHtml(reg),
      attachments,
    })
    console.log('[mail] invitation sent to', reg.email, '·', info.messageId)
  } catch (err) {
    console.error('[mail] sendInvitationEmail failed:', err)
  }
}
