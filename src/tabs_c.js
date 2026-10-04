/* =====================================================================
   TABS 8 to 10
   ===================================================================== */
const itemChip = (it, i, extra = '') => `<div class="item" data-drag="${i}" ${extra}>${SP[it.icon](3)}<span>${esc(it.name)}</span></div>`;

/* ---------------- TAB 8 ---------------- */
TABS[7] = {
  init: () => ({ placed: [], door: null, wrong: null }),
  modes: [
    { name: 'Pack the Van', max: VAN_ITEMS.length,
      sync(st, e) {
        if (e > st.placed.length) { const un = VAN_ITEMS.map((_, i) => i).filter(i => !st.placed.includes(i)); while (st.placed.length < e && un.length) st.placed.push(un.shift()); }
        else if (e < st.placed.length) st.placed.length = e;
        st.wrong = null;
      },
      render(c) {
        const st = c.st, tray = VAN_ITEMS.map((it, i) => st.placed.includes(i) ? '' : itemChip(it, i)).join('');
        const zones = Object.keys(ZONES).map(z => {
          const Z = ZONES[z], frosted = st.door && st.door !== z, bad = st.wrong && st.wrong.zone === z;
          const inside = st.placed.filter(i => VAN_ITEMS[i].zone === z).map(i => `<span class="chip ${i === st.placed[st.placed.length - 1] ? 'new' : ''}" style="font-size:16px;padding:0 6px;display:inline-flex;gap:4px;align-items:center;margin:2px">${SP[VAN_ITEMS[i].icon](2)}${esc(VAN_ITEMS[i].name)} <span style="color:#2d7a31">✓</span></span>`).join('');
          return `<div class="zone dropz ${bad ? 'new shake' : ''}" data-drop="${z}" style="flex:1;background:${Z.color};height:196px;overflow:hidden"><div class="mid" style="font-size:24px">${Z.name}</div><div class="sm">${Z.temp}</div><div class="mt">${inside}</div>
            ${bad ? `<span class="stamp" style="position:absolute;right:6px;bottom:6px;font-size:22px;border-width:3px">Damaged!</span>` : ''}
            ${frosted ? `<div style="position:absolute;inset:0;background:repeating-linear-gradient(45deg,rgba(255,255,255,.92) 0 10px,rgba(220,235,245,.92) 10px 20px);display:flex;align-items:center;justify-content:center;flex-direction:column">${SP.snow(5)}<b>Closed</b></div>` : ''}
            ${st.door === z ? '<div class="chip g sm" style="position:absolute;right:6px;top:6px">OPEN</div>' : ''}</div>`;
        }).join('');
        const door = (z, label) => `<button class="btn ${st.door === z ? 'red' : 'cream'} sm" data-a="door" data-v="${z}">${label}</button>`;
        return `<div class="row" style="gap:16px;align-items:flex-start"><div style="width:250px;flex:none"><div class="lg"><b>Items to pack</b></div><div class="col" style="gap:8px;margin-top:6px;min-height:200px">${tray || '<span class="chip g lg new">All packed!</span>'}</div><div class="sm mt">Drag each item into the right zone.</div></div>
          <div class="grow"><div class="row" style="gap:0;align-items:stretch"><div class="row" style="gap:6px;flex:1;background:var(--cream2);border:4px solid var(--ink);padding:8px;box-shadow:6px 6px 0 var(--ink);position:relative">${zones}<div style="position:absolute;left:60px;bottom:-24px;width:40px;height:40px;background:var(--glass);border:4px solid var(--ink)"></div><div style="position:absolute;right:60px;bottom:-24px;width:40px;height:40px;background:var(--glass);border:4px solid var(--ink)"></div></div><div style="margin-left:-4px;margin-top:100px">${SP.cab(6)}</div></div>
          <div class="row" style="gap:12px;margin-top:30px"><span class="cap">Doors:</span>${door('frozen', 'Rear door → Frozen')}${door('chilled', 'Side door 1 → Chilled')}${door('dry', 'Side door 2 → Dry')}<span class="sm">Open one zone without disturbing the others.</span></div>
          <div class="card white mt" style="font-size:19px">West &amp; South vans: chiller section 34 to 40°F (about 1 to 4°C). Freezer section 0 to -10°F (about -18 to -23°C).</div></div></div>`;
      },
      drop(id, zone, c) {
        const st = c.st, i = +id; if (st.placed.includes(i)) return;
        if (VAN_ITEMS[i].zone === zone) { st.placed.push(i); c.goEff(st.placed.length); }
        else { st.wrong = { id: i, zone }; c.rr(); setTimeout(() => { if (st.wrong) { st.wrong = null; if (S.cur === 8) render(); } }, 1400); }
      },
      act(a, v, c) { if (a === 'door') { c.st.door = c.st.door === v ? null : v; c.rr(); } }
    },
    { name: 'One Van, Three Stores', max: 6, render(c) {
      const s = c.step;
      const stores = [['Kharghar Little World', 560, 50], ['Kharghar Pacific', 840, 110], ['Store C, same route', 1090, 160]];
      const stars = Array.from({ length: 26 }, (_, i) => `<i style="position:absolute;left:${(i * 197) % 1280}px;top:${(i * 53) % 150}px;width:4px;height:4px;background:#fff"></i>`).join('');
      let routes = '', movers = '';
      const vansN = s === 0 ? 0 : s === 1 ? 3 : 1;
      if (s === 1) { stores.forEach((t, i) => { const d = `M130 120 L${t[1]} ${t[2] + 14}`; routes += `<path d="${d}" stroke="#F5C518" stroke-width="4" stroke-dasharray="10 8" fill="none"/>`; movers += `<div class="mover" style="offset-path:path('${d}');animation-delay:-${i * 0.5}s;margin:-16px 0 0 -30px">${SP.van(2)}</div>`; }); }
      if (s >= 2) { const d = `M130 120 L560 64 L840 124 L1090 174`; routes += `<path d="${d}" stroke="#4CAF50" stroke-width="5" stroke-dasharray="10 8" fill="none"/>`; movers += `<div class="mover" style="offset-path:path('${d}');margin:-16px 0 0 -30px;${s >= 4 ? 'animation-direction:reverse' : ''}">${SP.van(2)}</div>`; }
      const map = `<div style="position:relative;height:236px;background:#1f2430;border:4px solid var(--ink);box-shadow:6px 6px 0 var(--ink);overflow:hidden">${stars}<div style="position:absolute;right:20px;top:8px">${SP.cloud(4)}</div>
        <div style="position:absolute;left:20px;top:72px">${SP.dc(4)}<div class="chip" style="position:absolute;left:0;bottom:-34px;font-size:16px">DC (night)</div></div>
        <svg width="1294" height="236" style="position:absolute;left:0;top:0" shape-rendering="crispEdges">${routes}</svg>
        ${stores.map(t => `<div style="position:absolute;left:${t[1] - 20}px;top:${t[2] - 6}px">${SP.store(0.9)}<div class="chip" style="position:absolute;left:-30px;top:44px;font-size:15px;white-space:nowrap;padding:0 4px">${t[0]}</div></div>`).join('')}${movers}
        <span class="chip" style="position:absolute;left:12px;top:10px;font-size:15px">illustrative</span>
        ${s ? `<div class="card ${s === 1 ? 'red' : 'gold'} new" style="position:absolute;left:12px;top:40px;padding:2px 10px;display:flex;gap:10px;align-items:center"><b class="big" style="font-size:40px" data-count="${vansN}|500|0">${vansN}</b><span class="sm">${s === 1 ? 'vans needed (one per store)' : 'van needed (one route)'}</span></div>` : ''}</div>`;
      let info = '';
      if (s >= 3) info += `<div class="card white new" style="font-size:18px;line-height:1.15;flex:1;min-width:380px"><b>Outstation:</b> Kolhapur, Satara and Goa are served by combining multiple stores on one route. No dedicated van per outlet.</div>`;
      if (s >= 4) info += `<div class="card white new" style="font-size:18px;line-height:1.15;flex:1;min-width:380px"><b>Return trip:</b> ${['empty bottles', 'racks', 'plastic crates (for buns)'].map(x => `<span class="chip" style="font-size:16px;padding:0 6px">${x}</span>`).join(' ')}</div>`;
      if (s >= 5) info += `<div class="card ${s >= 6 ? 'red' : 'gold'} new" style="font-size:19px;line-height:1.15;width:100%"><b>Tonight\u2019s delivery:</b> ${s >= 6 ? 'DELAYED (about 20% of deliveries): breakdown, driver leave or strike. The store holds operations to unload chilled, freezer and dry stock, then resumes.' : 'ON TIME (about 80% of deliveries). Stock is unloaded and shelved before opening.'}</div>`;
      const lead = s === 0 ? 'Press Space: what is the cheapest way to deliver tonight?' : s === 1 ? 'One van per store: three vans, mostly half empty.' : s === 2 ? 'Route-based consolidation: one van serves about 2 to 3 stores on the same route.' : '';
      return map + `<div class="row" style="gap:10px;flex-wrap:wrap;margin-top:12px;align-items:flex-start">${lead ? `<div class="card white lg grow">${lead}</div>` : ''}${info}</div>`;
    } },
    { name: 'Shelf Life Sets the Schedule', max: 6, render(c) {
      const s = c.step, D = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
      const head = `<div></div>${D.map(d => `<div class="dayh">${d}</div>`).join('')}<div class="sm"><b>Shelf life</b> <span class="chip" style="font-size:13px;padding:0 4px">weekdays illustrative</span></div>`;
      const rows = SHELF_LIFE.map((r, i) => i >= s ? '' : `<div class="row ${i === s - 1 ? 'new left' : ''}" style="gap:6px"><span>${SP[r.icon](3)}</span><b class="lg" style="font-size:20px">${esc(r.item)}</b></div>${D.map((d, k) => `<div>${r.days.includes(k) ? `<div class="dot ${i === s - 1 ? 'new' : ''}" style="animation-delay:${k * 70}ms"></div>` : '<div class="dot off"></div>'}</div>`).join('')}
        <div><div class="row" style="gap:6px"><span class="chip" style="font-size:14px;padding:0 5px;white-space:nowrap">${esc(r.life)}</span><div style="height:18px;flex:1;background:var(--cream2);border:3px solid var(--ink)"><div style="height:100%;width:${r.bar}%;background:${['#D2403F', '#F0A35E', '#A9B858', '#7FB6EA', '#CFCBC0'][i]}" data-tw="width|0%|${r.bar}%|600"></div></div></div><div style="font-size:16px;line-height:1.1">${esc(r.note)}</div></div>`).join('');
      return `<div class="week">${head}${rows}</div>
        ${s >= 6 ? `<div class="cap-bar new"><b>Shorter shelf life = more frequent delivery.</b> Milk comes from local authorised regional suppliers and buns from Taloja, so neither is shipped long distance from Kalamboli.</div>` : ''}`;
    } }
  ]
};

