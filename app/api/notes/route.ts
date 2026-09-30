import { NextResponse } from 'next/server';
import { sql, userId } from '@/lib/db';
export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  const date = new URL(req.url).searchParams.get('date')!;
  const { rows } = await sql`SELECT body FROM daily_notes WHERE user_id=${userId()} AND note_date=${date}`;
  return NextResponse.json({ body: rows[0]?.body ?? '' });
}
export async function PUT(req: Request) {
  const { date, body } = await req.json();
  await sql`INSERT INTO daily_notes (user_id,note_date,body) VALUES (${userId()},${date},${body})
    ON CONFLICT (user_id,note_date) DO UPDATE SET body=EXCLUDED.body`;
  return NextResponse.json({ ok: true });
}
