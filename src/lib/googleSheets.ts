import { StartupData } from '@/hooks/useStartupContext';

// Google Sheets API configuration
const GOOGLE_SHEETS_API_URL = 'https://sheets.googleapis.com/v4/spreadsheets';
const SPREADSHEET_ID = import.meta.env.VITE_GOOGLE_SHEETS_ID || '1NruO3pEd2HoXBOt8uv_vV7Jzu5p_r9CBE2RnlkUSSzU';
const API_KEY = import.meta.env.VITE_GOOGLE_SHEETS_API_KEY || 'AQ.Ab8RN6LhBvMHHo2eknPukvzdKxZIwfXqLNUvBx0QjzocHVgmUw';

export interface GoogleSheetsResponse {
  success: boolean;
  message: string;
  data?: any;
}

export const submitToGoogleSheets = async (startupData: StartupData): Promise<GoogleSheetsResponse> => {
  try {
    console.log('Submitting to Google Sheets:', { SPREADSHEET_ID, API_KEY: API_KEY.substring(0, 10) + '...' });
    
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

    const url = `${GOOGLE_SHEETS_API_URL}/${SPREADSHEET_ID}/values/Sheet1:append?valueInputOption=RAW&key=${API_KEY}`;
    console.log('Google Sheets URL:', url);

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        values: values,
      }),
    });

    console.log('Google Sheets response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Google Sheets error response:', errorText);
      throw new Error(`Google Sheets API error: ${response.status} ${response.statusText} - ${errorText}`);
    }

    const result = await response.json();
    console.log('Google Sheets success:', result);
    
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

// Alternative method using Google Apps Script (RECOMMENDED)
export const submitToGoogleSheetsViaScript = async (startupData: StartupData): Promise<GoogleSheetsResponse> => {
  try {
    const SCRIPT_URL = import.meta.env.VITE_GOOGLE_APPS_SCRIPT_URL || 'your-apps-script-url';
    
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