/* ---------- v02.10: Record opens three ways in: Habits · Plan for the day · Modes ----------
   On home, pressing RECORD sends the other space names away to the left; RECORD stays and its options
   appear beside it in the same letters. Modes opens two more the same way: Study and Meditation. */
let subOn = false, subLevel = 0;
const subEl = document.createElement('div'); subEl.className = 'sub'; subEl.id = 'sub'; subEl.setAttribute('role', 'menu'); document.body.appendChild(subEl);
const recBtn = document.querySelector('.rail button.sp[data-space="record"]');
function subItems(items){
  subEl.classList.remove('in'); void subEl.offsetWidth;
  const r = recBtn.getBoundingClientRect();
  subEl.style.left = (r.right + 54) + 'px'; subEl.style.top = (r.top + r.height/2) + 'px';
  subEl.innerHTML = items.map(([k, lab], i) => `<button class="sp" role="menuitem" data-k="${k}" style="--d:${.08 + i*.09}s"><span class="tick"></span><span class="lbl">${lab}</span></button>`).join('');
  subEl.querySelectorAll('button').forEach(b => { b.addEventListener('click', () => subPick(b.dataset.k, b)); b.addEventListener('mouseenter', navTick); });
  requestAnimationFrame(() => subEl.classList.add('in'));
}
function recordMenu(){
  if (subOn){ closeSub(); return; }
  subOn = true; subLevel = 1; navTick(); tone(P[7],0,2.4,.05,.02);
  document.body.classList.add('insub'); recBtn.setAttribute('aria-pressed', 'true');
  setTimeout(() => subItems([['habits','Habits'], ['plan','Plan for the day'], ['modes','Modes']]), 380);   // the names leave first
}
function closeSub(){
  if (!subOn) return;
  subOn = false; subLevel = 0; subEl.classList.remove('in');
  document.body.classList.remove('insub'); recBtn.setAttribute('aria-pressed', 'false');
}
function subBack(){ if (subLevel === 2){ subLevel = 1; subItems([['habits','Habits'], ['plan','Plan for the day'], ['modes','Modes']]); navTick(); } else closeSub(); }
function subPick(k, b){
  if (k === 'modes'){ subLevel = 2; tone(P[9],0,2,.04,.02); subItems([['study','Study'], ['meditation','Meditation']]); return; }
  closeSub();
  if (k === 'habits') open('record', b);
  if (k === 'plan') open('plan', b);
  if (k === 'study' || k === 'meditation') startMode(k);
}
cv.addEventListener('click', () => { if (subOn) closeSub(); });

/* ---------- Plan: today (tick what's done) and tomorrow (made with Mia in the night talk) ---------- */
SHAPES.plan = {amp:.22, spread:1.8, y:.5, flow:.22};
spaceNotes.plan = [4, 8];
CHORDS.plan = [174.61, 233.08, 311.13, 466.16];
const planSp = document.createElement('div'); planSp.className = 'space'; planSp.id = 'sp-plan';
planSp.innerHTML = `<p class="eyebrow" id="plEye">Plan</p><h2 class="title" id="plTitle">Today</h2>
  <div class="ptabs" role="tablist"><button role="tab" data-tab="today" aria-selected="true">TODAY</button><button role="tab" data-tab="tomorrow" aria-selected="false">TOMORROW</button></div>
  <ol class="plist" id="plist"></ol>
  <form class="padd" id="padd" autocomplete="off"><input id="paddT" maxlength="5" placeholder="09:00" aria-label="Time"><input id="paddX" maxlength="60" placeholder="Add to today" aria-label="What"><button>ADD</button></form>
  <div class="pnight" id="pnight" hidden><p>That's tomorrow. Everything else can wait.</p><button id="closeDayB">CLOSE THE DAY</button></div>
  <p class="note">Example plan. Events from your Google Calendar come in read-only; the rest is Mia's own calendar. Tick what you did; tomorrow is shaped with Mia in the night talk.</p>`;
