/* ---------- v02.9.1: entering a space, PS3 XMB style ----------
   The waves gather into Mia's light (top) and the space's icon (left); the other spaces wait below it,
   almost invisible. The space's content starts only when the gathering has ended. */
const ICONS = {
  calendar:    '<rect x="8" y="11" width="32" height="29" rx="3"/><path d="M8 19H40M16 7V14M32 7V14"/><path d="M15 26h.01M24 26h.01M33 26h.01M15 33h.01M24 33h.01"/>',
  record:      '<rect x="13" y="7" width="22" height="7" rx="2"/><rect x="9" y="17" width="30" height="14" rx="2.5"/><rect x="13" y="34" width="22" height="7" rx="2"/>',
  habits:      '<rect x="15" y="9" width="18" height="28" rx="4"/><path d="M12 14.5 6.5 16.5 11 38l10 2.5M36 14.5l5.5 2L37 38l-10 2.5"/>',
  seasons:     '<path d="M5 27C12 15 19 37 26 25S38 17 43 24"/><path d="M11 14h.01M19 11h.01M30 13h.01M38 33h.01M15 36h.01M27 38h.01"/>',
  experiments: '<path d="M7 38C17 38 17 24 25 24C31 24 33 14 41 14M25 24C31 24 33 34 41 34"/><circle cx="7" cy="38" r="2"/><circle cx="41" cy="14" r="2"/><circle cx="41" cy="34" r="2"/>',
};
// v02.9.3: a second set, closer to the PS3 icons: solid soft shapes with a light-to-shade gradient
const ICONS_XMB = {
  calendar:    '<rect class="f2" x="6" y="11" width="36" height="31" rx="4.5"/><path class="f1" d="M10.5 11h27a4.5 4.5 0 0 1 4.5 4.5V20H6v-4.5A4.5 4.5 0 0 1 10.5 11Z"/><rect class="f1" x="14" y="6" width="4.4" height="9.5" rx="2.2"/><rect class="f1" x="29.6" y="6" width="4.4" height="9.5" rx="2.2"/><rect class="f1" x="12" y="25" width="6" height="5" rx="1.2"/><rect class="f1" x="21" y="25" width="6" height="5" rx="1.2"/><rect class="f1" x="30" y="25" width="6" height="5" rx="1.2"/><rect class="f1" x="12" y="33" width="6" height="5" rx="1.2"/><rect class="f1" x="21" y="33" width="6" height="5" rx="1.2"/>',
  record:      '<rect class="f3" x="12" y="5" width="24" height="8" rx="2.5"/><rect class="f1" x="7" y="16" width="34" height="16" rx="3.5"/><rect class="cut" x="12" y="21.5" width="20" height="2" rx="1"/><rect class="cut" x="12" y="26" width="13" height="2" rx="1"/><rect class="f3" x="12" y="35" width="24" height="8" rx="2.5"/>',
  habits:      '<rect class="f3" x="8.5" y="12" width="17" height="27" rx="3.5" transform="rotate(-15 17 25.5)"/><rect class="f3" x="22.5" y="12" width="17" height="27" rx="3.5" transform="rotate(15 31 25.5)"/><rect class="f1" x="14.5" y="8" width="19" height="30" rx="4"/><circle class="cut" cx="24" cy="18" r="3.2"/><rect class="cut" x="19" y="25" width="10" height="7" rx="3"/>',
  seasons:     '<path class="f1" d="M3 29C11 15 18 37 25.5 24.5S37.5 13 45 21.5V27C38 20 32.5 29 26.5 31.5S12 27 3 35.5Z"/><circle class="f2" cx="11" cy="13" r="2"/><circle class="f2" cx="20" cy="10" r="1.6"/><circle class="f2" cx="32" cy="12" r="2.2"/><circle class="f2" cx="38" cy="36" r="1.8"/><circle class="f2" cx="16" cy="40" r="1.6"/>',
  experiments: '<path class="st" d="M8 38C17 38 17 24 25 24C31 24 33 14 40 14"/><path class="st s2" d="M25 24C31 24 33 34 40 34"/><circle class="f1" cx="8" cy="38" r="4"/><circle class="f1" cx="40" cy="14" r="4"/><circle class="f2" cx="40" cy="34" r="4"/>',
};
// v02.10: a third set, the most minimal: one or two thin strokes each (the default)
const ICONS_MIN = {
  calendar:    '<rect x="10" y="12" width="28" height="26" rx="2.5"/><path d="M10 20h28"/>',
  record:      '<path d="M12 16h24M12 24h24M12 32h15"/>',
  habits:      '<rect x="16" y="10" width="16" height="28" rx="3"/>',
  seasons:     '<path d="M6 26c6-9 12-9 18 0s12 9 18 0"/>',
  experiments: '<path d="M8 31h13M21 31l15-13M21 31l15 6"/>',
  plan:        '<path d="M11 15l2 2 4-4M11 25l2 2 4-4M12 35h4M22 15h15M22 25h15M22 35h11"/>',
};
ICONS.plan = '<rect x="9" y="7" width="30" height="35" rx="3"/><path d="M15 17l2.5 2.5L22 15M15 27l2.5 2.5L22 25M15 36h5M26 18h8M26 28h8M26 36h6"/>';
ICONS_XMB.plan = '<rect class="f2" x="9" y="7" width="30" height="35" rx="4"/><rect class="f1" x="13" y="12" width="7" height="7" rx="1.5"/><rect class="f1" x="13" y="23" width="7" height="7" rx="1.5"/><rect class="f3" x="13" y="34" width="7" height="5" rx="1.5"/><rect class="f1" x="24" y="14" width="11" height="3" rx="1.5"/><rect class="f1" x="24" y="25" width="11" height="3" rx="1.5"/><rect class="f3" x="24" y="35" width="8" height="3" rx="1.5"/>';
let iconSet = 'min';
const XORDER = ['calendar','record','habits','seasons','experiments'];
const XLABEL = {calendar:'Calendar', record:'Record', habits:'Habits', seasons:'Seasons', experiments:'Experiments', plan:'Plan'};
const ARRIVE = {calendar:2300, record:1800, habits:4700, seasons:2200, experiments:1800, plan:1700, galaxy:5000};   // v02.10.1: content waits for each opening animation to end   // ms until the content starts

