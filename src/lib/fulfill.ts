import type { Registration } from './registrations'
import { sendToSheet } from './sheet'
import { sendInvitationEmail } from './mail'

/** Side-effects for a newly-paid registration: mirror to the Google Sheet and
 *  email the invitation + PDF. Best-effort, run in parallel, never throws.
 *  Only call this with the doc returned by markPaidOnce (so it runs once). */
export async function fulfillPaid(reg: Registration) {
  const paidAt = reg.paidAt instanceof Date ? reg.paidAt.toISOString() : new Date().toISOString()
  await Promise.allSettled([
    sendToSheet({
      name: reg.name,
      email: reg.email,
      phone: reg.phone,
      amount: reg.amount,
      currency: reg.currency,
      status: reg.status,
      seminar: reg.seminar,
      orderId: reg.orderId,
      paymentId: reg.paymentId,
      paidAt,
    }),
    sendInvitationEmail(reg),
  ])
}
