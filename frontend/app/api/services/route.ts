import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { readDatabase, writeDatabase, verifyAdminToken } from '@/lib/serverDb';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const DEFAULT_SERVICE_IMAGE = 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=600&q=80';

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

// GET /api/services (public: active services only, sorted by order)
export async function GET() {
  const db = readDatabase();
  const services = (db.services || [])
    .filter((s: any) => s.active !== false)
    .sort((a: any, b: any) => (a.order ?? 0) - (b.order ?? 0));
  return noStoreJson(services);
}

// POST /api/services (admin)
export async function POST(req: NextRequest) {
  const user = verifyAdminToken(req.headers.get('authorization'));
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const body = await req.json().catch(() => ({}));
    const { title, description, imageUrl, order, active = true } = body;
    if (!title || !description) {
      return NextResponse.json({ error: 'title and description required' }, { status: 400 });
    }

    const db = readDatabase();
    const newService = {
      id: String(Date.now()),
      title: String(title).trim(),
      description: String(description).trim(),
      imageUrl: (imageUrl && String(imageUrl).trim()) || DEFAULT_SERVICE_IMAGE,
      order: order !== undefined && order !== null && order !== '' ? Number(order) : (db.services?.length || 0) + 1,
      active: Boolean(active),
    };
    db.services = [...(db.services || []), newService];
    if (!writeDatabase(db)) {
      return NextResponse.json({ error: 'Failed to save service' }, { status: 500 });
    }
    purgeCache();
    return noStoreJson(newService, 201);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
