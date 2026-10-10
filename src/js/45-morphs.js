let calMorph = null, habMorph = null;
function rrPoint(x, y, w, h, r, u){        // a point at fraction u along a rounded rectangle's outline
  const segs = [w-2*r, Math.PI*r/2, h-2*r, Math.PI*r/2, w-2*r, Math.PI*r/2, h-2*r, Math.PI*r/2];
  const L = segs.reduce((a,b) => a+b, 0); let d = ((u%1)+1)%1 * L, i = 0;
  while (d > segs[i]) { d -= segs[i]; i++; }
  const a = d / r;
  switch (i){
    case 0: return [x+r+d, y];
    case 1: return [x+w-r + Math.sin(a)*r, y+r - Math.cos(a)*r];
    case 2: return [x+w, y+r+d];
    case 3: return [x+w-r + Math.cos(a)*r, y+h-r + Math.sin(a)*r];
    case 4: return [x+w-r-d, y+h];
    case 5: return [x+r - Math.sin(a)*r, y+h-r + Math.cos(a)*r];
    case 6: return [x, y+h-r-d];
    default: return [x+r - Math.cos(a)*r, y+r - Math.sin(a)*r];
  }
}
function startHabMorph(){
  if (!morphOn || reduce){ growScarves(); return; }
  hcards.forEach(c => { c.classList.add('hid'); c.classList.remove('grown'); });
  ['#prevH','#nextH'].forEach(q => $(q).classList.add('hid'));
  habMorph = {start: performance.now(), stage: 0};
}
const sineEase = v => { v = clamp01(v); return .5 - .5*Math.cos(Math.PI*v); };
function drawHabMorph(now){
  const s = (now - habMorph.start)/1000, c = hcards[selH], r = c.getBoundingClientRect();
  const [wr,wg,wb] = pal.wave;
  const conv = sineEase((s-.7)/2.0), tight = sineEase((s-1.9)/1.0);
  const alpha = sineEase(s/.7) * (1 - sineEase((s-3.0)/.9)) * (pal.dark ? .6 : .5);
  const tt = performance.now()/1000;                // its own clock: the strands never stop moving
  mcx.globalCompositeOperation = 'source-over'; mcx.lineWidth = 1;
  const N = 160;
  for (let k=0;k<6;k++){
    const inset = (k - 2.5) * 6 * (1 - tight);
    mcx.strokeStyle = `rgba(${wr},${wg},${wb},${alpha*(k%2 ? .7 : 1)})`; mcx.beginPath();
    for (let j=0;j<=N;j++){
      const x = j/N*W, n = j/N;
      const y = H*.56 + 46*Math.sin(n*Math.PI*2*1.3 + tt*.8 + k*.45) + 18*Math.sin(n*Math.PI*2*3.2 - tt*1.1 + k) + (k-2.5)*8;
      const [tx,ty] = rrPoint(r.left+inset, r.top+inset, r.width-2*inset, r.height-2*inset, 18, n + k*.13 + tt*.035);
      const X = x + (tx-x)*conv, Y = y + (ty-y)*conv; j ? mcx.lineTo(X,Y) : mcx.moveTo(X,Y);
    }
    mcx.stroke();
  }
  const n = HABITS.length, rel = i => { let k = ((i - selH) % n + n) % n; if (k > n/2) k -= n; return Math.abs(k); };
  const plan = [[3.55,0],[3.9,1],[4.15,2],[4.35,3],[4.5,4]];   // only once the waves have finished drawing the card
  plan.forEach(([at,d],idx) => { if (s >= at && habMorph.stage <= idx){ habMorph.stage = idx+1;
    hcards.forEach((h,i) => { if (rel(i) === d) h.classList.remove('hid'); });
    if (d === 0) tone(P[HABITS[selH].note],0,2.6,.05,.02);
    if (d === 1) { ['#prevH','#nextH'].forEach(q => $(q).classList.remove('hid')); growScarves(); } } });
  if (s > 4.7){ hcards.forEach(h => h.classList.remove('hid')); habMorph = null; answer(); }
}
function startCalMorph(){ if (!morphOn || reduce) return; $('#cal').classList.add('veil'); calMorph = {start: performance.now(), dur: 2280}; }
function goHome(){
  if (current === 'calendar' && morphOn && !reduce && !calMorph){
    closeDay(true); $('#cal').classList.add('veil');
    calMorph = {start: performance.now(), dur: 2280, reverse: true};
    setTimeout(() => close(false, true), 2280*.5);
  } else if (current) close();
}
function drawCalMorph(now){
  const cal = $('#cal'), kids = [...cal.children], rect = cal.getBoundingClientRect();
  const tops = []; for (let i=0;i<kids.length;i+=7) tops.push(kids[i].getBoundingClientRect().top); tops.push(rect.bottom);
  const lefts = kids.slice(0,7).map(k => k.getBoundingClientRect().left); lefts.push(rect.right);
  const k = (now - calMorph.start) / calMorph.dur, rev = !!calMorph.reverse, kk = rev ? 1 - k : k;
  const e1 = ease(kk/.5), fade = rev ? ease(k/.1) * (1 - ease((k-.82)/.18)) : 1 - ease((k-.8)/.2);
  const [wr,wg,wb] = pal.wave;
  mcx.globalCompositeOperation = 'source-over'; mcx.lineWidth = 1;
  const step = Math.max(6, W/160);
  tops.forEach((ty,r) => {
    const rb = ribbons[r%3], i = (r/(tops.length-1))*rb.strands;
    mcx.strokeStyle = `rgba(${wr},${wg},${wb},${.45*fade})`; mcx.beginPath();
    for (let x=0; x<=W; x+=step){
      const sy = yAt(rb,x,i,t), tx = rect.left + (x/W)*rect.width;
      const X = x + (tx-x)*e1, Y = sy + (ty-sy)*e1; x === 0 ? mcx.moveTo(X,Y) : mcx.lineTo(X,Y);
    }
    mcx.stroke();
  });
  lefts.forEach((lx,c) => {
    const e2 = ease((kk - .42 - c*.025)/.3); if (e2 <= 0) return;
    mcx.strokeStyle = `rgba(${wr},${wg},${wb},${.45*fade*e2})`; mcx.beginPath();
    mcx.moveTo(lx, rect.top); mcx.lineTo(lx, rect.top + (rect.bottom-rect.top)*e2); mcx.stroke();
  });
  if (!rev && k > .74) cal.classList.remove('veil');
  if (k >= 1){ calMorph = null; cal.classList.remove('veil'); }
}
function drawMorph(now){
  mcx.clearRect(0,0,W,H);
  if (calMorph && (current === 'calendar' || calMorph.reverse)) drawCalMorph(now);
  if (habMorph && current === 'habits') drawHabMorph(now);
  if (!morph || current !== 'seasons') return;
  const box = $('#seasons'), r = box.getBoundingClientRect(), tt = now/1000;
  const k = (now - morph.start) / morph.dur, e = ease(k);
  const [wr,wg,wb] = pal.wave;
  mcx.globalCompositeOperation = pal.dark ? 'lighter' : 'source-over';
  spts.forEach((p,i) => {
    const [sx,sy] = morph.src[i], [tx0,ty0] = seasonPos(p, r.width, r.height, tt), tx = r.left+tx0, ty = r.top+ty0;
    const lift = Math.sin(e*Math.PI) * (20 + 30*p.z) * (i%2 ? 1 : -1);
    const x = sx + (tx - sx)*e, y = sy + (ty - sy)*e + lift;
    const a = (.35 + .5*p.z) * (k < .85 ? 1 : 1 - (k-.85)/.15);
    mcx.fillStyle = `rgba(${wr},${wg},${wb},${a*(pal.dark?.8:.55)})`;
    mcx.beginPath(); mcx.arc(x,y,.5+p.z*1.3,0,6.283); mcx.fill();
  });
  if (k >= .8) box.classList.add('ready');
  if (k >= 1){ box.classList.add('labels'); morph = null; }
}
