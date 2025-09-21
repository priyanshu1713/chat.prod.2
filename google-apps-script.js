/**
 * Google Apps Script for Productica Startup Form - GET REQUEST COMPATIBLE
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
  return handleRequest(e, 'POST');
}

function doGet(e) {
  return handleRequest(e, 'GET');
}

function handleRequest(e, method) {
  try {
    console.log(`Handling ${method} request`);
    console.log('Full request object:', JSON.stringify(e));
    
    // Add null checks for e and e.postData
    if (!e) {
      console.log('Request object e is undefined');
      e = {};
    }
    
    let data;
    
    // Handle different data formats
    if (method === 'GET' && e.parameter) {
      console.log('Processing GET request with parameters:', e.parameter);
      
      // Check if this is a submit action
      if (e.parameter.action === 'submit' && e.parameter.data) {
        console.log('Processing GET submit data:', e.parameter.data);
        data = JSON.parse(e.parameter.data);
        console.log('Successfully parsed GET submit data:', data);
      } else if (e.parameter.data) {
        console.log('Processing GET parameter data:', e.parameter.data);
        data = JSON.parse(e.parameter.data);
        console.log('Successfully parsed GET data:', data);
      }
    } else if (method === 'POST' && e && e.postData && e.postData.contents) {
      console.log('Processing POST data:', e.postData.contents);
      try {
        data = JSON.parse(e.postData.contents);
        console.log('Successfully parsed POST JSON:', data);
      } catch (jsonError) {
        console.log('JSON parsing failed, trying form data:', jsonError);
        const formData = e.postData.contents;
        if (formData.includes('data=')) {
          const dataMatch = formData.match(/data=([^&]+)/);
          if (dataMatch) {
            const decodedData = decodeURIComponent(dataMatch[1]);
            data = JSON.parse(decodedData);
            console.log('Successfully parsed form data:', data);
          }
        }
      }
    } else if (method === 'POST' && e.parameter && e.parameter.data) {
      console.log('Processing POST parameter data:', e.parameter.data);
      data = JSON.parse(e.parameter.data);
      console.log('Successfully parsed POST parameter data:', data);
    } else {
      console.log('No data found, creating test entry');
      data = {
        data: {
          fullName: `Test User (${method})`,
          phoneNumber: '123-456-7890',
          emailId: 'test@example.com',
          startupName: 'Test Startup',
          features: 'Test features',
          productStage: 'Idea Stage',
          revenue: 'Pre-revenue'
        },
        timestamp: new Date().toISOString()
      };
    }
    
    // Log the received data for debugging
    console.log('Final data object:', data);
    
    // Get the active spreadsheet
    const SPREADSHEET_ID = '1NruO3pEd2HoXBOt8uv_vV7Jzu5p_r9CBE2RnlkUSSzU';
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    let sheet = spreadsheet.getSheetByName('Sheet1');
    
    // If Sheet1 doesn't exist, create it with headers
    if (!sheet) {
      console.log('Creating new sheet with headers');
      sheet = spreadsheet.insertSheet('Sheet1');
      sheet.getRange(1, 1, 1, 9).setValues([[
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
    
    // Log the row data for debugging
    console.log('Row data to append:', rowData);
    
    // Append the data to the sheet
    sheet.appendRow(rowData);
    
    // Log success
    console.log('Data successfully appended to sheet');
    
    // Return success response
    return ContentService
      .createTextOutput(JSON.stringify({
        success: true,
        message: `Data successfully added to Google Sheets via ${method}`,
        timestamp: new Date().toISOString(),
        data: rowData,
        sheetName: sheet.getName(),
        rowCount: sheet.getLastRow(),
        method: method,
        debugInfo: {
          receivedData: e,
          processedData: data
        }
      }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    // Log the error for debugging
    console.error(`Error in ${method} request:`, error);
    
    // Return error response
    return ContentService
      .createTextOutput(JSON.stringify({
        success: false,
        message: `Error adding data to Google Sheets via ${method}: ` + error.toString(),
        timestamp: new Date().toISOString(),
        error: error.toString(),
        method: method,
        receivedData: e
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
