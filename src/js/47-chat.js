/* ---------- v02.9.3: talking with Mia ----------
   Her circle (below the space names on home, or above the space's icon inside a space) opens the chat.
   Everything fades away and only the waves remain: they are her voice. They shimmer with her words,
   more lines join while she talks, and they go still while she listens.
   Voice is the main way (TALK); WRITE opens a text bar. In this prototype her answers are examples:
   the real Mia answers with Qwen and speaks with her Kokoro voice (V03). */
let chatOn = false, chatMode = 'choose', listening = false, dictating = false, speaking = false, chatTurn = 0;
let listenTm = 0, dictTm = 0, thinkTm = 0, wordTm = 0, fadeTm = 0, utter = null, gapUntil = 0, autoTm = 0, nightOn = false;
function CHAT_ON(){ return chatOn || modeOn; }   // v02.10: a mode also keeps her dot and the clicks on the waves away

const chat = document.createElement('div'); chat.className = 'chat'; chat.id = 'chat'; chat.dataset.mode = 'choose';
chat.innerHTML = `
  <p class="mwords" id="mWords" aria-live="polite"></p>
  <p class="rwords" id="rWords"></p>
  <div class="cdock" id="cdock">
    <div class="choose">
      <button class="cbtn talk" id="talkB" aria-label="Talk to Mia"><span><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 10v4M8 7v10M12 4v16M16 8v8M20 10.5v3"/></svg></span></button>
      <button class="cbtn write" id="writeB" aria-label="Write to Mia"><span><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15.5 4.5l4 4L9 19l-5 1 1-5Z"/><path d="M13.5 6.5l4 4"/></svg></span></button>
    </div>
    <form class="wbar" id="wbar" autocomplete="off">
      <button type="button" class="wico" id="dictB" aria-label="Speak, and Mia writes it"><svg viewBox="0 0 24 24" aria-hidden="true"><rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5.5 11a6.5 6.5 0 0 0 13 0M12 17.5V21"/></svg></button>
      <textarea id="wIn" rows="1" maxlength="600" placeholder="Write to Mia" aria-label="Message to Mia"></textarea>
      <button type="button" class="wico" id="attB" aria-label="Add a document"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg></button>
      <input type="file" id="attF" multiple hidden>
    </form>
    <div class="chips" id="chips"></div>
    <button class="cback" id="cBack" aria-label="Back to talk or write"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M19 12H5M11 6l-6 6 6 6"/></svg></button>
  </div>
  <button class="cclose" id="chatClose">CLOSE</button>`;
document.body.appendChild(chat);

// Mia's circle on home, just below the space names; the waves wind into it
const miaHome = document.createElement('button'); miaHome.className = 'miahome'; miaHome.id = 'miaHome';
miaHome.setAttribute('aria-label', 'Talk to Mia'); miaHome.innerHTML = '<i></i><span>Mia</span>';
document.body.appendChild(miaHome);                 // v02.9.5: in the middle of the waves, where the opening light was
miaHome.addEventListener('click', () => openChat());
miaHome.addEventListener('mouseenter', navTick);
$('#miaOrb').addEventListener('click', () => openChat());

/* ----- example conversation (voice) ----- */
const TALKS = [
  {you: 'Today was long, but the run by the river felt good.', mia: 'A long day, and still the river run felt good. What made it feel that way?'},
  {you: "The light on the water. And I didn't check the time once.", mia: 'The light, and no clock. That sounds worth keeping. Shall I add it to today?'},
  {you: 'Yes, please.', mia: "Done. RUN BY THE RIVER, NO CLOCK 🏃🏽‍♂️🌅 is in today's line.", show: TODAY, kind: 'records'},
  {you: 'When did I last play football?', mia: 'Last Friday, the 2nd. Football with friends.', show: 2, kind: 'records'},
  {you: 'When did I start French?', mia: 'My guess: around Monday the 5th, your first French session this month.', show: 5, kind: 'guess'},
  {you: "When is Sandro's birthday?", mia: "I don't have Sandro's birthday. Want me to save it now?", kind: 'notfound'},
  {you: 'How much sleep do adults need?', mia: 'Most adults need seven to nine hours a night.', kind: 'research', src: 'Watson et al., 2015 · Sleep (AASM / SRS consensus)'},
  {you: 'Thanks, Mia. That is all for now.', mia: "Anytime. I'm here.", end: true},
];
/* v02.10: the night talk, the same 7 steps every night: arrive · settle the day · the moment · the feeling ·
   one nudge at most · tomorrow (last) · close the day. Example lines; the real ones come from her mind (V03). */
