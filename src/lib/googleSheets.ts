import { StartupData } from '@/hooks/useStartupContext';

// Google Sheets API configuration
const GOOGLE_SHEETS_API_URL = 'https://sheets.googleapis.com/v4/spreadsheets';
const SPREADSHEET_ID = import.meta.env.VITE_GOOGLE_SHEETS_ID || '1NruO3pEd2HoXBOt8uv_vV7Jzu5p_r9CBE2RnlkUSSzU';

// Service Account Credentials
const SERVICE_ACCOUNT_EMAIL = 'mystartupform@protean-genius-444301-v7.iam.gserviceaccount.com';
const PRIVATE_KEY = `-----BEGIN PRIVATE KEY-----
MIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQCGw2Lhn24NJLml
4t9nXSuW6ZaCgxg8lY/iACb0bEG5Qoci+ZpnLqIcVDpSCse9OtahvfOPVQXI7jCp
VxhbNd5hjFjqA/IVLYCzyIBIJ8mUZcmd5mv5tZBb2ypxNn6s48w8tiGUJCWXRjZn
tA6Lbt5lB+lShHcJlfHwMAP4bmTas82Sn66TwXOfyDXl20EDsXTqRgxQ2Fimh1BH
IchK11ztju05MPh7s2FHZ2+suP2iiIK+JG7g5HAodoP3BaD0QdGbzU501H4KvDfl
w5tFBLrKqQSUB1GcE5rgxBeg1XOS9VwJlDCQnTD0wHv1J+8mPWA/13RmJuLqorBn
tJqYk/y7AgMBAAECggEAGOMmdLJjuYupuUfvqAAd163lvM6HAFFClCMhDoybiqIN
oNjlud5z07V+W75f6sNd9drFixfRjKzoUa2i8t0851jq5rS51U1k8k652hl28a/m
jwGJuUDdmwkbinLc7ALZqfCcvOX8BzbRP0+STA+6hH/0h+essBl/57KGWS/R8k1z
sKMSgCs4w54fJkNQ1k5EjacHSVDP3iXLh3BTUzMkxc1lta9LLok2X9filVrNKMYK
zjdPoXT54Ze2392UjzgtDZWtKozPAVGRBgC7FQEKEOejhSHCWQ8OK4g3/A1afalq
t26to+bzU55wy28P2hxo/44EDhNYTY6C7WF3UopRqQKBgQC9WKfHRkAxqE+EBeAH
jZS7YXDFyzwvvld2ukO01AGiHkk/NUn7P3sJv0QAS2i1uUpPO5eI7gdIcw7nnaGb
ilGdZ+bAZajUMDMZnoJcMDREpYj76+GoCuYZZ1yreWrZYU9q9L5UOELlYFOn4baD
w9BnT3eKNWfKG0vuS0bMJ9jjFQKBgQC2M9xMK6WToxl0CkZqu1xlA4BJ9l45N0Jo
ISUAwUIR2bJIhvrVF77+/UAWMvuptGw3Ga1paXL3TSKPuv8eQBA40aKZefdoJ03z
EwlMU/MmIQcmfFX76jJzT684yq4LOo4YfYdCWQ8zmk9rL9pY77w0Zbl1Y2rtDIjw
8YDvE9GUjwKBgEIArnOTdHsa3aT6204mt0reO45nOvK1mg2D/mgBYxRdFFFZRRG0
3jHWn2Cu6LA4B8Q41KjhuF4z5WUtmJD8lViWSGSWy1Qz/QwYKf7yurWXMnoGjqGi
MvV2B2Kqr2lZN3LkH5iCCCem/WJPFu01i+cHV3cxCJ32B/DoAqTV2w/FAoGBAKS6
AFqxP1JaK+H4hC9s0xzUbIDyB7/s0NH53U1wa/5ddk0SE+biQCCi7/TiBRsp7ohm
Y5yg5HrnNu8BXjOIMeJczYe6eE6m8ldoB4kFgRgg1ikaUlaeJxyPl1heDbpDJ0LH
AqmegRrjURgUPHEZ1Wr96Q1TY9GK+qfzf+EmZt3LAoGBAIbTTgHev3aj9CQeU/qi
Jh6rNcK+GdzcMEIiqi2ivfPjFp0EYkugyo+emXmIG24urYhtiZYEwioYlIMp8Fsh
W0k2LcocQBVSqJYUe8E9WF1hiHogR1iIQeaL06kP2CCPsBwSbOE1suftcWVssVPF
QLaQuH+CrZ7oqz1RbKmttmlP
-----END PRIVATE KEY-----`;

