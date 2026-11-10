import fs from 'fs';
import path from 'path';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'abyss_holdings_super_secret_key_2024';

// S-1: Warn at startup if secrets are using insecure defaults
if (!process.env.JWT_SECRET) {
  console.warn(
    '[SECURITY WARNING] JWT_SECRET is not set in environment variables. ' +
    'Using insecure default. Set JWT_SECRET in your .env.local for production.'
  );
}
if (!process.env.ADMIN_PASSWORD) {
  console.warn(
    '[SECURITY WARNING] ADMIN_PASSWORD is not set. Using default password "admin123". ' +
    'Set ADMIN_PASSWORD in your .env.local for production.'
  );
}

// Use /tmp for writable state in serverless environments (Vercel), or local data file in development/Node server
const TMP_DB_PATH = path.join('/tmp', 'abyss_db.json');

function resolveLocalDbPath(): string {
  const direct = path.join(process.cwd(), 'data', 'db.json');
  if (fs.existsSync(direct)) return direct;
  const nested = path.join(process.cwd(), 'frontend', 'data', 'db.json');
  if (fs.existsSync(nested)) return nested;
  return direct;
}

function getDbPath(): string {
  const localDbPath = resolveLocalDbPath();
  // If running in production (Vercel serverless), use /tmp to allow write operations
  if (process.env.NODE_ENV === 'production' && process.env.VERCEL) {
    if (!fs.existsSync(TMP_DB_PATH)) {
      try {
        if (fs.existsSync(localDbPath)) {
          fs.copyFileSync(localDbPath, TMP_DB_PATH);
        }
      } catch (e) {
        console.warn('Could not copy initial db to /tmp:', e);
      }
    }
    return TMP_DB_PATH;
  }
  return localDbPath;
}

export function readDatabase(): any {
  const localDbPath = resolveLocalDbPath();
  const dbPath = getDbPath();
  try {
    if (fs.existsSync(dbPath)) {
      const content = fs.readFileSync(dbPath, 'utf-8');
      const parsed = JSON.parse(content);
      return {
        company: parsed.company || {},
        services: Array.isArray(parsed.services) ? parsed.services : [],
        locations: Array.isArray(parsed.locations) ? parsed.locations : [],
        projects: Array.isArray(parsed.projects) ? parsed.projects : [],
        messages: Array.isArray(parsed.messages) ? parsed.messages : [],
      };
    }
  } catch (err) {
    console.error('Error reading db at', dbPath, err);
  }

  // Fallback to local copy if tmp fails
  if (dbPath !== localDbPath && fs.existsSync(localDbPath)) {
    try {
      const content = fs.readFileSync(localDbPath, 'utf-8');
      const parsed = JSON.parse(content);
      return {
        company: parsed.company || {},
        services: Array.isArray(parsed.services) ? parsed.services : [],
        locations: Array.isArray(parsed.locations) ? parsed.locations : [],
        projects: Array.isArray(parsed.projects) ? parsed.projects : [],
        messages: Array.isArray(parsed.messages) ? parsed.messages : [],
      };
    } catch {}
  }

  return { company: {}, services: [], locations: [], projects: [], messages: [] };
}

export function writeDatabase(data: any): boolean {
  const dbPath = getDbPath();
  const tmpPath = `${dbPath}.tmp`;
  try {
    fs.mkdirSync(path.dirname(dbPath), { recursive: true });
    fs.writeFileSync(tmpPath, JSON.stringify(data, null, 2), 'utf-8');
    try {
      fs.renameSync(tmpPath, dbPath);
    } catch {
      fs.copyFileSync(tmpPath, dbPath);
      fs.unlinkSync(tmpPath);
    }
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
    { expiresIn: '7d' }
  );
}
