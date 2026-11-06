import { NextRequest, NextResponse } from 'next/server';
import { readDatabase, writeDatabase, verifyAdminToken } from '@/lib/serverDb';

export async function GET() {
  const db = readDatabase();
  return NextResponse.json(db.company || {});
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

    const updated = {
      ...existing,
      ...body,
      socialLinks: {
        ...(existing.socialLinks || {}),
        ...(body.socialLinks || {}),
      },
    };

    db.company = updated;
    writeDatabase(db);

    return NextResponse.json({
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
