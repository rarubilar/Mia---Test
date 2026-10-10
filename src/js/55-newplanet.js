/* ---------- V02.15 · a new habit is born in the galaxy ----------
   A faint + under the void. It opens a small form: a name and an emoji from the list. The new planet is born in the
   emptiest place of the sky: a spark that swells into a small painted planet, with a soft ring of light.
   It is made by the same code as Habits › +, so the habit exists everywhere at once. Mia never proposes one here. */
const gPlus = document.createElement('button'); gPlus.className = 'gplus'; gPlus.id = 'gPlus'; gPlus.setAttribute('aria-label', 'New habit');
gPlus.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg><span class="atip">New habit</span>';
const gNew = document.createElement('form'); gNew.className = 'gnew'; gNew.id = 'gNew'; gNew.setAttribute('aria-label', 'New habit');
gNew.innerHTML = `<p class="gnt">A new planet</p>
  <div class="gnrow"><input id="gnName" maxlength="24" placeholder="Its name" aria-label="Habit name" autocomplete="off"><button class="gngo" aria-label="Create">›</button></div>
  <div class="gnemo" role="radiogroup" aria-label="Emoji">${EMO.map((e, i) => `<button type="button" role="radio" aria-checked="${i === 0}" data-e="${e}" aria-label="Emoji ${i+1}">${e}</button>`).join('')}</div>`;
document.body.append(gPlus, gNew);                   // V02.15.1: above the side column, in the bottom-left corner
new MutationObserver(() => { const on = galSp.classList.contains('arrived') && document.body.classList.contains('in-galaxy'); gPlus.classList.toggle('show', on); if (!on) gNewOpen(false); })
  .observe(galSp, {attributes: true, attributeFilter: ['class']});
let gnEmo = EMO[0];
const gNewOpen = on => { if (!on && !gNew.classList.contains('on')) return; gNew.classList.toggle('on', on); gPlus.classList.toggle('open', on); if (on){ navTick(); setTimeout(() => $('#gnName').focus(), 250); } else tone(P[5],0,1.2,.02,.02); };
gPlus.addEventListener('click', () => gNewOpen(!gNew.classList.contains('on')));
gPlus.addEventListener('pointerenter', hoverTick);
gNew.querySelectorAll('.gnemo button').forEach(b => b.addEventListener('click', () => {
  gNew.querySelectorAll('.gnemo button').forEach(x => x.setAttribute('aria-checked', x === b)); gnEmo = b.dataset.e; hoverTick();
}));
gNew.addEventListener('keydown', e => { if (e.key === 'Escape'){ e.stopPropagation(); gNewOpen(false); } });
gNew.addEventListener('submit', e => {
  e.preventDefault();
  const name = $('#gnName').value.trim(); if (!name || HABITS.length >= 12) return;
  const n0 = HABITS.length;
  $('#nhName').value = name; $('#nhEmoji').value = gnEmo; $('#newH').requestSubmit();     // the same creation as Habits › +
  if (HABITS.length === n0) return;
  const i = n0, h = HABITS[i]; h.born = TODAY;
  const p = makePlanet(h, i), miaAt = planets.findIndex(q => q.mia);
  planets.splice(miaAt < 0 ? planets.length : miaAt, 0, p);
  p.el.style.setProperty('--k', 0); placePlanets();
  p.el.classList.add('born'); setTimeout(() => p.el.classList.remove('born'), 3200);
  tone(P[h.note], .2, 3.2, .05, .4); tone(P[Math.min(12, h.note + 4)], .9, 3.2, .035, .4); tone(P[Math.min(12, h.note + 7)], 1.6, 3.4, .025, .5);
  $('#gnName').value = ''; gNewOpen(false);
});