const NIGHT_ARRIVE = "Good evening, Raúl. Today I have a good meditation, twenty-four minutes, and reading, forty minutes. Anything I missed?";
const NIGHT = [
  {you: 'I also ran by the river after work.', mia: 'Added: A GOOD RUN 🏃🏽 (30min). What stayed with you from today?', show: TODAY,
   after: () => { const l = 'A GOOD RUN🏃🏽 (30min)'; if (!DAYS[TODAY].lines.includes(l)){ DAYS[TODAY].lines.push(l); emit('line:add', {day: TODAY, line: l}); traces.push({life:0}); buildCal(); } }},
  {you: "The light on the water. I didn't check the time once.", mia: "The light, and no clock. I'll keep that moment. How did today feel, in one word?"},
  {you: 'Calm.', mia: 'Calm. I have one thought, if you want it.'},
  {you: 'Sure.', mia: 'Reading went well after meditating. Try that again tomorrow?'},
  {you: "Yes, let's do it.", mia: "Here is tomorrow. Meditation, then reading. Statistics at ten, football at eight. Goodnight, Raúl.", end: true,
   after: () => setTimeout(() => { closeChat(); openPlan('tomorrow', true); }, 2200)},
];
function script(){ return nightOn ? NIGHT : TALKS; }
const DICTS = ['Today I studied for two hours and then coded Mia for one.', 'I want to start running in the mornings again.'];
const FOLLOW = ['What stayed with you from it?', 'How did that feel?', 'Do you want to keep this in today?'];
function replyFor(text){
  let snip = text.replace(/\s+/g,' ').trim().split(/(?<=[.!?])\s/)[0].replace(/[.!?]+$/,'');   // she reflects the first thought, briefly
  if (snip.length > 60){ const cut = snip.slice(0, 60), c = cut.lastIndexOf(','); snip = (c > 25 ? cut.slice(0, c) : cut.slice(0, cut.lastIndexOf(' '))) + '…'; }
  return `“${snip}${snip.endsWith('…') ? '' : '.'}” ${FOLLOW[chatTurn++ % FOLLOW.length]}`;
}

