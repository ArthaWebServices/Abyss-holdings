import { NextRequest, NextResponse } from 'next/server';
import { readDatabase, writeDatabase, verifyAdminToken } from '@/lib/serverDb';

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const user = verifyAdminToken(req.headers.get('authorization'));
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const body = await req.json();
    const db = readDatabase();
    const idx = (db.locations || []).findIndex((l: any) => l.id === params.id);
    if (idx === -1) return NextResponse.json({ error: 'Location not found' }, { status: 404 });

    db.locations[idx] = { ...db.locations[idx], ...body };
    writeDatabase(db);
    return NextResponse.json(db.locations[idx]);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const user = verifyAdminToken(req.headers.get('authorization'));
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const db = readDatabase();
  db.locations = (db.locations || []).filter((l: any) => l.id !== params.id);
  writeDatabase(db);
  return NextResponse.json({ success: true });
}
