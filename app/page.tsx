'use client';
import { useCallback, useEffect, useState } from 'react';
import Timer from '@/components/Timer';
import Tasks, { Task, dueBadge } from '@/components/Tasks';
import Calendar from '@/components/Calendar';
import Streak from '@/components/Streak';
import Notes from '@/components/Notes';
import Ambient from '@/components/Ambient';

const NAME = 'Kusal';
export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [mins, setMins] = useState<Record<string, number>>({});
  const [streak, setStreak] = useState({ current_streak: 0, longest_streak: 0 });
  const load = useCallback(async () => {
    const [t, s] = await Promise.all([fetch('/api/tasks').then(r => r.json()), fetch('/api/sessions').then(r => r.json())]);
    setTasks(Array.isArray(t) ? t : []); setStreak(s.streak);
    setMins(Object.fromEntries(s.days.map((d: any) => [d.day, d.minutes])));
  }, []);
  useEffect(() => { load(); }, [load]);

  const pinned = tasks.find(t => t.pinned && !t.done);
  const dueToday = tasks.filter(t => !t.done && dueBadge(t.due_date).text === 'Due today').length;
  const h = new Date().getHours(), greet = h < 12 ? 'Good morning' : h < 18 ? 'Good afternoon' : 'Good evening';
  const todayMins = mins[new Date().toISOString().slice(0, 10)] ?? 0;

  return (
    <main className="max-w-6xl mx-auto px-4 py-8 md:py-12">
      <header className="mb-8 dim-soft">
        <h1 className="font-head font-extrabold text-4xl md:text-6xl tracking-tight">{greet}, {NAME}.</h1>
        <p className="text-lg text-[color:var(--mute)] mt-2">{dueToday} due today · {streak.current_streak}-day streak. One session is all it takes to keep it alive.</p>
      </header>
      <div className="grid gap-5 lg:grid-cols-2">
        <div className="grid gap-5 content-start">
          <Timer taskId={pinned?.id ?? null} taskTitle={pinned?.title} onDone={load} />
          <Streak current={streak.current_streak} longest={streak.longest_streak} minutesToday={todayMins} minutesByDay={mins} />
          <Ambient />
        </div>
        <div className="grid gap-5 content-start">
          <Tasks tasks={tasks} reload={load} />
          <Calendar tasks={tasks} minutesByDay={mins} />
          <Notes />
        </div>
      </div>
    </main>
  );
}