/* ----- opening and closing ----- */
function chatFrom(){ return current ? $('#miaOrb').getBoundingClientRect() : miaHome.getBoundingClientRect(); }
function flight(rect, reverse){                     // her light travels between her circle and the middle of the waves
  if (!morphOn || reduce) return;
  cancelAnimationFrame(gatherRAF); gather = null;
  const ox = rect.left + rect.width/2, oy = rect.top + rect.height/2, cx0 = W/2, cy0 = miaY(), start = performance.now(), dur = reverse ? 1000 : 1200;
  const parts = Array.from({length: 120}, () => ({a: Math.random()*6.283, r: Math.random()*rect.width*.3, d: Math.random()*.3, z: Math.random(), lift: 20 + Math.random()*90, spin: (Math.random()-.5)*1.6}));
  const loop = now => {
    fcx.clearRect(0,0,W,H);
    const k0 = (now - start)/dur, [wr,wg,wb] = pal.wave;
    fcx.globalCompositeOperation = pal.dark ? 'lighter' : 'source-over';
    for (const p of parts){
      let k = clamp01((k0 - p.d)/.7); if (reverse) k = 1 - k;
      const e = sineEase(k), sx = ox + Math.cos(p.a)*p.r, sy = oy + Math.sin(p.a)*p.r;
      const ex = cx0 + Math.cos(p.a + p.spin)*p.r*.6, ey = cy0 + Math.sin(p.a + p.spin)*p.r*.6;
      const mx2 = (sx+ex)/2, my2 = Math.min(sy,ey) - p.lift;
      const x = (1-e)*(1-e)*sx + 2*(1-e)*e*mx2 + e*e*ex, y = (1-e)*(1-e)*sy + 2*(1-e)*e*my2 + e*e*ey;
      const a = Math.sin(Math.PI*clamp01(k*1.05)) * (.4 + .6*p.z);
      fcx.fillStyle = `rgba(${wr},${wg},${wb},${(pal.dark?.85:.6)*a})`;
      fcx.beginPath(); fcx.arc(x, y, .7 + p.z*1.5, 0, 6.283); fcx.fill();
    }
    if (k0 < 1.35) gatherRAF = requestAnimationFrame(loop); else fcx.clearRect(0,0,W,H);
  };
  gatherRAF = requestAnimationFrame(loop);
}
function openChat(night){
  if (chatOn || introStart === null || closeStart !== null) return;
  initAudio(); chatOn = true; nightOn = !!night; chatTurn = 0;
  flight(chatFrom(), false);
  document.body.classList.add('chatting'); chatTarget = 1;
  shapeTarget = SHAPES.home; dimTarget = 1;          // the space fades away; only the waves remain
  tone(P[4],0,3.2,.05,.35); tone(P[7],.3,3.6,.04,.45);
  setMode('choose');
  clearTimeout(thinkTm);
  if (nightOn){ setMode('voice'); thinkTm = setTimeout(() => { if (chatOn) say(NIGHT_ARRIVE, true); }, 1500); }   // the night talk opens straight into voice
  else thinkTm = setTimeout(() => { if (chatOn && !speaking && !listening) say("I'm here.", false); }, 1500);
}
function closeChat(){
  if (!chatOn) return;
  hush(); stopListening(false); stopDictation(false); clearTimeout(thinkTm); clearTimeout(autoTm);
  chatOn = false; thinkTarget = 0; document.body.classList.remove('chatting'); chatTarget = 0; plainTarget = 0; voiceTarget = 0;
  if (current){ shapeTarget = morphOn ? SHAPES[current] : SHAPES.frozen; dimTarget = (current === 'seasons' || current === 'galaxy') ? 0 : .5; }
  else { shapeTarget = SHAPES.home; dimTarget = 1; }
  setTimeout(() => flight(chatFrom(), true), 60);
  tone(P[7],0,2.6,.04,.1); tone(P[4],.22,3,.04,.2);
  $('#mWords').classList.remove('on'); $('#rWords').classList.remove('on');
  setTimeout(() => { if (!chatOn) setMode('choose'); }, 700);
}
$('#chatClose').addEventListener('click', closeChat);

/* ----- talk or write ----- */
function setMode(m){
  chatMode = m; chat.dataset.mode = m;
  $('#talkB').setAttribute('aria-label', m === 'voice' ? 'Press to talk' : 'Talk to Mia');
  if (m === 'write') setTimeout(() => $('#wIn').focus(), 450);
  if (m !== 'voice') stopListening(false);
  if (m !== 'write') stopDictation(false);
}
$('#talkB').addEventListener('click', () => {
  if (chatMode !== 'voice'){ setMode('voice'); startListening(); return; }        // v02.9.4: pressing talk opens the microphone at once
  if (listening) stopListening(true); else startListening();          // the little dot is the microphone
});
$('#writeB').addEventListener('click', () => { navTick(); setMode('write'); });
$('#cBack').addEventListener('click', () => { navTick(); setMode('choose'); });

