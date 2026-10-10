/* ---------- v02.9.1: natural sounds (Topic 6) ----------
   Scarce: only sometimes with an ambient phrase (about 1 in 3), soft and far away, chosen by the hour
   (birds in the morning, water and wind by day, wind at dusk, crickets at night). Never in concentration mode.
   All synthesized, so nothing is downloaded. */
function natureOut(pan, wetAmt){
  const g = ac.createGain(), p = ac.createStereoPanner(), w = ac.createGain();
  p.pan.value = pan; w.gain.value = wetAmt; g.connect(p); p.connect(master); g.connect(w); w.connect(master._conv);
  setTimeout(() => [g, p, w].forEach(n => { try { n.disconnect(); } catch(e){} }), 20000);   // V02.12.2: freed once the sound is over
  return g;
}
function noiseSource(sec, brown){
  const b = ac.createBuffer(1, Math.floor(ac.sampleRate*sec), ac.sampleRate), d = b.getChannelData(0); let last = 0;
  for (let i=0;i<d.length;i++){ const w = Math.random()*2-1; if (brown){ last = (last + .02*w)/1.02; d[i] = last*3.5; } else d[i] = w; }
  const s = ac.createBufferSource(); s.buffer = b; return s;
}
function birds(at){                                   // two or three far phrases of quick chirps
  const out = natureOut(Math.random()*1.2-.6, .6); let w = at;
  const phrases = 2 + Math.floor(Math.random()*2);
  for (let ph=0; ph<phrases; ph++){
    const base = 2600 + Math.random()*1600, n = 2 + Math.floor(Math.random()*4);
    for (let c=0;c<n;c++){
      const o = ac.createOscillator(), g = ac.createGain(), dur = .06 + Math.random()*.09, up = Math.random() < .5;
      o.frequency.setValueAtTime(base*(up ? .85 : 1.15), w); o.frequency.exponentialRampToValueAtTime(base*(up ? 1.25 : .8), w+dur);
      g.gain.setValueAtTime(0,w); g.gain.linearRampToValueAtTime(.011,w+.012); g.gain.exponentialRampToValueAtTime(.0001,w+dur);
      o.connect(g); g.connect(out); o.start(w); o.stop(w+dur+.02); w += dur + .04 + Math.random()*.08;
    }
    w += .7 + Math.random()*1.6;
  }
}
function wind(at){                                    // a slow gust of filtered noise
  const len = 7 + Math.random()*4, s = noiseSource(len, false), bp = ac.createBiquadFilter(), g = ac.createGain(), out = natureOut(Math.random()*.8-.4, .35);
  bp.type = 'bandpass'; bp.Q.value = .9; bp.frequency.setValueAtTime(320, at); bp.frequency.linearRampToValueAtTime(820, at+len*.45); bp.frequency.linearRampToValueAtTime(380, at+len);
  g.gain.setValueAtTime(0,at); g.gain.linearRampToValueAtTime(.05, at+len*.45); g.gain.linearRampToValueAtTime(0, at+len);
  s.connect(bp); bp.connect(g); g.connect(out); s.start(at); s.stop(at+len);
}
function water(at){                                   // a small stream: soft low noise and a few drops
  const len = 6 + Math.random()*3, s = noiseSource(len, true), lp = ac.createBiquadFilter(), g = ac.createGain(), out = natureOut(Math.random()*.8-.4, .5);
  lp.type = 'lowpass'; lp.frequency.value = 900;
  g.gain.setValueAtTime(0,at); g.gain.linearRampToValueAtTime(.06, at+1.5); g.gain.setValueAtTime(.06, at+len-2); g.gain.linearRampToValueAtTime(0, at+len);
  s.connect(lp); lp.connect(g); g.connect(out); s.start(at); s.stop(at+len);
  const drops = 6 + Math.floor(Math.random()*8);
  for (let i=0;i<drops;i++){
    const w = at + .8 + Math.random()*(len-1.6), o = ac.createOscillator(), dg = ac.createGain(), f = 1100 + Math.random()*1400;
    o.frequency.setValueAtTime(f, w); o.frequency.exponentialRampToValueAtTime(f*.55, w+.06);
    dg.gain.setValueAtTime(0,w); dg.gain.linearRampToValueAtTime(.012,w+.004); dg.gain.exponentialRampToValueAtTime(.0001,w+.09);
    o.connect(dg); dg.connect(out); o.start(w); o.stop(w+.12);
  }
}
function crickets(at){                                // a far field at night
  const len = 4 + Math.random()*3, out = natureOut(Math.random()*1.2-.6, .45);
  for (let k=0;k<2;k++){
    const o = ac.createOscillator(), am = ac.createOscillator(), amg = ac.createGain(), g = ac.createGain(), f = 4200 + Math.random()*700;
    o.frequency.value = f; am.type = 'square'; am.frequency.value = 26 + Math.random()*8; amg.gain.value = .5;
    const st = at + k*.35; g.gain.setValueAtTime(0, st);
    for (let b=0; b<len/0.9; b++){ const bt = st + b*.9; g.gain.setValueAtTime(.0055, bt); g.gain.setValueAtTime(0, bt+.32); }
    am.connect(amg); amg.connect(g.gain); o.connect(g); g.connect(out);
    o.start(st); am.start(st); o.stop(st+len); am.stop(st+len);
  }
}
const NATURE = {birds, wind, water, crickets};
let concentration = false, natureP = .34;                // natureP: how often (Settings → Natural sounds)                            // set by the app during study/meditation sessions
function naturePool(){
  const h = hour % 24;
  if (h >= 5 && h < 11) return ['birds','birds','wind'];
  if (h >= 11 && h < 17) return ['water','wind','birds'];
  if (h >= 17 && h < 20.5) return ['wind','water'];
  return ['crickets','wind'];
}
function natureMaybe(force){
  if (!ac || !soundOn || concentration) return;
  if (!force && Math.random() > natureP) return;
  const pool = naturePool(), name = pool[Math.floor(Math.random()*pool.length)];
  NATURE[name](ac.currentTime + (force ? .2 : 1.5 + Math.random()*4));
}
const natureBtn = document.getElementById('natureBtn');
if (natureBtn) natureBtn.addEventListener('click', () => { initAudio(); natureMaybe(true); });
