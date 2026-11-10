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
    const idx = (db.projects || []).findIndex((p: any) => p.id === params.id);
    if (idx === -1) return NextResponse.json({ error: 'Project not found' }, { status: 404 });

    // S-7 / C-6: Allowlist accepted fields to prevent arbitrary DB key injection
    const existing = db.projects[idx];
    const updated: any = { ...existing, id: params.id };
    const allowedKeys = ['title', 'description', 'imageUrl', 'category', 'status', 'year', 'order'];
    for (const key of allowedKeys) {
      if (body[key] !== undefined) {
        if (key === 'year' || key === 'order') updated[key] = Number(body[key]);
        else updated[key] = String(body[key] ?? '').trim();
      }
    }
    // Preserve imageUrl fallback
    if (!updated.imageUrl) {
      updated.imageUrl = existing.imageUrl || 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=600&q=80';
    }
    db.projects[idx] = updated;
    if (!writeDatabase(db)) {
      return NextResponse.json({ error: 'Failed to update project' }, { status: 500 });
    }
    purgeCache();
    return NextResponse.json(db.projects[idx]);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const user = verifyAdminToken(req.headers.get('authorization'));
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const db = readDatabase();
  const idx = (db.projects || []).findIndex((p: any) => p.id === params.id);
  if (idx === -1) return NextResponse.json({ error: 'Project not found' }, { status: 404 });

  db.projects.splice(idx, 1);
  if (!writeDatabase(db)) {
    return NextResponse.json({ error: 'Failed to delete project' }, { status: 500 });
  }
  purgeCache();
  return NextResponse.json({ success: true });
}