/* ----- voice: she listens (the waves go still), then answers (the waves move with her voice) ----- */
function startListening(){
  hush(); clearTimeout(autoTm); listening = true; chat.classList.add('listening'); plainTarget = 1;
  clearTimeout(fadeTm); $('#mWords').classList.remove('on');          // her last words step aside while she listens
  showYou('listening…', true); tone(P[9],0,.9,.03,.01);
  clearTimeout(listenTm); listenTm = setTimeout(() => stopListening(true), 5200);   // in the prototype she "hears" an example line
}
function stopListening(answer){
  if (!listening) return;
  listening = false; chat.classList.remove('listening'); plainTarget = 0; clearTimeout(listenTm);
  tone(P[6],0,.9,.03,.01);
  if (!answer) { $('#rWords').classList.remove('on'); return; }
  const S = script(), tk = S[Math.min(chatTurn, S.length-1)]; chatTurn = Math.min(chatTurn+1, S.length);
  typeInto($('#rWords'), tk.you, 55, () => { showYou(tk.you); think(() => { if (tk.after && !tk.end) tk.after(); say(tk.mia, true, tk); }); });
}
function think(fn){ clearTimeout(thinkTm); thinkTarget = 1; thinkTm = setTimeout(() => { thinkTarget = 0; fn(); }, 2900); }   // V02.12.2: she thinks visibly (the swirl), then speaks   // v02.10: she waits 2 s longer before answering

/* ----- what she says: words appear as she speaks them ----- */
function hush(){
  clearTimeout(autoTm); speaking = false; voiceTarget = 0; clearTimeout(wordTm);
  if (utter && 'speechSynthesis' in window){ utter.onend = utter.onboundary = null; speechSynthesis.cancel(); } utter = null;
}
function miaVoice(){                                 // a local British voice only (never one that sends text online)
  const vs = speechSynthesis.getVoices().filter(v => v.localService && /^en/i.test(v.lang));
  return vs.find(v => /en-GB/i.test(v.lang) && /female|libby|sonia|hazel|serena|kate|martha|susan|fiona/i.test(v.name)) || vs.find(v => /en-GB/i.test(v.lang)) || vs[0] || null;
}
function say(text, spoken, opt = {}){
  hush(); clearTimeout(fadeTm); thinkTarget = 0;
  const el = $('#mWords'), words = text.split(' ');
  el.innerHTML = words.map(w => `<span>${w}</span>`).join(' '); el.classList.add('on');
  const spans = [...el.children]; let shown = 0;
  const reveal = n => { while (shown < Math.min(n, spans.length)){ const w = words[shown]; spans[shown++].classList.add('on'); if (/[,.?!]$/.test(w)) gapUntil = vt + .28; } };
  speaking = true;
  const level = spoken ? 1 : .4, done = () => {
    reveal(spans.length); speaking = false; voiceTarget = 0;
    const bar = answerBar(el, text, opt, spoken);    // V02.12: what kind of answer it is, and what you can do with it
    if (opt.end && opt.after) opt.after();
    if (!bar) fadeTm = setTimeout(() => el.classList.remove('on'), 7000);
    if (spoken && chatOn && chatMode === 'voice' && !opt.end) autoTm = setTimeout(() => { if (chatOn && chatMode === 'voice' && !speaking && !listening) startListening(); }, 2000);   // v02.10: the mic opens by itself 2 s after she finishes
  };
  (function env(){ if (!speaking) return;           // her voice, made visible: syllables, and small pauses at commas
    const syl = .5 + .5*Math.sin(vt*2*Math.PI*4.4), phr = .6 + .4*Math.sin(vt*2*Math.PI*.9 + 1);
    voiceTarget = vt < gapUntil ? .08*level : level*(.25 + .75*syl*syl*phr); requestAnimationFrame(env); })();
  const synth = spoken && soundOn && 'speechSynthesis' in window && miaVoice();
  if (synth){
    utter = new SpeechSynthesisUtterance(text.replace(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\u{1F3FB}-\u{1F3FF}‍]/gu, '').toLowerCase());
    utter.voice = synth; utter.lang = synth.lang; utter.rate = .92; utter.pitch = 1.05; utter.volume = .9;
    let chars = 0; const starts = words.map(w => { const s = chars; chars += w.length + 1; return s; });
    utter.onboundary = e => { if (e.name === 'word' || e.name === undefined) reveal(starts.filter(s => s <= e.charIndex).length); };
    utter.onend = done; speechSynthesis.speak(utter);
    wordTm = setTimeout(function safety(){ if (speaking && !speechSynthesis.speaking) done(); else if (speaking) wordTm = setTimeout(safety, 1500); }, 4000);
  } else {
    const per = spoken ? 330 : 140; let i = 0;
    (function step(){ if (!speaking) return; reveal(++i); if (i < words.length) wordTm = setTimeout(step, per + (/[,.?!]$/.test(words[i-1]) ? 260 : 0)); else wordTm = setTimeout(done, 500); })();
  }
}
function showYou(text, faint){ const el = $('#rWords'); el.textContent = text; el.classList.toggle('faint', !!faint); el.classList.add('on'); }
function typeInto(el, text, ms, then){            // a transcription appearing as it is heard
  el.classList.remove('faint'); el.classList.add('on'); el.textContent = ''; let i = 0;
  (function step(){ el.textContent = text.slice(0, ++i); if (i < text.length) setTimeout(step, ms/3); else then && then(); })();
}

