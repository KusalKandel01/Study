'use client';
import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, RotateCcw, Minus, Plus } from 'lucide-react';

const MODES = ['Focus', 'Short Break', 'Long Break'] as const;
type Mode = typeof MODES[number];
const DEF: Record<Mode, number> = { Focus: 25, 'Short Break': 5, 'Long Break': 15 };
const LIM: Record<Mode, [number, number, number]> = { Focus: [5, 120, 5], 'Short Break': [1, 30, 1], 'Long Break': [5, 60, 5] };
const R = 120, C = 2 * Math.PI * R;

export default function Timer({ taskId, taskTitle, onDone }: { taskId: number | null; taskTitle?: string; onDone: () => void }) {
  const [mode, setMode] = useState<Mode>('Focus');
  const [dur, setDur] = useState(DEF);
  const [left, setLeft] = useState(DEF.Focus * 60);
  const [running, setRunning] = useState(false);
  const saved = useRef(false);
  const total = dur[mode] * 60;

  useEffect(() => { try { const s = JSON.parse(localStorage.getItem('dur') || 'null'); if (s) { setDur(s); setLeft(s.Focus * 60); } } catch {} }, []);
  useEffect(() => { document.body.classList.toggle('focusing', running && mode === 'Focus'); }, [running, mode]);
  useEffect(() => { if (!running) return; const t = setInterval(() => setLeft(l => Math.max(0, l - 1)), 1000); return () => clearInterval(t); }, [running]);
  useEffect(() => {
    if (left > 0 || !running) return;
    setRunning(false);
    if (mode === 'Focus' && !saved.current) {
      saved.current = true;
      fetch('/api/sessions', { method: 'POST', body: JSON.stringify({ task_id: taskId, minutes: dur.Focus }) }).then(onDone);
    }
  }, [left, running, mode, taskId, dur, onDone]);

  const pick = (m: Mode, d = dur) => { setMode(m); setLeft(d[m] * 60); setRunning(false); saved.current = false; };
  const step = (dir: number) => {
    if (running) return;
    const [lo, hi, s] = LIM[mode], v = Math.min(hi, Math.max(lo, dur[mode] + dir * s));
    const d = { ...dur, [mode]: v }; setDur(d); setLeft(v * 60); localStorage.setItem('dur', JSON.stringify(d));
  };
  const mm = String(Math.floor(left / 60)).padStart(2, '0'), ss = String(left % 60).padStart(2, '0');

  return (
    <motion.section layout className="glass p-6 sm:p-8 flex flex-col items-center"
      animate={{ boxShadow: running && mode === 'Focus' ? '0 0 80px -10px rgba(255,69,58,.45)' : '0 20px 60px -20px rgba(0,0,0,.25)' }}>
      <div className="flex w-full max-w-sm mb-6 p-1 rounded-full" style={{ background: 'var(--line)' }}>
        {MODES.map(m => (
          <button key={m} onClick={() => pick(m)} className="flex-1 px-2 py-2 rounded-full text-sm font-medium relative whitespace-nowrap text-center">
            {mode === m && <motion.span layoutId="pill" className="absolute inset-0 pill" />}
            <span className="relative">{m}</span>
          </button>))}
      </div>
      <div className="relative w-64 h-64 sm:w-72 sm:h-72">
        <svg viewBox="0 0 280 280" className="-rotate-90 w-full h-full">
          <circle cx="140" cy="140" r={R} fill="none" stroke="var(--line)" strokeWidth="18" />
          <motion.circle cx="140" cy="140" r={R} fill="none" stroke="var(--accent)" strokeWidth="18" strokeLinecap="round" strokeDasharray={C}
            animate={{ strokeDashoffset: C * (1 - left / total) }} transition={{ type: 'tween', ease: 'linear', duration: 1 }} />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="num text-6xl sm:text-7xl">{mm}:{ss}</span>
          <span className="text-sm mt-1 text-[color:var(--mute)] max-w-[10rem] truncate">{taskTitle ?? 'Pin a task to focus on it'}</span>
        </div>
      </div>
      <div className="flex items-center gap-4 mt-6">
        <motion.button whileTap={{ scale: .9 }} onClick={() => step(-1)} disabled={running} className="w-11 h-11 rounded-full glass flex items-center justify-center disabled:opacity-30" aria-label="Shorter"><Minus size={18} /></motion.button>
        <motion.button whileTap={{ scale: .9 }} onClick={() => setRunning(r => !r)} className="w-16 h-16 rounded-full flex items-center justify-center text-white" style={{ background: 'var(--accent)' }} aria-label={running ? 'Pause' : 'Start'}>{running ? <Pause /> : <Play />}</motion.button>
        <motion.button whileTap={{ scale: .9 }} onClick={() => step(1)} disabled={running} className="w-11 h-11 rounded-full glass flex items-center justify-center disabled:opacity-30" aria-label="Longer"><Plus size={18} /></motion.button>
      </div>
      <div className="flex items-center gap-2 mt-4 text-sm text-[color:var(--mute)]">
        <span>{mode}: {dur[mode]} min</span>
        <button onClick={() => pick(mode)} aria-label="Reset" className="p-1"><RotateCcw size={14} /></button>
      </div>
    </motion.section>
  );
}
