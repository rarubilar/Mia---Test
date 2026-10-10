/* ---------- V02.11 · the morning card (V02.11.1: three cards, quieter, waves sink into the background) ----------
   An orange dot rides the home waves with a small sunrise bubble: Mia has your morning ready.
   Press it: the space names leave to the left, the waves spend 3 seconds drawing a card, and the card asks,
   one step at a time: yesterday's quick check → today's plan (adjust it) → one memory to recall.
   At the end, a button opens Plan for the day (Record › Plan), where the same plan lives. */
let mFirst = false, morningOpen = false, morningDone = false, mStep = 0, mRAF = 0;
const SUN = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 17h18M6.5 17a5.5 5.5 0 0 1 11 0M12 6.5V8.5M5.6 9.6l1.4 1.4M18.4 9.6 17 11M2.5 20.5h19"/></svg>';
const mdot = document.createElement('div'); mdot.className = 'mdot'; mdot.id = 'mdot';
mdot.innerHTML = `<div class="mbub" aria-hidden="true"><span class="nmini"><i></i><i></i><i></i></span><span class="mlab">Your morning</span></div><button class="mcore" aria-label="Your morning: yesterday, today's plan and one memory"><i></i></button>`;
document.body.appendChild(mdot);
mdot.querySelector('.mcore').addEventListener('click', openMorning);
mdot.addEventListener('mouseenter', hoverTick);

const mcard = document.createElement('section'); mcard.className = 'mcard'; mcard.id = 'mcard'; mcard.setAttribute('aria-label', 'Your morning');
mcard.innerHTML = `<header><ol class="msteps" aria-hidden="true"><li></li><li></li><li></li></ol>
    <span class="mtag">${WDN[new Date(2026,9,TODAY).getDay()]} ${TODAY} October</span>
    <button class="mx" id="mX" aria-label="Close">×</button></header>
  <div class="mcbody" id="mcBody"></div>`;
document.body.appendChild(mcard);
$('#mX').addEventListener('click', () => closeMorning(false));

/* the dot rides a wave, like a notification, only on home */
function morningDotFrame(){
  const show = introStart !== null && closeStart === null && !document.body.classList.contains('intro') && !current && !chatOn && !modeOn && !subOn && !morningOpen && !morningDone && !settingsOn;
  mdot.classList.toggle('on', show);
  if (show){ const rb = ribbons[0], x = W * .6; mdot.style.left = x + 'px'; mdot.style.top = yAt(rb, x, Math.floor(rb.strands/2) + 2, t) + 'px'; }
  requestAnimationFrame(morningDotFrame);
}
requestAnimationFrame(morningDotFrame);

/* ----- opening: the names leave, the waves draw the card (3 s), then it fills ----- */
function openMorning(){
  if (morningOpen) return;
  initAudio(); morningOpen = true; mStep = 0; mFirst = true;
  document.body.classList.add('morning');
  tone(P[4],0,3.4,.05,.4); tone(P[7],.5,3.4,.04,.4); tone(P[9],1.1,3.6,.035,.4);
  renderStep();
  // V02.11.1: the waves spread out and sink into the background; the card arrives on its own
  shapeTarget = {amp:1.6, spread:3.2, y:.6, flow:.5}; dimTarget = .3;
  clearTimeout(mRAF); mRAF = setTimeout(() => { if (!morningOpen) return; const b = $('#mcBody'); if (b.classList.contains('stagger')){ b.classList.remove('stagger'); void b.offsetWidth; b.classList.add('stagger'); } mcard.classList.add('in'); }, morphOn && !reduce ? 1400 : 0);
}
function closeMorning(done){
  morningOpen = false; if (done) morningDone = true;
  mcard.classList.remove('in'); document.body.classList.remove('morning'); dimTarget = 1; shapeTarget = SHAPES.home;
  clearTimeout(mRAF);
  tone(P[7],0,2.4,.04,.1); tone(P[4],.2,2.8,.04,.2);
}

