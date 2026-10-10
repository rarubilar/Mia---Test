/* ---------- V02.2 · Mia Test (public test version · Entrega Final VibeCoding) ----------
   1. A small (i) in the top-left corner of every space and window: what this place does, what to try, and
      where it stands (what the real app already does, and what comes later).
   2. Every button of the prototype command centre explains itself on hover.
   3. Writing to Mia: example questions she can answer in this test (no AI runs here; answers are written examples). */

/* ----- 1 · the (i) guide ----- */
const GUIDE = {
  home: {t: 'Home', d: 'Mia’s home. The waves are Mia: they follow the hour of the day, your mood and what you record. The idea is an app you barely open: what matters comes to you.',
    try: ['Click a space name on the left: Calendar, Record, Habits, Seasons or Experiments.', 'The small light in the middle of the waves is Mia. Click it to talk or write to her.', 'Dots riding the waves are Mia’s messages. Hover one to answer it. The amber one is your morning card.', 'Bottom right: the gear opens Settings, the bars turn the sound on and off.'],
    now: 'In the real app (V03, Windows): the home, the waves and the opening work with real data.'},
  recordmenu: {t: 'Record', d: 'Three ways to record your day.',
    try: ['Habits: the galaxy, where each habit is a planet.', 'Plan for the day: what you want to do today and tomorrow.', 'Modes: Study or Meditation, with a quiet timer that writes the line for you.'],
    now: 'In V03 you record by talking or writing to Mia. The galaxy and modes are the next look (V04).'},
  calendar: {t: 'Calendar', d: 'Your diary, one square per day. Each day keeps its lines, in capitals with an emoji, the way Raúl writes his diary.',
    try: ['Click a day to open it: its lines play as a short melody, one note per habit.', 'Inside a day: − and + remove or add a line; the songs you heard that day are at the top.', 'Lit dots mark days that hold a memory; faint lines were added by Mia and wait for your OK.', 'Scroll or ↑ ↓ to move between days.'],
    now: 'In V03: the Calendar holds the real diary (imported from years of Google Calendar). Day summaries come in deploy 2.'},
  galaxy: {t: 'Record · the galaxy', d: 'Each planet is a habit, bigger the more you have done it. In the centre waits a void: drop a planet in it and Mia writes the line on the day.',
    try: ['Drag a planet into the void. Mia asks how long and how it went (a short one is pre-marked QUICK).', 'Hover a planet to see its emoji and name.', 'The date beside the void is the day you are recording; click it to open it in the Calendar; ↑ ↓ change the day.', 'The + in the bottom-left corner creates a new habit, a new planet.', 'A habit you rarely do stays small in its place; one you have not done in a month becomes a point of light.'],
    now: 'Design for V04. In V03 the same lines are recorded by talking to Mia.'},
  habits: {t: 'Habits', d: 'Your habits as cards on a ring. The card shows how the habit lives in your days, never a streak.',
    try: ['Click a side card to bring it to the centre; click the centre card to open its page.', '← → turn the ring.', '+ creates a new habit, with its name and emoji.'],
    now: 'In V03 habits come from the diary lines. The galaxy is the new way to record them.'},
  habit: {t: 'A habit', d: 'One habit in depth: its month, how close it is to becoming automatic, what it is and what research says about it.',
    try: ['Click a day of the month to open it in the Calendar.', 'The curve shows the way to automatic (about 66 days, Lally et al., 2010), never a streak.', 'Facts you save from a chat with Mia appear under The science.'],
    now: 'Example numbers in this test.'},
  seasons: {t: 'Seasons', d: 'Your life seen from far away: chapters as a stream of light. Each season is a stretch of life with its own name.',
    try: ['Read the season names along the stream: the light rises and falls with each chapter.', 'Watch the home waves dissolve into the stream when it opens.'],
    now: 'Example seasons. Mia proposing seasons from your diary comes later.'},
  experiments: {t: 'Experiments', d: 'Small experiments you try for a few weeks, and what happened. The way it went glows; the way it did not drifts away like sand.',
    try: ['Watch the paths settle after the gust.', 'One experiment is Mia’s own: she tried fewer morning nudges and stopped them when they did not help.'],
    now: 'Example experiments. Starting one by talking to Mia comes later.'},
  plan: {t: 'Plan for the day', d: 'What you want to do today and tomorrow. The night talk with Mia ends here, with tomorrow’s plan.',
    try: ['Switch between Today and Tomorrow.', 'Mark a plan done: Mia asks how it went and writes the line.'],
    now: 'In V03 the plan comes from the night talk and your Google Calendar.'},
  mode: {t: 'Modes', d: 'Study or Meditation. The app goes quiet: no music, no messages. The waves gather in the centre and slow down.',
    try: ['Press the light to start the timer; press the timer to stop.', 'At the end Mia writes the line, for example A GOOD MEDITATION (24min).', 'LEAVE goes back home.'],
    now: 'Live heart rate from the watch comes with the phone app (deploy 2).'},
  chat: {t: 'Talk to Mia', d: 'Mia listens, remembers your diary and answers with her own voice. In this test her answers are written examples: no AI runs on this page.',
    try: ['Talk (the bars): a short example conversation plays.', 'Write (the pencil): pick one of the example questions above the bar.', 'Under answers from your diary: Show me opens the day; ✓, the pencil and the star confirm, correct or mark it.'],
    now: 'In V03 Mia runs on the computer (Qwen through Ollama), speaks with Kokoro and listens with Whisper. Nothing leaves the PC.'},
  morning: {t: 'Morning card', d: 'Once a morning: a quick look at yesterday, today’s plan and one memory. Then Mia goes quiet.',
    try: ['‹ › move between the three cards.', 'The plan icon opens Plan for the day; the house goes home.'],
    now: 'In V03 the morning look-back is a short spoken summary.'},
  settings: {t: 'Settings', d: 'The few things you may want to see or change. Most things change by telling Mia.',
    try: ['Voice, night talk hour, what Mia never tracks, backups and the lock.', 'About you › shows everything Mia knows about you.', 'Take my diary with me: your whole diary as Markdown, JSON or CSV.'],
    now: 'Toggles work in this test but nothing is saved.'},
  about: {t: 'About you', d: 'Everything Mia keeps about you, in plain sentences, with where she learned it. Nothing about you is hidden anywhere else.',
    try: ['Open a category to see its facts.', 'Hover a fact: the pencil corrects it, the bin forgets it (with a 5 second undo).', 'Values Mia only noticed wait, faint, for your yes.'],
    now: 'Example facts.'},
};
function guideCtx(){
  if (typeof chatOn !== 'undefined' && chatOn) return 'chat';
  if (typeof modeOn !== 'undefined' && modeOn) return 'mode';
  if (typeof morningOpen !== 'undefined' && morningOpen) return 'morning';
  if (typeof settingsOn !== 'undefined' && settingsOn) return $('#settings').classList.contains('about') ? 'about' : 'settings';
  if (current === 'habits' && !$('#hview').hidden) return 'habit';
  if (current && GUIDE[current]) return current;
  if (current === 'record') return 'recordmenu';
  if (typeof subOn !== 'undefined' && subOn) return 'recordmenu';
  return 'home';
}
const gInfo = document.createElement('button'); gInfo.className = 'tinfo'; gInfo.id = 'tInfo'; gInfo.setAttribute('aria-label', 'What is this?');
gInfo.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 11v6"/><circle cx="12" cy="7.6" r=".6"/></svg>';
const gCard = document.createElement('div'); gCard.className = 'tcard'; gCard.id = 'tCard'; gCard.setAttribute('role', 'dialog'); gCard.setAttribute('aria-label', 'What this is');
document.body.append(gInfo, gCard);
let gShown = '';
function showGuide(){
  const k = guideCtx(), g = GUIDE[k]; gShown = k;
  gCard.innerHTML = `<p class="teye">What this is</p><h3>${g.t}</h3><p class="td">${g.d}</p>
    <p class="teye">Try</p><ul>${g.try.map(x => `<li>${x}</li>`).join('')}</ul><p class="tnow">${g.now}</p>`;
  gCard.classList.add('on'); gInfo.classList.add('open'); navTick();
}
function hideGuide(){ if (!gCard.classList.contains('on')) return; gCard.classList.remove('on'); gInfo.classList.remove('open'); gShown = ''; }
gInfo.addEventListener('click', e => { e.stopPropagation(); gCard.classList.contains('on') ? hideGuide() : showGuide(); });
gInfo.addEventListener('pointerenter', hoverTick);
document.addEventListener('pointerdown', e => { if (!gCard.contains(e.target) && e.target !== gInfo && !gInfo.contains(e.target)) hideGuide(); }, true);
document.addEventListener('keydown', e => { if (e.key === 'Escape' && gCard.classList.contains('on')){ e.stopImmediatePropagation(); hideGuide(); } }, true);
setInterval(() => { if (gShown && gShown !== guideCtx()) hideGuide(); }, 400);     // a new place, a new guide
// the (i) waits for the opening to finish
const gReady = () => gInfo.classList.toggle('show', introStart !== null && closeStart === null);
setInterval(gReady, 300);
// the first time it appears, it says what it is, softly, for a few seconds
let gHinted = false;
setInterval(() => { if (gHinted || !gInfo.classList.contains('show')) return; gHinted = true; gInfo.classList.add('hint'); setTimeout(() => gInfo.classList.remove('hint'), 7000); }, 500);
gInfo.insertAdjacentHTML('beforeend', '<span class="thint">What is this? Open me in every space</span>');

