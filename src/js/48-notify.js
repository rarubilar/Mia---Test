/* ---------- v02.10: notifications live on the waves ----------
   A small dot (smaller than Mia's) rides a wave and pulses, with a tiny bubble above it. When the cursor passes,
   the bubble opens: the message and quick answers. No counters, no red, at most 2 at a time (Topic 5). */
const notesEl = document.createElement('div'); notesEl.className = 'notes'; notesEl.id = 'notes'; document.body.appendChild(notesEl);
const NOTE_POS = {anki: [.72, 1], night: [.3, 2]};     // where on the screen, and which wave it rides
let noteGone = new Set();
function noteActive(n){ if (noteGone.has(n.id)) return false; if (n.from){ const h = hour % 24; return h >= n.from || h < 4; } return true; }
function renderNotes(){
  notesEl.replaceChildren();
  NOTES.filter(noteActive).slice(0, 2).forEach(n => {
    const el = document.createElement('div'); el.className = 'nt'; el.dataset.id = n.id;
    el.innerHTML = `<div class="nbub" role="dialog" aria-label="${n.text}"><span class="nmini" aria-hidden="true"><i></i><i></i><i></i></span>
      <div class="nfull"><p class="nq">${n.text}</p><p class="ns">${n.sub}</p><div class="nact">${n.actions.map((a,i) => `<button data-i="${i}">${a}</button>`).join('')}</div></div></div>
      <button class="ndot" aria-label="Message from Mia: ${n.text}"><i></i></button>`;
    let leaveTm = 0;
    const openIt = () => { clearTimeout(leaveTm); if (!el.classList.contains('open')){ el.classList.add('open'); navTick(); } };
    el.addEventListener('mouseenter', openIt); el.addEventListener('focusin', openIt);
    el.querySelector('.ndot').addEventListener('click', openIt);
    el.addEventListener('mouseleave', () => { leaveTm = setTimeout(() => el.classList.remove('open'), 700); });
    el.querySelectorAll('.nact button').forEach(b => b.addEventListener('click', () => answerNote(n, +b.dataset.i, el)));
    notesEl.appendChild(el);
  });
}
function settleNote(el, id, text){                    // a one-line confirmation, then the dot dissolves into its wave
  noteGone.add(id);
  el.querySelector('.nfull').innerHTML = `<p class="nq small">${text}</p>`;
  setTimeout(() => { el.classList.add('gone'); const r = el.querySelector('.ndot').getBoundingClientRect(); ringAt(r.left + r.width/2, r.top + r.height/2, true); }, 1500);
  setTimeout(renderNotes, 2600);
}
function answerNote(n, i, el){
  const a = n.actions[i]; pick(i);
  if (n.id === 'anki'){
    if (a === 'Yes'){ emit('link:app', {app:'Anki', habit:'Study'}); settleNote(el, n.id, 'Linked: Anki → Study 📚. I’ll log it as study.'); }
    else if (a === 'No'){ emit('link:app', {app:'Anki', habit:null}); settleNote(el, n.id, 'Okay. Anki won’t count as a habit.'); }
    else {                                            // which habit? the habits appear as small tiles
      el.querySelector('.nact').innerHTML = HABITS.map((h,k) => `<button class="nh" data-k="${k}" aria-label="${h.name}" title="${h.name}">${h.e}</button>`).join('');
      el.querySelectorAll('.nh').forEach(b => b.addEventListener('click', () => { const h = HABITS[+b.dataset.k]; emit('link:app', {app:'Anki', habit:h.name}); tone(P[h.note],0,2,.05,.02); settleNote(el, n.id, `Linked: Anki → ${h.name} ${h.e}.`); }));
    }
  }
  if (n.id === 'night'){
    if (a === 'Talk now'){ noteGone.add('night'); renderNotes(); openChat(true); }
    else settleNote(el, n.id, 'Okay. Sleep well, Raúl.');
  }
}
function notesFrame(){                                // each dot rides its wave
  const show = introStart !== null && closeStart === null && !document.body.classList.contains('intro') &&   // V02.11.2: only once the opening has ended, with the space names
    !current && !chatOn && !modeOn && !subOn;
  notesEl.classList.toggle('on', show);
  if (!show) return;
  for (const el of notesEl.children){
    if (el.classList.contains('open')) continue;              // it holds still while open, so its answers are easy to press
    const [fx, rbi] = NOTE_POS[el.dataset.id] || [.6, 1], rb = ribbons[rbi], x = W*fx;
    el.style.left = x + 'px'; el.style.top = yAt(rb, x, Math.floor(rb.strands/2), t) + 'px';
  }
}
renderNotes();
$('#time').addEventListener('input', renderNotes);    // the night talk appears from 21:00
$('#now').addEventListener('click', renderNotes);
const notesBtn = document.getElementById('notesBtn');
if (notesBtn) notesBtn.addEventListener('click', () => { noteGone.clear(); renderNotes(); });
