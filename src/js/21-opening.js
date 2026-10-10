/* ================= opening, closing ================= */
function playIntro(){
  closeStart = null;
  document.body.classList.add('intro');
  introStart = performance.now();
  startupLong(); setAmbient('home'); startAmbient();
  const wm = $('#wordmark'); wm.classList.remove('show'); void wm.offsetWidth;
  setTimeout(() => wm.classList.add('show'), reduce ? 0 : 2100);
  document.body.classList.remove('miaready'); setTimeout(() => document.body.classList.add('miaready'), reduce ? 0 : 1750);   // v02.9.6: the opening light shrinks into her dot
  setTimeout(() => document.body.classList.remove('intro'), reduce ? 400 : 4500);
}
function goodnight(){
  if (current) close(true);
  document.body.classList.add('intro');
  closeStart = performance.now(); goodnightSound(); stopAmbient(); document.body.classList.remove('miaready');
  setTimeout(() => { closeStart = null; introStart = null; $('#beginTxt').textContent = 'touch to open'; $('#begin').hidden = false; }, reduce ? 300 : 4300);
}
$('#begin').addEventListener('click', () => { initAudio(); $('#begin').hidden = true; playIntro(); });
$('#replay').addEventListener('click', () => { if (current) close(true); playIntro(); });
$('#goodnight').addEventListener('click', goodnight);
$('#mute').addEventListener('click', e => { soundOn = !soundOn; const b = e.currentTarget; b.classList.toggle('off', !soundOn); b.setAttribute('aria-pressed', soundOn); b.setAttribute('aria-label', soundOn ? 'Sound on' : 'Sound off'); if (ac) master.gain.setTargetAtTime(soundOn ? .55 : 0, ac.currentTime, .3); });
$('#pulse').addEventListener('click', () => { pulseAt = t; tone(P[2],0,4,.05,.6); });
function setMood(m){ moodTarget = m; document.body.classList.toggle('restless', !!m); $('#calm').setAttribute('aria-pressed', !m); $('#restless').setAttribute('aria-pressed', !!m); }
$('#calm').addEventListener('click', () => setMood(0));
$('#restless').addEventListener('click', () => setMood(1));
$('#morphBtn').addEventListener('click', e => { morphOn = !morphOn; e.currentTarget.setAttribute('aria-pressed', morphOn); if (current) shapeTarget = morphOn ? SHAPES[current] : SHAPES.frozen; });
$('#traces').addEventListener('click', e => { tracesOn = !tracesOn; e.currentTarget.setAttribute('aria-pressed', tracesOn); });

