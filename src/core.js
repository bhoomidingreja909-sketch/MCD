/* =====================================================================
   CORE: shell, awning navigation, road + truck, question break,
   keyboard, reset. You should not need to edit below here.
   ===================================================================== */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');
const S = { cur: 0, t: {}, qb: null, scale: 1, hintOn: false };
const TABS = [];
const STOPS = [['Farm', 'farm'], ['Factory', 'factory'], ['Distribution Centre', 'dc'], ['Truck Stop', 'stop'], ['Store', 'store'], ['Customer', 'home']];
const STOP_OF = [0, 1, 1, 2, 2, 4, 2, 3, 4, 5]; // which stop the truck visits for tabs 1..10
const stopX = i => 110 + i * 229;
const b25 = () => '<span class="b13">as of 31 March 2025</span>';
const mdl = n => TABS[n - 1];
const mindex = (n = S.cur) => S.t[n].mode;

function TS(n = S.cur) {
  if (!S.t[n]) S.t[n] = { mode: 0, step: 0, st: mdl(n).init ? mdl(n).init() : {} };
  return S.t[n];
}
const hasOp = (n = S.cur) => !!(mdl(n).opener && TS(n).mode === 0);
const modeObj = (n = S.cur) => mdl(n).modes[TS(n).mode];
const maxStep = (n = S.cur) => modeObj(n).max + (hasOp(n) ? 1 : 0);
const effStep = (n = S.cur) => { const t = TS(n); return hasOp(n) ? (t.step <= 1 ? 0 : t.step - 1) : t.step; };
const rawOf = (e, n = S.cur) => hasOp(n) ? (e === 0 ? 0 : e + 1) : e;

/* context handed to every render/act function */
function ctx() {
  const t = TS();
  return { step: effStep(), st: t.st, raw: t.step, modeIdx: t.mode, rr: render, goEff: e => setStep(rawOf(e)), n: S.cur };
}