/* ---------------- TAB 9 ---------------- */
const LADDER9 = [['HACCP + SQMS', 'supplier', '#4CAF50'], ['Sensory', 'plant', '#9B7FD6'], ['DQMP', 'warehouse', '#D2403F'], ['QIP', 'store', '#FFFFFF']];
TABS[8] = {
  init: () => ({ dec: [], auto: [], flag: false, waste: 0, gone: [], autoDrop: false }),
  modes: [
    { name: 'Night Shift, QIP and Pyrometer', max: QIP_BOXES.length * 2 + 1,
      render(c) {
        const s = c.step, n = QIP_BOXES.length, st = c.st;
        const bi = s >= 1 && s <= n * 2 ? Math.floor((s - 1) / 2) : -1, phase = s >= 1 && s <= n * 2 ? (s - 1) % 2 : -1; // 0 = reading, 1 = decided
        const box = bi >= 0 ? QIP_BOXES[bi] : null;
        const t = box ? box.tempF : 0, rot = box ? Math.max(-90, Math.min(90, t / 30 * 90)) : -90;
        const cx = 210, cy = 205;
        const RR = [130, 140, 150, 160, 170];
        const band = RR.map(r => pixelDial(cx, cy, r, 90, 120, '#4CAF50', 10)).join('');
        const base = RR.map(r => pixelDial(cx, cy, r, 0, 180, '#CFCBC0', 10)).join('');
        const ticks = [-30, -20, -10, 0, 10, 20, 30].map(v => { const a = (180 - (v + 30) / 60 * 180) * Math.PI / 180; return `<text x="${cx + Math.cos(a) * 196 - 18}" y="${cy - Math.sin(a) * 196 + 6}" font-family="ui-monospace,monospace" font-weight="900" font-size="18">${v > 0 ? '+' : ''}${v}</text>`; }).join('');
        const dial = `<div style="position:relative;width:440px;height:240px;flex:none"><svg width="440" height="240" viewBox="0 0 440 240" shape-rendering="crispEdges">${base}${band}${ticks}</svg>
          <div style="position:absolute;left:${cx - 5}px;top:${cy - 150}px;width:10px;height:150px;background:var(--ink);transform-origin:50% 100%;transform:rotate(${rot}deg)" data-tw="transform|rotate(${bi >= 0 && phase === 0 || s === 0 ? -90 : rot}deg)|rotate(${rot}deg)|900"></div>
          <div style="position:absolute;left:${cx - 14}px;top:${cy - 14}px;width:28px;height:28px;background:var(--red);border:4px solid var(--ink)"></div><div class="chip g" style="position:absolute;left:90px;top:218px;font-size:15px;padding:0 6px">target 0 to -10°F</div></div>`;
        let mid = '<div class="card white lg c grow" style="margin-top:40px">Night shift: the truck is here. Check every box.</div>';
        if (box) {
          const ok = box.ok, dec = st.dec[bi], good = dec === undefined ? null : (dec === 'accept') === ok;
          mid = `<div class="grow col" style="gap:8px"><div class="row" style="gap:14px"><div class="new left">${SP.crate(6)}</div><div><div class="lg"><b>Box ${bi + 1}: ${esc(box.name)}</b></div><div class="big ${ok ? '' : 'red-t'}" data-count="${Math.abs(t)}|900|0|${t < 0 ? '-' : '+'}|°F">${t}°F</div></div></div>
            ${phase === 0 ? `<div class="row" style="gap:14px"><button class="btn" data-a="accept" style="font-size:26px;background:#4CAF50;color:#fff">Accept</button><button class="btn red" data-a="return" style="font-size:26px">Return to DC</button><span class="sm">or press Space</span></div>`
              : `<div class="col new" style="gap:6px;align-items:flex-start">${ok ? '<span class="stamp green">ACCEPTED</span><div class="cap">In range. Into the freezer.</div>' : '<span class="stamp">RETURNED</span><div class="cap"><b>Return to DC. Store is credited.</b></div><div class="cap">Whole-batch issue: escalated by email.</div>'}${st.auto[bi] ? '' : `<span class="chip ${good ? 'g' : 'r'}">Your call: ${dec === 'accept' ? 'Accept' : 'Return'} ${good ? '✓' : '✗'}</span>`}</div>`}</div>`;
        }
        const ladder = `<div class="row" style="gap:10px;margin-top:8px"><span style="width:120px;flex:none;line-height:1.1"><b>Quality checkpoints</b></span>${LADDER9.map((l, i) => `<div class="card c ${s === n * 2 + 1 ? 'new' : ''}" style="flex:1;background:${s === n * 2 + 1 ? l[2] : 'var(--cream)'};color:${l[2] === '#FFFFFF' || s < n * 2 + 1 ? 'var(--ink)' : '#fff'};animation-delay:${i * 200}ms;padding:4px;${s === n * 2 + 1 ? '' : 'opacity:.55'}"><b>${l[0]}</b><div class="sm">${l[1]}</div></div>`).join('')}</div>${s === n * 2 + 1 ? '<div class="cap-bar new">QIP: the last of several quality checkpoints.</div>' : ''}`;
        return `<div class="row" style="gap:14px;align-items:flex-start">${dial}${mid}</div>${ladder}`;
      },
      act(a, v, c) {
        const st = c.st, s = c.step, bi = Math.floor((s - 1) / 2);
        if ((a === 'accept' || a === 'return') && s >= 1 && s % 2 === 1 && s <= QIP_BOXES.length * 2) { st.dec[bi] = a; c.goEff(s + 1); }
      },
      sync(st, e, old) { // Space on a "reading" step auto-decides the correct way
        if (e >= 2 && e % 2 === 0 && e <= QIP_BOXES.length * 2) { const bi = e / 2 - 1; if (st.dec[bi] === undefined) { st.dec[bi] = QIP_BOXES[bi].ok ? 'accept' : 'return'; st.auto[bi] = true; } }
      }
    },
    { name: 'CFD Shelves, FIFO and Waste', max: 6,
      sync(st, e) {
        if (e >= 5 && !st.autoDrop && st.waste === 0) { st.gone.push('1:1'); st.waste = 1; st.autoDrop = true; }
        if (e < 5 && st.autoDrop) { st.gone = st.gone.filter(x => x !== '1:1'); st.waste = Math.max(0, st.waste - 1); st.autoDrop = false; }
      },
      render(c) {
        const s = c.step, st = c.st;
        const shelves = SHELVES.map((sh, zi) => {
          const live = sh.items.map((it, ii) => [it, ii]).filter(x => !st.gone.includes(zi + ':' + x[1]));
          const mn = Math.min(...live.map(x => x[0][1]));
          return `<div class="zone shelf" style="background:${zoneColor(sh.zone)};min-height:172px;padding:4px 10px"><div class="mid" style="font-size:22px">${sh.name}</div><div class="col" style="gap:4px;margin-top:4px">${live.map(([it, ii]) => `<div class="item ${s >= 3 && it[1] === mn ? 'glowitem' : ''}" data-drag="${zi}:${ii}" style="font-size:18px;justify-content:space-between;padding:0 8px"><span>${esc(it[0])}</span><span class="chip" style="font-size:15px;padding:0 5px">${it[1]} days left</span></div>`).join('') || '<span class="sm">Empty</span>'}</div></div>`;
        }).join('');
        const bin = `<div class="zone c ${s >= 5 ? '' : 'ghost'}" data-drop="bin" style="width:250px;background:#fff;min-height:172px;padding:2px">${SP.bin(4)}<div class="mid" style="font-size:24px">Raw Waste</div><div class="mid red-t" data-count="${st.waste}|500|0">${st.waste}</div><div class="sm">${s >= 5 ? 'Drag items here' : 'items binned'}</div></div>`;
        const lines = [];
        if (s === 2) lines.push('<div class="card red lg c new" style="padding:1px 10px">Which one goes out first?</div>');
        if (s >= 3) lines.push('<div class="card gold c" style="font-size:20px;padding:1px 10px">FIFO: first expiring, first out. The glowing item leaves first.</div>');
        if (s >= 4) lines.push('<div class="card white cap new"><b>Nightly:</b> inventory checked, expiry dates tracked. <b>Weekly:</b> physical stock check. ↻ The nightly count loops back into the next order: the pull signal (Tab 6).</div>');
        if (s >= 5) lines.push('<div class="card white new" style="font-size:19px;line-height:1.15;padding:3px 10px">Waste is recorded in the same system that drives ordering. Cardboard goes to a local vendor. Waste stays at the store: suppliers like milk vendors do not take back unsold stock.</div>');
        if (s >= 6) lines.push(`<div class="card gold new row" style="gap:12px;font-size:19px;line-height:1.15;padding:3px 10px"><span style="transform:scaleX(-1);display:inline-block">${SP.truck(1.5)}</span><span><b>Reverse flow:</b> failed items go back to the DC (credit). Empty bottles, racks and crates return on the same fleet.</span></div>`);
        return `<div class="row" style="gap:12px;align-items:flex-start">${s ? shelves : '<div class="card white lg c grow" style="margin-top:60px">Three shelf zones in the store.</div>'}${s >= 1 ? bin : ''}</div><div class="col" style="gap:5px;margin-top:8px">${lines.join('')}</div>`;
      },
      drop(id, target, c) {
        if (target !== 'bin') return; c.st.gone.push(id); c.st.waste++; c.rr();
      }
    },
    { name: 'Turn 36', max: 4, render(c) {
      const s = c.step;
      let ring = '';
      for (let i = 0; i < 36; i++) { const a = -90 + i * 10, x = 100 + Math.cos(a * Math.PI / 180) * 88 - 7, y = 100 + Math.sin(a * Math.PI / 180) * 88 - 7; ring += `<i class="${i === 0 ? 'on' : ''}" style="left:${x}px;top:${y}px;${i === 0 ? '' : 'background:#E9C27A'}"></i>`; }
      const left = s >= 1 ? `<div class="col" style="align-items:center;gap:8px;width:300px"><div class="ring ${s === 1 ? 'spin36' : ''}" style="width:200px;height:200px">${ring}</div>
        <div class="big"><span ${s === 1 ? 'data-count="36|3000|0"' : ''}>36</span></div><div class="cap">turns a year</div>${s >= 2 ? '<div class="card red c new"><div class="mid" style="font-size:30px">365 ÷ 36 ≈ 10 days</div></div>' : ''}</div>` : '';
      const sizes = (ic, name) => `<div class="c">${[2, 3, 4].map(z => SP[ic](z)).join(' ')}<div class="sm">${name}: S, M, L</div></div>`;
      const right = s === 2 ? `<div class="card gold lg c grow new" style="margin-top:60px;font-size:30px;align-self:flex-start">Stock cycles roughly every 10 days. Max 10 days of inventory in the system.</div>` : s >= 3 ? `<div class="col grow new" style="gap:10px"><div class="row" style="gap:12px"><div class="card white c res"><b>30 to 35</b><span class="sm">independent SKUs</span></div><span class="mid">→</span><div class="card gold c res"><b>100 to 150</b><span class="sm">sellable combinations</span></div></div>
        <div class="card white row" style="justify-content:space-around;align-items:flex-end">${sizes('burger', 'Meals')}${sizes('cup', 'Drinks')}${sizes('fries', 'Fries')}</div><div class="sm">Meal and drink size variants (small, medium, large) fan out from the same few items.</div>${s >= 4 ? '<div class="card red c lg new">Short list + high turnover + perishable = frequent, small, shelf-life-based deliveries.</div>' : ''}</div>` : '';
      return `<div class="row" style="gap:20px;align-items:flex-start">${left || '<div class="card white lg c grow" style="margin-top:80px">How fast does stock turn over?</div>'}${right}</div>
        `;
    } }
  ]
};

