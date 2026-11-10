import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { readDatabase, writeDatabase, verifyAdminToken } from '@/lib/serverDb';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

function purgeCache() {
  try {
    revalidatePath('/', 'layout');
  } catch {}
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const user = verifyAdminToken(req.headers.get('authorization'));
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const body = await req.json().catch(() => ({}));
    const db = readDatabase();
    const idx = (db.locations || []).findIndex((l: any) => l.id === params.id);
    if (idx === -1) return NextResponse.json({ error: 'Location not found' }, { status: 404 });

    // S-7: Allowlist accepted fields to prevent arbitrary DB key injection
    const existing = db.locations[idx];
    const updated: any = { ...existing, id: params.id };
    const allowedKeys = ['country', 'city', 'address', 'phone', 'email', 'isHeadquarter', 'order'];
    for (const key of allowedKeys) {
      if (body[key] !== undefined) {
        if (key === 'isHeadquarter') updated[key] = Boolean(body[key]);
        else if (key === 'order') updated[key] = Number(body[key]);
        else updated[key] = String(body[key] ?? '').trim();
      }
    }
    db.locations[idx] = updated;
    if (!writeDatabase(db)) {
      return NextResponse.json({ error: 'Failed to update location' }, { status: 500 });
    }
    purgeCache();
    return NextResponse.json(db.locations[idx]);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const user = verifyAdminToken(req.headers.get('authorization'));
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const db = readDatabase();
  const idx = (db.locations || []).findIndex((l: any) => l.id === params.id);
  if (idx === -1) return NextResponse.json({ error: 'Location not found' }, { status: 404 });

  db.locations.splice(idx, 1);
  if (!writeDatabase(db)) {
    return NextResponse.json({ error: 'Failed to delete location' }, { status: 500 });
  }
  purgeCache();
  return NextResponse.json({ success: true });
}
