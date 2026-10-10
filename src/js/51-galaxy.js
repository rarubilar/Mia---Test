/* ---------- V02.10.1 · Galaxy recording (V02.10.2: painted planets in depth, Mia in orbit, the void at the centre) ----------
   Record › Habits becomes a galaxy. Each habit is a planet in its own fixed place (it only drifts a little),
   bigger the more you do it. In the centre waits a void. Drag a planet into it: the void grows and shifts its
   colour slightly, then Mia asks how it was (duration, quality) and the line is written on the day at the right.
   Opening: for 5 seconds the home waves flow into the galaxy as stellar dust and far galaxies; then the planets arrive.
   Mia is a planet too: the same breathing light as on home. */
let galaxyOn = true;
ICONS.galaxy = ICONS.record; ICONS_XMB.galaxy = ICONS_XMB.record; ICONS_MIN.galaxy = ICONS_MIN.record; XLABEL.galaxy = 'Record';
SHAPES.galaxy = {amp:1, spread:1.3, y:.56, flow:.7};
spaceNotes.galaxy = spaceNotes.record; CHORDS.galaxy = CHORDS.record;

const gcv = document.createElement('canvas'); gcv.id = 'galaxyCv'; gcv.setAttribute('aria-hidden', 'true'); document.body.appendChild(gcv);
const gcx = gcv.getContext('2d');
function gSize(){ gcv.width = W*dpr; gcv.height = H*dpr; gcx.setTransform(dpr,0,0,dpr,0,0); }
addEventListener('resize', () => { gSize(); if (current === 'galaxy') placePlanets(); }); gSize();

const galSp = document.createElement('div'); galSp.className = 'space'; galSp.id = 'sp-galaxy';
galSp.innerHTML = `<div class="gal" id="gal">
    <div class="void" id="void" aria-hidden="true"><i></i><b></b></div>
    <div class="planets" id="planets"></div>
    <button class="gday" id="gday" aria-label="Open this day in the calendar"><span class="gdate" id="gdate"></span></button>
  </div>`;
$('#sheet').appendChild(galSp);

/* ----- V02.10.2: colours from an orange sunset to a dark forest green, chosen by what each habit is.
   Warm, high-energy habits sit at the sunset end (body, play); thinking habits in the golds and olives;
   calm, inward habits in the deep greens. Analogous steps keep them one family; red-orange "veins" run through
   the greens as their complement, like the stems in the painting. ----- */
const PLANET_COL = {Run:'#E8743B', Gym:'#C9543A', Football:'#E39A48', French:'#D8AE52', Study:'#B3A54A', Read:'#7F9C59', Yoga:'#4E7B57', Meditation:'#24462F'};
const SPARE_COL = ['#D98C45','#9DA24E','#5F8A57','#B86B3E'];
const hexRgb = h => [1,3,5].map(i => parseInt(h.slice(i,i+2),16));
function rgbHsl([r,g,b]){ r/=255; g/=255; b/=255; const mx = Math.max(r,g,b), mn = Math.min(r,g,b); let h = 0, s = 0; const l = (mx+mn)/2;
  if (mx !== mn){ const d = mx-mn; s = l > .5 ? d/(2-mx-mn) : d/(mx+mn); h = mx === r ? (g-b)/d + (g<b?6:0) : mx === g ? (b-r)/d + 2 : (r-g)/d + 4; h *= 60; } return [h, s*100, l*100]; }
const hsl = (h,s,l,a=1) => `hsla(${(h+360)%360},${Math.max(0,Math.min(100,s))}%,${Math.max(0,Math.min(100,l))}%,${a})`;
const colOf = (h, i) => PLANET_COL[h.name] || SPARE_COL[i % SPARE_COL.length];

