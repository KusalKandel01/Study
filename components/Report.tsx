'use client';
import { useEffect, useRef, useState } from 'react';
import { Share2, Download, X, FileText } from 'lucide-react';

type R = { name: string; minutes: number; sessions: number; done: number; streak: number };
function draw(c: HTMLCanvasElement, r: R) {
  const x = c.getContext('2d')!; c.width = 1080; c.height = 1350;
  const g = x.createLinearGradient(0, 0, 1080, 1350); g.addColorStop(0, '#0a0a0c'); g.addColorStop(1, '#1c1c1e'); x.fillStyle = g; x.fillRect(0, 0, 1080, 1350);
  const glow = x.createRadialGradient(540, 520, 20, 540, 520, 560); glow.addColorStop(0, 'rgba(255,69,58,.35)'); glow.addColorStop(1, 'transparent'); x.fillStyle = glow; x.fillRect(0, 0, 1080, 1350);
  const F = "'Plus Jakarta Sans', Inter, system-ui, sans-serif"; x.textAlign = 'center';
  x.fillStyle = '#86868b'; x.font = `600 40px ${F}`; x.fillText(new Date().toLocaleDateString('en', { weekday: 'long', month: 'long', day: 'numeric' }), 540, 150);
  x.fillStyle = '#f5f5f7'; x.font = `800 64px ${F}`; x.fillText(`${r.name}'s study day`, 540, 240);
  const h = Math.floor(r.minutes / 60), m = r.minutes % 60;
  x.font = `800 240px ${F}`; x.fillStyle = '#ff453a'; x.fillText(h ? `${h}h ${m}m` : `${m}m`, 540, 560);
  x.font = `600 44px ${F}`; x.fillStyle = '#86868b'; x.fillText('focused today', 540, 630);
  const stats: [string, string | number][] = [['Sessions', r.sessions], ['Tasks done', r.done], ['Day streak', r.streak]];
  stats.forEach(([l, v], i) => { const cx = 210 + i * 330; x.fillStyle = 'rgba(255,255,255,.07)'; x.beginPath(); x.roundRect(cx - 140, 760, 280, 240, 36); x.fill();
    x.fillStyle = '#f5f5f7'; x.font = `800 110px ${F}`; x.fillText(String(v), cx, 910); x.fillStyle = '#86868b'; x.font = `600 34px ${F}`; x.fillText(l, cx, 966); });
  x.fillStyle = '#f5f5f7'; x.font = `600 44px ${F}`;
  x.fillText(r.minutes >= 240 ? 'Goal hit. Rest well.' : r.minutes > 0 ? 'Showed up. That is the habit.' : 'Tomorrow starts with one session.', 540, 1140);
  x.fillStyle = '#86868b'; x.font = `500 30px ${F}`; x.fillText('Study Command Center', 540, 1270);
}
export default function Report(r: R) {
  const [open, setOpen] = useState(false); const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => { if (open && ref.current) draw(ref.current, r); }, [open, r.minutes, r.sessions, r.done, r.streak]);
  const blob = () => new Promise<Blob>(res => ref.current!.toBlob(b => res(b!), 'image/png'));
  const share = async () => {
    const f = new File([await blob()], 'study-report.png', { type: 'image/png' });
    if (navigator.canShare?.({ files: [f] })) await navigator.share({ files: [f], title: 'My study day' }).catch(() => {});
    else save();
  };
  const save = async () => { const a = document.createElement('a'); a.href = URL.createObjectURL(await blob()); a.download = `study-report-${new Date().toISOString().slice(0, 10)}.png`; a.click(); };
  return (<>
    <button onClick={() => setOpen(true)} className="glass px-5 py-2.5 text-sm font-semibold flex items-center gap-2" style={{ borderRadius: 999 }}><FileText size={16} />Daily report</button>
    {open && (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,.6)' }} onClick={() => setOpen(false)}>
        <div className="glass p-4 max-w-sm w-full max-h-[92vh] overflow-auto" onClick={e => e.stopPropagation()}>
          <div className="flex justify-end"><button onClick={() => setOpen(false)} aria-label="Close"><X /></button></div>
          <canvas ref={ref} className="w-full rounded-2xl my-3" />
          <div className="flex gap-2">
            <button onClick={share} className="flex-1 py-3 rounded-full text-white font-semibold flex items-center justify-center gap-2" style={{ background: 'var(--accent)' }}><Share2 size={16} />Share</button>
            <button onClick={save} className="flex-1 py-3 rounded-full glass font-semibold flex items-center justify-center gap-2"><Download size={16} />Save image</button>
          </div>
        </div>
      </div>)}
  </>);
}
