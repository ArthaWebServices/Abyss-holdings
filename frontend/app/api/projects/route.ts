import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { readDatabase, writeDatabase, verifyAdminToken } from '@/lib/serverDb';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const DEFAULT_PROJECT_IMAGE = 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=600&q=80';

function noStoreJson(data: any, status = 200) {
  return NextResponse.json(data, {
    status,
    headers: {
      'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
    },
  });
}

function purgeCache() {
  try {
    revalidatePath('/', 'layout');
  } catch {}
}

export async function GET() {
  const db = readDatabase();
  const projects = [...(db.projects || [])].sort((a: any, b: any) => (a.order ?? 0) - (b.order ?? 0));
  return noStoreJson(projects);
}

export async function POST(req: NextRequest) {
  const user = verifyAdminToken(req.headers.get('authorization'));
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const body = await req.json().catch(() => ({}));
    const { title, description = '', imageUrl, category = 'General', status = 'Ongoing', year, order } = body;
    if (!title) {
      return NextResponse.json({ error: 'title required' }, { status: 400 });
    }

    const db = readDatabase();
    const newProj = {
      id: String(Date.now()),
      title: String(title).trim(),
      description: String(description || '').trim(),
      imageUrl: (imageUrl && String(imageUrl).trim()) || DEFAULT_PROJECT_IMAGE,
      category: String(category || 'General').trim(),
      status: String(status || 'Ongoing').trim(),
      year: year ? Number(year) : new Date().getFullYear(),
      order: order !== undefined && order !== null && order !== '' ? Number(order) : (db.projects?.length || 0) + 1,
    };
    db.projects = [...(db.projects || []), newProj];
    if (!writeDatabase(db)) {
      return NextResponse.json({ error: 'Failed to save project' }, { status: 500 });
    }
    purgeCache();
    return noStoreJson(newProj, 201);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
