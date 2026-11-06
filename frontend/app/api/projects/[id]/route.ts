import { NextRequest, NextResponse } from 'next/server';
import { readDatabase, writeDatabase, verifyAdminToken } from '@/lib/serverDb';

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const user = verifyAdminToken(req.headers.get('authorization'));
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const body = await req.json();
    const db = readDatabase();
    const idx = (db.projects || []).findIndex((p: any) => p.id === params.id);
    if (idx === -1) return NextResponse.json({ error: 'Project not found' }, { status: 404 });

    db.projects[idx] = { ...db.projects[idx], ...body };
    writeDatabase(db);
    return NextResponse.json(db.projects[idx]);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const user = verifyAdminToken(req.headers.get('authorization'));
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const db = readDatabase();
  db.projects = (db.projects || []).filter((p: any) => p.id !== params.id);
  writeDatabase(db);
  return NextResponse.json({ success: true });
}
