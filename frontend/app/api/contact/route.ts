import { NextRequest, NextResponse } from 'next/server';
import { readDatabase, writeDatabase } from '@/lib/serverDb';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

// POST /api/contact (public - submit message)
// S-5: Input length caps and basic email format validation
export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { name, email, phone = '', message } = body;
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'name, email and message are required' },
        { status: 400 }
      );
    }

    // Field length caps to prevent DB flood / spam
    if (String(name).trim().length > 100) {
      return NextResponse.json({ error: 'name must be 100 characters or fewer' }, { status: 400 });
    }
    if (String(email).trim().length > 200) {
      return NextResponse.json({ error: 'email must be 200 characters or fewer' }, { status: 400 });
    }
    if (String(message).trim().length > 5000) {
      return NextResponse.json({ error: 'message must be 5000 characters or fewer' }, { status: 400 });
    }
    // Basic email format check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(String(email).trim())) {
      return NextResponse.json({ error: 'Invalid email address' }, { status: 400 });
    }

    const db = readDatabase();
    const msg = {
      id: String(Date.now()),
      name: String(name).trim(),
      email: String(email).trim(),
      phone: String(phone || '').trim(),
      message: String(message).trim(),
      createdAt: new Date().toISOString(),
      read: false,
    };
    db.messages = [...(db.messages || []), msg];
    if (!writeDatabase(db)) {
      return NextResponse.json({ error: 'Failed to save message' }, { status: 500 });
    }
    return NextResponse.json({ message: 'Message sent successfully' }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
