import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { signAdminToken } from '@/lib/serverDb';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { username, password } = body;

    if (!username || !password) {
      return NextResponse.json(
        { error: 'Username and password are required' },
        { status: 400 }
      );
    }

    const adminUsername = process.env.ADMIN_USERNAME || 'admin';
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';

    // Case-insensitive username check (accepts "admin", "Admin", "ADMIN")
    const isUserMatch = String(username).trim().toLowerCase() === adminUsername.trim().toLowerCase();

    // Password comparison (supports plain text or bcrypt hash in env)
    const isPassMatch = isUserMatch && (
      adminPassword.startsWith('$2')
        ? bcrypt.compareSync(password, adminPassword)
        : password === adminPassword
    );

    if (!isUserMatch || !isPassMatch) {
      return NextResponse.json(
        { error: 'Invalid username or password' },
        { status: 401 }
      );
    }

    const token = signAdminToken(adminUsername);

    return NextResponse.json({
      token,
      username: adminUsername,
      role: 'admin',
    });
  } catch (err: any) {
    console.error('[API /auth/login error]', err);
    return NextResponse.json(
      { error: 'Authentication service error: ' + err.message },
      { status: 500 }
    );
  }
}
