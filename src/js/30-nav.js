/* ================= spaces + sidebar ================= */
let sideOpen = false;
function ringAt(x, y, small){
  const ring = document.createElement('div'); ring.className = 'ring' + (small ? ' small' : '');
  ring.style.left = x+'px'; ring.style.top = y+'px';
  document.body.appendChild(ring); setTimeout(() => ring.remove(), 1700);
}
function setSide(open){
  sideOpen = open; document.body.classList.toggle('sideopen', open);
  setTimeout(() => { if (current === 'record') layoutFlow(); if (current === 'seasons') drawSeasons(true); if (current === 'habits') layoutCarousel(); }, 720);
}
$('#railClose').addEventListener('click', () => setSide(false));
$('#opener').addEventListener('click', () => { navTick(); setSide(true); });
$('#homeBtn').addEventListener('click', () => goHome());
function open(name, btn){
  if (name === 'record' && galaxyOn) name = 'galaxy';                // V02.10.1: Record › Habits is the galaxy
  if (current === name) return;
  const wasHome = !current;
  if (name !== 'habits') { document.body.classList.remove('in-habits'); $('#newH').classList.remove('on'); }
  current = name; sideOpen = false;                    // the names slide left and fade; no sidebar unless SPACES is pressed
  document.querySelectorAll('.rail button.sp').forEach((b,i) => b.style.setProperty('--d', (i*.05)+'s'));
  document.body.classList.add('inspace'); document.body.classList.remove('sideopen');
  document.querySelectorAll('.rail button.sp').forEach(b => b.setAttribute('aria-pressed', b.dataset.space === name));
  document.querySelectorAll('.space').forEach(s => s.classList.toggle('on', s.id === 'sp-'+name));
  shapeTarget = morphOn ? SHAPES[name] : SHAPES.frozen; dimTarget = name === 'seasons' ? 0 : .5;   // in Seasons the waves become the points, they don't stay behind
  const r = btn.getBoundingClientRect(); ringAt(r.left+7, r.top+r.height/2); openSound(name);
  $('#sheet').classList.add('open'); $('#sheet').scrollTop = 0; cancelUnfold();
  if (name === 'record') requestAnimationFrame(layoutFlow);
  if (name === 'experiments') xmbAfter(openExperiments);   // v02.9.1: the gust starts once the space has arrived
  if (name === 'habits') { showHabitMenu(); if (morphOn && !reduce){ hcards.forEach(c => c.classList.add('hid')); ['#prevH','#nextH'].forEach(q => $(q).classList.add('hid')); } requestAnimationFrame(() => { layoutCarousel(); startHabMorph(); }); }
  if (name === 'seasons') requestAnimationFrame(() => startSeasonMorph(wasHome));
  if (name === 'calendar') { closeDay(true); requestAnimationFrame(() => startCalMorph()); }
  setAmbient(name); xmbEnter(name, wasHome);
  if (name === 'galaxy') startGalaxy(); else if (gOn) stopGalaxy();
}
function close(silent, keepMorph){
  current = null; shapeTarget = SHAPES.home; dimTarget = 1; cancelUnfold(); morph = null; habMorph = null; hcards.forEach(c => c.classList.remove('hid')); ['#prevH','#nextH'].forEach(q => $(q).classList.remove('hid'));
  if (!keepMorph){ calMorph = null; $('#cal').classList.remove('veil'); }
  setAmbient('home'); setSide(false); document.body.classList.remove('in-habits'); $('#newH').classList.remove('on');
  document.body.classList.remove('inspace');
  $('#sheet').classList.remove('open'); if (!silent) closeSound();
  document.querySelectorAll('.rail button.sp').forEach(b => b.setAttribute('aria-pressed', false));
  xmbLeave(); if (gOn) stopGalaxy();
}
document.querySelectorAll('.rail button.sp').forEach(b => {
  b.addEventListener('click', () => (b.dataset.space === 'record' && !current) ? recordMenu() : open(b.dataset.space, b));   // v02.10: Record first offers Habits · Plan · Modes
  b.addEventListener('mouseenter', navTick);
});
addEventListener('keydown', e => {
  if (e.key === 'Escape'){ if (settingsOn){ closeSettings(); return; } if (morningOpen && !unfoldOn){ closeMorning(false); return; } if (chatOn){ closeChat(); return; } if (modeOn){ if (modeRunning) stopMode(); else if (!unfoldOn) endMode(); else { cancelUnfold(); endMode(); } return; } if (subOn){ subBack(); return; } if (unfoldOn) cancelUnfold(); else if (current) goHome(); return; }
  if (unfoldOn || e.target.tagName === 'INPUT') return;
  if (current === 'record' && (e.key === 'ArrowUp' || e.key === 'ArrowDown')){ e.preventDefault(); go(focusDay + (e.key === 'ArrowUp' ? -1 : 1)); }
  if (current === 'habits' && !$('#hmenu').hidden && (e.key === 'ArrowLeft' || e.key === 'ArrowRight')){ turn(e.key === 'ArrowLeft' ? -1 : 1); }
});

