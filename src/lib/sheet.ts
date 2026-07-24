/* Posts a paid registration to a Google Apps Script web app that appends it to
   the seminar Google Sheet. Headerless POST keeps it a "simple request" (no CORS
   preflight); best-effort so it never blocks the payment flow. */

const SHEET_URL = process.env.SEMINAR_SHEET_URL

export async function sendToSheet(data: Record<string, unknown>) {
  if (!SHEET_URL) return
  try {
    await fetch(SHEET_URL, {
      method: 'POST',
      body: JSON.stringify(data),
    })
  } catch (err) {
    console.error('sendToSheet failed:', err)
  }
}
