// Sounds are synthesized in the browser: no files, no broken links.
let ctx: AudioContext | null = null, master: GainNode | null = null;
const ac = () => { if (!ctx) { ctx = new AudioContext(); master = ctx.createGain(); master.connect(ctx.destination); } return ctx; };
export const setVolume = (v: number) => { ac(); master!.gain.value = v; };

function noise(kind: 'white' | 'pink' | 'brown') {
  const a = ac(), buf = a.createBuffer(1, a.sampleRate * 4, a.sampleRate), d = buf.getChannelData(0);
  let l = 0, b0 = 0, b1 = 0, b2 = 0;
  for (let i = 0; i < d.length; i++) {
    const w = Math.random() * 2 - 1;
    if (kind === 'white') d[i] = w * 0.5;
    else if (kind === 'brown') { l = (l + 0.02 * w) / 1.02; d[i] = l * 3.5; }
    else { b0 = 0.99765 * b0 + w * 0.099046; b1 = 0.963 * b1 + w * 0.2965164; b2 = 0.57 * b2 + w * 1.0526913; d[i] = (b0 + b1 + b2 + w * 0.1848) * 0.2; }
  }
  const s = a.createBufferSource(); s.buffer = buf; s.loop = true; s.start(); return s;
}
function beat(base: number, hz: number) {
  const a = ac(), out: AudioNode[] = [];
  [0, 1].forEach(side => {
    const o = a.createOscillator(), p = a.createStereoPanner(), g = a.createGain();
    o.frequency.value = base + (side ? hz : 0); p.pan.value = side ? 1 : -1; g.gain.value = 0.12;
    o.connect(g).connect(p).connect(master!); o.start(); out.push(o);
  });
  return () => out.forEach(o => (o as OscillatorNode).stop());
}
export const SOUNDS: { name: string; note: string; start: () => () => void }[] = [
  { name: 'Brown noise', note: 'Deep, steady hum', start: () => { const n = noise('brown'); n.connect(master!); return () => n.stop(); } },
  { name: 'Pink noise', note: 'Soft, balanced hiss', start: () => { const n = noise('pink'); n.connect(master!); return () => n.stop(); } },
  { name: 'White noise', note: 'Masks sudden sounds', start: () => { const n = noise('white'); n.connect(master!); return () => n.stop(); } },
  { name: 'Rain', note: 'Filtered pink noise', start: () => { const a = ac(), n = noise('pink'), f = a.createBiquadFilter(); f.type = 'highpass'; f.frequency.value = 700; n.connect(f).connect(master!); return () => n.stop(); } },
  { name: 'Ocean', note: 'Slow rolling waves', start: () => { const a = ac(), n = noise('brown'), g = a.createGain(), l = a.createOscillator(), lg = a.createGain(); g.gain.value = 0.5; l.frequency.value = 0.1; lg.gain.value = 0.4; l.connect(lg).connect(g.gain); l.start(); n.connect(g).connect(master!); return () => { n.stop(); l.stop(); }; } },
  { name: 'Alpha 10 Hz', note: 'Binaural, use headphones', start: () => beat(200, 10) },
  { name: 'Gamma 40 Hz', note: 'Binaural, use headphones', start: () => beat(200, 40) },
];