const xmb = document.createElement('div'); xmb.className = 'xmb'; xmb.id = 'xmb';
xmb.innerHTML = '<button class="mia" id="miaOrb" aria-label="Talk to Mia"><i></i></button><div class="xsel" id="xsel"></div><div class="xlist" id="xlist" aria-label="Other spaces"></div>';
document.body.appendChild(xmb);
// the gradient the solid icons are painted with; it follows the day colours through --fg
const xdefs = document.createElementNS('http://www.w3.org/2000/svg','svg'); xdefs.setAttribute('class','xdefs'); xdefs.setAttribute('aria-hidden','true');
xdefs.innerHTML = '<defs><linearGradient id="xg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="currentColor" stop-opacity="1"/><stop offset=".55" stop-color="currentColor" stop-opacity=".82"/><stop offset="1" stop-color="currentColor" stop-opacity=".55"/></linearGradient></defs>';
document.body.appendChild(xdefs);
const fx = document.createElement('canvas'); fx.id = 'xmbfx'; fx.setAttribute('aria-hidden','true'); document.body.appendChild(fx);
const fcx = fx.getContext('2d');
function fxSize(){ fx.width = W*dpr; fx.height = H*dpr; fcx.setTransform(dpr,0,0,dpr,0,0); }
addEventListener('resize', fxSize); fxSize();

function xIcon(name, big){
  const b = document.createElement('button'); b.className = 'xi' + (big ? ' big' : ''); b.dataset.space = name;
  b.setAttribute('aria-label', XLABEL[name]); if (big) b.setAttribute('aria-current', 'true');
  const set = iconSet === 'xmb' ? ICONS_XMB : iconSet === 'min' ? ICONS_MIN : ICONS;
  b.innerHTML = `<svg viewBox="0 0 48 48" aria-hidden="true" class="${iconSet === 'xmb' ? 'fs' : iconSet === 'min' ? 'mn' : ''}">${set[name]}</svg>` + (big ? '' : `<span>${XLABEL[name]}</span>`);
  if (!big){ b.addEventListener('click', () => open(name, b)); b.addEventListener('mouseenter', navTick); }
  return b;
}
function xmbRender(name){
  $('#xsel').replaceChildren(xIcon(name, true));
  $('#xlist').replaceChildren(...XORDER.filter(n => n !== name && !(name === 'galaxy' && n === 'record')).map(n => xIcon(n, false)));
}

