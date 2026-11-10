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
  return noStoreJson(db.company || {});
}

export async function PUT(req: NextRequest) {
  const authHeader = req.headers.get('authorization');
  const user = verifyAdminToken(authHeader);

  if (!user) {
    return NextResponse.json(
      { error: 'Authentication required. Please sign in.' },
      { status: 401 }
    );
  }

  try {
    const body = await req.json().catch(() => ({}));
    const db = readDatabase();
    const existing = db.company || {};

    const updated: any = { ...existing };

    const stringKeys = [
      'name', 'tagline', 'description', 'email', 'hrEmail',
      'phone', 'address', 'website', 'primaryColor',
      'secondaryColor', 'logoUrl',
    ];

    for (const key of stringKeys) {
      if (body[key] !== undefined && body[key] !== null) {
        updated[key] = String(body[key]).trim();
      }
    }

    if (body.socialLinks && typeof body.socialLinks === 'object') {
      updated.socialLinks = {
        ...(existing.socialLinks || {}),
        ...Object.fromEntries(
          Object.entries(body.socialLinks).map(([k, v]) => [k, v ? String(v).trim() : ''])
        ),
      };
    }

    db.company = updated;
    if (!writeDatabase(db)) {
      return NextResponse.json(
        { error: 'Failed to persist company details to database' },
        { status: 500 }
      );
    }

    purgeCache();

    return noStoreJson({
      success: true,
      message: 'Company details updated successfully',
      company: updated,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: 'Failed to update company: ' + err.message },
      { status: 500 }
    );
  }
}
