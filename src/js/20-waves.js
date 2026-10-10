/* ================= waves ================= */
const cv = $('#waves'), cx = cv.getContext('2d');
const mc = $('#morph'), mcx = mc.getContext('2d');
let W, H, dpr;
function resize(){ dpr = Math.min(devicePixelRatio||1,2); W = innerWidth; H = innerHeight;
  for (const [c,g] of [[cv,cx],[mc,mcx]]){ c.width = W*dpr; c.height = H*dpr; g.setTransform(dpr,0,0,dpr,0,0); } }
addEventListener('resize', resize); resize();

const ribbons = [
  {y:.56, a:52, k:1.6, s:.22, p:0,   strands:18, spread:16, alpha:.10},
  {y:.60, a:38, k:2.3, s:-.16,p:2.1, strands:14, spread:24, alpha:.07},
  {y:.52, a:64, k:1.1, s:.12, p:4.0, strands:10, spread:10, alpha:.06},
  {y:.58, a:46, k:1.9, s:.19, p:1.2, strands:8,  spread:12, alpha:.075},   // v02.9.1: two more lines
  {y:.54, a:58, k:.8,  s:-.10,p:5.2, strands:6,  spread:8,  alpha:.065},
];
// v02.9.1: an almost transparent cloth, like a cape of light, folding along the waves
const cloths = [
  {y:.57, a:70, k:1.25, s:.08, p:3.1, strands:2, spread:120, alpha:.045},
  {y:.53, a:48, k:.9,  s:-.06, p:.7,  strands:2, spread:70,  alpha:.03},
];
function drawCloth(cl, wr, wg, wb){
  const st = Math.max(8, W/140), top = [], bot = [];
  for (let x=-st; x<=W+st; x+=st){ top.push([x, yAt(cl,x,0,t)]); bot.push([x, yAt(cl,x,2,t)]); }
  const a = cl.alpha*SUBTLE*dim*(pal.dark?1.5:1)*pal.boost, c = v => `rgba(${wr},${wg},${wb},${Math.max(0,v)})`;
  let y0 = 1e9, y1 = -1e9; for (const q of top.concat(bot)){ if (q[1] < y0) y0 = q[1]; if (q[1] > y1) y1 = q[1]; }
  cx.beginPath(); top.forEach(([x,y],i) => i ? cx.lineTo(x,y) : cx.moveTo(x,y));
  for (let i=bot.length-1;i>=0;i--) cx.lineTo(bot[i][0], bot[i][1]); cx.closePath();
  const g = cx.createLinearGradient(0,y0,0,Math.max(y0+1,y1));
  g.addColorStop(0,c(a*1.7)); g.addColorStop(.45,c(a*.35)); g.addColorStop(1,c(a*1.1));
  cx.fillStyle = g; cx.fill();
  cx.strokeStyle = c(a*2.6); cx.lineWidth = 1.2; cx.beginPath(); top.forEach(([x,y],i) => i ? cx.lineTo(x,y) : cx.moveTo(x,y)); cx.stroke(); cx.lineWidth = 1;
}
// v02.9.3: Mia's voice lives in the waves. VOICE = how loud she is speaking now (0..1), PLAIN = how still they go while she listens,
// TALK = the extra lines that join while she talks, CHAT = the chat is open, HOMEORB = her circle on home is visible.
let THINK = 0, thinkTarget = 0, VOICE = 0, PLAIN = 0, TALK = 0, CHAT = 0, HOMEORB = 0, vt = 0, voiceTarget = 0, plainTarget = 0, chatTarget = 0;
/* V02.12.4: the sparks already floating near her are the first to gather: pulled in and turned slowly around her light */
let thinkSince = 0;
function gatherIn(x, y){
  const cy = miaY(), dx = x - W/2, dy = y - cy, R = Math.min(W, H) * .32, d = Math.hypot(dx, dy);
  const w = THINK * CHAT * Math.exp(-(d/R)*(d/R)); if (w < .002) return [x, y];
  const a = w * 1.4 + vt * .28 * .1 * w, k = 1 - .55*w, c = Math.cos(a), s = Math.sin(a);
  return [W/2 + (dx*c - dy*s*1.6)*k, cy + (dx*s/1.6 + dy*c)*k];
}
const swirl = Array.from({length:170}, () => ({a: Math.random()*6.283, R: .35 + Math.random()*.75, v: .16 + Math.random()*.18, o: Math.random(), z: Math.random()}));
const voiceRibbons = [
  {y:.56, a:40, k:2.8, s:.30, p:.9,  strands:9, spread:20, alpha:.08},
  {y:.55, a:30, k:3.6, s:-.26,p:3.3, strands:7, spread:14, alpha:.07},
];
// v02.9.2: the lines blend 40% more into the background
const SUBTLE = .6;
// v02.9.2: broad soft swells far behind the lines, like the PS3 background. Drawn small and blurred, then stretched.
const swells = [
  {y:.30, tilt:.14,  a:.09, k:.55, s:.05,  p:.4,  th:.22, alpha:1},
  {y:.50, tilt:-.08, a:.07, k:.80, s:-.04, p:2.3, th:.15, alpha:.8},
  {y:.72, tilt:.06,  a:.06, k:.45, s:.03,  p:4.1, th:.26, alpha:.7},
];
const SW = 6, bgc = document.createElement('canvas'), bgx = bgc.getContext('2d');
function swellSize(){ bgc.width = Math.ceil(W/SW); bgc.height = Math.ceil(H/SW); bgx.setTransform(1/SW,0,0,1/SW,0,0); }
addEventListener('resize', swellSize); swellSize();
function drawSwells(wr, wg, wb){
  const A = (pal.dark ? .09 : .045) * dim * LINE * (pal.dark ? 1 : pal.boost);
  if (A < .002) return;
  bgx.clearRect(0,0,W,H);
  const st = W/48, crests = [];
  for (const sw of swells){
    const top = [], bot = [];
    for (let x=-st*2; x<=W+st*2; x+=st){
      const n = x/W, y = H*(sw.y + sw.tilt*(n-.5) + sw.a*Math.sin(n*sw.k*6.283 + t*sw.s + sw.p) + sw.a*.35*Math.sin(n*sw.k*4.3 - t*sw.s*1.4 + sw.p*1.7));
      const th = H*sw.th*(.5 + .5*Math.sin(n*3.4 + t*sw.s*.7 + sw.p*2));
      top.push([x,y]); bot.push([x,y+th]);
    }
    const band = (k, a, blur) => {                    // k: how far down the fold the light reaches
      bgx.filter = `blur(${blur}px)`; bgx.fillStyle = `rgba(${wr},${wg},${wb},${a})`; bgx.beginPath();
      top.forEach(([x,y],i) => i ? bgx.lineTo(x,y) : bgx.moveTo(x,y));
      for (let i=bot.length-1;i>=0;i--) bgx.lineTo(bot[i][0], top[i][1] + (bot[i][1]-top[i][1])*k);
      bgx.closePath(); bgx.fill();
    };
    band(1, A*.55*sw.alpha, 5); band(.35, A*.7*sw.alpha, 2.5);
    crests.push([top, sw.alpha]);
  }
  bgx.filter = 'none';
  cx.imageSmoothingEnabled = true; cx.drawImage(bgc, 0, 0, W, H);
  for (const [top, al] of crests){                    // the bright edge of each fold, drawn sharp as a soft glow
    for (const [lw, k] of [[22,.12],[8,.28],[1.4,.7]]){
      cx.lineWidth = lw; cx.strokeStyle = `rgba(${wr},${wg},${wb},${A*k*al})`; cx.beginPath();
      top.forEach(([x,y],i) => i ? cx.lineTo(x,y) : cx.moveTo(x,y)); cx.stroke();
    }
  }
  cx.lineWidth = 1;
}
// v02.9.3: a few lines leave the waves and wind into Mia's circle below the space names
function drawHomeCurves(wr, wg, wb){
  const el = document.getElementById('miaHome'); if (!el) return;
  const r = el.getBoundingClientRect(); if (!r.width) return;
  const ox = r.left + r.width/2, oy = r.top + r.height/2, R0 = r.width*.36;
  const a0 = HOMEORB * LINE * dim * (pal.dark ? .5 : .38) * pal.boost * SUBTLE;
  for (let k=0;k<4;k++){
    const rb = ribbons[k%3], x0 = ox + 170 + k*95 + 40*Math.sin(t*.21 + k*1.7), y0 = yAt(rb, x0, Math.floor(rb.strands/2), t);
    const R = R0 + k*2.6 + 1.5*Math.sin(t*.5 + k), a = -1.1 + k*.62 + .25*Math.sin(t*.13 + k);   // where the line meets the circle
    const ex = ox + Math.cos(a)*R, ey = oy + Math.sin(a)*R, tx = -Math.sin(a), ty = Math.cos(a);
    const g = cx.createLinearGradient(x0, y0, ox, oy);
    g.addColorStop(0,`rgba(${wr},${wg},${wb},0)`); g.addColorStop(.55,`rgba(${wr},${wg},${wb},${a0*.6})`); g.addColorStop(1,`rgba(${wr},${wg},${wb},${a0})`);
    cx.strokeStyle = g; cx.lineWidth = 1.1; cx.beginPath(); cx.moveTo(x0, y0);
    cx.bezierCurveTo(x0 - (x0-ex)*.45, y0, ex - tx*70, ey - ty*70, ex, ey);
    cx.arc(ox, oy, R, a, a + Math.PI*(1.05 + k*.18));        // ...and wraps around it
    cx.stroke();
  }
  cx.lineWidth = 1;
}
// v02.9.1: dust that floats above the waves
const motes = Array.from({length:90}, () => ({x:Math.random(), y:.28+Math.random()*.5, v:.003+Math.random()*.008, o:Math.random()*6.28, z:Math.random()}));
const sparks = Array.from({length:299}, () => ({rb:Math.floor(Math.random()*3), u:Math.random(), r:Math.random(), v:.004+Math.random()*.012, o:Math.random()*6.28, z:Math.random()}));
let t = 0, flow = 1, mood = 0, moodTarget = 0, pulseAt = -10, dim = 1, dimTarget = 1;
const SHAPES = {
  home:        {amp:1,   spread:1,   y:.56, flow:1},
  frozen:      {amp:1,   spread:1,   y:.56, flow:0},
  calendar:    {amp:0,   spread:9,   y:.50, flow:.25},
  record:      {amp:.5,  spread:.7,  y:.62, flow:.35},
  habits:      {amp:.2,  spread:2.2, y:.48, flow:.2},
  seasons:     {amp:.35, spread:.45, y:.56, flow:.3},
  experiments: {amp:.08, spread:3.2, y:.50, flow:.2},
};
let shape = {...SHAPES.home}, shapeTarget = SHAPES.home, morphOn = true;
// pointer: a slow, gentle push. The pointer is smoothed and the whole ribbon bends together, so the pattern never breaks.
let mx = -999, my = -999, smx = -999, smy = -999, pStr = 0, pLast = 0;
addEventListener('pointermove', e => { mx = e.clientX; my = e.clientY; pLast = performance.now(); if (smx < -900){ smx = mx; smy = my; } });
let tracesOn = true, traces = [];

