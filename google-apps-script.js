/**
 * Google Apps Script for Productica Startup Form
 * 
 * Instructions:
 * 1. Go to https://script.google.com/
 * 2. Create a new project
 * 3. Replace the default code with this script
 * 4. Save the project
 * 5. Deploy as web app with execute permissions for "Anyone"
 * 6. Copy the web app URL and use it in your Vercel environment variables
 */

function doPost(e) {
  try {
    // Parse the incoming data
    const data = JSON.parse(e.postData.contents);
    
    // Get the active spreadsheet (replace with your spreadsheet ID)
    const SPREADSHEET_ID = '1NruO3pEd2HoXBOt8uv_vV7Jzu5p_r9CBE2RnlkUSSzU';
    const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName('Sheet1');
    
    // If Sheet1 doesn't exist, create it with headers
    if (!sheet) {
      const newSheet = SpreadsheetApp.openById(SPREADSHEET_ID).insertSheet('Sheet1');
      newSheet.getRange(1, 1, 1, 9).setValues([[
        'Timestamp',
        'Full Name',
        'Phone Number',
        'Email ID',
        'Startup Name',
        'Features',
        'Product Stage',
        'Revenue',
        'Submitted At'
      ]]);
    }
    
    // Prepare the data row
    const rowData = [
      new Date().toISOString(),
      data.data.fullName || '',
      data.data.phoneNumber || '',
      data.data.emailId || '',
      data.data.startupName || '',
      data.data.features || '',
      data.data.productStage || '',
      data.data.revenue || '',
      data.timestamp || new Date().toISOString()
    ];
    
    // Append the data to the sheet
    sheet.appendRow(rowData);
    
    // Return success response with CORS headers
    return ContentService
      .createTextOutput(JSON.stringify({
        success: true,
        message: 'Data successfully added to Google Sheets',
        timestamp: new Date().toISOString(),
        data: rowData
      }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    // Return error response with CORS headers
    return ContentService
      .createTextOutput(JSON.stringify({
        success: false,
        message: 'Error adding data to Google Sheets: ' + error.toString(),
        timestamp: new Date().toISOString(),
        error: error.toString()
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  // Handle GET requests (optional)
  return ContentService
    .createTextOutput(JSON.stringify({
      message: 'Productica Startup Form - Google Apps Script',
      status: 'active',
      timestamp: new Date().toISOString()
    }))
    .setMimeType(ContentService.MimeType.JSON);
}
