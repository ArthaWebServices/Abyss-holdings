import { NextRequest, NextResponse } from 'next/server';
import { readDatabase, verifyAdminToken } from '@/lib/serverDb';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

// GET /api/services/all (admin: returns all services including inactive, sorted by order)
export async function GET(req: NextRequest) {
  const user = verifyAdminToken(req.headers.get('authorization'));
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const db = readDatabase();
  const services = [...(db.services || [])].sort((a: any, b: any) => (a.order ?? 0) - (b.order ?? 0));
  return NextResponse.json(services, {
    headers: {
      'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
    },
  });
}
