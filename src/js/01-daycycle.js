/* ================= day cycle ================= */
const KEYS = [ // hour, background, wave colour
  [0,'#0A120E','#E7DECC'],[4.5,'#0E1913','#CFC3AB'],[6,'#3A4A3C','#E7DECC'],[7,'#E7DECC','#1F3B2C'],
  [9.5,'#F4F0E6','#1F3B2C'],[13,'#FCFBF8','#1F3B2C'],[17,'#EFE7D6','#1F3B2C'],[18.6,'#CFC3AB','#1F3B2C'],
  [19.6,'#5E6B57','#E7DECC'],[20.6,'#1F3B2C','#E7DECC'],[22.5,'#101C15','#E7DECC'],[24,'#0A120E','#E7DECC']];
const hex = h => [1,3,5].map(i => parseInt(h.slice(i,i+2),16));
const mix = (a,b,t) => a.map((v,i) => Math.round(v+(b[i]-v)*t));
let hour = 12, pal = {};
let ac, master, soundOn = true, analyser = null, freq = null;
function palette(h){
  let i = 0; while (KEYS[i+1][0] < h) i++;
  const [h0,b0,w0] = KEYS[i], [h1,b1,w1] = KEYS[i+1];
  const t = (h-h0)/(h1-h0||1), s = t*t*(3-2*t);
  const bg = mix(hex(b0),hex(b1),s);
  const lum = (0.2126*bg[0]+0.7152*bg[1]+0.0722*bg[2])/255;
  // the wave colour is chosen against the background, so dusk never swallows it
  const k = (v => v*v*(3-2*v))(Math.max(0, Math.min(1, (lum - .40)/.08)));
  const wave = mix([241,234,219],[24,48,35],k);
  const boost = 1 + .9*Math.exp(-Math.pow((lum - .45)/.14, 2));
  return {bg, wave, dark: lum < .5, boost};
}
function applyPalette(){
  pal = palette(hour);
  const r = document.documentElement.style, [R,G,B] = pal.bg;
  const fg = pal.dark ? [231,222,204] : [21,21,20];
  r.setProperty('--bg', `rgb(${R},${G},${B})`);
  r.setProperty('--fg', `rgb(${fg})`);
  r.setProperty('--fg-soft', `rgba(${fg},.64)`);
  r.setProperty('--line', `rgba(${fg},.16)`);
  r.setProperty('--sheet', `rgba(${R},${G},${B},.8)`);
  r.setProperty('--glow', pal.dark ? '#E7DECC' : '#1F3B2C');
  r.setProperty('--tile', pal.dark ? '#D9CFBC' : '#E7DECC');
  document.documentElement.style.colorScheme = pal.dark ? 'dark' : 'light';
  const hh = Math.floor(hour)%24, mm = Math.floor((hour%1)*60);
  $('#timeLbl').textContent = `${String(hh).padStart(2,'0')}:${String(mm).padStart(2,'0')}`;
}
function setNow(){ const d = new Date(); hour = d.getHours()+d.getMinutes()/60; $('#time').value = hour; applyPalette(); }
$('#time').addEventListener('input', e => { hour = +e.target.value; applyPalette(); });
$('#now').addEventListener('click', setNow);
setNow();

