/* ---------- record: the v0.1 day flow ---------- */
const NB = [[0,1,1,0],[175,.36,.9,.4],[245,.26,.7,.8],[300,.19,.5,1.2],[342,.14,.32,1.6],[375,.10,.18,2]]; // offset, scale, opacity, blur
const WD = ['sunday','monday','tuesday','wednesday','thursday','friday','saturday'];
const flowEl = $('#flow'), cards = new Map();
let focusDay = TODAY, wheelLock = 0;
function cardFor(n){
  if (cards.has(n)) return cards.get(n);
  const c = document.createElement('div'); c.className = 'dc'; c.dataset.n = n;
  c.addEventListener('click', () => { if (n !== focusDay) go(n); });
  flowEl.insertBefore(c, flowEl.firstChild); cards.set(n, c); return c;
}
function fillCard(n){
  const c = cardFor(n), d = DAYS[n];
  const ems = d && d.lines.length ? `<span class="ems">${emOf(d.lines).join(' ')}</span>` : `<span class="hint">Drag a habit here</span>`;
  const shown = d ? Math.min(d.lines.length, d.shown ?? d.lines.length) : 0;
  c.innerHTML = `${ems}<span class="trail">${'<i></i>'.repeat(shown)}</span><span class="num">${n}</span>`;
  const b = Math.min(1, shown/5) * .55;                       // the day warms a little as it fills (subtle)
  c.style.background = `rgb(${mix([236,231,220],[233,214,180],b)})`;
}
function layoutFlow(){
  for (let n=1;n<=31;n++){
    const dist = n - focusDay, ad = Math.abs(dist);
    if (ad > 5){ if (cards.has(n)) { const c = cards.get(n); c.style.opacity = 0; c.style.pointerEvents = 'none'; c.style.transform = `translateY(${Math.sign(dist)*420}px) scale(.08)`; } continue; }
    fillCard(n);
    const c = cards.get(n), [off,sc,op,bl] = NB[ad];
    c.classList.toggle('focus', ad === 0);
    c.style.pointerEvents = 'auto';
    c.style.transform = `translateY(${Math.sign(dist)*off}px) scale(${sc})`;
    c.style.opacity = op; c.style.filter = bl ? `blur(${bl}px)` : 'none'; c.style.zIndex = 10 - ad;
  }
  const date = new Date(2026, 9, focusDay);
  $('#fdate').innerHTML = `${String(focusDay).padStart(2,'0')} oct 2026<span>${WD[date.getDay()]}</span>`;
  renderSide();
}
function renderSide(newIdx){
  const d = DAYS[focusDay] || {lines:[], title:''};
  $('#fside').innerHTML = `<input id="dtitle" placeholder="Name this day" value="${(d.title||'').replace(/"/g,'&quot;')}" aria-label="Day title">` +
    d.lines.map((l,i) => `<p class="${i===newIdx?'new':''}">${l}</p>`).join('');
  $('#dtitle').addEventListener('input', e => { DAYS[focusDay] = DAYS[focusDay] || {lines:[], title:''}; DAYS[focusDay].title = e.target.value; emit('day:title', {day: focusDay, title: e.target.value}); });
}
function go(n){
  n = Math.max(1, Math.min(31, n)); if (n === focusDay) return;
  focusDay = n; layoutFlow();
  const d = DAYS[n]; tone(P[d && d.lines.length ? noteOf(d.lines[0]) : 2], 0, 1.8, .035, .02);
}
flowEl.addEventListener('wheel', e => { e.preventDefault(); const now = performance.now(); if (now < wheelLock || Math.abs(e.deltaY) < 4) return; wheelLock = now + 420; go(focusDay + Math.sign(e.deltaY)); }, {passive:false});
// tray of habit tiles
const tray = $('#tray'); flowEl.appendChild(tray);          // v02.10: tiles to the left of the day
function makeTile(h,i){
  const b = document.createElement('button'); b.className = 'tile'; b.innerHTML = `<span>${h.e}</span>`; b.setAttribute('aria-label', h.name);
  b.addEventListener('pointerdown', ev => startDrag(ev, i, b));
  b.addEventListener('mouseenter', hoverTick);
  tray.insertBefore(b, tray.lastElementChild);
}
HABITS.forEach(makeTile);
let drag = null, armed = null;
function flyMote(fromEl, dayN){             // a petal of light travels from the tile into the day
  const card = cards.get(dayN); if (!fromEl || !card) return;
  const a = fromEl.getBoundingClientRect(), b = card.getBoundingClientRect();
  const x0 = a.left + a.width/2, y0 = a.top + a.height/2;
  const x1 = b.left + 20 + (DAYS[dayN].lines.length-1)*12, y1 = b.bottom - 18;
  const mx0 = (x0 + x1)/2 - 60, my0 = Math.min(y0, y1) - 140;
  const m = document.createElement('div'); m.className = 'mote'; document.body.appendChild(m);
  const anim = m.animate([
    {transform:`translate(${x0}px,${y0}px) scale(.5)`, opacity:0},
    {transform:`translate(${mx0}px,${my0}px) scale(1.25)`, opacity:1, offset:.45},
    {transform:`translate(${x1}px,${y1}px) scale(.7)`, opacity:.95}], {duration:1300, easing:'cubic-bezier(.33,.0,.2,1)'});
  tone(P[11], .2, 2.4, .02, .05);
  anim.onfinish = () => { m.remove(); delete DAYS[dayN].shown; fillCard(dayN); tone(P[12], 0, 1.8, .02, .01); };
}
function startDrag(ev, i, tile){
  ev.preventDefault();
  drag = {i, x0:ev.clientX, y0:ev.clientY, ghost:null};
  tile.setPointerCapture(ev.pointerId);
  const focusCard = () => cards.get(focusDay);
  tile.onpointermove = e => {
    if (!drag) return;
    if (!drag.ghost && Math.hypot(e.clientX-drag.x0, e.clientY-drag.y0) > 5){
      const g = document.createElement('div'); g.className = 'ghost'; g.textContent = HABITS[i].e; document.body.appendChild(g); drag.ghost = g;
      tone(P[HABITS[i].note],0,1.6,.035,.01);
    }
    if (drag.ghost){
      drag.ghost.style.left = e.clientX+'px'; drag.ghost.style.top = e.clientY+'px';
      const over = document.elementFromPoint(e.clientX, e.clientY)?.closest('.dc');
      focusCard()?.classList.toggle('hot', !!over && +over.dataset.n === focusDay);
    }
  };
  tile.onpointerup = e => {
    tile.onpointermove = tile.onpointerup = null;
    focusCard()?.classList.remove('hot');
    if (drag && drag.ghost){
      drag.ghost.remove();
      const over = document.elementFromPoint(e.clientX, e.clientY)?.closest('.dc');
      if (over) { if (+over.dataset.n !== focusDay) go(+over.dataset.n); const r = cards.get(focusDay).getBoundingClientRect(); unfoldAt(r.left+r.width/2, r.top+r.height/2, i, focusDay); }
    } else {
      const r = cards.get(focusDay).getBoundingClientRect(); unfoldAt(r.left+r.width/2, r.top+r.height/2, i, focusDay);   // a tap logs onto the focused day
    }
    drag = null;
  };
}