$('#sheet').appendChild(planSp);
let planTab = 'today';
function renderPlan(){
  const list = PLAN[planTab], today = planTab === 'today', n = today ? TODAY : TODAY + 1;
  const wd = WDN[new Date(2026, 9, n).getDay()];
  $('#plTitle').textContent = today ? 'Today' : 'Tomorrow';
  $('#plEye').textContent = `Plan · ${wd} ${n} October`;
  document.querySelectorAll('.ptabs button').forEach(b => b.setAttribute('aria-selected', b.dataset.tab === planTab));
  $('#paddX').placeholder = today ? 'Add to today' : 'Add to tomorrow';
  $('#plist').innerHTML = list.map((it, i) => `<li class="pi${it.done ? ' done' : ''}" style="--d:${i*.06}s">
      ${today ? `<button class="ptick" data-i="${i}" aria-pressed="${!!it.done}" aria-label="Done: ${it.text}"><svg viewBox="0 0 16 16" aria-hidden="true"><path d="M3.5 8.5l3 3 6-7"/></svg></button>` : '<span class="ptick ghost" aria-hidden="true"></span>'}
      <span class="pt">${it.t}</span><input class="px" data-i="${i}" value="${it.text.replace(/"/g,'&quot;')}" aria-label="Plan item">
      ${it.e ? `<span class="pe">${it.e}</span>` : ''}${it.src ? `<small>${it.src}</small>` : ''}
      <button class="pdel" data-i="${i}" aria-label="Remove ${it.text}">−</button></li>`).join('');
  $('#plist').querySelectorAll('.ptick[data-i]').forEach(b => b.addEventListener('click', () => {
    const it = list[+b.dataset.i]; it.done = !it.done; emit('plan:tick', {item: it.text, done: it.done});
    if (it.done){ tone(P[7],0,2.2,.05,.02); tone(P[10],.14,2.4,.04,.02); } else tone(P[5],0,1.6,.03,.02);
    renderPlan();
  }));
  $('#plist').querySelectorAll('.px').forEach(inp => inp.addEventListener('change', () => { list[+inp.dataset.i].text = inp.value; emit('plan:edit', {item: inp.value}); }));
  $('#plist').querySelectorAll('.pdel').forEach(b => b.addEventListener('click', () => { list.splice(+b.dataset.i, 1); tone(P[5],0,1.4,.03,.02); renderPlan(); }));
}
document.querySelectorAll('.ptabs button').forEach(b => b.addEventListener('click', () => { planTab = b.dataset.tab; navTick(); renderPlan(); }));
$('#padd').addEventListener('submit', e => {
  e.preventDefault(); const x = $('#paddX').value.trim(); if (!x) return;
  const tt = /^\d{1,2}:\d{2}$/.test($('#paddT').value.trim()) ? $('#paddT').value.trim().padStart(5, '0') : '—';
  PLAN[planTab].push({t: tt, text: x, done: false}); PLAN[planTab].sort((a,b) => a.t.localeCompare(b.t));
  emit('plan:add', {day: planTab, t: tt, text: x}); $('#paddX').value = ''; $('#paddT').value = ''; tone(P[9],0,2,.04,.02); renderPlan();
});
function openPlan(tab, night){                        // the night talk ends here, to see tomorrow one last time
  planTab = tab; renderPlan(); $('#pnight').hidden = !night;
  if (current !== 'plan'){ if (current) close(true); open('plan', recBtn); }
}
$('#closeDayB').addEventListener('click', () => { $('#pnight').hidden = true; goodnight(); });
renderPlan();

/* ---------- Modes: Study and Meditation ----------
   Only the waves stay. A tiny dot at the bottom centre says "press to start"; pressing it starts the mode:
   the music stops (concentration), the dot becomes a timer that counts up. Press the timer to stop;
   then Mia asks how it was, like after dragging a habit, and the line is written. */
let modeOn = false, modeKind = '', modeStart = 0, modeTick = 0, modeRunning = false;
SHAPES.mode = {amp:.45, spread:.7, y:.56, flow:.5};
SHAPES.modeRun = {amp:.18, spread:.45, y:.56, flow:.28};     // the waves gather to the centre and slow
const modeEl = document.createElement('div'); modeEl.className = 'mode'; modeEl.id = 'mode';
modeEl.innerHTML = `<p class="mname" id="mName"></p>
  <button class="mstart" id="mStart" aria-label="Press to start"><i></i><span class="mbox">press to start</span></button>
  <button class="mtimer" id="mTimer" aria-label="Press to stop"><b id="mClock">00:00</b><span class="mbody" id="mBody"></span></button>
  <div class="mdone" id="mDone"><p class="mline" id="mLine"></p><p class="msum" id="mSum"></p><div class="mact" id="mAct"></div></div>
  <button class="mleave" id="mLeave">LEAVE</button>`;