/* ----- a painted planet: brush strokes of leaves, veins, light from the upper left ----- */
function paintPlanet(cv, size, hex, seed){
  const S = size * 1.6, d = Math.min(devicePixelRatio || 1, 2), r = size/2, c = S/2;
  cv.width = S*d; cv.height = S*d; const g = cv.getContext('2d'); g.setTransform(d,0,0,d,0,0);
  const [H0,S0,L0] = rgbHsl(hexRgb(hex)), rand = rng(seed * 7919 + 13);
  g.save(); g.beginPath(); g.arc(c, c, r, 0, 6.283); g.clip();
  g.fillStyle = hsl(H0, S0, L0); g.fillRect(0, 0, S, S);
  const strokes = Math.round(26 + size * .9);
  for (let k = 0; k < strokes; k++){                   // leaf-like strokes, each a little warmer or cooler, lighter or darker
    const x = c + (rand()-.5)*size*1.1, y = c + (rand()-.5)*size*1.1, len = size*(.18 + rand()*.32), a = rand()*6.283, w = size*(.05 + rand()*.09);
    const dh = (rand()-.5)*34*.7, dl = (rand()-.5)*30*.7, ds = (rand()-.5)*20*.7;          // V02.10.3: the strokes blend 30% more into the planet's colour
    g.strokeStyle = hsl(H0 + dh, S0 + ds, L0 + dl, (.55 + rand()*.35) * .7); g.lineWidth = w; g.lineCap = 'round';
    g.beginPath(); g.moveTo(x - Math.cos(a)*len/2, y - Math.sin(a)*len/2);
    g.quadraticCurveTo(x + Math.cos(a+1.4)*len*.3, y + Math.sin(a+1.4)*len*.3, x + Math.cos(a)*len/2, y + Math.sin(a)*len/2); g.stroke();
  }
  const vh = (H0 > 60 && H0 < 200) ? 14 : H0 + 160;    // veins: red-orange through greens, deep green through oranges
  for (let k = 0; k < 3 + Math.round(size/18); k++){
    let x = c + (rand()-.5)*size*.9, y = c + (rand()-.5)*size*.9, a = rand()*6.283;
    g.strokeStyle = hsl(vh, 62, (H0 > 60 && H0 < 200) ? 42 : 26, .385); g.lineWidth = Math.max(.6, size*.018); g.beginPath(); g.moveTo(x, y);
    for (let s = 0; s < 5; s++){ a += (rand()-.5)*.9; x += Math.cos(a)*size*.09; y += Math.sin(a)*size*.09; g.lineTo(x, y); }
    g.stroke();
  }
  const sh = g.createRadialGradient(c - r*.38, c - r*.42, r*.05, c, c, r*1.05);   // the sphere: light, then shadow
  sh.addColorStop(0, 'rgba(255,248,230,.42)'); sh.addColorStop(.38, 'rgba(255,248,230,0)'); sh.addColorStop(.72, 'rgba(10,16,12,.18)'); sh.addColorStop(1, 'rgba(6,10,8,.62)');
  g.fillStyle = sh; g.fillRect(0, 0, S, S);
  g.restore();
  g.strokeStyle = 'rgba(255,240,215,.35)'; g.lineWidth = Math.max(.8, size*.025);   // a thin rim of light
  g.beginPath(); g.arc(c, c, r - .6, 3.5, 5.2); g.stroke();
}

/* ----- planets: spread across the space, each with a fixed home and a depth (3D) ----- */
const timesDone = h => Object.values(DAYS).reduce((n, d) => n + d.lines.filter(l => l.includes(h.e)).length, 0);
/* V02.15 · a habit's life in the sky. Size comes from its whole life (all the times it was done). Nothing is ever paused
   or finished, and no planet moves: a habit that is not happening much (at most once in the last 4 weeks) stays in its
   place at 20% of its size; one not done for over a month stays as a point of light only 25% bigger than a spark.
   Done again, it grows back. New habits are full size for their first 4 weeks. */