/* ----- 2 · the command centre explains itself ----- */
const PROTO_TIPS = {
  time: 'Move through the day. Colours, light, sounds and Mia’s voice change with the hour. From 21:00 the night talk appears.',
  now: 'Back to the real time of your computer.',
  calm: 'Calm waves: how Mia looks when your heart rate is calm (from the watch).',
  restless: 'Restless waves: how Mia looks when your heart rate says you are restless.',
  pulse: 'One soft pulse of light, like a heartbeat sent by the watch.',
  replay: 'Play the opening again: the animation and its music.',
  goodnight: 'Close the day: the animation and music after the night talk.',
  morphBtn: 'On: spaces reshape the waves when they open. Off: reduced motion.',
  traces: 'Each new diary line leaves a soft trace in the waves.',
  natureBtn: 'Play a natural sound now: birds, wind, water or crickets. Mia plays them now and then on her own.',
  iconsBtn: 'Switch between the three icon sets of the side column: minimal, solid and line.',
  notesBtn: 'Bring back Mia’s message dots on the waves, and the morning card.',
  galBtn: 'Record › Habits as the galaxy (new), or the classic way.',
  marks: 'Show or hide the small marks of special days in the Calendar.',
  hideProto: 'Fold or unfold this command centre.',
};
const proto = $('#proto');
const ptip = document.createElement('p'); ptip.className = 'ptip'; ptip.id = 'pTip'; ptip.setAttribute('role', 'status'); proto.appendChild(ptip);
Object.entries(PROTO_TIPS).forEach(([id, tip]) => {
  const el = document.getElementById(id); if (!el) return;
  const tgt = id === 'time' ? proto.querySelector('label[for=time]') : null;
  [el, tgt].filter(Boolean).forEach(x => {
    x.setAttribute('aria-description', tip);
    x.addEventListener('pointerenter', () => { ptip.textContent = tip; ptip.classList.add('on'); });
    x.addEventListener('focus', () => { ptip.textContent = tip; ptip.classList.add('on'); });
    x.addEventListener('pointerleave', () => { ptip.classList.remove('on'); ptip.textContent = ''; });
    x.addEventListener('blur', () => { ptip.classList.remove('on'); ptip.textContent = ''; });
  });
});

