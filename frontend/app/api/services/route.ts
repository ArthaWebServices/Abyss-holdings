import { NextRequest, NextResponse } from 'next/server';
import { readDatabase, writeDatabase, verifyAdminToken } from '@/lib/serverDb';

// GET /api/services (public: active services only)
export async function GET() {
  const db = readDatabase();
  const services = (db.services || []).filter((s: any) => s.active);
  return NextResponse.json(services);
}

// POST /api/services (admin)
export async function POST(req: NextRequest) {
  const user = verifyAdminToken(req.headers.get('authorization'));
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const body = await req.json();
    const db = readDatabase();
    const newService = {
      id: String(Date.now()),
      order: (db.services?.length || 0) + 1,
      active: true,
      ...body,
    };
    db.services = [...(db.services || []), newService];
    writeDatabase(db);
    return NextResponse.json(newService, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
