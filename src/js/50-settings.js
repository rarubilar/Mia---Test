/* ---------- v02.10: Settings, behind a small gear (no word) next to the sound toggle ----------
   Few real settings (Topic 6.5): most things change by telling Mia. Everything decided in the 120 ideas
   that Raúl may want to see or change lives here. Prototype: toggles work locally; nothing is saved. */
let settingsOn = false;
const gear = document.createElement('button'); gear.className = 'gear'; gear.id = 'gear'; gear.setAttribute('aria-label', 'Settings');
gear.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="3.1"/><path d="M12 2.8v2.4M12 18.8v2.4M2.8 12h2.4M18.8 12h2.4M5.5 5.5l1.7 1.7M16.8 16.8l1.7 1.7M5.5 18.5l1.7-1.7M16.8 7.2l1.7-1.7"/></svg>';
document.body.appendChild(gear);
const seg = (id, opts, on) => `<span class="seg" data-set="${id}">${opts.map(o => `<button aria-pressed="${o === on}">${o}</button>`).join('')}</span>`;
const sw = (id, on) => `<button class="sw" data-set="${id}" aria-pressed="${on}"><i></i></button>`;
const row = (label, ctl, sub) => `<div class="srow"><div><p>${label}</p>${sub ? `<small>${sub}</small>` : ''}</div><div class="sctl">${ctl}</div></div>`;
const chipList = (id, items, add) => `<span class="chips2" data-set="${id}">${items.map(x => `<span>${x}</span>`).join('')}${add ? `<button class="addc">+ ${add}</button>` : ''}</span>`;
const panel = document.createElement('aside'); panel.className = 'settings'; panel.id = 'settings'; panel.setAttribute('aria-label', 'Settings');
panel.innerHTML = `<button class="sclose" id="sClose">CLOSE</button>
  <h2>Settings</h2><p class="slead">Most things change by telling Mia. These are the few you may want to see.</p>
  <section><h4>Look & sound</h4>
    ${row('Sound', sw('sound', true))}
    ${row('Natural sounds', seg('nature', ['Rarely','Sometimes','Often'], 'Sometimes'), 'Birds, wind, water, crickets, now and then')}
    ${row('Reduce motion', sw('motion', false), 'Spaces open without the waves reshaping')}</section>
  <section><h4>Mia</h4>
    ${row('Voice', seg('voice', ['N1','N2','N3','N4','N5'], 'N1'), 'N1: Isabella 21% · Lily 49% · Emma 30%, British. It adapts to morning, day, night, tired and restless.')}
    ${row('Night talk', seg('night', ['20:00','21:00','22:00'], '21:00'), '"Ready for night talk?" appears from this hour')}
    ${row('Actions outside Mia', seg('outside', ['Ask me first','Send automatically'], 'Ask me first'), 'Emails, messages, calendar invites')}
    ${row('About you', '<button class="slink sgo" id="sMe" aria-label="Open About you">›</button>', 'What Mia knows about you, each fact confirmed by you')}
    ${row('Parts of the day', '<button class="slink sgo" aria-label="Open Parts of the day">›</button>', 'Learned from how you live; tell Mia to change them')}</section>
  <section><h4>What Mia notices</h4>
    ${row('Never track', chipList('never', ['Banking apps (always)','Private windows (always)','Passwords · PINs · codes (always)'], 'Add app or page'), 'Dropped at the source. Or say "Mia, don’t track this"')}
    ${row('Apps that may show titles', chipList('titles', ['YouTube','Chrome · study tabs','VS Code'], 'Add'), 'Other apps: only the name and time')}
    ${row('Apps ↔ habits', chipList('links', ['Anki → Study 📚','VS Code → Code 💻','Duolingo → French 🇨🇵'], 'Link'), 'Most links are proposed by Mia, you confirm them')}
    ${row('Raw signals kept', '<span class="step" data-set="raw"><button aria-label="Fewer days">−</button><b>7 days</b><button aria-label="More days">+</button></span>', 'Then only the lines and summaries stay')}
    ${row('Pause everything', sw('pause', false), 'Waves go still and grey while paused')}</section>
  <section><h4>People</h4>
    ${row('Trusted people', chipList('trusted', [], 'Add (up to 2)'), 'Shown only in a hard moment, with one tap to call or message. Mia never contacts anyone.')}</section>
  <section><h4>Watch & devices</h4>
    ${row('Watch data', '<span class="sval">Allowed · Huawei Watch GT 4</span>', 'Through Health Sync, twice a day. With the phone app (deploy 2).')}
    ${row('Live heart rate', '<span class="sval">HR Data Broadcasts · set up with the watch</span>')}
    ${row('Pair the phone', '<button class="slink" disabled>QR · deploy 2</button>')}</section>
  <section><h4>Data & safety</h4>
    ${row('Lock', '<span class="sval">Windows Hello PIN once, at the first opening after the PC is on</span>')}
    ${row('Backups', '<span class="sval">USB E:\\MiaBackup · Google Drive (encrypted)<br>Last: today 03:10 · restore test OK</span>', '30 daily + 12 monthly copies')}
    ${row('Recovery key', '<span class="sval">In Google Password Manager ✓</span>')}
    ${row('Take my diary with me', '<span class="seg" data-set="export"><button>Markdown</button><button>JSON</button><button>CSV</button></span>', 'Your whole diary in open formats')}
    ${row('Delete everything', '<button class="slink" disabled>Deploy 2</button>', 'Fingerprint + typed confirmation + 7 days to undo')}</section>`;
