'use client';
import { useEffect, useRef, useState } from 'react';

import { todayLocal as today } from '@/lib/date';
export default function Notes() {
  const [body, setBody] = useState(''), [saved, setSaved] = useState(true), t = useRef<any>(null), loaded = useRef(false);
  useEffect(() => { fetch(`/api/notes?date=${today()}`).then(r => r.json()).then(d => { setBody(d.body); loaded.current = true; }); }, []);
  const change = (v: string) => {
    setBody(v); setSaved(false); clearTimeout(t.current);
    t.current = setTimeout(() => fetch('/api/notes', { method: 'PUT', body: JSON.stringify({ date: today(), body: v }) }).then(() => setSaved(true)), 1000);
  };
  return (
    <section className="glass p-6 dim-soft">
      <div className="flex justify-between items-baseline"><h2 className="font-head font-extrabold text-2xl">Today&apos;s note</h2><span className="text-xs text-[color:var(--mute)]">{saved ? 'Saved' : 'Saving…'}</span></div>
      <p className="text-sm text-[color:var(--mute)] mt-1 mb-3">What is the one thing that makes today a win?</p>
      <textarea value={body} onChange={e => change(e.target.value)} rows={6} className="w-full bg-transparent outline-none resize-none leading-relaxed" placeholder="Start writing…" />
    </section>
  );
}
