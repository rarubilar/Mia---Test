/* ---------- habits: rotating cards → detail ---------- */
const carousel = $('#carousel'); let selH = 0;
function rng(seed){ return () => { seed = (seed*16807) % 2147483647; return seed/2147483647; }; }
function sketchPath(w, h, r, seed, j){      // a hand-drawn rounded rectangle: the outline wobbles a little
  const rand = rng(seed), pts = [];
  for (let k=0;k<=96;k++){ const [x,y] = rrPoint(1.5, 1.5, w-3, h-3, r, k/96); pts.push([x + (rand()-.5)*j, y + (rand()-.5)*j]); }
  return 'M' + pts.map(p => p.map(v => v.toFixed(1)).join(',')).join(' L');
}
function sketchCircle(cx0, cy0, rad, seed, j){
  const rand = rng(seed), pts = []; const turns = 1.08;
  for (let k=0;k<=70;k++){ const a = -1.2 + k/70*Math.PI*2*turns, rr = rad + (rand()-.5)*j; pts.push([cx0 + Math.cos(a)*rr, cy0 + Math.sin(a)*rr]); }
  return 'M' + pts.map(p => p.map(v => v.toFixed(1)).join(',')).join(' L');
}
function makeCard(h,i){
  const f = INFO[h.name], b = document.createElement('button'); b.className = 'hc';
  const [bg, ink] = CARDCOL[h.name]; b.style.setProperty('--c', bg); b.style.setProperty('--k', ink);
  b.style.setProperty('--w', Math.max(4, Math.round(f.days.length/31*100*2.4)) + '%');   // the scarf: grows with this month's practice
  b.innerHTML = `<svg class="sk" viewBox="0 0 295 425" preserveAspectRatio="none" aria-hidden="true">
      <path d="${sketchPath(295,425,18,11+i*7,1.6)}" fill="none" stroke="currentColor" stroke-opacity=".38" stroke-width="1.1"/>
      <path d="${sketchPath(295,425,18,29+i*5,2.4)}" fill="none" stroke="currentColor" stroke-opacity=".18" stroke-width=".8"/></svg>
    <div class="top"><span class="mk">${h.e}</span><span>HABIT 0${i+1}</span></div>
    <div class="av"><span>${h.e}</span><small>avatar</small></div>
    <h3>${h.name}.</h3><p class="por">${f.portrait}</p>
    <div class="foot"><span class="scarf"><b>OCT</b><i></i></span><span class="pill">Open →</span></div>`;
  b.addEventListener('click', () => { if (i === selH) openHabit(i); else { selH = i; layoutCarousel(); tone(P[h.note],0,2,.045,.02); answer(); } });
  carousel.appendChild(b); return b;
}
const hcards = HABITS.map(makeCard);
const SPARE = [['#C7D3E8','#141922'],['#E4D6A4','#211D0F'],['#CDE0CF','#152017'],['#DDC4E0','#1F1521']];
$('#addH').addEventListener('click', () => { navTick(); $('#newH').classList.toggle('on'); if ($('#newH').classList.contains('on')) $('#nhName').focus(); });
$('#nhCancel').addEventListener('click', () => $('#newH').classList.remove('on'));
$('#newH').addEventListener('submit', e => {
  e.preventDefault();
  const name = $('#nhName').value.trim(); if (!name || HABITS.length >= 12) return;
  const emo = $('#nhEmoji').value.trim() || '✦';
  const label = name[0].toUpperCase() + name.slice(1);
  const i = HABITS.length, h = {name: label, e: emo, note: [3,6,9,12][i%4]};
  HABITS.push(h); emit('habit:create', h); CARDCOL[label] = SPARE[i%SPARE.length]; RELATED[label] = [];
  INFO[label] = {portrait:'New. Mia will learn its shape.', sub:'New habit', days:[], total:'No days yet this month', curve:.02,
    what:'Your own habit. Mia will write this with you.', sci:'Mia will add what research says about it.', src:'—'};
  hcards.push(makeCard(h, i)); makeTile(h, i);
  selH = i; layoutCarousel(); growScarves();
  $('#newH').classList.remove('on'); $('#nhName').value = ''; $('#nhEmoji').value = '';
  const r = hcards[i].getBoundingClientRect(); ringAt(r.left + r.width/2, r.top + r.height/2);
  tone(P[h.note],0,3,.07,.02); tone(P[Math.min(12,h.note+4)],.25,3,.05,.02);
});
function answer(){                            // call and answer: habits that often happen together glow back, softly
  const rel = RELATED[HABITS[selH].name] || [], me = selH;
  setTimeout(() => { if (selH !== me || current !== 'habits') return;
    hcards.forEach((c,i) => { if (rel.includes(HABITS[i].name)){ c.classList.remove('answer'); void c.offsetWidth; c.classList.add('answer'); tone(P[HABITS[i].note], .05, 2.2, .012, .08); } });
  }, 700);
}
function growScarves(){ hcards.forEach(c => c.classList.add('grown')); }
function layoutCarousel(){
  const n = HABITS.length, gap = Math.min(340, Math.max(190, carousel.clientWidth/3.4));
  hcards.forEach((c,i) => {
    let k = ((i - selH) % n + n) % n; if (k > n/2) k -= n;
    const ak = Math.abs(k);
    c.style.transform = `translateX(${k*gap}px) scale(${ak===0?1:ak===1?.74:.58})`;
    c.style.opacity = ak===0 ? 1 : ak===1 ? .55 : ak===2 ? .18 : 0;
    c.style.filter = ak===0 ? 'none' : `blur(${ak*.6}px) saturate(.7)`;
    c.style.zIndex = 10 - ak; c.style.pointerEvents = ak > 1 ? 'none' : 'auto';
    c.tabIndex = ak === 0 ? 0 : -1;
  });
}
function turn(d){ selH = (selH + d + HABITS.length) % HABITS.length; layoutCarousel(); tone(P[HABITS[selH].note],0,2,.045,.02); answer(); }
$('#prevH').addEventListener('click', () => turn(-1));
let hWheel = 0;
carousel.addEventListener('wheel', e => { e.preventDefault(); const now = performance.now(); if (now < hWheel || Math.abs(e.deltaY) < 4) return; hWheel = now + 450; turn(e.deltaY < 0 ? 1 : -1); }, {passive:false});
$('#nextH').addEventListener('click', () => turn(1));
addEventListener('resize', () => { if (current === 'habits') layoutCarousel(); if (current === 'record') layoutFlow(); });
function showHabitMenu(){ $('#hmenu').hidden = false; $('#hview').hidden = true; document.body.classList.add('in-habits'); }
$('#hback').addEventListener('click', () => { showHabitMenu(); layoutCarousel(); closeSound(); });
function curveSVG(pos){
  const pts = []; for (let k=0;k<=60;k++){ const u = k/60, v = 1 - Math.exp(-u*3.2); pts.push([20+u*480, 96-v*76]); }
  const v = 1 - Math.exp(-pos*3.2), dx = 20+pos*480, dy = 96-v*76;
  return `<svg class="curve" viewBox="0 0 520 110" role="img" aria-label="Position on the way to automatic">
    <path d="M${pts.map(p=>p.join(',')).join(' L')}" fill="none" stroke="var(--fg)" stroke-opacity=".35" stroke-width="1"/>
    <circle cx="${dx}" cy="${dy}" r="5" fill="var(--fg)"/><circle cx="${dx}" cy="${dy}" r="11" fill="none" stroke="var(--fg)" stroke-opacity=".3"/>
    <text x="20" y="108" font-family="DM Mono, monospace" font-size="10" letter-spacing="2" fill="var(--fg)" fill-opacity=".5">NEW</text>
    <text x="500" y="108" text-anchor="end" font-family="DM Mono, monospace" font-size="10" letter-spacing="2" fill="var(--fg)" fill-opacity=".5">AUTOMATIC</text></svg>`;
}
function openHabit(i){
  const h = HABITS[i], f = INFO[h.name];
  const cells = Array.from({length:31}, (_,k) => k+1 <= TODAY ? `<button class="${f.days.includes(k+1)?'on':''}" data-d="${k+1}" title="${k+1} Oct · open the day" aria-label="${k+1} October"></button>` : `<i></i>`).join('');   // v02.10: each day is a way into the calendar
  $('#hdetail').innerHTML = `<div class="hd">
    <div class="head"><h3>${h.e} ${h.name}</h3><p class="portrait">${f.portrait}</p></div>
    <div><h4>October</h4><div class="month">${cells}</div><p class="totals">${f.total}</p>
    <h4>On the way to automatic</h4>${curveSVG(f.curve)}</div>
    <div><h4>What it is</h4><p class="body">${f.what}</p>
    <h4>The science</h4><p class="body">${f.sci}</p><p class="src">${f.src}</p>${(f.saved || []).map(x => `<p class="body saved">${x.text}</p><p class="src">${x.src} · saved from a chat with Mia</p>`).join('')}</div></div>`;
  $('#hdetail').querySelectorAll('.month button').forEach(b => b.addEventListener('click', () => openCalendarDay(+b.dataset.d, b)));
  $('#hmenu').hidden = true; $('#hview').hidden = false; document.body.classList.remove('in-habits'); $('#newH').classList.remove('on');
  const r = hcards[i].getBoundingClientRect(); ringAt(r.left+r.width/2, r.top+r.height/2);
  tone(P[h.note],0,3,.07,.02); tone(P[Math.min(12,h.note+2)],.18,3,.05,.02);
}

