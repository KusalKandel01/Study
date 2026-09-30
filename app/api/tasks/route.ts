import { NextResponse } from 'next/server';
import { sql, userId } from '@/lib/db';
export const dynamic = 'force-dynamic';

export async function GET() {
  const { rows } = await sql`SELECT id,title,subject,priority,done,pinned,created_at,due_date::text AS due_date
    FROM tasks WHERE user_id=${userId()} ORDER BY done, priority DESC, due_date NULLS LAST`;
  return NextResponse.json(rows);
}
export async function POST(req: Request) {
  const { title, subject = 'General', priority = 0, due_date = null } = await req.json();
  if (!title?.trim()) return NextResponse.json({ error: 'Title is required' }, { status: 400 });
  const { rows } = await sql`INSERT INTO tasks (user_id,title,subject,priority,due_date)
    VALUES (${userId()},${title},${subject},${priority},${due_date}) RETURNING id`;
  return NextResponse.json(rows[0]);
}
export async function PATCH(req: Request) {
  const { id, done, pinned } = await req.json();
  if (typeof done === 'boolean') await sql`UPDATE tasks SET done=${done} WHERE id=${id} AND user_id=${userId()}`;
  if (typeof pinned === 'boolean') {
    if (pinned) await sql`UPDATE tasks SET pinned=FALSE WHERE user_id=${userId()}`;
    await sql`UPDATE tasks SET pinned=${pinned} WHERE id=${id} AND user_id=${userId()}`;
  }
  return NextResponse.json({ ok: true });
}
