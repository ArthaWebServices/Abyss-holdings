import { NextRequest, NextResponse } from 'next/server';
import { readDatabase, writeDatabase, verifyAdminToken } from '@/lib/serverDb';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const user = verifyAdminToken(req.headers.get('authorization'));
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const db = readDatabase();
  const msg = (db.messages || []).find((m: any) => m.id === params.id);
  if (!msg) {
    return NextResponse.json({ error: 'Message not found' }, { status: 404 });
  }

  msg.read = true;
  if (!writeDatabase(db)) {
    return NextResponse.json({ error: 'Failed to update message' }, { status: 500 });
  }
  return NextResponse.json({ success: true, message: msg });
}
