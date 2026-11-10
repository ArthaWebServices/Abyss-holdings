import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { readDatabase, writeDatabase, verifyAdminToken } from '@/lib/serverDb';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

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
  const locations = [...(db.locations || [])].sort((a: any, b: any) => (a.order ?? 0) - (b.order ?? 0));
  return noStoreJson(locations);
}

export async function POST(req: NextRequest) {
  const user = verifyAdminToken(req.headers.get('authorization'));
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const body = await req.json().catch(() => ({}));
    const { country, city, address = '', phone = '', email = '', isHeadquarter = false, order } = body;
    if (!country || !city) {
      return NextResponse.json({ error: 'country and city required' }, { status: 400 });
    }

    const db = readDatabase();
    const newLoc = {
      id: String(Date.now()),
      country: String(country).trim(),
      city: String(city).trim(),
      address: String(address || '').trim(),
      phone: String(phone || '').trim(),
      email: String(email || '').trim(),
      isHeadquarter: Boolean(isHeadquarter),
      order: order !== undefined && order !== null && order !== '' ? Number(order) : (db.locations?.length || 0) + 1,
    };
    db.locations = [...(db.locations || []), newLoc];
    if (!writeDatabase(db)) {
      return NextResponse.json({ error: 'Failed to save location' }, { status: 500 });
    }
    purgeCache();
    return noStoreJson(newLoc, 201);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
