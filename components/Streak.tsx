'use client';
import { motion } from 'framer-motion';
import { ymd } from '@/lib/date';

export default function Streak({ current, longest, minutesToday, goal = 240, minutesByDay }: { current: number; longest: number; minutesToday: number; goal?: number; minutesByDay: Record<string, number> }) {
  const pct = Math.min(1, minutesToday / goal), R = 52, C = 2 * Math.PI * R;
  const days = Array.from({ length: 182 }, (_, i) => { const d = new Date(Date.now() - (181 - i) * 86400000); return ymd(d); });
  const shade = (m = 0) => m === 0 ? 'var(--line)' : `rgba(48,209,88,${Math.min(1, .3 + m / 240)})`;
  return (
    <section className="glass p-6 dim-soft">
      <div className="flex items-center gap-5 sm:gap-6">
        <div className="relative w-32 h-32 shrink-0">
          <svg viewBox="0 0 120 120" className="-rotate-90"><circle cx="60" cy="60" r={R} fill="none" stroke="var(--line)" strokeWidth="14" />
            <motion.circle cx="60" cy="60" r={R} fill="none" stroke="#30d158" strokeWidth="14" strokeLinecap="round" strokeDasharray={C}
              initial={{ strokeDashoffset: C }} animate={{ strokeDashoffset: C * (1 - pct) }} transition={{ type: 'spring', stiffness: 60, damping: 18 }} /></svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center"><span className="num text-2xl">{Math.round(minutesToday / 6) / 10}h</span><span className="text-xs text-[color:var(--mute)]">of {goal / 60}h</span></div>
        </div>
        <div>
          <div className="num text-5xl sm:text-6xl leading-none mb-2">🔥 {current}</div>
          <div className="text-sm text-[color:var(--mute)]">day streak · best {longest}</div>
        </div>
      </div>
      <div className="grid grid-flow-col grid-rows-7 gap-1 mt-6 overflow-x-auto pb-1">
        {days.map(d => <div key={d} title={`${d}: ${minutesByDay[d] ?? 0} min`} className="w-3 h-3 rounded-[4px]" style={{ background: shade(minutesByDay[d]) }} />)}
      </div>
    </section>
  );
}
