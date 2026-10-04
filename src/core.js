/* =====================================================================
   CORE: shell, awning navigation, road + truck, question break, score,
   keyboard, reset, stopwatch. You should not need to edit below here.
   ===================================================================== */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');
const S = { cur: 0, t: {}, score: { burger: 0, fries: 0 }, qb: null, scale: 1, sw: { run: false, acc: 0, t0: 0 }, hintOn: true };
const TABS = [];
const STOPS = [['Farm', 'farm'], ['Factory', 'factory'], ['Distribution Centre', 'dc'], ['Truck Stop', 'stop'], ['Store', 'store'], ['Customer', 'home']];
const STOP_OF = [0, 1, 1, 2, 2, 4, 2, 3, 4, 5]; // which stop the truck visits for tabs 1..10
const stopX = i => 110 + i * 229;
const b13 = () => '<span class="b13">as of 2013</span>';
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
function build() {
  $('#app').innerHTML = `
  <div id="open"></div>
  <div id="awning"><div id="tabs"></div></div>
  <div id="stage" class="panel"><div id="hd"></div><div id="bd"></div></div>
  <div id="score"></div><div id="ctl"></div><div id="sw">0:00</div><div id="hintchip" data-a="hintt" style="cursor:pointer">H = keys</div>
  <div id="strip"><div class="pave"></div><div class="road"></div></div>
  <div id="concepts"></div><div id="hint" class="panel"></div><div id="qb"></div><div id="toast"></div>`;
  // awning tabs
  let t = `<span class="sp">${SP.archS(3)}</span>`;
  [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].forEach(n => { t += `<button class="tabsign" data-a="tab" data-v="${n}" title="${SEGMENTS[n - 1].title}">${n % 10}</button>`; });
  t += `<span class="sp">${SP.archS(3)}</span>`;
  $('#tabs').innerHTML = t;
  // road strip
  let st = '';
  STOPS.forEach((s, i) => { st += `<div class="stop" data-i="${i}" style="left:${stopX(i)}px"><span class="bld">${SP[s[1]](s[1] === 'store' ? 1.3 : 3.5)}</span><span class="lb">${s[0]}</span></div>`; });
  st += `<div id="truck" style="left:${stopX(0) - 38}px">${SP.truck(2)}</div>`;
  $('#strip').insertAdjacentHTML('beforeend', st);
  // opening scene
  $('#open').innerHTML = `
   <div style="position:absolute;left:90px;top:210px">${SP.cloud(8)}</div><div style="position:absolute;left:1120px;top:150px">${SP.cloud(7)}</div><div style="position:absolute;left:760px;top:280px">${SP.cloud(5)}</div>
   <div class="sign panel"><h1>McDonald’s India<br>Supply Chain</h1><div class="lg" style="margin-top:6px">From farm to customer, in ten stops</div></div>
   <div class="pave"></div><div class="road"></div>
   <div style="position:absolute;left:467px;bottom:184px">${SP.store(6)}</div>
   <div style="position:absolute;left:330px;bottom:184px">${SP.lamp(8)}</div>
   <div style="position:absolute;left:960px;bottom:184px">${SP.tree(9)}</div>
   <div style="position:absolute;left:150px;bottom:184px">${SP.tree(7)}</div>
   <div style="position:absolute;left:1180px;bottom:184px">${SP.lamp(8)}</div>
   ${[40, 250, 300, 900, 1090, 1250].map(x => `<div style="position:absolute;left:${x}px;bottom:182px">${SP.grass(6)}</div>`).join('')}
   <div style="position:absolute;left:1000px;bottom:16px">${SP.truck(4)}</div>
   <div class="go btn">Press Space to start</div><div style="position:absolute;left:0;right:0;bottom:8px;text-align:center"><span class="chip">1-9, 0 jump to a tab &middot; Space = next step &middot; H = all shortcuts</span></div>`;
  $('#hint').innerHTML = `<div class="row" style="justify-content:space-between"><h3 class="mono">Keyboard</h3><button class="btn sm" data-a="hint">Hide</button></div>
   <div class="k"><kbd>1-9, 0</kbd><span>Go to tab 1 to 9, tab 10</span><kbd>PgUp / PgDn</kbd><span>Previous / next tab</span>
   <kbd>Space / Enter</kbd><span>Main action, next step</span><kbd>← / →</kbd><span>Step back / forward</span>
   <kbd>M</kbd><span>Next mode in this tab</span><kbd>T</kbd><span>Question Break now</span><kbd>Esc</kbd><span>Close Question Break</span>
   <kbd>B / Y / S</kbd><span>Point Burger / Fries / Skip</span><kbd>C</kbd><span>Concept links</span><kbd>R</kbd><span>Reset this tab</span>
   <kbd>F</kbd><span>Fullscreen</span><kbd>P</kbd><span>Stopwatch start/pause/reset</span><kbd>↑ / ↓</kbd><span>Adjust (Tab 6)</span><kbd>H</kbd><span>This panel</span></div>
   <button class="btn red sm" data-a="scorereset" id="srbtn">Reset scores</button>`;
  renderScore(); fit();
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
  ['#awning', '#stage', '#score', '#sw', '#hintchip', '#strip', '#ctl'].forEach(s => $(s).style.display = n === 0 ? 'none' : '');
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
  const letters = 'ABC';
  const multi = tab.modes.length > 1;
  $('#hd').innerHTML = `<div class="r1"><span class="num">${sg.n}</span><h1>${esc(sg.title)}</h1><span class="tag ${sg.domain}">${sg.domain}</span><span class="spk">${esc(sg.speaker)}</span></div>
    <div class="def">${esc(sg.def)}</div>
    `;
  $('#ctl').innerHTML = `${multi ? `<span class="pill" title="Press M to switch mode">Mode ${letters[t.mode]}: ${esc(tab.modes[t.mode].name)} &middot; M</span>` : ''}<button class="btn sm" data-a="reset">Reset (R)</button>`;
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
  bd.style.paddingBottom = '22px';
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
  else if (S.cur < 10) openQB();
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
      e.style.transition = `${cssp} ${ms || 600}ms steps(8)`; e.style[p] = to;
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

/* ---------- score ---------- */
function renderScore() {
  $('#score').innerHTML = `<div class="t b"><span>${TEAMS.burger}</span><b>${S.score.burger}</b></div><div class="t f"><span>${TEAMS.fries}</span><b>${S.score.fries}</b></div>`;
}

/* ---------- question break ---------- */
function openQB() {
  if (!S.cur) return; const q = QUESTIONS[S.cur];
  if (!q) return toast('No question for this segment');
  if (S.qb) return;
  closeConcepts();
  S.qb = { n: S.cur, rev: false, aw: null };
  $('#qb').innerHTML = `<div class="ticket"><div class="th"><span>ORDER TICKET #${S.cur}</span><span>Question for the class</span></div>
    <div class="tq">${esc(q.q)}</div><div class="ta" id="qa"></div><div class="tb" id="qbtn"></div><div class="tm"><i></i></div></div>`;
  $('#qb').classList.add('on'); updQB();
}
function updQB() {
  const q = S.qb; if (!q) return;
  $('#qa').innerHTML = q.rev ? `<span class="stamp gold">${esc(QUESTIONS[q.n].a)}</span>` : `<span class="lg" style="opacity:.6">Space to reveal the answer</span>`;
  $('#qbtn').innerHTML = !q.rev ? '' : q.aw ? `<span class="chip g lg">${q.aw === 'skip' ? 'Skipped. No point.' : '+1 for ' + (q.aw === 'burger' ? TEAMS.burger : TEAMS.fries)}</span><span class="lg" style="align-self:center">Space for next segment</span>`
    : `<button class="btn red" data-a="award" data-v="burger">+1 ${TEAMS.burger} (B)</button><button class="btn" data-a="award" data-v="fries">+1 ${TEAMS.fries} (Y)</button><button class="btn cream" data-a="award" data-v="skip">Skip (S)</button>`;
}
function award(w) {
  const q = S.qb; if (!q || !q.rev || q.aw) return;
  q.aw = w; if (w !== 'skip') S.score[w]++; renderScore(); updQB();
}
function closeQB(advance) {
  if (!S.qb) return; const n = S.qb.n; S.qb = null; $('#qb').classList.remove('on'); $('#qb').innerHTML = '';
  if (advance && n < 10) go(n + 1);
}
function qbSpace() { const q = S.qb; if (!q.rev) { q.rev = true; updQB(); } else closeQB(true); }

/* ---------- concepts, hint, stopwatch ---------- */
function toggleConcepts() {
  const c = $('#concepts'); if (!S.cur) return;
  if (c.classList.contains('on')) return closeConcepts();
  c.innerHTML = `<div class="row" style="justify-content:space-between"><h3 class="mono">Concept links</h3><span class="sm">C to close</span></div><div class="cn mt">${(CONCEPTS[S.cur] || []).map(x => `<div class="cc"><b>${esc(x[0])}.</b> ${esc(x[1])}</div>`).join('')}</div>`;
  c.classList.add('on');
}
function closeConcepts() { $('#concepts').classList.remove('on'); }
function toggleHint(force) { S.hintOn = force === undefined ? !S.hintOn : force; $('#hint').classList.toggle('on', S.hintOn); }
function swTick() {
  const s = S.sw, ms = s.acc + (s.run ? performance.now() - s.t0 : 0), sec = Math.floor(ms / 1000);
  const el = $('#sw'); el.textContent = Math.floor(sec / 60) + ':' + String(sec % 60).padStart(2, '0'); el.classList.toggle('run', s.run);
}
function swPress() {
  const s = S.sw;
  if (!s.run && s.acc === 0) { s.run = true; s.t0 = performance.now(); }
  else if (s.run) { s.acc += performance.now() - s.t0; s.run = false; }
  else { s.acc = 0; }
  swTick();
}

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
  if (a === 'award') return award(v);
  if (a === 'hint') return toggleHint(false);
  if (a === 'hintt') return toggleHint();
  if (a === 'scorereset') {
    if (el.dataset.arm) { S.score = { burger: 0, fries: 0 }; renderScore(); el.textContent = 'Reset scores'; delete el.dataset.arm; toast('Scores reset'); }
    else { el.dataset.arm = 1; el.textContent = 'Click again to confirm'; setTimeout(() => { if (el.dataset.arm) { delete el.dataset.arm; el.textContent = 'Reset scores'; } }, 3000); }
    return;
  }
  const m = S.cur && modeObj(); if (m && m.act) m.act(a, v, ctx());
});
document.addEventListener('click', e => { if (e.target.closest('#open .go')) go(1); });
document.addEventListener('keydown', e => {
  if (e.ctrlKey || e.metaKey || e.altKey) return;
  const k = e.key, K = k.length === 1 ? k.toLowerCase() : k;
  const stop = () => e.preventDefault();
  if (/^[0-9]$/.test(k)) { stop(); return go(k === '0' ? 10 : +k); }
  if (k === 'PageDown') { stop(); return S.cur === 0 ? go(1) : nextTab(); }
  if (k === 'PageUp') { stop(); return prevTab(); }
  if (K === 'f') { stop(); return document.fullscreenElement ? document.exitFullscreen() : document.documentElement.requestFullscreen().catch(() => { }); }
  if (K === 'h') { stop(); return toggleHint(); }
  if (K === 'p') { stop(); return swPress(); }
  if (S.cur === 0) { if (k === ' ' || k === 'Enter' || k === 'ArrowRight') { stop(); go(1); } return; }
  if (k === 'Escape') { stop(); if (S.qb) closeQB(false); else closeConcepts(); return; }
  if (S.qb) {
    if (k === ' ' || k === 'Enter' || k === 'ArrowRight') { stop(); return qbSpace(); }
    if (k === 'ArrowLeft') { stop(); return closeQB(false); }
    if (K === 'b') return award('burger'); if (K === 'y') return award('fries'); if (K === 's') return award('skip');
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