/* ---------- unfolding choices ---------- */
const DUR = [5,10,15,20,30,45,60,90], QUAL = ['quick','scattered','regular','good','great','powerful'];
const fmt = m => { const h = Math.floor(m/60), r = m%60; if (!h) return `${r}min`; const hs = h===1?'1hr':`${h}hrs`; return r ? `${hs} ${r}min` : hs; };
const layer = $('#unfold'); let unfoldOn = false;
function cancelUnfold(){ unfoldOn = false; layer.classList.remove('on'); layer.innerHTML = ''; }
layer.addEventListener('click', e => { if (e.target === layer) cancelUnfold(); });
function ringOpts(cx0, cy0, labels, onPick, pre = -1){
  layer.querySelectorAll('.opt,.spoke').forEach(o => o.remove());
  const n = labels.length, R = n > 6 ? 150 : 130;
  labels.forEach((lab,i) => {
    const a = -Math.PI/2 + i*(2*Math.PI/n), x = cx0 + Math.cos(a)*R, y = cy0 + Math.sin(a)*R;
    const sp = document.createElement('div'); sp.className = 'spoke';
    sp.style.left = cx0+'px'; sp.style.top = cy0+'px'; sp.style.width = (R-30)+'px'; sp.style.transform = `rotate(${a}rad)`;
    const o = document.createElement('button'); o.className = 'opt' + (i === pre ? ' pre' : ''); o.textContent = lab;   // V02.13: the likely answer is already lit
    o.style.left = cx0+'px'; o.style.top = cy0+'px';
    o.addEventListener('click', ev => { ev.stopPropagation(); pick(i); onPick(i); });
    o.addEventListener('mouseenter', hoverTick);
    layer.append(sp,o);
    setTimeout(() => { sp.classList.add('in'); o.classList.add('in'); o.style.left = x+'px'; o.style.top = y+'px'; }, 40 + i*45);
  });
}
function unfoldAt(x, y, hi, dayN){
  const cx0 = Math.min(Math.max(x, 200), innerWidth-200), cy0 = Math.min(Math.max(y, 190), innerHeight-190);
  const h = HABITS[hi];
  unfoldOn = true; layer.classList.add('on');
  layer.innerHTML = `<div class="hub" style="left:${cx0}px;top:${cy0}px">${h.e}</div>`;
  tone(P[h.note],0,2.4,.06,.02);
  ringOpts(cx0, cy0, DUR.map(fmt), di => {
    const dur = DUR[di];
    ringOpts(cx0, cy0, QUAL, qi => {
      const q = QUAL[qi];
      const line = `${/^[aeiou]/i.test(q)?'AN':'A'} ${q.toUpperCase()} ${h.name.toUpperCase()}${h.e} (${fmt(dur)})`;
      DAYS[dayN] = DAYS[dayN] || {lines:[], title:''};
      DAYS[dayN].lines.push(line); emit('line:add', {day: dayN, line});
      if (dayN === TODAY) traces.push({life:0});
      cancelUnfold(); ringAt(cx0, cy0);
      tone(P[h.note],0,3,.07,.02); tone(P[Math.min(12,h.note+3)],.2,3,.05,.02);
      if (current === 'record' && !reduce){ DAYS[dayN].shown = DAYS[dayN].lines.length - 1; fillCard(dayN); flyMote(tray.children[hi], dayN); }
      else fillCard(dayN);
      renderSide(DAYS[dayN].lines.length-1); buildCal();
      showUndo(cx0, cy0, () => undoAdd(dayN, line));   // V02.13: a quiet undo, never a confirmation
    }, dur <= 10 ? 0 : -1);                                // short sessions: QUICK already lit
  });
}