/* ----- the three steps ----- */
const RECALL = {q: 'Last Saturday you read for a while. How long, more or less?', day: 3, answer: '1 hr 30 min', note: 'READ📘 (1hr 30min) · Slow Saturday'};
let sleepWord = '';
function stepDots(){ mcard.querySelectorAll('.msteps li').forEach((li, i) => { li.classList.toggle('on', i === mStep); li.classList.toggle('done', false); }); }
function renderStep(){
  stepDots();
  const b = $('#mcBody'); b.classList.remove('show'); void b.offsetWidth;
  if (mStep === 0) b.innerHTML = yesterdayHTML();
  if (mStep === 1) b.innerHTML = todayHTML();
  if (mStep === 2) b.innerHTML = recallHTML();
  b.classList.toggle('stagger', mStep === 0 && mFirst); mFirst = false;   // first card, first time: the title alone, the rest 2 s later
  b.classList.add('show'); wireStep();
}
function yesterdayHTML(){
  const y = TODAY - 1, d = DAYS[y] || {lines: []}, wd = WDN[new Date(2026,9,y).getDay()];
  return `<h3>Let's review yesterday</h3><p class="mtiny">${wd} ${y} October</p>${d.title ? `<p class="mdayname">${d.title}</p>` : ''}
    <ul class="mlines">${d.lines.map(l => `<li>${l}</li>`).join('') || '<li class="none">Nothing written yet.</li>'}</ul>
    <p class="mq">Anything missing?</p>
    <div class="mtiles" id="mTiles" hidden>${HABITS.map((h, i) => `<button class="mtile" data-i="${i}" aria-label="${h.name}" title="${h.name}">${h.e}</button>`).join('')}</div>
    <div class="msleep"><span>How did you sleep?</span>${['Deep','Okay','Light','Restless'].map(w => `<button class="mchip${sleepWord === w ? ' on' : ''}">${w}</button>`).join('')}</div>
    <div class="mrow"><button class="mbtn ic" id="mAdd" aria-label="Add something missing" title="Add missing">+</button><button class="mbtn ic go" id="mOk1" aria-label="All good, next" title="Next">›</button></div>`;
}
function todayHTML(){
  const it = PLAN.today;
  return `<h3>Today's plan</h3>
    <ol class="mplan">${it.map((x, i) => `<li class="${x.done ? 'done' : ''}"><span class="pt">${x.t}</span><input class="px" data-i="${i}" value="${x.text.replace(/"/g,'&quot;')}" aria-label="Plan item">${x.e ? `<span class="pe">${x.e}</span>` : ''}<button class="mdel" data-i="${i}" aria-label="Remove">−</button></li>`).join('')}</ol>
    <form class="madd" id="mAddPlan" autocomplete="off"><input id="mAddT" maxlength="5" placeholder="09:00" aria-label="Time"><input id="mAddX" maxlength="60" placeholder="Add something to today" aria-label="What"><button>ADD</button></form>
    <div class="mrow"><button class="mbtn ic" id="mBack" aria-label="Back" title="Back">‹</button><button class="mbtn ic go" id="mOk2" aria-label="Looks good, next" title="Next">›</button></div>`;
}
function recallHTML(){
  return `<h3>One memory</h3><p class="mq big mem">${RECALL.q}</p>
    <div class="mrow wrap" id="mRec">${['10 min','20 min','30 min+'].map(v => `<button class="mbtn rec">${v}</button>`).join('')}<button class="mbtn rec" id="mRecOwn">Enter time</button></div>
    <p class="manswer" id="mAns" hidden></p>
    <div class="mrow"><button class="mbtn ic" id="mBack" aria-label="Back" title="Back">‹</button>
      <span class="mend"><button class="mbtn ic mplanb" id="mPlan" aria-label="Open Plan for the day"><svg viewBox="0 0 48 48" aria-hidden="true">${ICONS_MIN.plan}</svg><span class="mtip">Open plan for the day</span></button><button class="mbtn go" id="mHome">Home</button></span></div>`;
}
function wireStep(){
  const q = s => mcard.querySelector(s), qa = s => mcard.querySelectorAll(s);
  const next = () => { mStep++; pick(mStep); renderStep(); };
  const back = () => { mStep--; navTick(); renderStep(); };
  if (q('#mBack')) q('#mBack').addEventListener('click', back);
  if (mStep === 0){
    q('#mAdd').addEventListener('click', () => { q('#mTiles').hidden = !q('#mTiles').hidden; navTick(); });
    qa('.mtile').forEach(b => b.addEventListener('click', () => { const r = b.getBoundingClientRect(); unfoldAt(r.left + r.width/2, r.top - 60, +b.dataset.i, TODAY - 1); }));
    qa('.msleep .mchip').forEach(b => b.addEventListener('click', () => { sleepWord = b.textContent; emit('sleep:word', {day: TODAY - 1, word: sleepWord}); qa('.msleep .mchip').forEach(x => x.classList.toggle('on', x === b)); pick(1); }));
    q('#mOk1').addEventListener('click', next);
  }
  if (mStep === 1){
    qa('.mplan .px').forEach(inp => inp.addEventListener('change', () => { PLAN.today[+inp.dataset.i].text = inp.value; emit('plan:edit', {item: inp.value}); }));
    qa('.mdel').forEach(b => b.addEventListener('click', () => { PLAN.today.splice(+b.dataset.i, 1); tone(P[5],0,1.4,.03,.02); renderStep(); }));
    q('#mAddPlan').addEventListener('submit', e => {
      e.preventDefault(); const x = q('#mAddX').value.trim(); if (!x) return;
      const tt = /^\d{1,2}:\d{2}$/.test(q('#mAddT').value.trim()) ? q('#mAddT').value.trim().padStart(5, '0') : '—';
      PLAN.today.push({t: tt, text: x, done: false}); PLAN.today.sort((a, b) => a.t.localeCompare(b.t)); emit('plan:add', {day: 'today', t: tt, text: x});
      tone(P[9],0,2,.04,.02); renderStep();
    });
    q('#mOk2').addEventListener('click', next);
  }
  if (mStep === 2){
    const reveal = said => {                           // the real answer, shown quietly; no score
      const a = q('#mAns'); a.hidden = false; a.innerHTML = `${said ? `You said ${said}. ` : ''}It was <b>${RECALL.answer}</b><small>${RECALL.note}</small>`;
      qa('.rec').forEach(x => x.disabled = true); tone(P[noteOf('📘')],0,2.4,.05,.02); emit('recall:answer', {day: RECALL.day, said});
    };
    qa('.rec:not(#mRecOwn)').forEach(b => b.addEventListener('click', () => reveal(b.textContent)));
    q('#mRecOwn').addEventListener('click', () => {
      q('#mRec').innerHTML = '<form class="madd one" id="mRecF"><input id="mRecIn" placeholder="e.g. 1h 20m" aria-label="How long"><button>OK</button></form>';
      q('#mRecIn').focus(); q('#mRecF').addEventListener('submit', e => { e.preventDefault(); reveal(q('#mRecIn').value.trim() || '—'); });
    });
    q('#mPlan').addEventListener('click', () => { closeMorning(true); setTimeout(() => openPlan('today', false), 450); });
    q('#mPlan').addEventListener('mouseenter', hoverTick);
    q('#mHome').addEventListener('click', () => closeMorning(true));
  }
}
window.addEventListener('mia:line:add', e => { if (morningOpen && mStep === 0 && e.detail && e.detail.day === TODAY - 1){ renderStep(); } });
const notesBtn2 = document.getElementById('notesBtn');
if (notesBtn2) notesBtn2.addEventListener('click', () => { morningDone = false; });
