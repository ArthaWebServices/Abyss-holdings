import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminToken } from '@/lib/serverDb';

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get('authorization');
  const user = verifyAdminToken(authHeader);

  if (!user) {
    return NextResponse.json(
      { error: 'Session expired or invalid token. Please log in again.' },
      { status: 401 }
    );
  }

  return NextResponse.json({
    username: user.username,
    role: user.role,
  });
}
