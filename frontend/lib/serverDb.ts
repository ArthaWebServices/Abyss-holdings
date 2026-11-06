import fs from 'fs';
import path from 'path';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'abyss_holdings_super_secret_key_2024';

// Use /tmp for writable state in serverless environments (Vercel), or local data file in development
const LOCAL_DB_PATH = path.join(process.cwd(), 'data/db.json');
const TMP_DB_PATH = path.join('/tmp', 'abyss_db.json');

function getDbPath(): string {
  // If running in production (Vercel serverless), use /tmp to allow write operations
  if (process.env.NODE_ENV === 'production' && process.env.VERCEL) {
    if (!fs.existsSync(TMP_DB_PATH)) {
      try {
        if (fs.existsSync(LOCAL_DB_PATH)) {
          fs.copyFileSync(LOCAL_DB_PATH, TMP_DB_PATH);
        }
      } catch (e) {
        console.warn('Could not copy initial db to /tmp:', e);
      }
    }
    return TMP_DB_PATH;
  }
  return LOCAL_DB_PATH;
}

export function readDatabase(): any {
  const dbPath = getDbPath();
  try {
    if (fs.existsSync(dbPath)) {
      const content = fs.readFileSync(dbPath, 'utf-8');
      return JSON.parse(content);
    }
  } catch (err) {
    console.error('Error reading db at', dbPath, err);
  }

  // Fallback to local copy if tmp fails
  if (fs.existsSync(LOCAL_DB_PATH)) {
    try {
      const content = fs.readFileSync(LOCAL_DB_PATH, 'utf-8');
      return JSON.parse(content);
    } catch {}
  }

  return { company: {}, services: [], locations: [], projects: [], messages: [] };
}

export function writeDatabase(data: any): boolean {
  const dbPath = getDbPath();
  const tmpPath = `${dbPath}.tmp`;
  try {
    fs.writeFileSync(tmpPath, JSON.stringify(data, null, 2), 'utf-8');
    fs.renameSync(tmpPath, dbPath);
    return true;
  } catch (err) {
    console.error('Error writing db at', dbPath, err);
    try {
      if (fs.existsSync(tmpPath)) fs.unlinkSync(tmpPath);
    } catch {}
    return false;
  }
}

export function verifyAdminToken(authHeader: string | null): { username: string; role: string } | null {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    return { username: decoded.username, role: decoded.role };
  } catch {
    return null;
  }
}

export function signAdminToken(username: string): string {
  return jwt.sign(
    { username, role: 'admin' },
    JWT_SECRET,
    { expiresIn: '30d' }
  );
}
