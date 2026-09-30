'use client';
import { useCallback, useEffect, useState } from 'react';
import Timer from '@/components/Timer';
import Tasks, { Task, dueBadge } from '@/components/Tasks';
import Calendar from '@/components/Calendar';
import Streak from '@/components/Streak';
import Notes from '@/components/Notes';
import Ambient from '@/components/Ambient';
import Themes from '@/components/Themes';
import Report from '@/components/Report';
import { todayLocal, ymd } from '@/lib/date';

const NAME = 'Kusal';
export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [mins, setMins] = useState<Record<string, number>>({});
  const [sess, setSess] = useState<Record<string, number>>({});
  const [streak, setStreak] = useState({ current_streak: 0, longest_streak: 0 });
  const load = useCallback(async () => {
    const [t, s] = await Promise.all([fetch('/api/tasks').then(r => r.json()), fetch('/api/sessions').then(r => r.json())]);
    setTasks(Array.isArray(t) ? t : []); setStreak(s.streak);
    setMins(Object.fromEntries(s.days.map((d: any) => [d.day, d.minutes]))); setSess(Object.fromEntries(s.days.map((d: any) => [d.day, d.sessions])));
  }, []);
  useEffect(() => { load(); }, [load]);

  const pinned = tasks.find(t => t.pinned && !t.done);
  const dueToday = tasks.filter(t => !t.done && dueBadge(t.due_date).text === 'Due today').length;
  const doneToday = tasks.filter(t => t.completed_at && ymd(new Date(t.completed_at)) === todayLocal()).length;
  const h = new Date().getHours(), greet = h < 12 ? 'Good morning' : h < 18 ? 'Good afternoon' : 'Good evening';
  const todayMins = mins[todayLocal()] ?? 0;
  const Stat = ({ n, l }: { n: string | number; l: string }) => <div><div className="stat-n">{n}</div><div className="text-xs sm:text-sm text-[color:var(--mute)] mt-2 leading-tight">{l}</div></div>;

  return (
    <main className="max-w-6xl mx-auto px-4 py-8 md:py-12">
      <header className="mb-8 md:mb-10 dim-soft grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end">
        <div>
          <h1 className="font-head font-extrabold tracking-tight" style={{ fontSize: 'clamp(2rem,6vw,3.75rem)', lineHeight: 1.05 }}>{greet}, {NAME}.</h1>
          <p className="text-[color:var(--mute)] mt-3 mb-5">One focused session keeps your streak alive.</p>
          <Report name={NAME} minutes={todayMins} sessions={sess[todayLocal()] ?? 0} done={doneToday} streak={streak.current_streak} />
        </div>
        <div className="grid grid-cols-3 gap-6 sm:gap-10 lg:text-right">
          <Stat n={`${Math.floor(todayMins / 60)}h ${todayMins % 60}m`} l="Focused today" />
          <Stat n={streak.current_streak} l="Day streak" />
          <Stat n={dueToday} l="Due today" />
        </div>
      </header>
      <div className="grid gap-5 lg:grid-cols-2">
        <div className="grid gap-5 content-start">
          <Timer taskId={pinned?.id ?? null} taskTitle={pinned?.title} onDone={load} />
          <Tasks tasks={tasks} reload={load} />
          <Notes />
        </div>
        <div className="grid gap-5 content-start">
          <Streak current={streak.current_streak} longest={streak.longest_streak} minutesToday={todayMins} minutesByDay={mins} />
          <Calendar tasks={tasks} minutesByDay={mins} />
          <Ambient />
          <Themes />
        </div>
      </div>
    </main>
  );
}
