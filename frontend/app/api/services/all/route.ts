import { NextResponse } from 'next/server';
import { readDatabase } from '@/lib/serverDb';

// GET /api/services/all (returns all services including inactive)
export async function GET() {
  const db = readDatabase();
  return NextResponse.json(db.services || []);
}
