import nodemailer from 'nodemailer'

/* Shared SMTP transporter — used by the seminar invitation email and the
   payment-link receipt email. */
const HOST = process.env.SMTP_HOST
const PORT = Number(process.env.SMTP_PORT || 465)
const USER = process.env.SMTP_USER
const PASS = process.env.SMTP_PASS
export const MAIL_FROM = process.env.MAIL_FROM || 'Delta Trading Academy <info@deltainstitutions.com>'

export function isMailConfigured() {
  return Boolean(HOST && USER && PASS)
}

export function createMailTransporter() {
  return nodemailer.createTransport({
    host: HOST,
    port: PORT,
    secure: PORT === 465,
    auth: { user: USER, pass: PASS },
  })
}