const SPARK = 2.2, FAR_S = Math.round(SPARK * 1.25 * 10) / 10;          // the biggest dust grain is 2.2 px
const daysDone = h => Object.keys(DAYS).map(Number).filter(n => DAYS[n].lines.some(l => l.includes(h.e)));
function habitLife(h){
  const past = PAST[h.name] || {n: 0, last: Infinity}, mine = daysDone(h);
  const total = past.n + mine.length;
  const ago = mine.length ? TODAY - Math.max(...mine) : TODAY - 1 + past.last + 1;   // days since it last happened
  const recent = mine.filter(n => TODAY - n < 28).length + (past.n && TODAY + past.last < 28 ? 1 : 0);
  const full = Math.max(22, Math.round(Math.min(72, 22 + Math.sqrt(total) * 4.5) * .8));
  if (h.born && TODAY - h.born < 28) return {tier: 'new', s: full};
  if (ago > 30) return {tier: 'far', s: FAR_S};
  if (recent <= 1) return {tier: 'quiet', s: Math.max(5, Math.round(full * .2 * 10) / 10)};
  return {tier: 'on', s: full};
}
const planetSize = h => habitLife(h).s;
const HOMES = {Meditation:[.29,.27,1.15], Read:[.68,.2,.9], Study:[.2,.64,1.05], Yoga:[.8,.72,.72], Run:[.38,.84,.88], Football:[.62,.85,1.0], French:[.88,.36,.66], Gym:[.17,.37,.62]};
let planets = [], gC = {x:0, y:0}, gArrived = false, gMouse = {x:0, y:0};
function gCentre(){ gC = {x: W * .5, y: H * .5}; return gC; }
addEventListener('pointermove', e => { gMouse = {x: e.clientX, y: e.clientY}; });
function buildPlanets(){
  $('#planets').replaceChildren();
  planets = HABITS.map(makePlanet);
  // Mia is a planet too, the same breathing light as on home; she orbits the void
  const m = document.createElement('button'); m.className = 'planet miap'; m.style.setProperty('--k', HABITS.length); m.setAttribute('aria-label', 'Talk to Mia');
  m.innerHTML = '<span class="pin"><i class="pb"></i></span><span class="pname">Mia</span>';
  m.addEventListener('click', () => openChat()); m.addEventListener('pointerenter', navTick);
  $('#planets').appendChild(m);
  planets.push({el: m, i: -1, mia: true});
  placePlanets();
}
function makePlanet(h, i){
    const b = document.createElement('button'); b.className = 'planet'; b.dataset.i = i; b.style.setProperty('--k', i);
    b.setAttribute('aria-label', `${h.name}. Drag into the centre to log it`);
    b.innerHTML = `<span class="pin"><canvas class="pc"></canvas></span><span class="pop" aria-hidden="true"><b>${h.e}</b></span><span class="pname">${h.name}</span>`;
    $('#planets').insertBefore(b, $('#planets .miap'));
    const p = {el: b, i, h, col: colOf(h, i), ph: Math.random()*6.28, w: .22 + Math.random()*.18, rw: 5 + Math.random()*6, drag: false, inside: 0, out: 0};
    b.addEventListener('pointerenter', () => { if (!p.drag) wiiPop(h); });
    b.addEventListener('pointerdown', e => planetDown(e, p));
    b.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' '){ e.preventDefault(); absorb(p, p.x, p.y); } });
    return p;
}
function placePlanets(){                               // each habit keeps its own place: a space of its own
  gCentre();
  const n = HABITS.length;
  planets.forEach((p, k) => {
    if (p.mia) return;
    let [fx, fy, z] = HOMES[p.h.name] || [];
    if (fx === undefined) [fx, fy, z] = HOMES[p.h.name] = freeHome(k);
    p.ax = Math.max(200, Math.min(W - 120, W * fx)); p.ay = Math.max(90, Math.min(H - 150, H * fy)); p.z = z;
    const life = habitLife(p.h), s = life.s;
    p.el.classList.toggle('quiet', life.tier === 'quiet'); p.el.classList.toggle('far', life.tier === 'far');
    p.el.style.setProperty('--c', p.col);
    if (s !== p.s){ p.s = s; p.el.style.setProperty('--s', s + 'px'); paintPlanet(p.el.querySelector('.pc'), Math.max(s, 6), p.col, k + 1); }
  });
  sizeVoid();
}
function freeHome(k){                                  // a new planet takes the emptiest place in the sky, away from the void
  let best = null, bd = -1;
  for (let t = 0; t < 140; t++){
    const fx = .14 + Math.random() * .76, fy = .16 + Math.random() * .68;
    if (Math.hypot((fx - .5) * W, (fy - .5) * H) < Math.min(W, H) * .24) continue;
    const d = Math.min(...Object.values(HOMES).map(([x, y]) => Math.hypot((x - fx) * W, (y - fy) * H)));
    if (d > bd){ bd = d; best = [fx, fy, .78 + (k % 3) * .1]; }
  }
  return best || [.5, .2, .8];
}
function planetsFrame(now){
  const tt = now / 1000, px = (gMouse.x - gC.x) / W, py = (gMouse.y - gC.y) / H;
  for (const p of planets){
    if (p.mia){                                        // Mia orbits the centre on a tilted ring: in front of the void, then behind it
      const a = tt * (2*Math.PI/44.7) + .8, R = Math.min(W, H) * .3, depth = Math.sin(a);
      const z = .78 + .32 * (depth * .5 + .5);
      p.x = gC.x + Math.cos(a) * R * 1.25; p.y = gC.y + depth * R * .32 - 10;
      p.el.style.transform = `translate(${p.x}px, ${p.y}px) scale(${z})`; p.el.style.zIndex = depth > 0 ? 40 : 10;
      p.el.style.opacity = gArrived ? .9 + .1 * (depth * .5 + .5) : '';
      continue;
    }
    if (p.drag) continue;
    let x = p.ax + Math.cos(tt * p.w + p.ph) * p.rw + px * (p.z - .9) * 70, y = p.ay + Math.sin(tt * p.w * 1.3 + p.ph) * p.rw * .7 + py * (p.z - .9) * 50;   // drift + parallax by depth
    let sc = p.z;
    if (p.inside){ x = gC.x; y = gC.y; sc = .01; if (now - p.inside > 900 && !unfoldOn){ p.inside = 0; p.out = now; } }
    else if (p.out){                                   // coming back out of the void, home again
      const k = clamp01((now - p.out) / 1300), e = sineEase(k);
      x = gC.x + (x - gC.x) * e; y = gC.y + (y - gC.y) * e - Math.sin(Math.PI*k) * 40; sc = .05 + (p.z - .05) * e;
      if (k >= 1) p.out = 0;
    }
    p.x = x; p.y = y;
    p.el.style.transform = `translate(${x}px, ${y}px) scale(${sc})`;
    p.el.style.zIndex = Math.round(10 + p.z * 20);
    p.el.style.filter = p.z < .75 ? `blur(${((.75 - p.z) * 4).toFixed(2)}px)` : '';
  }
  const v = $('#void'); v.style.left = gC.x + 'px'; v.style.top = gC.y + 'px';
  const r = v.getBoundingClientRect(), gd = $('#gday'); gd.style.left = (gC.x + r.width/2 + 34) + 'px'; gd.style.top = gC.y + 'px';
}