/* ---------- build the page ---------- */
function palm(h, lean = 0, id = 0) {
  const fr = [-172, -145, -118, -92, -66, -40, -14, 12, 34].map((a, i) => `<g transform="translate(${100 + lean} 70) rotate(${a})"><path d="M0 0 Q50 -42 118 -4 Q62 8 0 0Z" fill="${i % 2 ? '#2F9E55' : '#47B864'}"/><path d="M6 0 Q50 -20 108 -4" stroke="#1F7A41" stroke-width="2" fill="none" opacity=".6"/></g>`).join('');
  const rings = Array.from({ length: 12 }, (_, i) => `<path d="M${95 + lean * (1 - i / 12) * 0.2} ${120 + i * 24} q8 6 17 0" stroke="#8A5A36" stroke-width="3" fill="none" opacity=".5"/>`).join('');
  return `<svg class="spr" viewBox="0 0 220 420" width="${h * 0.52}" height="${h}"><defs><linearGradient id="pt${id}" x1="0" x2="1"><stop offset="0" stop-color="#B7794A"/><stop offset="1" stop-color="#8A5A36"/></linearGradient></defs><path d="M94 420 Q${90 + lean} 250 ${98 + lean} 70 L${114 + lean} 70 Q${112 + lean * 0.5} 250 118 420Z" fill="url(#pt${id})"/>${rings}${fr}<circle cx="${106 + lean}" cy="74" r="11" fill="#7A4A2A"/></svg>`;
}
const lampSvg = h => `<svg class="spr" viewBox="0 0 170 420" width="${h * 170 / 420}" height="${h}"><rect x="72" y="40" width="9" height="380" rx="4" fill="#3C6272"/><path d="M76 44 Q76 12 118 12 L150 12" stroke="#3C6272" stroke-width="8" fill="none" stroke-linecap="round"/><rect x="138" y="8" width="30" height="14" rx="7" fill="#3C6272"/><ellipse cx="153" cy="25" rx="11" ry="4" fill="#FFF3B0"/><rect x="62" y="396" width="29" height="24" rx="6" fill="#3C6272"/></svg>`;
const shrub = (w, c = '#3FA65B') => `<div style="width:${w}px;height:${w * 0.45}px;background:radial-gradient(circle at 30% 30%,${c},#2A8248);border-radius:50% 50% 14px 14px"></div>`;
function build() {
  $('#app').innerHTML = `
  <div id="open"></div>
  <div id="awning"><div id="tabs"></div></div>
  <div id="stage" class="panel"><div id="hd"></div><div id="bd"></div></div>
  <div id="strip"><div class="pave"></div><div class="road"></div></div>
  <div id="concepts"></div><div id="hint" class="panel"></div><div id="qb"></div><div id="toast"></div>`;
  // awning tabs
  let t = `<span class="sp">${SP.badge(3)}</span>`;
  [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].forEach(n => { t += `<button class="tabsign" data-a="tab" data-v="${n}" title="${SEGMENTS[n - 1].title}">${n % 10}</button>`; });
  t += `<span class="sp">${SP.badge(3)}</span>`;
  $('#tabs').innerHTML = t;
  // road strip
  let st = '';
  STOPS.forEach((s, i) => { st += `<div class="stop" data-i="${i}" style="left:${stopX(i)}px"><span class="bld">${SP[s[1]](s[1] === 'store' ? 1.3 : 3.5)}</span><span class="lb">${s[0]}</span></div>`; });
  st += `<div id="truck" style="left:${stopX(0) - 38}px">${SP.truck(2)}</div>`;
  $('#strip').insertAdjacentHTML('beforeend', st);
  // opening scene
  $('#open').innerHTML = `
   <div class="sign panel"><h1>McDonald\u2019s India<br>Supply Chain</h1><div class="lg" style="margin-top:6px">From farm to customer, in ten stops</div></div>
   <div class="pave"></div><div class="road"></div>
   <div style="position:absolute;left:400px;bottom:200px">${SP.store(7)}</div>
   <div style="position:absolute;left:880px;bottom:30px">${SP.truck(4)}</div>
   <div class="go btn" data-a="start">Start</div>`;
  $('#hint').innerHTML = `<div class="row" style="justify-content:space-between"><h3 class="mono">Presenter keys</h3><button class="btn sm" data-a="hint">Hide</button></div>
   <div class="k"><kbd>1-9, 0</kbd><span>Go to tab 1 to 9, tab 10</span><kbd>PgUp / PgDn</kbd><span>Previous / next tab</span>
   <kbd>Space / Enter</kbd><span>Next step</span><kbd>\u2190 / \u2192</kbd><span>Step back / forward</span>
   <kbd>M</kbd><span>Next mode in this tab</span><kbd>T</kbd><span>Question now</span><kbd>Esc</kbd><span>Close question</span>
   <kbd>1-4</kbd><span>Pick an answer</span><kbd>C</kbd><span>Concept links</span><kbd>R</kbd><span>Reset this tab</span>
   <kbd>F</kbd><span>Fullscreen</span><kbd>\u2191 / \u2193</kbd><span>Adjust (Tab 6)</span><kbd>H</kbd><span>This panel</span></div>`;
  fit();
}
function fit() {
  const s = Math.min(innerWidth / 1366, innerHeight / 768); S.scale = s;
  const a = $('#app'); a.style.transform = `scale(${s})`; a.style.left = (innerWidth - 1366 * s) / 2 + 'px'; a.style.top = (innerHeight - 768 * s) / 2 + 'px';
}
function toast(m) { const t = $('#toast'); t.textContent = m; t.style.display = 'block'; clearTimeout(toast.h); toast.h = setTimeout(() => t.style.display = 'none', 1800); }

/* ---------- navigation ---------- */
function go(n) {
  n = Math.max(0, Math.min(10, n));
  closeQB(false); closeConcepts();
  const prev = S.cur; S.cur = n;
  if (prev === 0 && n > 0) toggleHint(false);
  const open = $('#open'); open.style.display = n === 0 ? 'block' : 'none';
  ['#awning', '#stage', '#strip'].forEach(s => $(s).style.display = n === 0 ? 'none' : '');
  if (n === 0 && !S.t[0]) { /* nothing */ }
  if (n > 0) { moveTruck(STOP_OF[n - 1], prev > 0 ? STOP_OF[prev - 1] : null); render(); }
  $$('.tabsign').forEach(b => b.classList.toggle('on', +b.dataset.v === n));
  $$('.stop').forEach(s => s.classList.toggle('cur', n > 0 && +s.dataset.i === STOP_OF[n - 1]));
}
function moveTruck(to, from) {
  const t = $('#truck'); const x = stopX(to) - 38;
  const cur = parseFloat(t.style.left) || 0;
  t.classList.toggle('flip', x < cur);
  t.style.left = x + 'px';
}
function nextTab() { go(S.cur + 1); }
function prevTab() { go(S.cur - 1); }

