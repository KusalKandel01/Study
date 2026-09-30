'use client';
import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { SOUNDS, setVolume } from '@/lib/audio';

export default function Ambient() {
  const [on, setOn] = useState<Record<string, boolean>>({}), [vol, setVol] = useState(0.5);
  const stops = useRef<Record<string, () => void>>({});
  const toggle = (n: string, start: () => () => void) => {
    setVolume(vol);
    if (on[n]) { stops.current[n]?.(); delete stops.current[n]; } else stops.current[n] = start();
    setOn({ ...on, [n]: !on[n] });
  };
  return (
    <section className="glass p-6 dim-soft">
      <h2 className="font-head font-extrabold text-xl mb-1">Sound</h2>
      <p className="text-sm text-[color:var(--mute)] mb-3">Steady noise helps many people block distractions. Evidence for binaural tones is mixed, so try and keep what works.</p>
      {SOUNDS.map(s => (
        <div key={s.name} className="flex justify-between items-center py-2">
          <div><div className="font-medium">{s.name}</div><div className="text-xs text-[color:var(--mute)]">{s.note}</div></div>
          <button onClick={() => toggle(s.name, s.start)} role="switch" aria-checked={!!on[s.name]} aria-label={s.name} className="w-12 h-7 rounded-full p-0.5 flex" style={{ background: on[s.name] ? '#30d158' : 'var(--line)', justifyContent: on[s.name] ? 'flex-end' : 'flex-start' }}>
            <motion.span layout transition={{ type: 'spring', stiffness: 500, damping: 30 }} className="w-6 h-6 rounded-full bg-white shadow" />
          </button>
        </div>))}
      <label className="flex items-center gap-3 mt-3 text-sm text-[color:var(--mute)]">Volume
        <input type="range" min="0" max="1" step="0.05" value={vol} onChange={e => { setVol(+e.target.value); setVolume(+e.target.value); }} className="flex-1" /></label>
    </section>
  );
}
