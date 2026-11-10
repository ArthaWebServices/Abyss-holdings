import { NextRequest, NextResponse } from 'next/server';
import { readDatabase, writeDatabase, verifyAdminToken } from '@/lib/serverDb';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const user = verifyAdminToken(req.headers.get('authorization'));
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const db = readDatabase();
  const idx = (db.messages || []).findIndex((m: any) => m.id === params.id);
  if (idx === -1) return NextResponse.json({ error: 'Message not found' }, { status: 404 });

  db.messages.splice(idx, 1);
  if (!writeDatabase(db)) {
    return NextResponse.json({ error: 'Failed to delete message' }, { status: 500 });
  }
  return NextResponse.json({ success: true, message: 'Deleted' });
}