/* ---------- stage rendering ---------- */
function renderHead() {
  const sg = SEGMENTS[S.cur - 1], tab = mdl(S.cur), t = TS();
  const multi = tab.modes.length > 1, h = multi ? 86 : 54;
  $('#hd').style.height = h + 'px'; $('#bd').style.top = h + 'px';
  $('#hd').innerHTML = `<div class="r1"><span class="num">${sg.n}</span><h1>${esc(sg.title)}</h1></div>
    ${multi ? `<div class="mh"><span class="chip g">Mode ${'ABC'[t.mode]}</span><span>${esc(tab.modes[t.mode].name)}</span></div>` : ''}`;
}
function render() {
  if (!S.cur) return;
  renderHead();
  const bd = $('#bd'), c = ctx();
  let html;
  try {
    if (hasOp() && c.raw === 1) html = `<div class="opener"><div class="card">${esc(mdl(S.cur).opener)}</div></div>`;
    else html = modeObj().render(c);
  } catch (e) { console.warn('tab fallback', e); html = placeholder(); }
  bd.innerHTML = html;
  bd.style.paddingBottom = '14px';
  post();
}
function placeholder() {
  const sg = SEGMENTS[S.cur - 1];
  return `<div class="col c" style="height:100%;justify-content:center;gap:20px"><div class="mid">${esc(sg.title)}</div><div class="row" style="justify-content:center;gap:30px">${sg.key.map(k => `<div class="card white big" style="font-size:40px;padding:16px 24px">${esc(k)}</div>`).join('')}</div></div>`;
}
function setStep(raw) {
  const t = TS(), mx = maxStep();
  raw = Math.max(0, Math.min(mx, raw));
  const old = effStep(); t.step = raw;
  const m = modeObj(); if (m.sync) m.sync(t.st, effStep(), old, ctx());
  render();
}
function forward() {
  if (S.cur === 0) return go(1);
  const t = TS();
  if (t.step < maxStep()) setStep(t.step + 1);
  else if (QUESTIONS[S.cur]) openQB();
  else if (S.cur < 10) go(S.cur + 1);
}
function backward() { if (S.cur === 0) return; if (S.qb) return closeQB(false); const t = TS(); if (t.step > 0) setStep(t.step - 1); }
function cycleMode() {
  if (!S.cur) return; const tab = mdl(S.cur), t = TS();
  if (tab.modes.length < 2) return toast('This tab has one mode');
  t.mode = (t.mode + 1) % tab.modes.length; t.step = 0; t.st = tab.init ? tab.init() : {}; render();
}
function resetTab() {
  if (!S.cur) return; closeQB(false); closeConcepts();
  const t = TS(), tab = mdl(S.cur); t.step = 0; t.st = tab.init ? tab.init() : {}; render();
}

/* ---------- post-render hooks: tweens, counters, confetti ---------- */
let timers = [], raf = 0;
function post() {
  timers.forEach(clearInterval); timers = []; cancelAnimationFrame(raf);
  const bd = $('#bd');
  const tw = $$('[data-tw]', bd);
  tw.forEach(e => { const [p, f, to, ms] = e.dataset.tw.split('|'); e.style.transition = 'none'; e.style[p] = f; });
  if (tw.length) {
    void bd.offsetHeight;
    requestAnimationFrame(() => requestAnimationFrame(() => tw.forEach(e => {
      const [p, f, to, ms] = e.dataset.tw.split('|'); const cssp = p.replace(/[A-Z]/g, m => '-' + m.toLowerCase());
      e.style.transition = `${cssp} ${ms || 600}ms cubic-bezier(.3,.7,.25,1)`; e.style[p] = to;
    })));
  }
  $$('[data-count]', bd).forEach(e => {
    const [to, ms, dec, pre, suf] = e.dataset.count.split('|'); const total = +to; const dur = +ms || 800; const t0 = performance.now();
    const fmt = v => (pre || '') + v.toFixed(+dec || 0) + (suf || '');
    e.textContent = fmt(0);
    const id = setInterval(() => {
      const p = Math.min(1, (performance.now() - t0) / dur), q = Math.floor(p * 12) / 12;
      e.textContent = fmt(total * (p >= 1 ? 1 : q));
      if (p >= 1) clearInterval(id);
    }, 50);
    timers.push(id);
  });
  const cv = $('#confetti', bd); if (cv) confetti(cv);
  const m = modeObj(); if (m.post) m.post(ctx());
}
function confetti(cv) {
  const w = cv.width = 1300, h = cv.height = 470, g = cv.getContext('2d');
  const cols = ['#D2403F', '#F5C518', '#4CAF50', '#7FB6EA', '#9B7FD6', '#F0A35E'];
  const ps = Array.from({ length: 90 }, () => ({ x: Math.random() * w, y: -Math.random() * h, v: 3 + Math.random() * 4, s: 8 + Math.floor(Math.random() * 3) * 4, c: cols[Math.floor(Math.random() * cols.length)] }));
  (function tick() {
    g.clearRect(0, 0, w, h);
    ps.forEach(p => { p.y += p.v; if (p.y > h) { p.y = -10; p.x = Math.random() * w; } g.fillStyle = p.c; g.fillRect(Math.round(p.x / 4) * 4, Math.round(p.y / 4) * 4, p.s, p.s); });
    raf = requestAnimationFrame(tick);
  })();
}