let gather = null, gatherRAF = 0, afterQ = [], arriveTm = 0, shownTm = 0;
function xmbAfter(fn){ afterQ.push(fn); }
function homeOrbPoint(){                       // a point inside Mia's circle on home
  const r = $('#miaHome').getBoundingClientRect(), a = Math.random()*6.283, d = Math.sqrt(Math.random())*r.width*.3;
  return [r.left + r.width/2 + Math.cos(a)*d, r.top + r.height/2 + Math.sin(a)*d];
}
function wavePoint(){
  const rb = ribbons[Math.floor(Math.random()*ribbons.length)], x = Math.random()*W;
  return [x, yAt(rb, x, Math.floor(Math.random()*rb.strands), t)];
}
function gatherTargets(){                       // points on Mia's light and along the icon's lines
  const pts = [], orb = $('#miaOrb').getBoundingClientRect(), ox = orb.left + orb.width/2, oy = orb.top + orb.height/2;
  for (let i=0;i<110;i++){ const a = Math.random()*6.283, r = Math.pow(Math.random(),2)*14; pts.push([ox + Math.cos(a)*r, oy + Math.sin(a)*r]); }
  const svg = $('#xsel svg'); if (!svg) return pts;
  const shapes = [...svg.querySelectorAll('path,rect,circle')];
  for (let i=0;i<200;i++){
    const el = shapes[i % shapes.length], L = el.getTotalLength(), q = el.getPointAtLength(Math.random()*L);
    const p = new DOMPoint(q.x, q.y).matrixTransform(el.getScreenCTM()); pts.push([p.x, p.y]);
  }
  return pts;
}
function runGather(reverse, fromHome){
  cancelAnimationFrame(gatherRAF);
  const tg = gatherTargets();
  gather = {start: performance.now(), dur: reverse ? 1100 : 1500, reverse,           // Mia's light comes from her circle on home
    parts: tg.map((e,i) => { const h = fromHome && i < 110; return {s: h ? homeOrbPoint() : wavePoint(), e, d: Math.random()*(h ? .12 : .32), z: Math.random(), lift: h ? 10 + Math.random()*30 : 40 + Math.random()*110}; })};
  const loop = now => {
    fcx.clearRect(0,0,W,H);
    if (!gather) return;
    const k0 = (now - gather.start) / gather.dur, [wr,wg,wb] = pal.wave;
    fcx.globalCompositeOperation = pal.dark ? 'lighter' : 'source-over';
    for (const p of gather.parts){
      let k = clamp01((k0 - p.d) / (1 - .32)); if (gather.reverse) k = 1 - k;
      const e = sineEase(k), [sx,sy] = p.s, [ex,ey] = p.e;
      const cxp = (sx + ex)/2, cyp = Math.min(sy, ey) - p.lift;          // each mote arcs up, then settles
      const x = (1-e)*(1-e)*sx + 2*(1-e)*e*cxp + e*e*ex, y = (1-e)*(1-e)*sy + 2*(1-e)*e*cyp + e*e*ey;
      const a = (gather.reverse ? 1 : (1 - ease((k - .82) / .18))) * (.35 + .65*Math.sin(Math.PI*Math.min(1, k*1.1 + .05)));
      fcx.fillStyle = `rgba(${wr},${wg},${wb},${(pal.dark?.85:.6)*a*(.4+p.z*.6)})`;
      fcx.beginPath(); fcx.arc(x, y, .6 + p.z*1.5, 0, 6.283); fcx.fill();
    }
    if (k0 >= 1.02){ gather = null; fcx.clearRect(0,0,W,H); return; }
    gatherRAF = requestAnimationFrame(loop);
  };
  gatherRAF = requestAnimationFrame(loop);
}
function xmbEnter(name, fromHome){
  xmbRender(name);
  clearTimeout(arriveTm); clearTimeout(shownTm);
  xmb.classList.remove('shown'); document.body.classList.add('arriving');
  const arrive = () => { document.body.classList.remove('arriving'); const q = afterQ; afterQ = []; q.forEach(f => f()); };
  if (!morphOn || reduce){ xmb.classList.add('shown'); arrive(); return; }
  // V02.10.4: like Record, every space plays its own opening first; the side menu and the content appear only when it ends
  shownTm = setTimeout(() => xmb.classList.add('shown'), ARRIVE[name] || 1800);         // the icon and the light appear as the motes settle
  arriveTm = setTimeout(arrive, ARRIVE[name] || 1800);
}
function xmbLeave(){
  clearTimeout(arriveTm); clearTimeout(shownTm); afterQ = [];
  document.body.classList.remove('arriving');
  const was = xmb.classList.contains('shown'); xmb.classList.remove('shown');
  // (no gather back either: the waves simply return)                       // the light and the icon return to the waves
}
// prototype: switch between the two icon sets
const iconsBtn = document.getElementById('iconsBtn');
if (iconsBtn) iconsBtn.addEventListener('click', () => { iconSet = {min:'xmb', xmb:'line', line:'min'}[iconSet]; iconsBtn.textContent = 'Icons: ' + {min:'minimal', xmb:'solid', line:'line'}[iconSet]; if (current) xmbRender(current); });