document.body.appendChild(panel);
function openSettings(){ settingsOn = true; document.body.classList.add('setting'); navTick(); tone(P[9],0,1.8,.03,.02); }
function closeSettings(){ settingsOn = false; document.body.classList.remove('setting'); tone(P[6],0,1.6,.03,.02); }
gear.addEventListener('click', () => settingsOn ? closeSettings() : openSettings());
$('#sClose').addEventListener('click', closeSettings);
panel.querySelectorAll('.seg').forEach(s => s.querySelectorAll('button').forEach(b => b.addEventListener('click', () => {
  const k = s.dataset.set;
  if (k === 'export'){ exportDiary(b.textContent); return; }
  s.querySelectorAll('button').forEach(x => x.setAttribute('aria-pressed', x === b)); pick(0);
  if (k === 'nature') natureP = {Rarely:.15, Sometimes:.34, Often:.6}[b.textContent];
  if (k === 'night'){ NOTES.find(n => n.id === 'night').from = parseInt(b.textContent, 10); renderNotes(); }
})));
panel.querySelectorAll('.sw').forEach(b => b.addEventListener('click', () => {
  const on = b.getAttribute('aria-pressed') !== 'true'; b.setAttribute('aria-pressed', on); pick(on ? 2 : 0);
  if (b.dataset.set === 'sound' && on !== soundOn) $('#mute').click();
  if (b.dataset.set === 'motion'){ morphOn = !on; $('#morphBtn').setAttribute('aria-pressed', morphOn); }
  if (b.dataset.set === 'pause'){ document.body.classList.toggle('paused', on); flowPause = on; emit('capture:pause', {on}); }
}));
$('#mute').addEventListener('click', () => { const s = panel.querySelector('.sw[data-set="sound"]'); if (s) s.setAttribute('aria-pressed', soundOn); });
let rawDays = 7;
panel.querySelectorAll('.step button').forEach((b,i) => b.addEventListener('click', () => { rawDays = Math.max(1, Math.min(30, rawDays + (i ? 1 : -1))); panel.querySelector('.step b').textContent = rawDays + (rawDays === 1 ? ' day' : ' days'); pick(1); }));
panel.querySelectorAll('.addc').forEach(b => b.addEventListener('click', () => { navTick(); b.textContent = 'Tell Mia: “add …”'; }));
function exportDiary(kind){                           // "Take my diary with me": a real file, made here, never sent anywhere
  const days = Object.keys(DAYS).map(Number).sort((a,b) => a-b);
  let body, type, ext;
  if (kind === 'JSON'){ body = JSON.stringify(days.map(n => ({date:`2026-10-${String(n).padStart(2,'0')}`, title: DAYS[n].title || '', lines: DAYS[n].lines})), null, 2); type = 'application/json'; ext = 'json'; }
  else if (kind === 'CSV'){ body = 'date,title,line\n' + days.flatMap(n => DAYS[n].lines.map(l => `2026-10-${String(n).padStart(2,'0')},"${(DAYS[n].title||'').replace(/"/g,'""')}","${l.replace(/"/g,'""')}"`)).join('\n'); type = 'text/csv'; ext = 'csv'; }
  else { body = '# My diary\n\n' + days.map(n => `## ${n} October 2026${DAYS[n].title ? ' · ' + DAYS[n].title : ''}\n\n` + DAYS[n].lines.map(l => `- ${l}`).join('\n')).join('\n\n') + '\n'; type = 'text/markdown'; ext = 'md'; }
  const name = `mia-diary.${ext}`, plain = () => { const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([body], {type})); a.download = name; a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 2000); };
  tone(P[7],0,2,.04,.02);
  // in the hosted prototype the viewer confirms the save; in the app (or a plain browser) it downloads directly
  const host = window.claude && window.claude.use ? window.claude.use('downloads') : null;
  if (!host) { plain(); return; }
  host.then(dl => dl ? dl.save({filename: name, data: body}).catch(() => {}) : plain());
}
let flowPause = false;