/* ----- the void ----- */
let voidHue = 0;
function sizeVoid(){
  const d = DAYS[focusDay] || {lines: []};
  $('#void').style.setProperty('--v', (64 + Math.min(10, d.lines.length) * 12) + 'px');
  $('#void').style.setProperty('--hue', voidHue + 'deg');
}
function overVoid(x, y){ const r = $('#void').getBoundingClientRect(); return Math.hypot(x - gC.x, y - gC.y) < r.width/2 + 26; }

/* ----- dragging a planet into the centre ----- */
function planetDown(e, p){
  if (!gArrived || e.button || p.inside || p.out) return;
  e.preventDefault(); p.el.setPointerCapture(e.pointerId);
  const x0 = e.clientX, y0 = e.clientY; let moved = false, hot = false;
  p.el.onpointermove = ev => {
    if (!moved && Math.hypot(ev.clientX - x0, ev.clientY - y0) < 5) return;
    if (!moved){ moved = true; p.drag = true; p.el.classList.add('dragging'); p.el.style.filter = ''; p.el.style.zIndex = 60; tone(P[p.h.note],0,1.6,.035,.01); }
    p.el.style.transform = `translate(${ev.clientX}px, ${ev.clientY}px) scale(1)`;
    const o = overVoid(ev.clientX, ev.clientY);
    if (o !== hot){ hot = o; $('#void').classList.toggle('hot', hot); p.el.classList.toggle('near', hot); if (hot) tone(P[p.h.note], 0, 1.2, .03, .02); }
  };
  p.el.onpointerup = ev => {
    p.el.onpointermove = p.el.onpointerup = null; $('#void').classList.remove('hot'); p.el.classList.remove('near');
    p.el.classList.remove('dragging'); p.drag = false;
    if (moved && overVoid(ev.clientX, ev.clientY)) absorb(p, ev.clientX, ev.clientY);
    else { p.el.classList.add('home'); setTimeout(() => p.el.classList.remove('home'), 700); }   // back to its own place
  };
}
function absorb(p, x, y){                             // the planet goes into the void; it comes back out once logged
  p.el.classList.add('home'); p.inside = performance.now(); setTimeout(() => p.el.classList.remove('home'), 700);
  voidHue = (voidHue + 14 + Math.random()*10) % 60; sizeVoid();
  const v = $('#void'); v.classList.remove('gulp'); void v.offsetWidth; v.classList.add('gulp');
  tone(P[p.h.note], .1, 2.6, .05, .02); tone(P[Math.min(12, p.h.note + 3)], .3, 2.6, .035, .02);
  setTimeout(() => unfoldAt(gC.x, gC.y, p.i, focusDay), 650);
}
window.addEventListener('mia:line:add', () => { if (current === 'galaxy'){ renderGalDay(); setTimeout(placePlanets, 1400); } });