/* ----- write: the text bar, a microphone that writes for you, and + for documents ----- */
function wSize(){                                  // v02.9.4: lines pile downward; the bar grows upward from its place
  const ta = $('#wIn'); ta.style.height = 'auto'; const h = Math.min(ta.scrollHeight, 132); ta.style.height = h + 'px';
  chat.style.setProperty('--wgrow', Math.max(0, $('#wbar').offsetHeight - 46) + 'px');
}
$('#wIn').addEventListener('input', wSize);
$('#wIn').addEventListener('keydown', e => { if (e.key === 'Enter' && !e.shiftKey){ e.preventDefault(); $('#wbar').requestSubmit(); } });
$('#wbar').addEventListener('submit', e => {
  e.preventDefault(); const v = $('#wIn').value.trim(); if (!v) return;
  stopDictation(false); $('#wIn').value = ''; wSize(); showYou(v); tone(P[8],0,1.2,.03,.01);
  const ask = DEMO_ASKS.find(a => a.re.test(v));      // V02.12: example questions that show each kind of answer
  think(() => ask ? say(ask.mia, false, ask) : say(replyFor(v), false));
});
function stopDictation(fill){
  if (!dictating) return;
  dictating = false; chat.classList.remove('dictating'); plainTarget = 0; clearTimeout(dictTm);
  if (!fill) return;
  const text = DICTS[chatTurn % DICTS.length], inp = $('#wIn'), base = inp.value ? inp.value.trimEnd() + ' ' : ''; let i = 0;
  (function step(){ inp.value = base + text.slice(0, ++i); wSize(); if (i < text.length) setTimeout(step, 18); else inp.focus(); })();
}
$('#dictB').addEventListener('click', () => {
  if (dictating){ stopDictation(true); return; }
  hush(); dictating = true; chat.classList.add('dictating'); plainTarget = 1; tone(P[9],0,.9,.03,.01);
  dictTm = setTimeout(() => stopDictation(true), 3200);
});
$('#attB').addEventListener('click', () => $('#attF').click());
$('#attF').addEventListener('change', e => {            // prototype: only the names are shown; nothing is read or sent
  const names = [...e.target.files].slice(0, 3).map(f => f.name);
  $('#chips').replaceChildren(...names.map(n => { const c = document.createElement('span'); c.textContent = n; return c; }));
  e.target.value = '';
});

/* ---------- V02.12 · answer controls ----------
   Under Mia's answers from memory: what kind of answer it is (your diary · general knowledge · not found · a guess),
   and quiet controls: Show me · not right · mark important · forget this (5 s undo). Faint until the cursor is on her words. */
