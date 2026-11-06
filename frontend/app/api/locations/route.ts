import { NextRequest, NextResponse } from 'next/server';
import { readDatabase, writeDatabase, verifyAdminToken } from '@/lib/serverDb';

export async function GET() {
  const db = readDatabase();
  return NextResponse.json(db.locations || []);
}

export async function POST(req: NextRequest) {
  const user = verifyAdminToken(req.headers.get('authorization'));
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const body = await req.json();
    const db = readDatabase();
    const newLoc = {
      id: String(Date.now()),
      order: (db.locations?.length || 0) + 1,
      ...body,
    };
    db.locations = [...(db.locations || []), newLoc];
    writeDatabase(db);
    return NextResponse.json(newLoc, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
