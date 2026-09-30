'use client';
import { useRef, useState } from 'react';
import { motion } from 'framer-motion';

const SOUNDS = [
  { name: 'Rain', url: 'https://cdn.pixabay.com/audio/2022/03/10/audio_c8c8a73467.mp3' },
  { name: 'Cafe', url: 'https://cdn.pixabay.com/audio/2022/02/07/audio_d0c6ff1bdd.mp3' },
  { name: 'Lofi', url: 'https://cdn.pixabay.com/audio/2022/05/27/audio_1808fbf07a.mp3' },
];
export default function Ambient() {
  const [on, setOn] = useState<Record<string, boolean>>({}); const refs = useRef<Record<string, HTMLAudioElement>>({});
  const toggle = (n: string, url: string) => {
    const a = (refs.current[n] ||= Object.assign(new Audio(url), { loop: true }));
    on[n] ? a.pause() : a.play(); setOn({ ...on, [n]: !on[n] });
  };
  return (
    <section className="glass p-6 dim-soft">
      <h2 className="font-head font-extrabold text-2xl mb-3">Ambience</h2>
      {SOUNDS.map(s => (
        <div key={s.name} className="flex justify-between items-center py-2">
          <span>{s.name}</span>
          <button onClick={() => toggle(s.name, s.url)} role="switch" aria-checked={!!on[s.name]} className="w-12 h-7 rounded-full p-0.5 flex" style={{ background: on[s.name] ? '#30d158' : 'var(--line)', justifyContent: on[s.name] ? 'flex-end' : 'flex-start' }}>
            <motion.span layout transition={{ type: 'spring', stiffness: 500, damping: 30 }} className="w-6 h-6 rounded-full bg-white shadow" />
          </button>
        </div>))}
    </section>
  );
}
