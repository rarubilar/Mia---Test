const $ = s => document.querySelector(s);
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
document.body.classList.add('intro');

// The UI announces changes; the app (V03) listens on window for 'mia:<type>' and saves them.
const emit = (type, detail) => window.dispatchEvent(new CustomEvent('mia:' + type, {detail}));