/* ---------- question (multiple choice) ---------- */
function openQB() {
  if (!S.cur) return; const q = QUESTIONS[S.cur];
  if (!q) return toast('No question for this segment');
  if (S.qb) return;
  closeConcepts();
  S.qb = { n: S.cur, rev: false, pick: null };
  $('#qb').innerHTML = `<div class="ticket"><div class="th"><span>Question</span><span>${SEGMENTS[S.cur - 1].title}</span></div>
    <div class="tq">${esc(q.q)}</div><div class="opts" id="qo"></div><div class="ta" id="qa"></div><div class="tb" id="qbtn"></div></div>`;
  $('#qb').classList.add('on'); updQB();
}
function pickOpt(i) { const q = S.qb; if (!q || q.rev || i >= QUESTIONS[q.n].opts.length) return; q.pick = i; updQB(); }
function updQB() {
  const q = S.qb; if (!q) return; const Q = QUESTIONS[q.n];
  $('#qo').innerHTML = Q.opts.map((o, i) => `<button class="opt ${q.pick === i ? 'sel' : ''} ${q.rev && i === Q.correct ? 'right' : ''} ${q.rev && q.pick === i && i !== Q.correct ? 'wrong' : ''} ${q.rev && i !== Q.correct && q.pick !== i ? 'dim' : ''}" data-a="opt" data-v="${i}"><b>${'ABCD'[i]}</b><span>${esc(o)}</span></button>`).join('');
  $('#qa').innerHTML = q.rev ? `${q.pick === null ? '' : `<span class="chip ${q.pick === Q.correct ? 'g' : 'r'} lg" style="margin-right:14px">${q.pick === Q.correct ? 'Correct!' : 'Not quite'}</span>`}<span class="stamp gold">${esc(Q.a)}</span>` : '';
  $('#qbtn').innerHTML = q.rev ? `<button class="btn" data-a="qnext">Continue</button>` : `<button class="btn" data-a="qshow">Show answer</button>`;
}
function closeQB(advance) {
  if (!S.qb) return; const n = S.qb.n; S.qb = null; $('#qb').classList.remove('on'); $('#qb').innerHTML = '';
  if (advance && n < 10) go(n + 1);
}
function qbSpace() { const q = S.qb; if (!q.rev) { q.rev = true; updQB(); } else closeQB(true); }

/* ---------- concepts, hint ---------- */
function toggleConcepts() {
  const c = $('#concepts'); if (!S.cur) return;
  if (c.classList.contains('on')) return closeConcepts();
  c.innerHTML = `<div class="row" style="justify-content:space-between"><h3 class="mono">Concept links</h3><span class="sm">C to close</span></div><div class="cn mt">${(CONCEPTS[S.cur] || []).map(x => `<div class="cc"><b>${esc(x[0])}.</b> ${esc(x[1])}</div>`).join('')}</div>`;
  c.classList.add('on');
}
function closeConcepts() { $('#concepts').classList.remove('on'); }
function toggleHint(force) { S.hintOn = force === undefined ? !S.hintOn : force; $('#hint').classList.toggle('on', S.hintOn); }