/* ----- hover: the habit's icon pops up on top, Wii-style, with a small bright pop ----- */
function wiiPop(h){
  if (!ac || !soundOn) return;
  const t0 = ac.currentTime, o = ac.createOscillator(), g = ac.createGain();
  o.type = 'sine'; o.frequency.setValueAtTime(P[h.note] * 4, t0); o.frequency.exponentialRampToValueAtTime(P[h.note] * 6, t0 + .07);
  g.gain.setValueAtTime(0, t0); g.gain.linearRampToValueAtTime(.025, t0 + .008); g.gain.exponentialRampToValueAtTime(.0001, t0 + .16);
  o.connect(g); g.connect(master); o.start(t0); o.stop(t0 + .2);
}

/* ----- the day, small, beside the void; it blooms on hover and opens the day in the calendar ----- */
function renderGalDay(){
  const date = new Date(2026, 9, focusDay);
  $('#gdate').innerHTML = `${String(focusDay).padStart(2,'0')} oct 2026<span>${WD[date.getDay()]}</span>`;
  sizeVoid();
}
$('#gday').addEventListener('click', e => openCalendarDay(focusDay, e.currentTarget));
$('#gday').addEventListener('pointerenter', hoverTick);
function galGo(n){ n = Math.max(1, Math.min(31, n)); if (n === focusDay) return; focusDay = n; renderGalDay(); const d = DAYS[n]; tone(P[d && d.lines.length ? noteOf(d.lines[0]) : 2], 0, 1.8, .035, .02); }
let gWheel = 0;
$('#gal').addEventListener('wheel', e => { e.preventDefault(); const now = performance.now(); if (now < gWheel || Math.abs(e.deltaY) < 4) return; gWheel = now + 420; galGo(focusDay + Math.sign(e.deltaY)); }, {passive:false});
addEventListener('keydown', e => { if (current !== 'galaxy' || unfoldOn || e.target.tagName === 'INPUT') return; if (e.key === 'ArrowUp' || e.key === 'ArrowDown'){ e.preventDefault(); galGo(focusDay + (e.key === 'ArrowUp' ? -1 : 1)); } });

