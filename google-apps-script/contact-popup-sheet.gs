/**
 * Contact popup (ContactPopup.tsx) → Google Sheet
 * Sheet: https://docs.google.com/spreadsheets/d/1avPnKl6be7dKClgga-b1IqmPzyUWKgyKgml8I22SPn0/edit
 *
 * SETUP
 * 1. Open the sheet → Extensions → Apps Script.
 * 2. Paste this whole file over the old doPost, Save.
 * 3. Deploy → Manage deployments → edit the existing deployment → New version.
 *    (Keeps the same /exec URL — no change needed in ContactPopup.tsx.)
 *
 * Columns: Name | Email | PhoneNumber | Message | Subject | CreatedAt | Challenge
 * "Challenge" is new — added as the LAST column so existing rows stay aligned.
 * If your sheet already has a header row, add a "Challenge" header to column G.
 */

function doPost(e) {

  try {

    const sheet = SpreadsheetApp

      .openByUrl("https://docs.google.com/spreadsheets/d/1avPnKl6be7dKClgga-b1IqmPzyUWKgyKgml8I22SPn0/edit")

      .getSheetByName("Sheet1");



    const data = JSON.parse(e.postData.contents);



    Logger.log(data);



    const createdAt = new Date(); // Current date & time



    sheet.appendRow([

      data.Name,

      data.Email,

      data.PhoneNumber,

      data.Message,

      data.Subject,

      createdAt,

      data.Challenge   // "What is your biggest challenge in trading right now?"

    ]);



    return ContentService

      .createTextOutput("Added..")

      .setMimeType(ContentService.MimeType.TEXT);



  } catch (error) {

    Logger.log("Error: " + error);



    return ContentService

      .createTextOutput("Failed..")

      .setMimeType(ContentService.MimeType.TEXT);

  }

}