document.body.appendChild(modeEl);
const heart = '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M8 13.5S2.5 10 2.5 6.2A2.8 2.8 0 0 1 8 4.8a2.8 2.8 0 0 1 5.5 1.4C13.5 10 8 13.5 8 13.5Z"/></svg>';
const hrvIc = '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M1.5 9h3l1.5-4 2 7 1.5-5 1 2h4"/></svg>';
function startMode(kind){
  if (chatOn) closeChat();
  modeOn = true; modeKind = kind; modeRunning = false; initAudio();
  modeEl.className = 'mode ready'; $('#mName').textContent = kind === 'study' ? 'Study' : 'Meditation';
  document.body.classList.add('inmode'); shapeTarget = SHAPES.mode; dimTarget = 1;
  tone(P[kind === 'study' ? 9 : 5],0,3,.05,.3);
}
function bell(){ tone(P[9]*2, 0, 6, .05, .004); tone(P[9]*5.4, 0, 2.2, .012, .004); tone(P[9], .01, 7, .03, .01); }   // a short soft bell
function beginMode(){
  if (modeRunning) return;
  modeRunning = true; modeStart = performance.now(); modeEl.className = 'mode running';
  concentration = true; stopAmbient();                // concentration: no music, no nature, no messages
  shapeTarget = SHAPES.modeRun; bell(); emit('mode:start', {mode: modeKind});
  let hr = 66;
  const upd = () => {
    const s = Math.floor((performance.now() - modeStart)/1000);
    $('#mClock').textContent = `${String(Math.floor(s/60)).padStart(2,'0')}:${String(s%60).padStart(2,'0')}`;
    if (modeKind === 'meditation'){ hr += (Math.random() - .55) * 1.2; hr = Math.max(56, Math.min(72, hr)); $('#mBody').innerHTML = `<span>${heart}${Math.round(hr)}</span><span>${hrvIc}—</span>`; }
    else $('#mBody').textContent = '';
  };
  upd(); clearInterval(modeTick); modeTick = setInterval(upd, 1000);
}
function stopMode(){
  if (!modeRunning) return;
  modeRunning = false; clearInterval(modeTick); bell();
  const min = Math.max(1, Math.round((performance.now() - modeStart)/60000));
  shapeTarget = SHAPES.mode; modeEl.className = 'mode asking';
  const hi = HABITS.findIndex(h => h.name === (modeKind === 'study' ? 'Study' : 'Meditation'));
  const r = $('#mTimer').getBoundingClientRect();
  askQuality(r.left + r.width/2, Math.min(r.top - 140, innerHeight - 200), hi, min, line => {
    $('#mLine').textContent = line;
    if (modeKind === 'study'){                         // study ends with a short summary and a way to talk about it
      $('#mSum').textContent = `${fmt(min)} with Anki and two PDFs. Want to say the two key ideas?`;
      $('#mAct').innerHTML = '<button id="mTalk">TALK ABOUT IT</button><button id="mOk">DONE</button>';
      $('#mTalk').addEventListener('click', () => { endMode(); setTimeout(() => openChat(), 400); });
      $('#mOk').addEventListener('click', endMode);
    } else { $('#mSum').textContent = 'Saved in Meditation, with your heart through the session.'; $('#mAct').innerHTML = ''; setTimeout(() => { if (modeOn) endMode(); }, 4200); }
    modeEl.className = 'mode done';
  });
}
function askQuality(x, y, hi, min, then){             // the same question as after dragging a habit: how was it?
  const h = HABITS[hi], cx0 = Math.min(Math.max(x, 200), innerWidth-200), cy0 = Math.min(Math.max(y, 190), innerHeight-190);
  unfoldOn = true; layer.classList.add('on');
  layer.innerHTML = `<div class="hub" style="left:${cx0}px;top:${cy0}px">${h.e}</div>`;
  ringOpts(cx0, cy0, QUAL, qi => {
    const q = QUAL[qi], line = `${/^[aeiou]/i.test(q)?'AN':'A'} ${q.toUpperCase()} ${h.name.toUpperCase()}${h.e} (${fmt(min)})`;
    DAYS[TODAY].lines.push(line); emit('line:add', {day: TODAY, line}); traces.push({life:0}); buildCal();
    cancelUnfold(); ringAt(cx0, cy0); tone(P[h.note],0,3,.07,.02); tone(P[Math.min(12,h.note+3)],.2,3,.05,.02);
    then(line); showUndo(cx0, cy0, () => { undoAdd(TODAY, line); $('#mLine').textContent = ''; });
  }, min <= 10 ? 0 : -1);
}
function endMode(){
  if (!modeOn) return;
  clearInterval(modeTick); if (unfoldOn) cancelUnfold();
  modeOn = false; modeRunning = false; concentration = false; startAmbient(); emit('mode:end', {mode: modeKind});
  modeEl.className = 'mode'; document.body.classList.remove('inmode'); shapeTarget = SHAPES.home; dimTarget = 1;
  tone(P[7],0,2.6,.04,.1); tone(P[4],.22,3,.04,.2);
}
$('#mStart').addEventListener('click', beginMode);
$('#mTimer').addEventListener('click', stopMode);
$('#mLeave').addEventListener('click', () => { if (modeRunning) stopMode(); else endMode(); });
layer.addEventListener('click', e => { if (e.target === layer && modeOn && !modeRunning) setTimeout(endMode, 30); });   // dismissing the question leaves the mode
