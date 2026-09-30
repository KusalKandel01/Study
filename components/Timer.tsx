'use client';
import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, RotateCcw } from 'lucide-react';

const MODES = { Focus: 25, 'Short Break': 5, 'Long Break': 15 } as const;
type Mode = keyof typeof MODES;
const R = 120, C = 2 * Math.PI * R;

export default function Timer({ taskId, taskTitle, onDone }: { taskId: number | null; taskTitle?: string; onDone: () => void }) {
  const [mode, setMode] = useState<Mode>('Focus');
  const [left, setLeft] = useState(MODES.Focus * 60);
  const [running, setRunning] = useState(false);
  const total = MODES[mode] * 60;
  const saved = useRef(false);

  useEffect(() => { document.body.classList.toggle('focusing', running && mode === 'Focus'); }, [running, mode]);
  useEffect(() => {
    if (!running) return;
    const t = setInterval(() => setLeft(l => Math.max(0, l - 1)), 1000);
    return () => clearInterval(t);
  }, [running]);
  useEffect(() => {
    if (left > 0 || !running) return;
    setRunning(false);
    if (mode === 'Focus' && !saved.current) {
      saved.current = true;
      fetch('/api/sessions', { method: 'POST', body: JSON.stringify({ task_id: taskId, minutes: MODES.Focus }) }).then(onDone);
    }
  }, [left, running, mode, taskId, onDone]);

  const pick = (m: Mode) => { setMode(m); setLeft(MODES[m] * 60); setRunning(false); saved.current = false; };
  const mm = String(Math.floor(left / 60)).padStart(2, '0'), ss = String(left % 60).padStart(2, '0');

  return (
    <motion.section layout className="glass p-8 flex flex-col items-center"
      animate={{ boxShadow: running && mode === 'Focus' ? '0 0 80px -10px rgba(255,69,58,.45)' : '0 20px 60px -20px rgba(0,0,0,.25)' }}>
      <div className="flex gap-2 mb-6 p-1 rounded-full" style={{ background: 'var(--line)' }}>
        {(Object.keys(MODES) as Mode[]).map(m => (
          <button key={m} onClick={() => pick(m)} className="px-4 py-1.5 rounded-full text-sm font-medium relative">
            {mode === m && <motion.span layoutId="pill" className="absolute inset-0 rounded-full glass" style={{ borderRadius: 999 }} />}
            <span className="relative">{m}</span>
          </button>
        ))}
      </div>
      <div className="relative w-72 h-72">
        <svg viewBox="0 0 280 280" className="-rotate-90 w-full h-full">
          <circle cx="140" cy="140" r={R} fill="none" stroke="var(--line)" strokeWidth="18" />
          <motion.circle cx="140" cy="140" r={R} fill="none" stroke="var(--accent)" strokeWidth="18" strokeLinecap="round"
            strokeDasharray={C} animate={{ strokeDashoffset: C * (1 - left / total) }} transition={{ type: 'tween', ease: 'linear', duration: 1 }} />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="num text-7xl">{mm}:{ss}</span>
          <span className="text-sm mt-1 text-[color:var(--mute)] max-w-[10rem] truncate">{taskTitle ?? 'Pin a task to focus on it'}</span>
        </div>
      </div>
      <div className="flex gap-4 mt-6">
        <motion.button whileTap={{ scale: .9 }} onClick={() => setRunning(r => !r)}
          className="w-16 h-16 rounded-full flex items-center justify-center text-white" style={{ background: 'var(--accent)' }}
          aria-label={running ? 'Pause' : 'Start'}>{running ? <Pause /> : <Play />}</motion.button>
        <motion.button whileTap={{ scale: .9 }} onClick={() => pick(mode)} className="w-16 h-16 rounded-full glass flex items-center justify-center" aria-label="Reset"><RotateCcw /></motion.button>
      </div>
    </motion.section>
  );
}