/* ---------------- TAB 10 ---------------- */
TABS[9] = {
  modes: [{
    name: 'Full Journey Replay', max: 14,
    render(c) {
      const s = c.step, sg = S.score, tie = sg.burger === sg.fries, win = sg.burger > sg.fries ? 'burger' : 'fries';
      if (s <= 9) {
        const k = s, boxes = JOURNEY.map((j, i) => `<div class="card c ${i < k ? 'gold' : ''} ${i === k - 1 ? 'new' : ''}" style="width:122px;padding:4px 2px;font-size:15px;line-height:1.1;${i < k ? '' : 'opacity:.5'}">${SP[j[0]](j[0] === 'truck' || j[0] === 'van' ? 2 : j[0] === 'dc' ? 2.5 : 3)}<div><b>${i + 1}</b> ${j[1]}</div></div>`).join('') + `<div class="card c ${k >= 9 ? 'gold' : ''}" style="width:100px;padding:4px 2px;font-size:15px;opacity:${k >= 9 ? 1 : .5}">${SP.person(4, '#6C8EAD')}<div><b>Customer</b></div></div>`;
        const tx = k === 0 ? 8 : 8 + (k - 1) * 128;
        return `<div style="position:relative;padding-top:44px"><div class="row" style="gap:6px;align-items:flex-start">${boxes}</div><div class="chip r" style="position:absolute;left:0;top:0;white-space:nowrap" data-tw="left|${k <= 1 ? 8 : 8 + (k - 2) * 128}px|${tx}px|600">Order: 1 burger</div></div>
          ${k ? `<div class="card white mt new" style="display:flex;gap:24px;align-items:center;padding:20px 30px">${SP[JOURNEY[k - 1][0]](10)}<div><div class="chip d">Segment ${k}</div><div class="mid" style="margin:6px 0">${JOURNEY[k - 1][1]}</div><div class="lg">${JOURNEY[k - 1][2]}</div></div></div>` : '<div class="card white lg c mt" style="padding:30px">One order. Nine stations. Space to follow it.</div>'}`;
      }
      if (s === 10) return `<div class="col c" style="align-items:center;gap:14px;margin-top:10px"><div class="bob">${SP.scooter(9)}</div><div class="mid">McDelivery</div><div class="lg">Launched in Mumbai and Delhi in 2004. Grown over 400% since launch.</div><div class="card red new" style="font:900 40px var(--mono);padding:14px 30px">Good logistics is business power.</div></div>`;
      if (s === 11) {
        const T = [['40', 'suppliers', '14 Tier-1'], ['100%', 'outsourced', ''], ['80%', 'reefer movement', ''], ['10', 'days max inventory', ''], ['36', 'inventory turns', ''], ['99.8%', 'fill rate', '']];
        return `<div class="mid c" style="margin-bottom:10px">Chain scorecard</div><div class="row" style="flex-wrap:wrap;gap:14px;justify-content:center">${T.map((t, i) => `<div class="card white c new" style="width:410px;height:150px;animation-delay:${i * 90}ms;display:flex;flex-direction:column;justify-content:center"><div class="xl red-t">${t[0]}</div><div class="lg">${t[1]}${t[2] ? ' / ' + t[2] : ''}</div></div>`).join('')}</div>`;
      }
      if (s === 12) return `<div class="mid c" style="margin-bottom:14px">Final score</div><div class="row" style="gap:40px;justify-content:center"><div class="card red c new" style="width:420px;padding:24px"><div class="lg">${TEAMS.burger}</div><div class="xl" style="font-size:140px">${sg.burger}</div></div><div class="card gold c new" style="width:420px;padding:24px"><div class="lg">${TEAMS.fries}</div><div class="xl" style="font-size:140px">${sg.fries}</div></div></div>`;
      if (s === 13) return `<canvas id="confetti" class="conf"></canvas><div class="col c" style="align-items:center;gap:16px;margin-top:40px;position:relative;z-index:2">${tie ? `<div class="card gold new" style="padding:24px 50px"><div class="xl" style="font-size:80px">It’s a tie!</div><div class="mid mt">${sg.burger} : ${sg.fries}</div></div>` : `<div class="card ${win === 'burger' ? 'red' : 'gold'} new" style="padding:24px 50px"><div class="lg">Winner</div><div class="xl" style="font-size:80px">${TEAMS[win]}</div><div class="mid mt">${sg.burger} : ${sg.fries}</div></div>`}<div class="lg card white">Thank you for playing!</div></div>`;
      return `<div class="col c" style="align-items:center;justify-content:center;height:100%;gap:20px"><div class="card gold new" style="padding:40px 80px"><div class="xl" style="font-size:84px">Thank you.</div><div class="xl" style="font-size:84px;margin-top:10px">Questions?</div></div>${SP.store(6)}</div>`;
    }
  }]
};
