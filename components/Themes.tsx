'use client';
import { useEffect, useState } from 'react';

export const BGS = [
  { id: 'mono', name: 'Mono', sw: 'linear-gradient(135deg,#1c1c1e,#000)' },
  { id: 'aurora', name: 'Aurora', sw: 'linear-gradient(135deg,#7c5cff,#00d4ff)' },
  { id: 'sunset', name: 'Sunset', sw: 'linear-gradient(135deg,#ff9f0a,#ff375f)' },
  { id: 'ocean', name: 'Ocean', sw: 'linear-gradient(135deg,#0a84ff,#64d2ff)' },
  { id: 'forest', name: 'Forest', sw: 'linear-gradient(135deg,#30d158,#0a4d2a)' },
  { id: 'rose', name: 'Rose', sw: 'linear-gradient(135deg,#ff6b9d,#c44dff)' },
];
export const FONTS = [
  { id: 'jakarta', name: 'Jakarta', css: "'Plus Jakarta Sans'", w: 800 },
  { id: 'montserrat', name: 'Montserrat', css: "'Montserrat'", w: 900 },
  { id: 'bebas', name: 'Bebas Neue', css: "'Bebas Neue'", w: 400 },
  { id: 'anton', name: 'Anton', css: "'Anton'", w: 400 },
  { id: 'unbounded', name: 'Unbounded', css: "'Unbounded'", w: 800 },
  { id: 'bangers', name: 'Bangers', css: "'Bangers'", w: 400 },
  { id: 'nunito', name: 'Nunito', css: "'Nunito'", w: 900 },
];
const applyFont = (id: string) => { const f = FONTS.find(x => x.id === id) || FONTS[0], r = document.documentElement.style; r.setProperty('--head', f.css + ', sans-serif'); r.setProperty('--headw', String(f.w)); r.setProperty('--headls', f.w === 400 ? '.02em' : '-.03em'); };
export default function Themes() {
  const [font, setFont] = useState('jakarta');
  const [cur, setCur] = useState('mono');
  useEffect(() => { const s = localStorage.getItem('bg') || 'mono'; setCur(s); document.documentElement.dataset.bg = s; const f = localStorage.getItem('font') || 'jakarta'; setFont(f); applyFont(f); }, []);
  const pick = (id: string) => { setCur(id); document.documentElement.dataset.bg = id; localStorage.setItem('bg', id); };
  return (
    <section className="glass p-6 dim-soft">
      <h2 className="font-head font-extrabold text-xl mb-3">Look</h2>
      <div className="grid grid-cols-3 gap-3">
        {BGS.map(b => (
          <button key={b.id} onClick={() => pick(b.id)} aria-label={b.name} className="text-sm">
            <div className="h-14 rounded-2xl mb-1" style={{ background: b.sw, outline: cur === b.id ? '3px solid var(--accent)' : 'none', outlineOffset: 2 }} />{b.name}
          </button>))}
      </div>
      <h3 className="text-sm font-semibold text-[color:var(--mute)] mt-5 mb-2">Headline font</h3>
      <div className="flex flex-wrap gap-2">
        {FONTS.map(f => (
          <button key={f.id} onClick={() => { setFont(f.id); applyFont(f.id); localStorage.setItem('font', f.id); }} className="px-3 py-1.5 rounded-full text-sm"
            style={{ fontFamily: f.css, fontWeight: f.w, background: font === f.id ? 'var(--accent)' : 'var(--line)', color: font === f.id ? '#fff' : undefined }}>{f.name}</button>))}
      </div>
    </section>
  );
}
