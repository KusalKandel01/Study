import { NextResponse } from 'next/server';
import { sql, userId } from '@/lib/db';
export const dynamic = 'force-dynamic';

export async function GET() {
  const days = await sql`SELECT completed_at::date::text AS day, SUM(minutes)::int AS minutes
    FROM pomodoro_sessions WHERE user_id=${userId()} AND completed_at > NOW() - INTERVAL '180 days' GROUP BY 1`;
  const s = await sql`SELECT current_streak, longest_streak FROM streaks WHERE user_id=${userId()}`;
  return NextResponse.json({ days: days.rows, streak: s.rows[0] ?? { current_streak: 0, longest_streak: 0 } });
}
export async function POST(req: Request) {
  const { task_id = null, minutes } = await req.json();
  const u = userId();
  await sql`INSERT INTO pomodoro_sessions (user_id,task_id,minutes) VALUES (${u},${task_id},${minutes})`;
  // streak: +1 if last study was yesterday, keep if today, else reset to 1
  await sql`UPDATE streaks SET
      current_streak = CASE WHEN last_study_date = CURRENT_DATE THEN current_streak
                            WHEN last_study_date = CURRENT_DATE - 1 THEN current_streak + 1 ELSE 1 END,
      last_study_date = CURRENT_DATE WHERE user_id=${u}`;
  await sql`UPDATE streaks SET longest_streak = GREATEST(longest_streak, current_streak) WHERE user_id=${u}`;
  return NextResponse.json({ ok: true });
}