export interface GoogleSheetsResponse {
  success: boolean;
  message: string;
  data?: any;
}

// Generate JWT token for service account authentication
const generateJWT = async (): Promise<string> => {
  try {
    console.log('Starting JWT generation...');
    
    const header = {
      alg: 'RS256',
      typ: 'JWT'
    };

    const now = Math.floor(Date.now() / 1000);
    const payload = {
      iss: SERVICE_ACCOUNT_EMAIL,
      scope: 'https://www.googleapis.com/auth/spreadsheets',
      aud: 'https://oauth2.googleapis.com/token',
      iat: now,
      exp: now + 3600, // 1 hour
    };

    console.log('JWT payload:', payload);

    // Encode header and payload
    const encodedHeader = btoa(JSON.stringify(header)).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
    const encodedPayload = btoa(JSON.stringify(payload)).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
    
    const signatureInput = `${encodedHeader}.${encodedPayload}`;
    console.log('Signature input length:', signatureInput.length);

    // Try a simpler approach - use a mock signature for testing
    // In production, you'd need proper RSA signing
    const mockSignature = 'mock_signature_for_testing';
    const jwt = `${signatureInput}.${mockSignature}`;

    console.log('Generated JWT (mock):', jwt.substring(0, 100) + '...');

    // For now, let's try without JWT and use a different approach
    // We'll make the sheet publicly writable temporarily
    throw new Error('JWT signing not implemented - using fallback method');
    
  } catch (error) {
    console.error('Error generating JWT:', error);
    throw error;
  }
};

export const submitToGoogleSheets = async (startupData: StartupData): Promise<GoogleSheetsResponse> => {
  try {
    console.log('Submitting to Google Sheets...');
    
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

    console.log('Data to submit:', values);

    // Try direct API call without authentication first (if sheet is public)
    const appendUrl = `${GOOGLE_SHEETS_API_URL}/${SPREADSHEET_ID}/values/Sheet1:append?valueInputOption=RAW`;
    
    console.log('Attempting direct API call to:', appendUrl);
    
    const response = await fetch(appendUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        values: values,
      }),
    });

    console.log('Google Sheets response status:', response.status);
    console.log('Google Sheets response headers:', Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Google Sheets error response:', errorText);
      
      // Try with service account authentication as fallback
      try {
        console.log('Direct API failed, trying with service account authentication...');
        const accessToken = await generateJWT();
        console.log('Access token obtained, retrying...');
        
        const authResponse = await fetch(appendUrl, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            values: values,
          }),
        });

        console.log('Authenticated response status:', authResponse.status);

        if (!authResponse.ok) {
          const authErrorText = await authResponse.text();
          console.error('Authenticated API error:', authErrorText);
          
          return {
            success: false,
            message: `Google Sheets API error: ${authResponse.status} ${authResponse.statusText} - ${authErrorText}. Please make sure the sheet is publicly writable or check service account permissions.`,
          };
        }

        const authResult = await authResponse.json();
        console.log('Google Sheets success with auth:', authResult);
        
        return {
          success: true,
          message: 'Startup details successfully submitted to Google Sheets with authentication!',
          data: authResult
        };
        
      } catch (authError) {
        console.error('Authentication fallback failed:', authError);
        return {
          success: false,
          message: `Both direct and authenticated API calls failed. Please make the Google Sheet publicly writable or check service account setup. Direct error: ${response.status} ${response.statusText} - ${errorText}`,
        };
      }
    }

    const result = await response.json();
    console.log('Google Sheets success (direct):', result);
    
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

// Google Apps Script method (RECOMMENDED - Much easier to implement)
export const submitToGoogleSheetsViaScript = async (startupData: StartupData): Promise<GoogleSheetsResponse> => {
  try {
    // Use the Apps Script URL from environment or fallback to a test URL
    const SCRIPT_URL = import.meta.env.VITE_GOOGLE_APPS_SCRIPT_URL || 'https://script.google.com/macros/s/AKfycbxYOUR_SCRIPT_ID_HERE/exec';
    
    console.log('Submitting via Apps Script to:', SCRIPT_URL);
    
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

    console.log('Apps Script response status:', response.status);
    console.log('Apps Script response headers:', Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Apps Script error response:', errorText);
      throw new Error(`Apps Script error: ${response.status} ${response.statusText} - ${errorText}`);
    }

    const result = await response.json();
    console.log('Apps Script success:', result);
    
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