import { google } from 'googleapis';

// Interface for the log data structure
export interface LogData {
    timestamp: string;
    ip: string;
    referer: string;
    userAgent: string;
    question: string;
    answer: string;
    sourceId: string;
}

// Environment variables
const SPREADSHEET_ID = process.env.GOOGLE_SHEETS_SPREADSHEET_ID;
const CLIENT_EMAIL = process.env.GOOGLE_SHEETS_CLIENT_EMAIL;
const PRIVATE_KEY = process.env.GOOGLE_SHEETS_PRIVATE_KEY?.replace(/\\n/g, '\n'); // Handle newlines in env var

export async function appendLogToSheet(
    data: LogData,
    spreadsheetId?: string,
    sheetName?: string
) {
    const targetSpreadsheetId = spreadsheetId || SPREADSHEET_ID;
    const targetSheetName = sheetName || 'log1';

    if (!targetSpreadsheetId || !CLIENT_EMAIL || !PRIVATE_KEY) {
        console.warn('[Google Sheets] Missing credentials or spreadsheet ID. Skipping log.');
        return;
    }

    try {
        const auth = new google.auth.GoogleAuth({
            credentials: {
                client_email: CLIENT_EMAIL,
                private_key: PRIVATE_KEY,
            },
            scopes: ['https://www.googleapis.com/auth/spreadsheets'],
        });

        const sheets = google.sheets({ version: 'v4', auth });

        // Prepare the row data
        const values = [
            [
                data.timestamp,
                data.ip,
                data.referer,
                data.userAgent,
                data.sourceId,
                data.question,
                data.answer,
            ],
        ];

        // Append to the specified sheet
        await sheets.spreadsheets.values.append({
            spreadsheetId: targetSpreadsheetId,
            range: `${targetSheetName}!A:G`,
            valueInputOption: 'USER_ENTERED',
            requestBody: {
                values,
            },
        });

        console.log(`[Google Sheets] Log appended successfully to ${targetSheetName} in ${targetSpreadsheetId}`);
    } catch (error) {
        console.error('[Google Sheets] Error appending log:', error);
    }
}