const DEMO_ASKS = [
  {re: /football/i, mia: 'Last Friday, the 2nd. Football with friends.', show: 2, kind: 'records'},
  {re: /french/i, mia: 'My guess: around Monday the 5th, your first French session this month.', show: 5, kind: 'guess'},
  {re: /sandro|birthday/i, mia: "I don't have Sandro's birthday. Want me to save it now?", kind: 'notfound'},
  {re: /sleep/i, mia: 'Most adults need seven to nine hours a night.', kind: 'research', src: 'Watson et al., 2015 · Sleep (AASM / SRS consensus)'},
];
const ib = (a, tip, svg) => `<button class="aic" data-a="${a}" aria-label="${tip}"><span class="atip">${tip}</span>${svg}</button>`;
const AIC = {
  cal: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="4" y="5.5" width="16" height="14.5" rx="2"/><path d="M4 10h16M8.5 3.5v4M15.5 3.5v4"/></svg>',
  tick: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12.5l4.2 4.2L19 7"/></svg>',
  fix: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 20h4.5L19 9.5 14.5 5 4 15.5Z"/><path d="M12.5 7l4.5 4.5"/></svg>',
  plus: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>',
  minus: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14"/></svg>',
  star: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3.8l2.5 5.1 5.6.8-4 3.9.9 5.6-5-2.6-5 2.6.9-5.6-4-3.9 5.6-.8Z"/></svg>',
  wrong: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14"/><path d="M12 5v0"/><circle cx="12" cy="12" r="8.5"/></svg>',
  forget: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 7h14M10 7V5h4v2M7 7l1 12h8l1-12"/></svg>',
};
const shortDay = n => `${WDN[new Date(2026, 9, n).getDay()].slice(0, 3)} ${n} Oct`;
function kindLabel(o){
  if (o.kind === 'records') return `From your diary${o.show ? ' · ' + shortDay(o.show) : ''}`;
  if (o.kind === 'research') return `General knowledge · ${o.src}`;
  if (o.kind === 'notfound') return 'Not in your diary';
  if (o.kind === 'guess') return 'A guess';
  return '';
}
function answerBar(el, text, o, spoken){
  if (!o.kind && !o.show) return null;
  o = {kind: 'records', ...o};
  const bar = document.createElement('div'); bar.className = 'ans k-' + o.kind; bar.setAttribute('role', 'group'); bar.setAttribute('aria-label', 'About this answer');
  const draw = () => {
    bar.innerHTML = `<p class="akind">${o.important ? '<b>Important</b> · ' : ''}${kindLabel(o)}</p><div class="arow">` +
      (o.kind === 'notfound' ? ib('save', 'Save it now', AIC.plus) + ib('no', 'Not now', AIC.minus)
        : (o.kind === 'guess' ? ib('right', "That's right", AIC.tick) + ib('fix', 'Correct it', AIC.fix) : '') +
          (o.kind === 'research' ? ib('card', "Add to a habit's card", AIC.plus) : '') +
          (o.show ? ib('show', 'Show me in Calendar', AIC.cal) : '')) +
      `<span class="aics">${o.kind !== 'notfound' ? `<button class="aic${o.important ? ' on' : ''}" data-a="star" aria-label="${o.important ? 'Important (press to unmark)' : 'Mark important'}"><span class="atip">${o.important ? 'Important' : 'Mark important'}</span>${AIC.star}</button><button class="aic" data-a="wrong" aria-label="Not right"><span class="atip">Not right</span>${AIC.wrong}</button>` : ''}<button class="aic" data-a="forget" aria-label="Forget this"><span class="atip">Forget this</span>${AIC.forget}</button></span></div>`;
    bar.querySelectorAll('button').forEach(b => b.addEventListener('click', ev => { ev.stopPropagation(); act(b.dataset.a); }));
  };
  const hold = () => { clearTimeout(autoTm); clearTimeout(fadeTm); if (listening) stopListening(false); };   // using the bar pauses the mic
  const ask = (ph, then) => {                          // a one-line field right under her words
    hold(); bar.querySelector('.arow').innerHTML = `<form class="afix"><input placeholder="${ph}" aria-label="${ph}"><button aria-label="Send">›</button><button type="button" class="acancel" aria-label="Cancel">×</button></form>`;
    const f = bar.querySelector('form'), inp = f.querySelector('input'); inp.focus();
    f.addEventListener('submit', ev => { ev.preventDefault(); const v = inp.value.trim(); if (v) then(v); });
    f.querySelector('.acancel').addEventListener('click', draw);
  };
  const reply = (line, extra = {}) => { showYou(extra.you || ''); if (!extra.you) $('#rWords').classList.remove('on'); think(() => say(line, spoken && chatMode === 'voice', extra.opt || {})); };
  const act = a => {
    navTick();
    if (a === 'show'){ closeChat(); setTimeout(() => openCalendarDay(o.show), 500); return; }
    if (a === 'star'){ o.important = !o.important; emit('memory:important', {text, on: o.important}); if (o.important) { tone(P[9],0,2,.04,.02); tone(P[12],.12,2.2,.03,.02); } else tone(P[6],0,1.4,.03,.02); hold(); draw(); return; }
    if (a === 'right'){ o.kind = 'records'; emit('answer:confirm', {text}); pick(2); hold(); draw(); return; }
    if (a === 'fix') return ask('What was right?', v => { emit('answer:correct', {text, right: v}); reply(`Thanks. Noted: ${v}. I'll remember it.`, {you: v}); });
    if (a === 'wrong') return ask("What's right?", v => { emit('answer:wrong', {text, right: v}); reply(`Sorry, I had that wrong. Noted: ${v}. I've learned it.`, {you: v}); });
    if (a === 'save') return ask('Tell me, and I\'ll keep it', v => { emit('memory:save', {text: v}); reply(`Saved: ${v}. Mark it important if you want it to come back.`, {you: v, opt: {kind: 'records'}}); });
    if (a === 'no'){ el.classList.remove('on'); return; }
    if (a === 'card'){                                // general knowledge → kept in a habit's card, under The science
      hold(); const guess = HABITS.findIndex(h => new RegExp(h.name, 'i').test(text + ' ' + (o.src || '')));
      bar.querySelector('.arow').innerHTML = '<span class="apick">To which habit?</span>' + HABITS.map((h, i) => `<button class="ahab${i === guess ? ' on' : ''}" data-i="${i}" aria-label="${h.name}" title="${h.name}">${h.e}</button>`).join('') + '<button class="aic" data-a="back" aria-label="Cancel">' + AIC.minus + '</button>';
      bar.querySelectorAll('.ahab').forEach(b => b.addEventListener('click', ev => { ev.stopPropagation(); const h = HABITS[+b.dataset.i], f = INFO[h.name];
        (f.saved = f.saved || []).push({text, src: o.src || ''}); emit('habit:science', {habit: h.name, text, src: o.src}); tone(P[h.note],0,2.4,.05,.02);
        reply(`Added to ${h.name}'s card, under The science.`, {opt: {}}); }));
      bar.querySelector('[data-a=back]').addEventListener('click', ev => { ev.stopPropagation(); draw(); });
      return;
    }
    if (a === 'forget'){                              // full deletion after a 5 s undo
      hold(); el.classList.add('forgetting'); tone(P[8],0,1.6,.03,.02); tone(P[5],.12,1.8,.03,.02);
      const keep = bar.innerHTML; let tm = 0;
      bar.innerHTML = '<p class="akind">Forgotten.</p><div class="arow"><button class="apill" data-a="undo">Undo</button></div>';
      bar.querySelector('button').addEventListener('click', ev => { ev.stopPropagation(); clearTimeout(tm); el.classList.remove('forgetting'); bar.innerHTML = keep; draw(); tone(P[5],0,1.6,.03,.02); tone(P[8],.12,1.8,.03,.02); });
      tm = setTimeout(() => { emit('memory:forget', {text}); el.classList.remove('on', 'forgetting'); }, 5000);
    }
  };
  draw(); el.appendChild(bar);
  return bar;
}
