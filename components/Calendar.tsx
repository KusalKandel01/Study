'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { Task } from './Tasks';

const iso = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

export default function Calendar({ tasks, minutesByDay }: { tasks: Task[]; minutesByDay: Record<string, number> }) {
  const [m, setM] = useState(() => new Date(new Date().getFullYear(), new Date().getMonth(), 1));
  const [sel, setSel] = useState<string | null>(null);
  const first = m.getDay(), count = new Date(m.getFullYear(), m.getMonth() + 1, 0).getDate();
  const cells = [...Array(first).fill(null), ...Array.from({ length: count }, (_, i) => new Date(m.getFullYear(), m.getMonth(), i + 1))];
  const dayTasks = sel ? tasks.filter(t => t.due_date === sel) : [];

  return (
    <section className="glass p-6 dim-soft">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-head font-extrabold text-2xl">{m.toLocaleString('en', { month: 'long', year: 'numeric' })}</h2>
        <div className="flex gap-2">
          <button aria-label="Previous month" onClick={() => setM(new Date(m.getFullYear(), m.getMonth() - 1, 1))}><ChevronLeft /></button>
          <button aria-label="Next month" onClick={() => setM(new Date(m.getFullYear(), m.getMonth() + 1, 1))}><ChevronRight /></button>
        </div>
      </div>
      <div className="grid grid-cols-7 text-center text-xs text-[color:var(--mute)] mb-1">{['S','M','T','W','T','F','S'].map((d, i) => <div key={i}>{d}</div>)}</div>
      <div className="grid grid-cols-7 gap-1">
        {cells.map((d, i) => { if (!d) return <div key={i} />; const k = iso(d); const has = tasks.some(t => t.due_date === k); const studied = minutesByDay[k];
          const today = k === iso(new Date());
          return (
            <motion.button key={i} whileHover={{ scale: 1.08 }} whileTap={{ scale: .95 }} onClick={() => setSel(k)}
              className="aspect-square rounded-2xl flex flex-col items-center justify-center text-sm"
              style={{ background: sel === k ? 'var(--line)' : 'transparent', color: today ? 'var(--accent)' : undefined, fontWeight: today ? 700 : 400 }}>
              {d.getDate()}
              <span className="flex gap-0.5 h-1.5 mt-0.5">{has && <i className="w-1.5 h-1.5 rounded-full bg-[#ff9f0a]" />}{studied && <i className="w-1.5 h-1.5 rounded-full bg-[#30d158]" />}</span>
            </motion.button>); })}
      </div>
      <AnimatePresence>
        {sel && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
            <div className="pt-4 mt-4 border-t border-[color:var(--line)]">
              <div className="font-semibold">{new Date(sel + 'T00:00').toLocaleDateString('en', { weekday: 'long', month: 'short', day: 'numeric' })}</div>
              <div className="text-sm text-[color:var(--mute)] mb-2">{minutesByDay[sel] ? `${minutesByDay[sel]} min focused` : 'No focus time logged'}</div>
              {dayTasks.length ? dayTasks.map(t => <div key={t.id} className={t.done ? 'line-through opacity-50' : ''}>{t.title}</div>) : <div className="text-sm text-[color:var(--mute)]">No tasks due this day.</div>}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
