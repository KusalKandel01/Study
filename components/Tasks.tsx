'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Pin, Plus } from 'lucide-react';

export type Task = { id: number; title: string; subject: string; priority: number; done: boolean; pinned: boolean; created_at: string; completed_at: string | null; due_date: string | null };

const day = 86400000;
export function dueBadge(due: string | null) {
  if (!due) return { text: 'No deadline', color: 'var(--mute)' };
  const d = Math.ceil((new Date(due + 'T23:59:59').getTime() - Date.now()) / day);
  if (d < 0) return { text: `${-d}d overdue`, color: '#ff453a' };
  if (d === 0) return { text: 'Due today', color: '#ff9f0a' };
  if (d === 1) return { text: 'Due tomorrow', color: '#ff9f0a' };
  return { text: `${d}d left`, color: d < 3 ? '#ff9f0a' : '#30d158' };
}
const ago = (iso: string) => { const d = Math.floor((Date.now() - new Date(iso).getTime()) / day); return d === 0 ? 'Started today' : `Started ${d}d ago`; };

export default function Tasks({ tasks, reload }: { tasks: Task[]; reload: () => void }) {
  const [title, setTitle] = useState(''), [subject, setSubject] = useState(''), [due, setDue] = useState('');
  const patch = (b: object) => fetch('/api/tasks', { method: 'PATCH', body: JSON.stringify(b) }).then(reload);
  const add = async () => {
    if (!title.trim()) return;
    await fetch('/api/tasks', { method: 'POST', body: JSON.stringify({ title, subject: subject || 'General', due_date: due || null }) });
    setTitle(''); setDue(''); reload();
  };
  const groups = tasks.reduce<Record<string, Task[]>>((a, t) => ((a[t.subject] ||= []).push(t), a), {});

  return (
    <section className="glass p-6 dim-soft">
      <h2 className="font-head">Tasks</h2>
      <div className="flex flex-wrap items-end gap-3 mb-6">
        <input value={title} onChange={e => setTitle(e.target.value)} onKeyDown={e => e.key === 'Enter' && add()} placeholder="What needs finishing?" className="flex-1 min-w-[10rem] bg-transparent border-b border-[color:var(--line)] py-2 outline-none" />
        <input value={subject} onChange={e => setSubject(e.target.value)} placeholder="Subject" className="w-28 bg-transparent border-b border-[color:var(--line)] py-2 outline-none" />
        <input type="date" value={due} onChange={e => setDue(e.target.value)} className="bg-transparent border-b border-[color:var(--line)] py-2 outline-none" />
        <motion.button whileTap={{ scale: .9 }} onClick={add} className="w-10 h-10 rounded-full text-white flex items-center justify-center" style={{ background: 'var(--accent)' }} aria-label="Add task"><Plus size={18} /></motion.button>
      </div>
      {tasks.length === 0 && <p className="text-[color:var(--mute)]">Nothing here yet. Add your first task and start the clock.</p>}
      {Object.entries(groups).map(([subj, list]) => (
        <div key={subj} className="mb-5">
          <h3 className="text-sm font-semibold text-[color:var(--mute)] mb-2">{subj}</h3>
          <AnimatePresence>
            {list.map(t => { const b = dueBadge(t.due_date); return (
              <motion.div layout key={t.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: t.done ? .4 : 1, y: 0 }} exit={{ opacity: 0 }}
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                className="flex items-center gap-3 py-3 border-b border-[color:var(--line)]">
                <motion.button whileTap={{ scale: 1.3 }} onClick={() => patch({ id: t.id, done: !t.done })}
                  className="w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0" style={{ borderColor: t.done ? '#30d158' : 'var(--mute)', background: t.done ? '#30d158' : 'transparent' }} aria-label="Toggle done">
                  {t.done && <Check size={14} color="#fff" />}
                </motion.button>
                <div className="flex-1 min-w-0">
                  <div className={`leading-snug break-words ${t.done ? 'line-through' : ''}`}>{t.title}</div>
                  <div className="text-xs text-[color:var(--mute)] mt-0.5">{ago(t.created_at)}</div>
                </div>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full whitespace-nowrap shrink-0 tabular" style={{ color: b.color, background: 'var(--line)' }}>{b.text}</span>
                <button onClick={() => patch({ id: t.id, pinned: !t.pinned })} aria-label="Pin to timer"><Pin size={18} fill={t.pinned ? 'var(--accent)' : 'none'} color={t.pinned ? 'var(--accent)' : 'var(--mute)'} /></button>
              </motion.div>); })}
          </AnimatePresence>
        </div>
      ))}
    </section>
  );
}
