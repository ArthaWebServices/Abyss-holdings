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
    const idx = (db.services || []).findIndex((s: any) => s.id === params.id);
    if (idx === -1) return NextResponse.json({ error: 'Service not found' }, { status: 404 });

    // S-7 / C-6: Allowlist accepted fields to prevent arbitrary DB key injection
    const existing = db.services[idx];
    const updated: any = { ...existing, id: params.id };
    const allowedKeys = ['title', 'description', 'imageUrl', 'order', 'active'];
    for (const key of allowedKeys) {
      if (body[key] !== undefined) {
        if (key === 'active') updated[key] = Boolean(body[key]);
        else if (key === 'order') updated[key] = Number(body[key]);
        else updated[key] = String(body[key] ?? '').trim();
      }
    }
    if (!updated.imageUrl) {
      updated.imageUrl = existing.imageUrl || 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=600&q=80';
    }
    db.services[idx] = updated;
    if (!writeDatabase(db)) {
      return NextResponse.json({ error: 'Failed to update service' }, { status: 500 });
    }
    purgeCache();
    return NextResponse.json(db.services[idx]);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const user = verifyAdminToken(req.headers.get('authorization'));
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const db = readDatabase();
  const idx = (db.services || []).findIndex((s: any) => s.id === params.id);
  if (idx === -1) return NextResponse.json({ error: 'Service not found' }, { status: 404 });

  db.services.splice(idx, 1);
  if (!writeDatabase(db)) {
    return NextResponse.json({ error: 'Failed to delete service' }, { status: 500 });
  }
  purgeCache();
  return NextResponse.json({ success: true });
}
