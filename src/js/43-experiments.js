/* ---------- experiments: a trail across the dunes (Journey), carried by the wind (Flower) ---------- */
const sand = Array.from({length:320}, () => ({x:Math.random(), y:Math.random(), v:.4+Math.random()*.9, z:Math.random()}));
let duneStart = 0, duneLast = 0;
function curvePts(a, b, w, h, step){        // a soft S-curve from a to b, sampled every few pixels
  const pts = [], len = Math.hypot((b[0]-a[0])*w, (b[1]-a[1])*h), n = Math.max(2, Math.round(len/step));
  for (let i=0;i<=n;i++){ const u = i/n, e = u*u*(3-2*u); pts.push([(a[0] + (b[0]-a[0])*u)*w, (a[1] + (b[1]-a[1])*e)*h]); }
  return pts;
}
function openExperiments(){
  const box = $('#dunes'); box.classList.remove('on'); box.querySelectorAll('.elab').forEach(e => e.remove());
  EXPS.forEach(ex => {
    const l = document.createElement('div'); l.className = 'elab'; l.textContent = ex.label;
    l.style.left = (ex.start[0]*100)+'%'; l.style.top = `calc(${ex.start[1]*100}% - 28px)`; box.appendChild(l);
    ex.ends.forEach(en => { const e = document.createElement('div'); e.className = 'elab' + (en.taken ? '' : ' soft'); e.textContent = en.text;
      e.style.left = `calc(${en.p[0]*100}% + 14px)`; e.style.top = `calc(${en.p[1]*100}% - 7px)`; box.appendChild(e); });
  });
  duneStart = duneLast = performance.now(); sand.forEach(p => p.x = Math.random()*-.6);
  if (!reduce) tone(P[1], .1, 4, .03, 1.2);     // the gust
  requestAnimationFrame(duneLoop);
}
function duneLoop(now){
  if (current !== 'experiments') return;
  const box = $('#dunes'), c = $('#duneCanvas'), g = c.getContext('2d');
  const w = box.clientWidth, h = box.clientHeight, d = Math.min(2, devicePixelRatio||1);
  if (c.width !== Math.round(w*d)) { c.width = w*d; c.height = h*d; }
  g.setTransform(d,0,0,d,0,0); g.clearRect(0,0,w,h);
  const s = reduce ? 99 : (now - duneStart)/1000, dt = Math.min(.05,(now - duneLast)/1000); duneLast = now;
  const tt = now/1000, [wr,wg,wb] = pal.wave;
  // dunes: four soft layers drifting very slowly, faded at every edge and arriving with the gust
  const appear = ease(s/1.4);
  for (let L=0; L<4; L++){
    const base = h*(.30 + L*.19);
    g.beginPath(); g.moveTo(0,h);
    for (let x=0;x<=w;x+=8){ g.lineTo(x, base + 16*Math.sin(x/w*Math.PI*2*(.55+L*.18) + tt*.04*(L+1) + L*1.7) + 7*Math.sin(x/w*Math.PI*2*2.1 - tt*.03 + L)); }
    g.lineTo(w,h); g.closePath(); g.fillStyle = `rgba(${wr},${wg},${wb},${(.028 + L*.008)*appear})`; g.fill();
  }
  g.globalCompositeOperation = 'destination-in';              // soft edges: no visible borders on any side
  const fx = g.createLinearGradient(0,0,w,0); fx.addColorStop(0,'rgba(0,0,0,0)'); fx.addColorStop(.16,'#000'); fx.addColorStop(.84,'#000'); fx.addColorStop(1,'rgba(0,0,0,0)');
  g.fillStyle = fx; g.fillRect(0,0,w,h);
  const fy = g.createLinearGradient(0,0,0,h); fy.addColorStop(0,'rgba(0,0,0,0)'); fy.addColorStop(.3,'#000'); fy.addColorStop(.72,'#000'); fy.addColorStop(1,'rgba(0,0,0,0)');
  g.fillStyle = fy; g.fillRect(0,0,w,h);
  g.globalCompositeOperation = 'source-over';
  const edge = x => Math.min(1, x/(w*.1), (w-x)/(w*.1));
  // the gust: sand sweeps across, then settles into a slow drift
  const gust = 1 - ease((s-.2)/2.2);
  sand.forEach(p => {
    p.x += dt * p.v * (.03 + gust*.9); if (p.x > 1.05) p.x -= 1.1;
    const y = (p.y*h) + Math.sin(p.x*12 + p.z*6)*6;
    g.fillStyle = `rgba(${wr},${wg},${wb},${(.12 + gust*.35)*(.4+p.z*.6)*Math.max(0, edge(p.x*w))})`;
    g.fillRect(p.x*w, y, 1.2 + p.z, 1.2 + p.z);
  });
  // the paths settle after the gust
  const rev = ease((s-1.1)/1.8);
  EXPS.forEach(ex => {
    const trunk = curvePts(ex.start, ex.node, w, h, 9);
    const drawDots = (pts, upto, bright, drift) => {
      const lim = Math.floor(pts.length*upto);
      for (let i=0;i<lim;i++){
        let [x,y] = pts[i]; let a = bright ? .55 + .35*Math.max(0, Math.sin(i*.35 - tt*2.4)) : .22;
        if (drift){ const f = i/pts.length; x += f*f*(14*Math.sin(tt*.6 + i) + (tt*9 + i*13) % 26); y += f*f*6*Math.sin(tt*.8 + i*1.7); a *= 1 - f*.6; }
        g.fillStyle = `rgba(${wr},${wg},${wb},${a})`; g.beginPath(); g.arc(x, y, bright ? 1.6 : 1.2, 0, 6.283); g.fill();
      }
    };
    drawDots(trunk, Math.min(1, rev/.45), true, false);
    ex.ends.forEach(en => drawDots(curvePts(ex.node, en.p, w, h, 9), clamp01((rev-.45)/.55), en.taken, !en.taken));
    const node = [ex.node[0]*w, ex.node[1]*h], st = [ex.start[0]*w, ex.start[1]*h];
    [[st, rev > .02], [node, rev > .45]].forEach(([q,on]) => { if (!on) return; g.fillStyle = `rgba(${wr},${wg},${wb},.85)`; g.beginPath(); g.arc(q[0], q[1], 3.5, 0, 6.283); g.fill(); });
    ex.ends.forEach(en => { if (rev < .98) return; const q = [en.p[0]*w, en.p[1]*h];
      g.strokeStyle = `rgba(${wr},${wg},${wb},${en.taken ? .9 : .3})`; g.beginPath(); g.arc(q[0], q[1], en.taken ? 5 : 3.5, 0, 6.283); g.stroke();
      if (en.taken){ g.fillStyle = `rgba(${wr},${wg},${wb},.9)`; g.beginPath(); g.arc(q[0], q[1], 2.2, 0, 6.283); g.fill(); } });
  });
  if (rev > .9) box.classList.add('on');
  requestAnimationFrame(duneLoop);
}

