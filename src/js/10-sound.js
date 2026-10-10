/* ================= sound (Eno / Bloom spirit) ================= */
function initAudio(){
  if (ac) return;
  ac = new (window.AudioContext||window.webkitAudioContext)();
  master = ac.createGain(); master.gain.value = .55;
  const limit = ac.createDynamicsCompressor();        // V02.12.2: a soft limiter, so long sessions never pile up into distortion
  limit.threshold.value = -10; limit.knee.value = 8; limit.ratio.value = 6; limit.attack.value = .005; limit.release.value = .25;
  master.connect(limit); limit.connect(ac.destination);
  analyser = ac.createAnalyser(); analyser.fftSize = 1024; analyser.smoothingTimeConstant = .8; master.connect(analyser); freq = new Uint8Array(analyser.frequencyBinCount);
  const conv = ac.createConvolver(), len = ac.sampleRate*5, ir = ac.createBuffer(2,len,ac.sampleRate);
  for (let c=0;c<2;c++){ const d = ir.getChannelData(c); for (let i=0;i<len;i++) d[i]=(Math.random()*2-1)*Math.pow(1-i/len,3.2); }
  conv.buffer = ir; const wet = ac.createGain(); wet.gain.value = .9; conv.connect(wet); wet.connect(master);
  master._conv = conv;
}
function tone(f, when=0, dur=2.4, gain=.12, attack=.03, type='sine'){
  if (!ac || !soundOn || activeVoices > 48) return;   // never more than ~48 notes at once
  const t = ac.currentTime + when, o = ac.createOscillator(), o2 = ac.createOscillator(), g = ac.createGain(), dry = ac.createGain(), g2 = ac.createGain();
  o.type = type; o.frequency.value = f; o2.type = 'sine'; o2.frequency.value = f*2.001; g2.gain.value = .18;
  g.gain.setValueAtTime(0,t); g.gain.linearRampToValueAtTime(gain,t+attack); g.gain.exponentialRampToValueAtTime(.0001,t+dur);
  o.connect(g); o2.connect(g2); g2.connect(g); dry.gain.value = .35;
  g.connect(dry); dry.connect(master); g.connect(master._conv);
  o.start(t); o2.start(t); o.stop(t+dur+.1); o2.stop(t+dur+.1);
  activeVoices++; o.onended = () => { activeVoices--; [o, o2, g, g2, dry].forEach(n => { try { n.disconnect(); } catch(e){} }); };   // free every node when the note ends
}
let activeVoices = 0;
const P = [155.56,174.61,196.00,233.08,261.63,311.13,349.23,392.00,466.16,523.25,622.25,698.46,783.99]; // Eb major pentatonic
function startupLong(){
  tone(P[0]/2,.05,6.5,.06,1.6);
  tone(P[3],.7,4.5,.045,.5); tone(P[5],1.2,4.5,.045,.4);
  [[2,1.9],[5,1.95],[7,2.0],[9,2.05]].forEach(([n,w]) => tone(P[n],w,5,.05,.35));
  tone(P[10],2.55,4,.035,.08); tone(P[12],2.95,4,.03,.05); tone(P[11],3.4,4.4,.028,.05);
}
function goodnightSound(){
  [[11,0],[9,.45],[7,.9],[5,1.35]].forEach(([n,w]) => tone(P[n],w,3.6,.045,.06));
  tone(P[2],1.9,5,.04,.5); tone(P[0]/2,2.3,6,.05,1.2);
}
const spaceNotes = {calendar:[5,9], record:[7,10], habits:[6,9], seasons:[3,8], experiments:[4,9]};
function openSound(name){ const [a,b] = spaceNotes[name]; tone(P[a],0,3,.09,.02); tone(P[b],.18,3.2,.07,.02); }
function closeSound(){ tone(P[8],0,2.4,.06,.02); tone(P[5],.16,2.8,.06,.02); }
function hoverTick(){ tone(P[12]*2,0,.5,.012,.005); }
function pick(i){ tone(P[(i*2)%P.length],0,1.8,.06,.01,'triangle'); }

/* ambient music, PS4-style: it is not always there. A soft phrase appears now and then,
   in the colour of the space you are in, and fades away. Navigation has its own small sounds. */
const CHORDS = {
  home:        [155.56,233.08,311.13,392.00],
  calendar:    [174.61,261.63,349.23,523.25],
  record:      [196.00,293.66,392.00,587.33],
  habits:      [130.81,196.00,261.63,392.00],
  seasons:     [116.54,174.61,233.08,349.23],
  experiments: [155.56,261.63,392.00,523.25],
};
let ambOn = false, ambTimer = null, ambSet = 'home';
function ambientPhrase(){
  lastAmbient = performance.now();
  if (!ac || !ambOn) return;
  const c = CHORDS[ambSet] || CHORDS.home;
  c.forEach((f,i) => tone(f/2, i*.5, 11 + Math.random()*4, .016, 2.5 + Math.random()*1.5));   // a slow pad that swells in
  let w = 2.2; const n = 3 + Math.floor(Math.random()*4);
  for (let j=0;j<n;j++){ w += .8 + Math.random()*1.9; tone(c[Math.floor(Math.random()*c.length)] * (Math.random() < .5 ? 1 : 2), w, 3.6, .022, .04); }
  try { natureMaybe(); } catch(e){}                // v02.9.1: now and then, a natural sound
  scheduleAmbient();
}
/* V02.12.2: the music must survive long sessions — resume the audio if the browser suspended it (sleep, headphones,
   tab in the background), and restart the ambient schedule if a timer was lost. */
let lastAmbient = 0;
setInterval(() => {
  if (!ac) return;
  if (ac.state !== 'running' && ac.state !== 'closed') ac.resume().catch(() => {});
  if (ambOn && !concentration && performance.now() - lastAmbient > 60000) scheduleAmbient();
}, 5000);
document.addEventListener('visibilitychange', () => { if (!document.hidden && ac){ ac.resume().catch(() => {}); if (ambOn) scheduleAmbient(); } });
function scheduleAmbient(first){ clearTimeout(ambTimer); lastAmbient = performance.now(); if (!ambOn) return; ambTimer = setTimeout(ambientPhrase, first ? 5850 : 18000 + Math.random()*25200); }
function startAmbient(){ ambOn = true; scheduleAmbient(true); }
function stopAmbient(){ ambOn = false; clearTimeout(ambTimer); }
function setAmbient(name){ ambSet = name; }
let noiseBuf = null;
function navTick(){                       // a soft click, like moving along a console menu
  if (!ac || !soundOn) return;
  if (!noiseBuf){ noiseBuf = ac.createBuffer(1, ac.sampleRate*.04, ac.sampleRate); const d = noiseBuf.getChannelData(0); for (let i=0;i<d.length;i++) d[i] = (Math.random()*2-1)*Math.pow(1-i/d.length,4); }
  const src = ac.createBufferSource(), bp = ac.createBiquadFilter(), g = ac.createGain();
  src.buffer = noiseBuf; bp.type = 'bandpass'; bp.frequency.value = 2600; bp.Q.value = 1.4; g.gain.value = .05;
  src.connect(bp); bp.connect(g); g.connect(master); src.start();
  tone(P[12]*2, 0, .3, .006, .003);
}

const noteOf = line => { const h = HABITS.find(h => line.includes(h.e)); return h ? h.note : 3; };
function playPhrase(lines, start=.35, gap=.32){ lines.forEach((l,i) => tone(P[noteOf(l)], start + i*gap, 2.6, .06, .02)); }

