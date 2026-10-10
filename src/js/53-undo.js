/* ---------- V02.13 · undo after adding ----------
   No confirmation dialogs anywhere (Topic 6): after a line is added, a tiny undo icon (an arrow turning back,
   with three motion lines) waits where it happened for 5 seconds, half transparent. Pressed: the line goes,
   with the done-chord reversed. */
const UNDO_IC = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 4.5 4 8.5l4 4"/><path d="M4 8.5h16M9 14h11M9 19h11"/></svg>';
const undoEl = document.createElement('button'); undoEl.className = 'undoic'; undoEl.setAttribute('aria-label', 'Undo');
undoEl.innerHTML = UNDO_IC + '<span class="utip">Undo</span>'; document.body.appendChild(undoEl);
let undoFn = null, undoTm2 = 0;
function showUndo(x, y, fn){
  undoFn = fn; clearTimeout(undoTm2);
  if (current === 'galaxy'){ const r = $('#gday').getBoundingClientRect(); x = r.left - 13; y = r.bottom - 12; }   // in the galaxy: under the date
  undoEl.style.left = Math.min(innerWidth - 30, x + 26) + 'px'; undoEl.style.top = (y + 26) + 'px';
  undoEl.classList.remove('on'); void undoEl.offsetWidth; undoEl.classList.add('on');
  undoTm2 = setTimeout(() => { undoEl.classList.remove('on'); undoFn = null; }, 5000);
}
undoEl.addEventListener('click', () => {
  if (!undoFn) return; const f = undoFn; undoFn = null; clearTimeout(undoTm2); undoEl.classList.remove('on');
  tone(P[8],0,1.6,.035,.02); tone(P[5],.12,1.8,.035,.02);      // the done chord, reversed
  f();
});
function undoAdd(day, line){
  const d = DAYS[day]; if (!d) return; const i = d.lines.lastIndexOf(line); if (i < 0) return;
  d.lines.splice(i, 1); if (day === TODAY && traces.length) traces.pop(); emit('line:remove', {day, line, undo: true});
  buildCal(); if (cards.has(day)) fillCard(day); if (focusDay === day) renderSide();
  if (current === 'galaxy'){ renderGalDay(); placePlanets(); }
  if (current === 'calendar' && typeof dayN !== 'undefined' && dayN === day) openDay(day, true);
  if (morningOpen && mStep === 0) renderStep();
}