/* ----- stellar dust: the waves become the galaxy ----- */
const GN = 2100, dust = [], FAR = [[.86,.18,.9],[.12,.2,.7],[.78,.84,.8],[.2,.82,.6],[.6,.1,.5],[.95,.55,.55]];
for (let k = 0; k < GN; k++){
  const kind = k < 1500 ? 'arm' : k < 1800 ? 'field' : 'far';
  dust.push({kind, arm: k % 3, u: Math.pow(Math.random(), .7), n: (Math.random() - .5), z: Math.random(), tw: Math.random()*6.28,
    fx: Math.random(), fy: Math.random(), g: k % FAR.length, d: Math.random() * .35, sx: 0, sy: 0});
}
function dustTarget(p, tt){
  if (p.kind === 'field') return [p.fx * W, p.fy * H];
  if (p.kind === 'far'){                               // small far galaxies: little tilted spirals
    const [fx, fy, sc] = FAR[p.g], r = 26 * sc * (.15 + p.u), a = (p.arm * Math.PI) + p.u * 5 + p.n * .8 + tt * .02;
    return [W*fx + Math.cos(a) * r * 1.6, H*fy + Math.sin(a) * r * .55];
  }
  const R = Math.max(W, H) * .44, r = R * (.05 + .95 * p.u), a = p.arm * 2.094 + p.u * 4.4 + p.n * (.5 + p.u * .6) + tt * .035 * (1.2 - p.u);
  return [gC.x + Math.cos(a) * r, gC.y + Math.sin(a) * r * .5];
}
let gStart = 0, gRAF = 0, gOn = false, gMorph = true;
/* V02.10.3: cloth-like veils and blurred waves drifting behind the dust (drawn small and blurred, then stretched) */
const gbg = document.createElement('canvas'), gbx = gbg.getContext('2d'), GS = 5;
function gbgSize(){ gbg.width = Math.ceil(W/GS); gbg.height = Math.ceil(H/GS); gbx.setTransform(1/GS,0,0,1/GS,0,0); }
addEventListener('resize', gbgSize); gbgSize();
const VEILS = [{y:.34, a:.09, k:.7, s:.12, p:.3, th:.16, al:1}, {y:.62, a:.07, k:1.05, s:-.09, p:2.2, th:.12, al:.8}, {y:.5, a:.11, k:.5, s:.07, p:4.4, th:.2, al:.6}];
const SOFTW = [{y:.28, a:.05, k:1.4, s:.2, p:1}, {y:.47, a:.06, k:1.1, s:-.16, p:2.6}, {y:.7, a:.05, k:1.7, s:.13, p:5}];
function veilY(v, x, tt, edge){                        // two edges with different phases: the sheet folds and twists like cloth
  const n = x / W, ph = edge ? 1.7 : 0;
  return H * (v.y + v.a * Math.sin(n * v.k * 6.283 + tt * v.s + v.p + ph * .35) + v.a * .45 * Math.sin(n * v.k * 13 - tt * v.s * 1.7 + v.p * 2 + ph)
    + (edge ? v.th * (.55 + .45 * Math.sin(n * 5.1 + tt * v.s * 1.3 + v.p)) : 0));
}
function drawVeils(tt, show, wr, wg, wb){
  if (show < .01) return;
  const A = show * (pal.dark ? 1 : .7);
  gbx.clearRect(0, 0, W, H); const st = W / 40;
  for (const v of VEILS){
    const top = [], bot = [];
    for (let x = -st; x <= W + st; x += st){ top.push([x, veilY(v, x, tt, 0)]); bot.push([x, veilY(v, x, tt, 1)]); }
    bgxFill(top, bot, `rgba(${wr},${wg},${wb},${.07 * v.al * A})`, 4);
    bgxFill(top, top.map(([x, y], i) => [x, y + (bot[i][1] - y) * .3]), `rgba(${wr},${wg},${wb},${.06 * v.al * A})`, 1.5);   // the fold's brighter edge
  }
  gbx.filter = 'blur(3px)'; gbx.lineCap = 'round';
  for (const w of SOFTW){                               // soft, blurred waves
    gbx.strokeStyle = `rgba(${wr},${wg},${wb},${.11 * A})`; gbx.lineWidth = 16; gbx.beginPath();
    for (let x = -st; x <= W + st; x += st){ const n = x / W, y = H * (w.y + w.a * Math.sin(n * w.k * 6.283 + tt * w.s + w.p) + w.a * .4 * Math.sin(n * w.k * 15 - tt * w.s * 1.4)); x <= -st + 1 ? gbx.moveTo(x, y) : gbx.lineTo(x, y); }
    gbx.stroke();
  }
  gbx.filter = 'none';
  gcx.globalCompositeOperation = 'source-over'; gcx.drawImage(gbg, 0, 0, W, H);
}
function bgxFill(top, bot, col, blur){
  gbx.filter = `blur(${blur}px)`; gbx.fillStyle = col; gbx.beginPath();
  top.forEach(([x, y], i) => i ? gbx.lineTo(x, y) : gbx.moveTo(x, y));
  for (let i = bot.length - 1; i >= 0; i--) gbx.lineTo(bot[i][0], bot[i][1]);
  gbx.closePath(); gbx.fill(); gbx.filter = 'none';
}
function startGalaxy(){
  gOn = true; gArrived = false; gCentre(); buildPlanets(); renderGalDay();
  document.body.classList.add('in-galaxy'); galSp.classList.remove('arrived'); dimTarget = 0;   // the waves give themselves to the dust
  gMorph = morphOn && !reduce;
  for (const p of dust){                               // every grain starts on the waves as they are right now
    const rb = ribbons[Math.floor(Math.random() * ribbons.length)], x = Math.random() * W;
    p.sx = x; p.sy = yAt(rb, x, Math.floor(Math.random() * rb.strands), t);
  }
  gStart = performance.now(); cancelAnimationFrame(gRAF); gRAF = requestAnimationFrame(galaxyFrame);
  const arrive = () => { if (current !== 'galaxy') return; gArrived = true; galSp.classList.add('arrived'); tone(P[7],0,3,.04,.3); tone(P[11],.4,3,.03,.2); };
  if (gMorph) setTimeout(arrive, 5000); else arrive();
}
function stopGalaxy(){ gOn = false; document.body.classList.remove('in-galaxy'); const gn = document.getElementById('gNew'); if (gn){ gn.classList.remove('on'); $('#gPlus').classList.remove('open'); } setTimeout(() => { if (!gOn){ cancelAnimationFrame(gRAF); gcx.clearRect(0,0,W,H); } }, 900); }
function galaxyFrame(now){
  if (!gOn && !document.body.classList.contains('in-galaxy')){ /* fading out */ }
  const tt = (now - gStart) / 1000, k0 = gMorph ? Math.min(1, tt / 5) : 1, [wr,wg,wb] = pal.wave;
  gcx.clearRect(0, 0, W, H);
  drawVeils(tt, ease((k0 - .35) / .65), wr, wg, wb);
  gcx.globalCompositeOperation = pal.dark ? 'lighter' : 'source-over';
  const core = gcx.createRadialGradient(gC.x, gC.y, 0, gC.x, gC.y, Math.min(W,H) * .42);   // the galaxy's soft core
  core.addColorStop(0, `rgba(${wr},${wg},${wb},${(pal.dark ? .16 : .08) * ease(k0)})`); core.addColorStop(1, `rgba(${wr},${wg},${wb},0)`);
  gcx.fillStyle = core; gcx.fillRect(0, 0, W, H);
  for (const p of dust){
    let k = clamp01((k0 - p.d) / (1 - .35)); const e = sineEase(k), [tx, ty] = dustTarget(p, tt);
    // each grain leaves its wave, swirls once around the centre and settles into the dust
    const mx = (p.sx + tx)/2 + (p.sy - ty) * .35, my = (p.sy + ty)/2 - (p.sx - tx) * .2;
    const x = (1-e)*(1-e)*p.sx + 2*(1-e)*e*mx + e*e*tx, y = (1-e)*(1-e)*p.sy + 2*(1-e)*e*my + e*e*ty;
    const tw = .55 + .45 * Math.sin(tt * 1.4 + p.tw);
    const base = p.kind === 'field' ? .35 : p.kind === 'far' ? .5 : .55, fade = p.kind === 'arm' ? (1 - p.u * .55) : 1;
    gcx.fillStyle = `rgba(${wr},${wg},${wb},${(pal.dark ? 1.5 : 1.15) * base * fade * tw * (.35 + .65 * p.z) * (k < 1 ? .5 + .5*k : 1)})`;
    const s = p.kind === 'far' ? .6 + p.z * .7 : .7 + p.z * 1.5;
    gcx.fillRect(x - s/2, y - s/2, s, s);
  }
  if (planets.length) planetsFrame(now);
  gRAF = requestAnimationFrame(galaxyFrame);
}
const galBtn = document.getElementById('galBtn');
if (galBtn) galBtn.addEventListener('click', () => { galaxyOn = !galaxyOn; galBtn.textContent = 'Record: ' + (galaxyOn ? 'galaxy' : 'classic'); });

/* ---------- Habits › + : pick the emoji from a list instead of typing it ---------- */
const EMO = ['🏊🏽','🚴🏽','🧘🏽‍♂️','🏃🏽','🥾','⚽','🎾','🏋🏽‍♂️','📚','📘','✍🏽','💻','🎸','🎹','🎨','📷','🧑🏽‍🍳','🌱','💧','😴','🧹','🗣️','🇨🇵','🙏🏽'];
$('#emoPick').innerHTML = EMO.map((e, i) => `<button type="button" role="radio" aria-checked="false" data-e="${e}" aria-label="Emoji ${i+1}">${e}</button>`).join('');
$('#emoPick').querySelectorAll('button').forEach(b => b.addEventListener('click', () => {
  $('#emoPick').querySelectorAll('button').forEach(x => x.setAttribute('aria-checked', x === b)); $('#nhEmoji').value = b.dataset.e; hoverTick();
}));
$('#newH').addEventListener('submit', () => setTimeout(() => $('#emoPick').querySelectorAll('button').forEach(x => x.setAttribute('aria-checked', 'false')), 0));
