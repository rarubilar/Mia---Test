/* ---------- V02.14 · About you (inside Settings) ----------
   Everything Mia keeps about Raúl, in plain sentences, grouped quietly. It opens inside the Settings panel,
   from the "About you" row: the settings slide away and the facts take their place, with ‹ Settings to go back.
   Each fact says where it came from; a pencil corrects it, a bin forgets it (5 s undo). Values Mia has only
   noticed wait, faint, for a yes or a no. Sensitive facts are kept only after his OK and say so. */
const ABOUT = {
  People: [
    {t: 'Sandro is your cousin.', src: 'chat · 2 Oct'},
    {t: 'You play football with friends, usually on Fridays.', src: 'your diary'},
    {t: 'Your trusted people: none yet.', src: 'Settings', fixed: true},
  ],
  Places: [
    {t: 'You study at the university, in Santiago.', src: 'night talk · 1 Oct'},
    {t: 'You like running by the river.', src: 'night talk · 6 Oct'},
  ],
  Routines: [
    {t: 'You meditate most mornings, about 23 minutes.', src: 'your diary'},
    {t: 'You read in the evening, often after meditating.', src: 'your diary'},
    {t: 'Your mornings start around 7:30.', src: 'learned · 3 weeks'},
  ],
  Preferences: [
    {t: 'You prefer short, scarce nudges.', src: 'Experiments · Oct'},
    {t: 'You like ambient piano while studying.', src: 'what played'},
  ],
  Health: [
    {t: 'You sleep better on days you run.', src: 'kept with your OK · 4 Oct', sens: true},
  ],
  Values: [
    {t: 'Family matters most.', src: 'you confirmed · 28 Sep'},
    {t: 'You protect your mornings.', src: 'noticed by Mia', pending: true},
    {t: 'Learning slowly is better than not at all.', src: 'noticed by Mia', pending: true},
  ],
};
const meOpen = new Set();                       // all categories start closed
const meSp = document.createElement('div'); meSp.className = 'ssub'; meSp.id = 'sAbout';
$('#settings').appendChild(meSp);
const MEIC = {
  edit: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 20h4.5L19 9.5 14.5 5 4 15.5Z"/><path d="M12.5 7l4.5 4.5"/></svg>',
  del: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 7h14M10 7V5h4v2M7 7l1 12h8l1-12"/></svg>',
  yes: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12.5l4.2 4.2L19 7"/></svg>',
  no: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14"/></svg>',
};
const meBtn = (a, g, k, tip, svg) => `<button class="meb" data-a="${a}" data-g="${g}" data-k="${k}" aria-label="${tip}"><span class="atip">${tip}</span>${svg}</button>`;
function renderMe(){
  const n = Object.values(ABOUT).reduce((s, l) => s + l.filter(f => !f.pending).length, 0);
  meSp.innerHTML = `<button class="sback" id="sBack" aria-label="Back to Settings">‹ Settings</button>
    <h2>About you</h2><p class="slead">${n} things Mia keeps about you, all here. Correct or forget any of them.</p>
    <div class="melist">${Object.entries(ABOUT).map(([g, list]) => list.length ? `<section class="mecat${meOpen.has(g) ? ' open' : ''}" data-g="${g}"><h4><button class="mehd" aria-expanded="${meOpen.has(g)}"><span>${g}</span><small>${list.length}${list.some(f => f.pending) ? ' · <i>new</i>' : ''}</small><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 6l6 6-6 6"/></svg></button></h4><div class="mewrap"><ul>${list.map((f, k) => `
      <li class="mef${f.pending ? ' pend' : ''}${f.sens ? ' sens' : ''}" data-g="${g}" data-k="${k}"><div><p class="met">${f.t}</p><p class="mes">${f.src}</p></div>
        <span class="meacts">${f.pending ? meBtn('yes', g, k, 'Yes, that’s me', MEIC.yes) + meBtn('no', g, k, 'Not really', MEIC.no)
          : f.fixed ? '' : meBtn('edit', g, k, 'Correct it', MEIC.edit) + meBtn('del', g, k, 'Forget this', MEIC.del)}</span></li>`).join('')}</ul></div></section>` : '').join('')}</div>
    <p class="menote">Mia learns these from your diary and your talks. What she only noticed waits, faint, for your yes.</p>`;
  $('#sBack').addEventListener('click', closeAbout);
  meSp.querySelectorAll('.mehd').forEach(h => h.addEventListener('click', () => {      // each category opens only when he wants to see it
    const sec = h.closest('.mecat'), g = sec.dataset.g, on = !meOpen.has(g);
    on ? meOpen.add(g) : meOpen.delete(g); sec.classList.toggle('open', on); h.setAttribute('aria-expanded', on);
    on ? tone(P[7],0,1.4,.025,.02) : tone(P[5],0,1.2,.02,.02);
  }));
  meSp.querySelectorAll('.meb').forEach(b => b.addEventListener('click', () => meAct(b.dataset.a, b.dataset.g, +b.dataset.k, b)));
}
function meAct(a, g, k, btn){
  const f = ABOUT[g][k], li = btn.closest('.mef');
  if (a === 'yes'){ f.pending = false; f.src = 'you confirmed · today'; emit('about:confirm', {fact: f.t}); tone(P[7],0,2.2,.05,.02); tone(P[10],.14,2.4,.04,.02); renderMe(); return; }
  if (a === 'no' || a === 'del'){
    ABOUT[g].splice(k, 1); emit('about:forget', {fact: f.t}); tone(P[8],0,1.6,.03,.02); tone(P[5],.12,1.8,.03,.02);
    const r = li.getBoundingClientRect(); renderMe();
    showUndo(r.right - 40, r.top + 4, () => { ABOUT[g].splice(k, 0, f); emit('about:restore', {fact: f.t}); renderMe(); });
    return;
  }
  if (a === 'edit'){
    li.querySelector('div').innerHTML = `<form class="mefix"><input value="${f.t.replace(/"/g, '&quot;')}" aria-label="Correct this fact"><button aria-label="Save">›</button></form><p class="mes">${f.src}</p>`;
    li.querySelector('.meacts').innerHTML = '';
    const inp = li.querySelector('input'); inp.focus(); inp.select();
    li.querySelector('form').addEventListener('submit', e => { e.preventDefault(); const v = inp.value.trim(); if (v && v !== f.t){ emit('about:correct', {from: f.t, to: v}); f.t = v; f.src = 'you corrected · today'; tone(P[9],0,2,.04,.02); } renderMe(); });
    inp.addEventListener('keydown', e => { if (e.key === 'Escape'){ e.stopPropagation(); renderMe(); } });
  }
}
function openAbout(){ renderMe(); $('#settings').classList.add('about'); $('#settings').scrollTop = 0; navTick(); tone(P[8],0,1.8,.03,.02); }
function closeAbout(){ $('#settings').classList.remove('about'); $('#settings').scrollTop = 0; tone(P[6],0,1.4,.03,.02); }
renderMe();
$('#sMe').addEventListener('click', openAbout);
$('#sClose').addEventListener('click', () => setTimeout(closeAbout, 600));
document.addEventListener('keydown', e => { if (e.key === 'Escape' && $('#settings').classList.contains('about') && !e.target.closest('.mefix')){ e.stopImmediatePropagation(); closeAbout(); } }, true);
