import fs from 'fs';
import path from 'path';

// Mock DB for logging
// In production, use Firestore or Supabase

export async function logChat(sourceId: string, message: string, response: string) {
    const logEntry = {
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
        sourceId,
        message,
        response
    };

    const logDir = path.join(process.cwd(), 'data', sourceId);
    const logFile = path.join(logDir, 'logs.json');

    try {
        // Ensure directory exists
        if (!fs.existsSync(logDir)) {
            fs.mkdirSync(logDir, { recursive: true });
        }

        let logs = [];
        if (fs.existsSync(logFile)) {
            const content = fs.readFileSync(logFile, 'utf-8');
            logs = JSON.parse(content);
        }
        logs.push(logEntry);

        // In Vercel (production), the filesystem is read-only.
        // We only write to file in development mode.
        if (process.env.NODE_ENV !== 'production') {
            fs.writeFileSync(logFile, JSON.stringify(logs, null, 2));
            console.log(`[DB] Logged chat to ${logFile}`);
        } else {
            console.log(`[DB] Skipped file write in production for ${sourceId}`);
        }
    } catch (error) {
        console.error("Error logging chat:", error);
    }
}
