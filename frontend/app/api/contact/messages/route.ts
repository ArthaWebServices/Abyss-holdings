import { NextRequest, NextResponse } from 'next/server';
import { readDatabase, verifyAdminToken } from '@/lib/serverDb';

export async function GET(req: NextRequest) {
  const user = verifyAdminToken(req.headers.get('authorization'));
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const db = readDatabase();
  return NextResponse.json(db.messages || []);
}
