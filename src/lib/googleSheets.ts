import { StartupData } from '@/hooks/useStartupContext';

// Google Sheets API configuration
const GOOGLE_SHEETS_API_URL = 'https://sheets.googleapis.com/v4/spreadsheets';
const SPREADSHEET_ID = process.env.VITE_GOOGLE_SHEETS_ID || 'your-spreadsheet-id';
const API_KEY = process.env.VITE_GOOGLE_SHEETS_API_KEY || 'your-api-key';

export interface GoogleSheetsResponse {
  success: boolean;
  message: string;
  data?: any;
}

export const submitToGoogleSheets = async (startupData: StartupData): Promise<GoogleSheetsResponse> => {
  try {
    // Prepare the data for Google Sheets
    const values = [
      [
        new Date().toISOString(), // Timestamp
        startupData.fullName,
        startupData.phoneNumber,
        startupData.emailId,
        startupData.startupName,
        startupData.features,
        startupData.productStage,
        startupData.revenue,
        startupData.submittedAt || new Date().toISOString()
      ]
    ];

    const response = await fetch(
      `${GOOGLE_SHEETS_API_URL}/${SPREADSHEET_ID}/values/Sheet1:append?valueInputOption=RAW&key=${API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          values: values,
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`Google Sheets API error: ${response.status} ${response.statusText}`);
    }

    const result = await response.json();
    
    return {
      success: true,
      message: 'Startup details successfully submitted to Google Sheets!',
      data: result
    };
  } catch (error) {
    console.error('Error submitting to Google Sheets:', error);
    return {
      success: false,
      message: `Failed to submit to Google Sheets: ${error instanceof Error ? error.message : 'Unknown error'}`,
    };
  }
};

// Alternative method using Google Apps Script (if you prefer)
export const submitToGoogleSheetsViaScript = async (startupData: StartupData): Promise<GoogleSheetsResponse> => {
  try {
    const SCRIPT_URL = process.env.VITE_GOOGLE_APPS_SCRIPT_URL || 'your-apps-script-url';
    
    const response = await fetch(SCRIPT_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        data: startupData,
        timestamp: new Date().toISOString()
      }),
    });

    if (!response.ok) {
      throw new Error(`Apps Script error: ${response.status} ${response.statusText}`);
    }

    const result = await response.json();
    
    return {
      success: true,
      message: 'Startup details successfully submitted via Apps Script!',
      data: result
    };
  } catch (error) {
    console.error('Error submitting via Apps Script:', error);
    return {
      success: false,
      message: `Failed to submit via Apps Script: ${error instanceof Error ? error.message : 'Unknown error'}`,
    };
  }
};