/* ---------- drag (mouse, touchpad, touch) ---------- */
let drag = null;
document.addEventListener('pointerdown', e => {
  const it = e.target.closest('.item[data-drag]'); if (!it) return;
  e.preventDefault();
  const r = it.getBoundingClientRect(), cl = it.cloneNode(true); cl.classList.add('drag'); cl.style.transformOrigin = '0 0'; cl.style.transform = `scale(${S.scale}) rotate(-3deg)`;
  document.body.appendChild(cl); drag = { id: it.dataset.drag, cl, dx: e.clientX - r.left, dy: e.clientY - r.top }; cl.style.left = r.left + 'px'; cl.style.top = r.top + 'px';
});
document.addEventListener('pointermove', e => { if (drag) { drag.cl.style.left = (e.clientX - drag.dx) + 'px'; drag.cl.style.top = (e.clientY - drag.dy) + 'px'; } });
document.addEventListener('pointerup', e => {
  if (!drag) return; const d = drag; drag = null; d.cl.remove();
  const tgt = document.elementsFromPoint(e.clientX, e.clientY).find(x => x.dataset && x.dataset.drop);
  const m = S.cur && modeObj(); if (tgt && m && m.drop) m.drop(d.id, tgt.dataset.drop, ctx());
});

/* ---------- input ---------- */
document.addEventListener('click', e => {
  const el = e.target.closest('[data-a]'); if (!el) return;
  const a = el.dataset.a, v = el.dataset.v;
  if (a === 'tab') return go(+v);
  if (a === 'reset') return resetTab();
  if (a === 'qshow') return qbSpace();
  if (a === 'qnext') return closeQB(true);
  if (a === 'start') return go(1);
  if (a === 'opt') return pickOpt(+v);
  if (a === 'hint') return toggleHint(false);
  if (a === 'hintt') return toggleHint();
  const m = S.cur && modeObj(); if (m && m.act) m.act(a, v, ctx());
});
document.addEventListener('keydown', e => {
  if (e.ctrlKey || e.metaKey || e.altKey) return;
  const k = e.key, K = k.length === 1 ? k.toLowerCase() : k;
  const stop = () => e.preventDefault();
  if (S.qb && /^[1-4]$/.test(k)) { stop(); return pickOpt(+k - 1); }
  if (/^[0-9]$/.test(k)) { stop(); return go(k === '0' ? 10 : +k); }
  if (k === 'PageDown') { stop(); return S.cur === 0 ? go(1) : nextTab(); }
  if (k === 'PageUp') { stop(); return prevTab(); }
  if (K === 'f') { stop(); return document.fullscreenElement ? document.exitFullscreen() : document.documentElement.requestFullscreen().catch(() => { }); }
  if (K === 'h') { stop(); return toggleHint(); }
  if (S.cur === 0) { if (k === ' ' || k === 'Enter' || k === 'ArrowRight') { stop(); go(1); } return; }
  if (k === 'Escape') { stop(); if (S.qb) closeQB(false); else closeConcepts(); return; }
  if (S.qb) {
    if (k === ' ' || k === 'Enter' || k === 'ArrowRight') { stop(); return qbSpace(); }
    if (k === 'ArrowLeft') { stop(); return closeQB(false); }
    return;
  }
  if (k === ' ' || k === 'Enter' || k === 'ArrowRight') { stop(); return forward(); }
  if (k === 'ArrowLeft') { stop(); return backward(); }
  if (k === 'ArrowUp' || k === 'ArrowDown') { stop(); const m = modeObj(); if (m.key) m.key(k, ctx()); return; }
  if (K === 'm') return cycleMode();
  if (K === 'r') return resetTab();
  if (K === 't') return openQB();
  if (K === 'c') return toggleConcepts();
});
addEventListener('resize', fit);

/* ---------- small html helpers used by the tabs ---------- */
const N = (i, step) => i === step - 1 ? ' new' : '';          // newest item gets the pop animation
const cap = t => `<div class="cap-bar">${t}</div>`;
const res = (v, l, o = {}) => `<div class="card white res ${o.cls || ''}"><b ${o.count ? `data-count="${o.count}"` : ''}>${v}</b><span class="sm">${l}</span></div>`;
const zoneColor = z => ZONES[z].color;
