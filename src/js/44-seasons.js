/* ---------- seasons: the home waves dissolve into the stream ---------- */
const spts = Array.from({length:520}, () => ({u:Math.random(), r:(Math.random()+Math.random()+Math.random()-1.5), z:Math.random(), s:Math.random()*6.28, rb:Math.floor(Math.random()*3), si:Math.random()}));
function seasonPos(p, w, h, tt){
  const mid = h/2, base = mid + 18*Math.sin(p.u*14 + tt*.25) + 10*Math.sin(p.u*37 - tt*.4);
  return [p.u*w, base + p.r*22*(1+.6*Math.sin(p.u*9+tt*.3))];
}
let seasonRAF = 0, morph = null;
function startSeasonMorph(fromHome){
  const box = $('#seasons'); box.classList.remove('ready','labels');
  if (!morphOn || reduce){ drawSeasons(); box.classList.add('ready','labels'); return; }
  // sources: points sitting on the strands of the waves as they are right now
  const src = spts.map(p => { const rb = ribbons[p.rb]; const x = p.u*W*0.9 + W*0.05; return [x, yAt(rb, x, p.si*rb.strands, t)]; });
  morph = {start: performance.now(), src, dur: 2200};
  drawSeasons();
}
function drawSeasons(relabel){
  const box = $('#seasons'), c = $('#seasonCanvas'), g = c.getContext('2d');
  box.querySelectorAll('.chap').forEach(x => x.remove());
  const w = box.clientWidth, h = box.clientHeight, mid = h/2;
  SEASONS.forEach(([name,u,dir,len]) => {
    const el = document.createElement('div'); el.className = 'chap '+dir; el.textContent = name;
    el.style.left = (u*w)+'px'; el.style.setProperty('--h', (len-12)+'px');
    el.style.top = dir==='up' ? (mid-len-16)+'px' : (mid+len)+'px';
    box.appendChild(el);
  });
  cancelAnimationFrame(seasonRAF);
  function loop(ts){
    if (current !== 'seasons') return;
    const d = Math.min(2,devicePixelRatio||1); c.width = w*d; c.height = h*d; g.setTransform(d,0,0,d,0,0);
    const [wr,wg,wb] = pal.wave, tt = reduce ? 0 : ts/1000;
    g.globalCompositeOperation = pal.dark ? 'lighter' : 'source-over';
    for (const p of spts){
      const [x,y] = seasonPos(p, w, h, tt);
      const a = (.25 + .6*Math.abs(Math.sin(tt*.8+p.s))) * (.3 + p.z*.7);
      g.fillStyle = `rgba(${wr},${wg},${wb},${a*(pal.dark?.8:.5)})`;
      g.beginPath(); g.arc(x,y,.5+p.z*1.3,0,6.283); g.fill();
    }
    seasonRAF = requestAnimationFrame(loop);
  }
  seasonRAF = requestAnimationFrame(loop);
}
