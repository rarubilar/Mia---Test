/* ---------- example data ---------- */
const emOf = lines => lines.map(l => (HABITS.find(h => l.includes(h.e))||{e:''}).e);
traces = DAYS[TODAY].lines.map(() => ({life:1}));

/* ---------- calendar ---------- */
function buildCal(){
  const cal = $('#cal'); cal.innerHTML = '';
  ['MO','TU','WE','TH','FR','SA','SU'].forEach(d => cal.insertAdjacentHTML('beforeend', `<div class="dow">${d}</div>`));
  [28,29,30].forEach(n => cal.insertAdjacentHTML('beforeend', `<div class="d out"><span class="n">${n}</span></div>`));
  for (let n=1;n<=31;n++){
    const d = DAYS[n], b = document.createElement('button');
    b.className = 'd' + (n===TODAY ? ' today' : ''); b.setAttribute('aria-label', `October ${n}`);
    b.innerHTML = `<span><span class="n">${n}</span></span><span class="em">${d?emOf(d.lines).join(''):''}</span>${d&&d.mark?'<span class="mark"></span>':''}`;
    if (n <= TODAY) b.addEventListener('click', () => openDay(n));             // v02.10: every day so far opens, even an empty one (to add with +)
    cal.appendChild(b);
  }
  for (let n=1;n<=4;n++) cal.insertAdjacentHTML('beforeend', `<div class="d out"><span class="n">${n}</span></div>`);
}
buildCal(); document.body.classList.add('marks-on');
const WDN = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
let dayN = 0, undoTm = 0, lastRemoved = null;
function openDay(n, quiet){
  const d = DAYS[n] = DAYS[n] || {lines:[], title:''}, el = $('#day'); dayN = n;
  $('#calwrap').classList.add('split');
  document.querySelectorAll('.cal .d').forEach(c => c.classList.toggle('sel', c.getAttribute('aria-label') === `October ${n}`));
  if (!quiet){ el.classList.remove('show','still'); void el.offsetWidth; }
  const wd = WDN[new Date(2026,9,n).getDay()], auto = d.auto || {};
  // v02.10: + takes you to Record on this day; − removes a line (with undo); a dot marks a line Mia added that is not confirmed yet
  el.innerHTML = `<div class="scan"></div><h3>${wd.toUpperCase()} · ${n} OCTOBER 2026</h3><h2>${d.title || 'Untitled day'}</h2>
    <p class="cover"><button class="dadd" aria-label="Add a habit to this day">+</button>${emOf(d.lines).join('')}</p>` +
    d.lines.map((l,i) => `<p class="ln" style="animation-delay:${.45+i*.32}s"><span>${l}</span>${auto[l] === false ? `<button class="adot" data-i="${i}" aria-label="Added by Mia. Press to confirm" title="Added by Mia · press to confirm"></button>` : ''}<button class="lrm" data-i="${i}" aria-label="Remove this line" title="Remove">−</button></p>`).join('') +
    `<p class="undo" id="dUndo" hidden>Removed. <button id="dUndoB">UNDO</button></p>`;
  el.querySelector('.dadd').addEventListener('click', e => openRecordDay(n, e.currentTarget));
  el.querySelectorAll('.lrm').forEach(b => b.addEventListener('click', () => removeLine(n, +b.dataset.i)));
  el.querySelectorAll('.adot').forEach(b => b.addEventListener('click', () => { const l = d.lines[+b.dataset.i]; d.auto[l] = true; emit('line:confirm', {day:n, line:l}); tone(P[noteOf(l)],0,2,.05,.02); openDay(n, true); }));
  $('#dUndoB').addEventListener('click', undoRemove);
  fillSoundtrack(n);
  if (quiet){ el.classList.add('show','still'); return; }
  setTimeout(() => el.classList.add('show'), 250);
  tone(P[2],0,2.6,.04,.02); playPhrase(d.lines, .6);
}
function removeLine(n, i){
  const d = DAYS[n], line = d.lines.splice(i, 1)[0]; lastRemoved = {n, i, line};
  emit('line:remove', {day:n, line}); tone(P[8],0,1.6,.03,.02); tone(P[5],.12,1.8,.03,.02);   // the "done" chord, reversed
  buildCal(); openDay(n, true); if (typeof fillCard === 'function' && cards.has(n)) fillCard(n);
  const u = $('#dUndo'); u.hidden = false; clearTimeout(undoTm); undoTm = setTimeout(() => { const v = $('#dUndo'); if (v) v.hidden = true; lastRemoved = null; }, 5000);
}
function undoRemove(){
  if (!lastRemoved) return; const {n, i, line} = lastRemoved; lastRemoved = null;
  DAYS[n].lines.splice(i, 0, line); emit('line:restore', {day:n, line}); tone(P[5],0,1.6,.03,.02); tone(P[8],.12,1.8,.03,.02);
  buildCal(); openDay(n, true); if (cards.has(n)) fillCard(n);
}
function openRecordDay(n, btn){ focusDay = n; open('record', btn); }
function openCalendarDay(n, btn){               // used by Show me, habit squares and notifications
  if (current === 'calendar'){ openDay(n); return; }
  if (current) close(true);
  open('calendar', btn || document.querySelector('.rail button.sp[data-space="calendar"]'));
  if (!morphOn || reduce) openDay(n); else xmbAfter(() => openDay(n));
}
/* v02.10: the day's soundtrack, under the small calendar, so nothing moves */
$('#cal').insertAdjacentHTML('afterend', '<div class="strack"><button id="stBtn" aria-expanded="false"><svg viewBox="0 0 16 16" aria-hidden="true"><path d="M6 12V3.5l7-1.5V10.5"/><circle cx="4.3" cy="12" r="1.7"/><circle cx="11.3" cy="10.5" r="1.7"/></svg>SOUNDTRACK</button><ol id="stList"></ol></div>');
function fillSoundtrack(n){
  const s = SONGS[n] || [];
  $('#stList').innerHTML = s.length ? s.map(([t,pl,style],i) => `<li${i===0?' class="sotd"':''}><b>${t}</b><span>${pl}</span><small>${style}</small></li>`).join('') : '<li class="none">Nothing played this day.</li>';   // v02.10.1: playlist + style, not every song
}
$('#stBtn').addEventListener('click', e => { const on = !$('.strack').classList.contains('open'); $('.strack').classList.toggle('open', on); e.currentTarget.setAttribute('aria-expanded', on); navTick(); });
function closeDay(silent){ $('#calwrap').classList.remove('split'); $('.strack').classList.remove('open'); $('#day').classList.remove('show'); document.querySelectorAll('.cal .d').forEach(c => c.classList.remove('sel')); if (!silent) closeSound(); }
$('#dclose').addEventListener('click', () => closeDay());
$('#marks').addEventListener('click', e => { const on = !document.body.classList.contains('marks-on'); document.body.classList.toggle('marks-on', on); e.currentTarget.setAttribute('aria-pressed', on); });

