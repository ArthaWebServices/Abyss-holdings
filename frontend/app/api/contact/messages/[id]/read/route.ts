import { NextRequest, NextResponse } from 'next/server';
import { readDatabase, writeDatabase, verifyAdminToken } from '@/lib/serverDb';

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const user = verifyAdminToken(req.headers.get('authorization'));
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const db = readDatabase();
  const msg = (db.messages || []).find((m: any) => m.id === params.id);
  if (msg) {
    msg.read = true;
    writeDatabase(db);
  }
  return NextResponse.json({ success: true, message: msg });
}