let introStart = null, closeStart = null, AMP = 0, LINE = 0, GLITTER = 0, POINT = 0;
const clamp01 = v => Math.max(0, Math.min(1, v));
const ease = v => { v = clamp01(v); return v*v*(3-2*v); };
function introState(now){
  if (closeStart !== null){
    const s = reduce ? 99 : (now - closeStart)/1000;
    GLITTER = 1 - ease(s/1.0); AMP = 1 - ease((s-.4)/1.6); LINE = 1 - ease((s-1.6)/1.3);
    POINT = s < 2.6 ? ease((s-1.8)/.6) : 1 - ease((s-2.6)/1.4);
    return;
  }
  if (introStart === null){ AMP = 0; LINE = 0; GLITTER = 0; POINT = .25 + .2*Math.sin(now/1000*2*Math.PI/10); return; }
  const s = reduce ? 99 : (now - introStart)/1000;
  POINT = s < 1.6 ? ease(s/0.9) : 1 - ease((s-1.6)/1.0);
  LINE = ease((s-0.6)/1.4); AMP = ease((s-1.8)/1.8); GLITTER = ease((s-2.4)/1.6);
}
function yAt(rb, x, i, time){
  const n = x / W, br = 1 + .08*Math.sin(time*2*Math.PI/10);
  const restless = mood * (Math.sin(n*31 + time*5)*6 + Math.sin(n*57 - time*7)*3);
  const wave = (br*rb.a*Math.sin(n*rb.k*Math.PI*2 + time*rb.s + rb.p) + rb.a*.45*Math.sin(n*rb.k*3.1 - time*rb.s*1.6 + rb.p*1.3)) * (1 - .78*PLAIN);
  let centre = H*(rb.y + shape.y - .56) + (wave + restless)*shape.amp;
  if (VOICE > .002){                      // v02.9.3: her voice: a fast shimmer, strongest in the middle, that follows how she speaks
    const env = Math.pow(Math.sin(Math.PI*clamp01(n)), 1.4);
    centre += VOICE * env * (Math.sin(n*34 + vt*19 + rb.p*3 + i*.25)*11 + Math.sin(n*63 - vt*27 + rb.p)*5 + Math.sin(n*12 + vt*7.5 + i*.1)*9);
  }
  const px = ((time - pulseAt) / 3.2) * (W + 400) - 200;
  if (time - pulseAt < 3.4) centre -= 34 * Math.exp(-Math.pow((x - px)/140, 2));
  if (pStr > .005){                       // the whole ribbon leans, so strands stay parallel
    const dx = x - smx, dy = centre - smy;
    centre += Math.tanh(dy/80) * 24 * pStr * Math.exp(-dx*dx/(2*300*300)) * Math.exp(-dy*dy/(2*220*220));
  }
  if (THINK > .002){                       // V02.12.2 thinking: the waves bend in toward her light and turn around it, softly
    const g = Math.exp(-Math.pow((x - W/2)/(W*.3), 2)), c0 = H*(shape.y);
    centre += (c0 - centre) * THINK * .3 * g + THINK * g * 16 * Math.sin(n*11 - vt*2.4*.28 + rb.p);
  }
  const strand = (i - rb.strands/2) * (rb.spread/rb.strands) * (1 - .55*THINK*Math.exp(-Math.pow((x - W/2)/(W*.3), 2))) * (1.2 + Math.min(1,shape.amp)*Math.sin(n*4.2 + time*.4 + i*.3)) * shape.spread * (1 - .55*PLAIN + .9*VOICE);
  const c = H*.56; return c + (centre + strand - c)*AMP;
}
function miaY(){ return yAt(ribbons[0], W/2, ribbons[0].strands/2, t); }   // the middle line of the main wave, at the centre
let current = null;
function frame(now){
  const dt = Math.min(.05, (now - (frame.last||now))/1000); frame.last = now;
  for (const k of ['amp','spread','y','flow']) shape[k] += (shapeTarget[k] - shape[k]) * Math.min(1, dt*1.3);
  flow = shape.flow;
  dim  += (dimTarget  - dim ) * Math.min(1, dt*1.6);
  mood += (moodTarget - mood) * Math.min(1, dt*1.2);
  smx += (mx - smx) * Math.min(1, dt*.7); smy += (my - smy) * Math.min(1, dt*.7);
  const pTarget = (now - pLast < 3000 && introStart !== null && closeStart === null) ? 1 : 0;
  pStr += (pTarget - pStr) * Math.min(1, dt*(pTarget ? .6 : .35));
  if (!reduce && !flowPause) t += dt * flow;                 // v02.10: paused capture = still waves
  if (thinkTarget && THINK < .01) thinkSince = vt;
  vt += dt; THINK += (thinkTarget - THINK) * Math.min(1, dt*(thinkTarget ? 1.4 : 2.6)); VOICE += (voiceTarget - VOICE) * Math.min(1, dt*(voiceTarget > VOICE ? 14 : 6));
  PLAIN += (plainTarget - PLAIN) * Math.min(1, dt*1.6); CHAT += (chatTarget - CHAT) * Math.min(1, dt*1.4);
  TALK += ((voiceTarget > .05 ? 1 : 0) - TALK) * Math.min(1, dt*(voiceTarget > .05 ? 1.2 : .45));
  const homeT = (introStart !== null && closeStart === null && !current && !CHAT_ON()) ? 1 : 0;
  HOMEORB += (homeT - HOMEORB) * Math.min(1, dt*(homeT ? 1.1 : 3));
  introState(now);
  const [R,G,B] = pal.bg, [wr,wg,wb] = pal.wave;
  cx.globalCompositeOperation = 'source-over';
  cx.fillStyle = `rgb(${R},${G},${B})`; cx.fillRect(0,0,W,H);
  const gy = H*.56, grd = cx.createRadialGradient(W*.55,gy,0,W*.55,gy,Math.max(W,H)*.55);
  grd.addColorStop(0,`rgba(${wr},${wg},${wb},${(pal.dark?.10:.06)*dim*LINE})`); grd.addColorStop(1,`rgba(${wr},${wg},${wb},0)`);
  cx.fillStyle = grd; cx.fillRect(0,0,W,H);
  drawSwells(wr, wg, wb);
  if (POINT > .01){
    const pr = 6 + 70*POINT, pg = cx.createRadialGradient(W/2,H*.56,0,W/2,H*.56,pr);
    pg.addColorStop(0,`rgba(${wr},${wg},${wb},${.9*POINT})`); pg.addColorStop(.25,`rgba(${wr},${wg},${wb},${.35*POINT})`); pg.addColorStop(1,`rgba(${wr},${wg},${wb},0)`);
    cx.fillStyle = pg; cx.fillRect(W/2-pr,H*.56-pr,pr*2,pr*2);
  }
  cx.globalCompositeOperation = pal.dark ? 'lighter' : 'source-over';
  cx.lineWidth = 1;
  const step = Math.max(6, W/180);
  cx.save();
  const half = (W/2 + 20) * LINE;
  cx.beginPath(); cx.rect(W/2 - half, 0, half*2, H); cx.clip();
  for (const cl of cloths) drawCloth(cl, wr, wg, wb);
  const strokeLine = (rb, i) => { cx.beginPath(); for (let x=-step; x<=W+step; x+=step){ const y = yAt(rb,x,i,t); x<=-step+.1 ? cx.moveTo(x,y) : cx.lineTo(x,y); } cx.stroke(); };
  const lit = 1 + .9*VOICE;                                   // v02.9.3: the lines brighten a little with her voice
  for (const rb of (TALK > .01 ? ribbons.concat(voiceRibbons) : ribbons)){
    const join = rb.k > 2.5 ? TALK : 1;                       // the voice lines fade in only while she talks
    for (let i=0;i<rb.strands;i++){
      const edge = 1 - Math.abs(i - rb.strands/2)/(rb.strands/2);
      cx.strokeStyle = `rgba(${wr},${wg},${wb},${rb.alpha*SUBTLE*lit*join*(.35+edge)*dim*(pal.dark?1.25:1)*pal.boost})`;
      strokeLine(rb, i);
    }
  }
  // v02.9.5: her circle now sits on the waves themselves, so the winding lines are off (drawHomeCurves kept for later)
  if (tracesOn && traces.length){
    cx.lineWidth = 1.3;
    traces.forEach((tr,k) => {
      cx.strokeStyle = `rgba(${wr},${wg},${wb},${(pal.dark?.28:.22)*SUBTLE*dim*tr.life})`;
      strokeLine(ribbons[0], ribbons[0].strands/2 + (k - traces.length/2)*1.6 + .5);
      tr.life = Math.min(1, tr.life + dt*.5);
    });
    cx.lineWidth = 1;
  }
  for (const s of sparks){
    if (!reduce) s.u = (s.u + s.v*dt*flow*.35) % 1;
    const sr = ribbons[s.rb]; let x = s.u*W, y = yAt(sr,x,Math.floor(s.r*sr.strands),t) + (s.r-.5)*30*(1+s.z)*Math.max(.3,shape.amp);
    if (THINK > .002) [x, y] = gatherIn(x, y);
    const tw = .35 + .65*Math.abs(Math.sin(t*1.3 + s.o));
    cx.fillStyle = `rgba(${wr},${wg},${wb},${(pal.dark?.75:.45)*SUBTLE*tw*dim*(.3+s.z*.7)*GLITTER})`;
    cx.beginPath(); cx.arc(x,y,.6+s.z*1.4,0,6.283); cx.fill();
  }
  for (const m of motes){
    if (!reduce){ m.x = (m.x + m.v*dt*.25) % 1; }
    let x = m.x*W, y = H*m.y + 14*Math.sin(t*.35 + m.o) * (1+m.z);
    if (THINK > .002) [x, y] = gatherIn(x, y);
    const tw = .2 + .8*Math.pow(Math.abs(Math.sin(t*.6 + m.o)), 3);
    cx.fillStyle = `rgba(${wr},${wg},${wb},${(pal.dark?.5:.3)*SUBTLE*tw*dim*(.25+m.z*.75)*GLITTER})`;
    cx.beginPath(); cx.arc(x,y,.4+m.z*1.1,0,6.283); cx.fill();
  }
  cx.restore();
  if (CHAT > .01){                                           // v02.9.3: in the chat Mia is a point of light in the middle of the waves
    const pr = (16 + 46*VOICE + 8*THINK + 5*Math.sin(vt*2*Math.PI/10)) * CHAT, cy = miaY(), pg = cx.createRadialGradient(W/2,cy,0,W/2,cy,pr*2.2);
    cx.globalCompositeOperation = pal.dark ? 'lighter' : 'source-over';
    if (THINK > .01){                                        // V02.12.2: while she thinks, a wide soft glow that melts into the background
      const R = pr*6 + 60*THINK, hg = cx.createRadialGradient(W/2,cy,0,W/2,cy,R);
      hg.addColorStop(0,`rgba(${wr},${wg},${wb},${(pal.dark?.08:.05)*THINK*CHAT})`); hg.addColorStop(.45,`rgba(${wr},${wg},${wb},${(pal.dark?.025:.015)*THINK*CHAT})`); hg.addColorStop(1,`rgba(${wr},${wg},${wb},0)`);
      cx.fillStyle = hg; cx.fillRect(W/2-R, cy-R, R*2, R*2);
      const late = clamp01((vt - thinkSince - .9) / 1.4);
      for (const sp of swirl){                               // sparks spiral inward to her light, then are born again outside
        const k = (vt*sp.v*.28 + sp.o) % 1, r = (1 - k) * sp.R * Math.min(W, H) * .42, a = sp.a + k*5.2 + vt*.35*.28;   // V02.12.4: 20% slower again
        const x = W/2 + Math.cos(a)*r, y = cy + Math.sin(a)*r*.62, al = Math.sin(Math.PI*k) * THINK * CHAT * (pal.dark ? .9 : .6) * (.4 + .6*sp.z) * .5 * late;   // and 50% softer; these extra sparks come softly, after the near ones
        cx.fillStyle = `rgba(${wr},${wg},${wb},${al})`; cx.beginPath(); cx.arc(x, y, .6 + sp.z*1.4, 0, 6.283); cx.fill();
      }
    }
    pg.addColorStop(0,`rgba(${wr},${wg},${wb},${(.55 + .35*VOICE + .1*THINK)*CHAT})`); pg.addColorStop(.18,`rgba(${wr},${wg},${wb},${(.22 + .05*THINK)*CHAT})`); pg.addColorStop(1,`rgba(${wr},${wg},${wb},0)`);
    cx.fillStyle = pg; cx.fillRect(W/2-pr*2.2, cy-pr*2.2, pr*4.4, pr*4.4); cx.globalCompositeOperation = 'source-over';
  }
  const mh = document.getElementById('miaHome'); if (mh) mh.style.top = miaY() + 'px';
  notesFrame();                                              // v02.10: notification dots ride their waves   // v02.9.6: her dot rides the main wave
  drawMorph(now); updateMute();
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);

const bars = [...document.querySelectorAll('#mute i')], peaks = [.06,.06,.06,.06,.06];
function updateMute(){                      // the little wave moves only with the sound it hears
  if (!analyser || !soundOn){ bars.forEach(b => b.style.transform = 'scaleY(.08)'); return; }
  analyser.getByteFrequencyData(freq);
  const bands = [[2,4],[3,6],[5,9],[8,13],[11,22]];          // ~90–1300 Hz, where Mia's music lives
  bands.forEach(([a,b],i) => {
    let sum = 0; for (let k=a;k<b;k++) sum += freq[k]; const lvl = sum/(b-a)/255;
    peaks[i] = Math.max(lvl, peaks[i]*.995, .06);                 // each bar adapts to its own range, so all five move
    bars[i].style.transform = `scaleY(${Math.min(1, .08 + (lvl/peaks[i])*.92*Math.min(1, lvl*20))})`;
  });
}
cv.addEventListener('click', e => {
  if (current || CHAT_ON() || introStart === null || closeStart !== null) return;
  ringAt(e.clientX, e.clientY, true);
  tone(P[Math.min(P.length-1, Math.floor(e.clientX / W * P.length))], 0, 2.6, .035, .03);
});