/* ----- 3 · example questions when writing to Mia ----- */
DEMO_ASKS.push(
  {re: /yesterday/i, mia: 'Yesterday, the 5th: a powerful meditation, thirty minutes; French, thirty minutes; and two hours of Statistics.', show: 5, kind: 'records'},
  {re: /meditat/i, mia: 'Five days this month, one hour and forty-seven minutes in all. Mostly in the mornings.', show: 6, kind: 'records'},
  {re: /read/i, mia: 'You read more on evenings after meditating, like on the 1st and today.', show: 6, kind: 'records'},
);
const ASK_LIST = ['What did I do yesterday?', 'When did I last play football?', 'How long did I meditate this month?', 'When did I start French?', 'When is Sandro’s birthday?', 'How much sleep do adults need?', 'When do I read more?'];
const asks = document.createElement('div'); asks.className = 'tasks'; asks.id = 'tAsks';
asks.innerHTML = `<p class="teye">Try asking</p>${ASK_LIST.map(q => `<button type="button">${q}</button>`).join('')}`;
$('#cdock').appendChild(asks);
asks.querySelectorAll('button').forEach(b => {
  b.addEventListener('click', () => { const t = $('#wIn'); t.value = b.textContent; $('#wbar').requestSubmit(); });
  b.addEventListener('pointerenter', hoverTick);
});
// in this test Mia only knows the example questions
document.addEventListener('submit', e => {
  if (e.target.id !== 'wbar') return;
  const v = $('#wIn').value.trim(); if (!v || DEMO_ASKS.some(a => a.re.test(v))) return;
  e.preventDefault(); e.stopImmediatePropagation();
  $('#wIn').value = ''; showYou(v); tone(P[8],0,1.2,.03,.01);
  think(() => say('In this test I can only answer the example questions above. Try one of them.', false));
}, true);
