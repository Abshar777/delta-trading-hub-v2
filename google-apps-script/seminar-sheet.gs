/**
 * Seminar registrations → Google Sheet
 * Sheet: https://docs.google.com/spreadsheets/d/1AwsG0XUZ68gXyApZsI0X4271zQWNmGskC7cGAdyrCF8/edit
 *
 * SETUP
 * 1. Open the sheet → Extensions → Apps Script.
 * 2. Paste this whole file, Save.
 * 3. Run `setupHeaders` once (adds the header row) — approve permissions when asked.
 * 4. Deploy → New deployment → type "Web app":
 *      - Execute as: Me
 *      - Who has access: Anyone
 *    Copy the /exec URL.
 * 5. Put that URL in the app's .env.local as  SEMINAR_SHEET_URL=...  and restart.
 *
 * The Next app POSTs one JSON body per PAID registration; doPost appends a row.
 */

var SHEET_ID = '1AwsG0XUZ68gXyApZsI0X4271zQWNmGskC7cGAdyrCF8'
var SHEET_NAME = 'Sheet1'

var HEADERS = [
  'Paid At', 'Name', 'Email', 'Phone', 'Amount (₹)',
  'Status', 'Seminar', 'Order ID', 'Payment ID',
]

function getSheet_() {
  var ss = SpreadsheetApp.openById(SHEET_ID)
  return ss.getSheetByName(SHEET_NAME) || ss.insertSheet(SHEET_NAME)
}

/** Run once to add the header row. */
function setupHeaders() {
  var sheet = getSheet_()
  sheet.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS]).setFontWeight('bold')
  sheet.setFrozenRows(1)
}

function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents)
    var sheet = getSheet_()
    if (sheet.getLastRow() === 0) setupHeaders()

    var amount = Number(data.amount || 0) / 100 // paise → rupees

    sheet.appendRow([
      data.paidAt ? new Date(data.paidAt) : new Date(),
      data.name || '',
      data.email || '',
      "'" + (data.phone || ''), // leading quote keeps +91… as text
      amount,
      data.status || '',
      data.seminar || '',
      data.orderId || '',
      data.paymentId || '',
    ])

    return ContentService.createTextOutput('OK').setMimeType(ContentService.MimeType.TEXT)
  } catch (err) {
    return ContentService.createTextOutput('ERROR: ' + err).setMimeType(ContentService.MimeType.TEXT)
  }
}
