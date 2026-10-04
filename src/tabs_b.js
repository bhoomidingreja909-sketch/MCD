/* =====================================================================
   TABS 4 to 7
   ===================================================================== */
const hbar = (pct, color, label, tw = true) => `<div class="row" style="gap:10px;height:34px"><div style="width:${pct}%;height:30px;background:${color};border:3px solid var(--ink);box-shadow:3px 3px 0 var(--ink);flex:none" ${tw ? `data-tw="width|0%|${pct}%|600"` : ''}></div><span class="cap">${label}</span></div>`;

/* ---------------- TAB 4 ---------------- */
TABS[3] = {
  opener: 'How does the chain know, long before a burger is ordered, how much it will need?',
  modes: [
    { name: '31Q Decoded', max: 8, render(c) {
      const s = c.step;
      const band = (w, bg, big, txt, on, fresh) => on ? `<div class="card ${fresh ? 'new wipe' : ''}" style="width:${w}px;height:46px;background:${bg};display:flex;align-items:center;gap:12px;padding:0 12px"><span class="mid" style="font-size:30px">${big}</span><span style="font-size:18px;line-height:1.05">${txt}</span></div>` : '<div style="height:46px"></div>';
      const bands = `<div class="col" style="width:820px;flex:none;gap:6px">${band(820, '#fff', '3', 'Three-year rolling plan: long-range direction', s >= 1, s === 1)}${band(620, '#fbeaa0', '1', 'Detailed one-year forecast', s >= 2, s === 2)}${band(440, '#cdeccd', 'Q', 'Quarterly monitoring: actual vs plan', s >= 3, s === 3)}</div>`;
      const big = s >= 4 ? `<div class="card red new c grow" style="height:150px;display:flex;align-items:center;justify-content:center"><span class="xl" style="font-size:110px">31Q</span></div>` : `<div class="card c grow" style="height:150px;display:flex;align-items:center;justify-content:center"><span class="xl" style="opacity:.25">?</span></div>`;
      const LAD = [[100, '#D2403F', '3 years (rolling)'], [82, '#E0753F', '1 year (detailed)'], [64, '#F0A35E', 'Quarterly review'], [46, '#F5C518', 'DC to suppliers: 3-month rolling forecast'], [30, '#A9B858', 'Store to DC: 3 days to 1 week'], [14, '#6C8EAD', 'Store’s actual order via ERP Fusion (Tab 6)']];
      const upto = s >= 7 ? 6 : s >= 6 ? 5 : s >= 5 ? 3 : 0;
      const lad = LAD.slice(0, upto).map((r, k) => `<div class="row ${(s === 5 && k < 3) || (s === 6 && k >= 3 && k < 5) || (s === 7 && k === 5) ? 'new wipe' : ''}" style="gap:10px;height:34px"><div style="width:${r[0] * 7}px;height:28px;background:${r[1]};border:3px solid var(--ink);box-shadow:3px 3px 0 var(--ink);flex:none"></div><span class="cap">${r[2]}</span></div>`).join('');
      return `<div class="row" style="gap:14px;align-items:stretch">${bands}${big.replace('height:150px', 'height:150px')}</div>
        ${s >= 5 ? `<div class="mt"><b class="lg">Forecast Ladder: shorter as it nears the customer</b></div>` : ''}<div style="margin-top:4px">${lad}</div>
        ${s >= 8 ? `<div class="cap-bar new">Suppliers are inside the plan. They are included in annual budgeting and plan capacity and raw material around it.</div>` : ''}`;
    } },
    { name: 'Why Forecast a Pull Chain?', max: 4, render(c) {
      const s = c.step, on = s === 2 || s >= 4;
      const st = [['Restaurant', 'burger'], ['DC', 'dc'], ['Supplier', 'factory'], ['Production', 'gear']];
      const chain = st.map((x, i) => `<div class="card white c ${s === 1 ? 'new' : ''}" style="width:240px;padding:6px"><div>${SP[x[1]](x[1] === 'gear' ? 5 : 3)}</div><b class="lg">${x[0]}</b></div>${i < 3 ? '<span class="mid">→</span>' : ''}`).join('');
      let mid = '';
      if (s >= 2) {
        mid = `<div class="card ${on ? 'gold' : 'white'} new" style="margin-top:12px"><div class="row" style="gap:16px"><span class="chip ${on ? 'g' : 'd'} lg">Forecast: ${on ? 'ON' : 'OFF'}</span>
          <div class="grow"><div class="sm">Supplier capacity</div><div style="height:34px;background:var(--cream2);border:4px solid var(--ink)"><div style="height:100%;background:${on ? 'var(--haccp)' : 'var(--red)'}" data-tw="width|${on ? '100%' : '0%'}|100%|${on ? 10 : 2600}"></div></div></div>
          <div class="cap" style="width:430px">${on ? 'Capacity is already filled when the order ticket arrives. Production starts immediately.' : 'Order ticket arrives first. The supplier scrambles while capacity fills slowly.'}</div></div></div>`;
      }
      const tiles = s >= 4 ? `<div class="row new" style="gap:12px;margin-top:8px">${res('0', 'days max inventory', { count: '10|900|0' })}${res('0', 'inventory turn ratio', { count: '36|900|0' })}${res('0', 'fill rate to stores', { count: '99.8|1100|1||%' })}<div class="card gold grow" style="font-size:18px;line-height:1.15">Demand growing 30 to 40% a year ${b13()}<br>New outlets absorbed within 10 days ${b13()}</div></div>` : '';
      return `<div class="row" style="justify-content:center;gap:10px">${chain}</div>${mid}
        ${s >= 3 ? `<div class="card red c cap mt new">Forecasts do not change the trigger. The order still pulls. They give suppliers visibility, so they are ready when it arrives.</div>` : ''}${tiles}`;
    } },
    { name: 'RKFL Does the Purchasing', max: 7, render(c) {
      const s = c.step, SP5 = ['Raises purchase orders to suppliers', 'Invoicing', 'Working capital', 'Timely delivery', 'Payments to suppliers'];
      const n = Math.min(s, 5);
      let lines = '', spokes = '';
      SP5.forEach((t, i) => {
        const y = 12 + i * 54; lines += i < n ? `<line x1="250" y1="140" x2="470" y2="${y + 22}" stroke="#2B2622" stroke-width="4"/>` : '';
        spokes += `<div class="card ${i < n ? 'gold' : ''} ${i === s - 1 ? 'new left' : ''}" style="position:absolute;left:470px;top:${y}px;width:620px;${i < n ? '' : 'opacity:.35'}">${i + 1}. ${t}</div>`;
      });
      const flow = s >= 6 ? `<div class="row new" style="gap:10px;margin-top:6px"><div class="card white c" style="flex:1"><b>Suppliers</b><div class="sm">on SAP</div></div><span class="mid">→</span><div class="card white c" style="flex:2;padding:2px 8px"><b>DCs on RAMCO Marshall ERP with Cobra</b><div style="font-size:17px;line-height:1.1">Automates store-order upload, store scheduling and forecast orders</div></div><span class="mid">→</span><div class="card white c" style="flex:1"><b>Stores</b><div class="sm">ERP Fusion</div></div></div>` : '';
      return `<div style="position:relative;height:${s >= 6 ? 280 : 340}px"><svg width="1294" height="300" style="position:absolute;left:0;top:0" shape-rendering="crispEdges">${lines}</svg>
        <div class="card red c" style="position:absolute;left:30px;top:70px;width:220px;height:140px;display:flex;flex-direction:column;align-items:center;justify-content:center">${SP.handshake(4)}<b class="lg">RKFL</b><span class="sm">sole distribution partner</span></div>${spokes}</div>${flow}
        ${s >= 7 ? `<div class="chip g new" style="margin-top:8px;font-size:20px">Same trust-based approach as with suppliers: KPIs, no legal SLA.</div>` : ''}`;
    } }
  ]
};

/* ---------------- TAB 5 ---------------- */
TABS[4] = {
  opener: 'The goods move. This is where the inbound part of the chain ends.',
  modes: [
    { name: 'Hub and Spoke Map', max: 4, render(c) {
      const s = c.step, W = 1294;
      const hubs = [['Gujarat', 250], ['Kalamboli (Navi Mumbai)', 647], ['Hyderabad', 1060]];
      const rest = [['Gujarat', 250, 0], ['Mumbai', 470, 1], ['Pune', 610, 1], ['Aurangabad', 750, 1], ['Goa', 890, 1], ['Hyderabad', 1100, 2]];
      const RY = 282, HY = 100;
      let lines = '';
      if (s >= 1) hubs.forEach(h => { lines += `<line x1="647" y1="38" x2="${h[1]}" y2="${HY}" stroke="#2B2622" stroke-width="4"/>`; });
      if (s >= 2) rest.forEach(r => { lines += `<line x1="${hubs[r[2]][1]}" y1="${HY + 104}" x2="${r[1]}" y2="${RY}" stroke="#2B2622" stroke-width="4"/>`; });
      if (s >= 4) lines += [[300, 470], [300, 610], [900, 750], [900, 890]].map(p => `<line x1="${p[0]}" y1="44" x2="${p[1]}" y2="${RY}" stroke="#D2403F" stroke-width="5" stroke-dasharray="12 8"/>`).join('') + `<line x1="1190" y1="76" x2="1100" y2="${RY}" stroke="#4CAF50" stroke-width="5" stroke-dasharray="4 8"/>`;
      const at = (x, y, h, cls = '') => `<div style="position:absolute;left:${x}px;top:${y}px;transform:translateX(-50%)"><div class="${cls}">${h}</div></div>`;
      let h = at(647, 0, `<div class="card white c" style="padding:2px 14px"><b>Suppliers</b></div>`);
      if (s >= 1) hubs.forEach((x, i) => { h += at(x[1], HY, `<div class="card red c" style="padding:2px 10px;font-size:19px">${SP.dc(3)}<div>${x[0]}</div></div>`, s === 1 ? 'new' : ''); });
      if (s >= 2) rest.forEach(r => { h += at(r[1], RY, `<div class="card gold c" style="padding:0 10px;font-size:19px">${r[0]}</div>`, s === 2 ? 'new' : ''); });
      let trucks = '';
      if (s >= 3) [['M647 40 L250 100 L250 290', 0], ['M647 40 L647 100 L610 290', 0.4], ['M647 40 L1060 100 L1100 290', 0.8]].forEach(t => { trucks += `<div class="mover" style="offset-path:path('${t[0]}');animation-delay:-${t[1]}s;margin:-14px 0 0 -28px">${SP.truck(1.5)}</div>`; });
      if (s >= 4) {
        h += at(300, 0, `<div class="card white c" style="padding:2px 10px;font-size:18px;border-color:#D2403F;width:230px">Taloja factory: buns</div>`, 'new') + at(900, 0, `<div class="card white c" style="padding:2px 10px;font-size:18px;border-color:#D2403F;width:250px">Coca-Cola: own distribution</div>`, 'new') + at(1190, 0, `<div class="card white c" style="padding:2px 8px;font-size:16px;line-height:1.05;border-color:#4CAF50;width:190px">Milk: local authorised regional suppliers</div>`, 'new');
      }
      return `<div style="position:relative;width:${W}px;height:410px"><svg width="${W}" height="410" style="position:absolute;left:0;top:0" shape-rendering="crispEdges">${lines}</svg>${h}${trucks}
        <span class="chip d" style="position:absolute;left:0;top:44px">West &amp; South zone</span>
        <div class="col" style="position:absolute;left:0;bottom:6px;gap:6px"><span class="chip">DQMP audits the DC warehouses</span><span class="chip">Fleet: frozen, chilled and dry (Tab 8)</span></div>
        ${s >= 4 ? `<div class="card red new c lg" style="position:absolute;right:0;bottom:4px;width:640px">Only two items bypass the DC: buns and Coke.</div>` : ''}</div>`;
    } },
    { name: 'National View', max: 4, render(c) {
      const s = c.step;
      const DCS = [['Noida', 'Primary, company-owned', 10.5, 7.8, 1], ['Mumbai', 'Primary, company-owned', 5, 16.5, 1], ['Bengaluru', 'Secondary, leased', 12.5, 24, 0], ['Kolkata', 'Secondary, leased', 21, 11.5, 0]];
      let pins = ''; DCS.forEach((d, i) => { if (i < s) pins += mapPin(d[2], d[3], i + 1, `${d[4] ? '' : 'cur'} ${i === s - 1 ? 'new' : ''}`); });
      const list = DCS.map((d, i) => i < s ? `<div class="card ${d[4] ? 'red' : 'gold'} ${i === s - 1 ? 'new left' : ''} row" style="gap:12px;padding:3px 12px"><span class="chip">${i + 1}</span><div class="mid" style="font-size:28px;width:230px">${d[0]}</div><div class="cap">${d[1]}</div></div>` : '').join('');
      return `<div class="row" style="gap:20px;align-items:flex-start">${indiaMap(pins)}<div class="col grow" style="gap:8px"><div class="row" style="gap:10px"><span class="chip d lg">National view</span>${b13()}</div>
        ${list || '<div class="card white lg">Four DCs serve the national network.</div>'}${s >= 4 ? '<div class="card white new lg">Two primary DCs are company-owned. Two secondary DCs are leased.</div>' : ''}</div></div>`;
    } },
    { name: 'Four Ways to Keep Inbound Lead Time Short', max: 5, render(c) {
      const s = c.step;
      const W4 = [['Pull production', 'Nothing is produced to sit in stock.', 'gear'], ['Forecast visibility', '3-month rolling forecast plus annual budgeting.', 'receipt'], ['A cap on inventory', 'Max 10 days. Turn ratio 36.', 'bin'], ['Direct flow for perishables', 'Buns and Coke skip the DC.', 'truck']];
      const cards = W4.map((w, i) => i < s ? `<div class="card white c fcard ${i === s - 1 ? 'new' : ''}"><div>${SP[w[2]](i === 3 ? 2.5 : 4)}</div><div class="mid" style="font-size:22px;margin:4px 0">${i + 1}. ${w[0]}</div><div style="font-size:20px;line-height:1.15">${w[1]}</div></div>` : `<div class="card c fcard" style="opacity:.4"><div class="big" style="margin-top:40px">${i + 1}</div></div>`).join('');
      return `<div class="row" style="gap:14px;justify-content:center">${cards}</div>
        ${s >= 5 ? `<div class="card gold mt new" style="padding:4px 12px"><div class="lg"><b>Fill rate</b></div><div style="height:34px;background:var(--cream2);border:4px solid var(--ink);margin:4px 0"><div style="height:100%;background:var(--haccp)" data-tw="width|0%|99.8%|1200"></div></div><div class="row" style="justify-content:space-between"><span class="lg">Restaurants almost always find the product when they order.</span><span class="mid" data-count="99.8|1200|1||%">99.8%</span></div></div>
        <div class="chip mt" style="margin-top:8px">The DC is where inbound logistics ends and outbound begins.</div>` : ''}`;
    } }
  ]
};

/* ---------------- TAB 6 ---------------- */
TABS[5] = {
  opener: 'Every pull in the pull chain begins at the store.',
  init: () => ({ n: STORE_SCENARIO.suggested }),
  modes: [{
    name: 'Mock ordering screen', max: 6,
    render(c) {
      const s = c.step, SC = STORE_SCENARIO;
      const lit = { 1: [1, 2], 2: [0], 3: [0], 4: [2], 5: [0], 6: [2] }[s] || [];
      const bar = `<div class="erpbar">${['Ordering', 'Sales entry', 'Inventory'].map((t, i) => `<span class="${lit.includes(i) ? 'on' : ''}">${t}</span>`).join('')}<span style="margin-left:auto;background:none;border:0;color:#fff">ERP Fusion: one website, three jobs.</span></div>`;
      let body = '';
      if (s === 0) body = `<div class="c" style="margin-top:120px"><div class="mid">Store ordering screen</div><div class="cap mt">Press Space to walk through a night in the store.</div></div>`;
      if (s === 1) body = `<div class="lg"><b>Nightly stock count</b></div><div class="col mt" style="gap:16px"><div><div class="cap">Sold stock (linked to sales)</div>${hbar(72, '#D2403F', '')}</div><div><div class="cap">Available stock</div>${hbar(45, '#4CAF50', '')}</div></div>
        <div class="card gold lg mt c">The system works from actual sold stock, not manually typed forecasts.</div>`;
      if (s === 2) body = `<div class="row" style="gap:30px;align-items:flex-end;justify-content:center;height:262px;margin-bottom:6px"><div class="c"><div class="lg">\u20B9${SC.fridayThis} lakh</div><div style="width:110px;height:${SC.fridayThis * 34}px;background:var(--red);border:4px solid var(--ink)" data-tw="height|0px|${SC.fridayThis * 34}px|600"></div><div class="cap">This Friday</div></div>
        <div class="c"><div class="lg">\u20B9${SC.fridayLast} lakh</div><div style="width:110px;height:${SC.fridayLast * 34}px;background:var(--leaf);border:4px solid var(--ink)" data-tw="height|0px|${SC.fridayLast * 34}px|600"></div><div class="cap">Last Friday</div></div>
        <div class="card white c" style="width:420px"><div class="sm">Projected sales</div><div class="big red-t">${SC.sales}</div><div class="mt">→ Suggested order</div><div class="big">${SC.suggested} cases</div></div></div>
        <div class="card gold lg c">It suggests. It does not decide. Ordering unit: cases.</div>`;
      if (s === 3) {
        const n = c.st.n, local = n - SC.suggested;
        body = `<div class="row" style="gap:16px;align-items:stretch"><div class="card white grow"><div class="chip r">ORDER TICKET</div><div class="mid" style="font-size:32px;margin:8px 0">${esc(SC.event)}</div><div class="card red lg c">System sees only past sales.</div></div>
          <div class="card white c" style="width:250px"><svg width="110" height="110" viewBox="0 0 110 110" shape-rendering="crispEdges">${pixelDial(55, 55, 46, 0, 360, '#2B2622', 6)}<rect x="52" y="12" width="6" height="46" fill="#D2403F"/><rect x="50" y="28" width="10" height="30" fill="#2B2622"/></svg><div class="lg"><b>Cut-off ${SC.cutoff}</b></div><div class="sm">next applicable delivery</div></div></div>
          <div class="row mt" style="gap:12px;justify-content:center"><div class="card c"><div class="sm">System projection</div><div class="mid">${SC.suggested}</div></div><span class="mid">+</span><div class="card gold c"><div class="sm">Local knowledge</div><div class="mid">${local >= 0 ? '+' : ''}${local}</div></div><span class="mid">=</span><div class="card red c"><div class="sm">The order (cases)</div><div class="mid">${n}</div></div>
          <button class="btn" data-a="dec">↓ less</button><button class="btn" data-a="inc">↑ more</button></div><div class="c sm mt">Use the ↑ ↓ keys to override the suggestion.</div>`;
      }
      if (s === 4) body = `<div class="row" style="gap:30px;align-items:center;justify-content:center"><div style="position:relative;width:360px;height:200px"><svg width="360" height="200" viewBox="0 0 360 200" shape-rendering="crispEdges">${[150, 140, 130, 120].map(r => pixelDial(180, 180, r, 0, 180, '#CFCBC0', 10)).join('')}${[150, 140, 130, 120].map(r => pixelDial(180, 180, r, 85, 125, '#4CAF50', 10)).join('')}</svg><div style="position:absolute;left:175px;top:50px;width:10px;height:130px;background:var(--ink);transform-origin:50% 100%;transform:rotate(-20deg)" data-tw="transform|rotate(-90deg)|rotate(-20deg)|900"></div><div style="position:absolute;left:166px;top:166px;width:28px;height:28px;background:var(--red);border:4px solid var(--ink)"></div></div>
        <div class="card white c"><div class="sm">Buffer stock</div><div class="big red-t">${SC.buffer}</div><div class="lg">covers ${SC.bufferDays} of surprise demand</div></div></div>
        <div class="card gold lg c mt">No formal emergency order. A store can ask, but is not guaranteed. The buffer is the real protection.</div>`;
      if (s === 5) body = `<div class="row" style="gap:16px;align-items:stretch"><div class="card white grow"><div class="chip r">A</div> <b class="lg">Cheese product with dedicated packaging runs short</b><div class="row mt" style="gap:14px">${SP.cheese(6)}<span class="stamp">PAUSED</span></div><div class="cap mt">Item paused, not substituted.</div></div>
        <div class="card white grow"><div class="chip r">B</div> <b class="lg">COVID: oil-filter powder (Magnosol) unavailable</b><div class="mt cap">Oil quality: degradation</div><div style="height:30px;background:var(--cream2);border:4px solid var(--ink);position:relative"><div style="height:100%;background:var(--red)" data-tw="width|0%|62%|1400"></div><div style="position:absolute;left:62%;top:-8px;bottom:-8px;width:6px;background:var(--ink)"></div></div><div class="sm">25% degradation limit</div>
        <div class="cap mt">Oil must be fully replaced instead of filtered.</div><div class="row mt" style="gap:10px"><span class="cap">Extra cost</span><span class="mid red-t" data-count="12000|1600|0|₹ ">0</span><span class="chip">illustrative</span></div></div></div>`;
      if (s === 6) body = `<div class="row" style="gap:16px;align-items:center"><div class="grow"><div class="lg"><b>Late truck</b></div><div class="row mt" style="gap:3px">${Array.from({ length: 10 }, (_, i) => `<div style="width:34px;height:34px;background:${i < 8 ? '#4CAF50' : '#D2403F'};border:3px solid var(--ink)"></div>`).join('')}</div><div class="cap mt">About ${SC.onTime}% on time, ${SC.delayed}% delayed: breakdowns, driver leave, strikes.</div></div></div>
        <div style="position:relative;height:110px;margin-top:10px;border-bottom:6px solid var(--ink)"><div class="sm" style="position:absolute;left:0;top:0">Planned slot</div><div class="sm" style="position:absolute;left:680px;top:0">Slips into the morning</div><div style="position:absolute;bottom:0" data-tw="left|60px|700px|1400">${SP.truck(3)}</div></div>
        <div class="card gold lg c mt">The store holds operations to unload chilled and frozen stock, then resumes.</div>`;
      return `<div class="erp">${bar}<div style="padding:10px 16px;flex:1;position:relative">${body}</div></div>`;
    },
    key(k, c) { if (c.step !== 3) return; this.act(k === 'ArrowUp' ? 'inc' : 'dec', 0, c); },
    act(a, v, c) { if (c.step !== 3) return; if (a === 'inc') c.st.n = Math.min(6, c.st.n + 1); if (a === 'dec') c.st.n = Math.max(0, c.st.n - 1); if (a === 'inc' || a === 'dec') c.rr(); }
  }]
};

/* ---------------- TAB 7 ---------------- */
function bullwhip(push) {
  return {
    name: push ? 'Bullwhip Test: PUSH' : 'Bullwhip Test: PULL', max: 4,
    render(c) {
      const s = c.step, names = ['Restaurant', 'DC', 'Supplier', 'Production'];
      const amp = push ? [0.12, 0.3, 0.55, 0.85] : [0.12, 0.03, 0.02, 0.01];
      const bars = names.map((n, i) => `<div class="c"><div class="vbar" style="width:96px;height:150px"><i class="${s >= 2 ? 'swing' : ''}" style="height:55%;background:${['#6C8EAD', '#D2403F', '#4CAF50', '#F5C518'][i]};--amp:${amp[i]};border-top:4px solid var(--ink)"></i></div><b class="cap">${n}</b></div>${i < 3 ? '<span class="mid" style="margin-top:56px">' + (push ? '→' : '←') + '</span>' : ''}`).join('');
      return `<div class="row" style="gap:20px;align-items:flex-start"><div class="card white" style="padding:10px 14px;width:640px;flex:none"><div class="row" style="gap:10px;margin-bottom:6px"><span class="chip ${push ? 'r' : 'g'} lg">${push ? 'PUSH: forecast-driven' : 'PULL: McDonald’s'}</span><span class="chip">illustrative model</span></div><div class="row" style="gap:12px;align-items:flex-start">${bars}</div>
        <div class="cap c mt">${push ? 'Information flows upstream, goods flow down' : 'Order starts at the restaurant'}: restaurant → DC → supplier → production</div></div>
        <div class="col grow" style="gap:10px">
          ${s === 0 ? '<div class="card gold lg">Press Space: customer demand wobbles.</div>' : ''}
          ${s >= 2 ? (push ? '<div class="stamp new" style="align-self:flex-start;margin:10px 0 0 10px;font-size:30px">BULLWHIP EFFECT</div><div class="card white cap new">A small wobble at the restaurant grows at every stage upstream.</div>' : '<div class="card white cap new">The order starts at the restaurant. Upstream bars barely move.</div>') : ''}
          ${s >= 3 ? (push ? '<div class="card gold cap new">Remedies: better information systems, lead-time management, proper inventory policy.</div>' : '<div class="card gold cap new">Made to order. Suppliers hold barely any extra stock, except contingency stock during machinery servicing.</div><div class="card white sm new">Remedies McDonald’s uses: better information systems, lead-time management, proper inventory policy.</div>') : ''}</div></div>
        ${s >= 4 ? `<div class="row mt new" style="gap:12px">${res('0', 'fill rate', { count: '99.8|900|1||%' })}${res('0', 'days max inventory', { count: '10|900|0' })}${res('0', 'turns', { count: '36|900|0' })}<div class="card white grow sm"><span class="chip">Store → DC: 3 days to 1 week</span> <span class="chip">DC → suppliers: 3 months rolling</span></div></div>` : ''}`;
    }
  };
}
TABS[6] = {
  modes: [
    bullwhip(true), bullwhip(false),
    { name: 'Inside the Engine', max: 8, render(c) {
      const s = c.step, F = ['RKFL manages all DCs', 'Owns the transport division', 'Handles all truck movement nationally', '80% of movement is by refrigerated truck', 'Frozen and chilled ordered through RK Cold Chain', 'RKFL is a logistics partner, not part of McDonald’s'];
      const pos = [[0, 10], [410, 10], [0, 150], [410, 150], [0, 290], [410, 290]];
      let lines = '', cards = '';
      F.forEach((f, i) => {
        const on = i < Math.min(s, 6), p = pos[i];
        if (on) lines += `<line x1="350" y1="215" x2="${p[0] ? 410 : 290}" y2="${p[1] + 45}" stroke="#2B2622" stroke-width="4"/>`;
        cards += `<div class="card ${on ? (i === 3 ? 'gold' : 'white') : ''} ${i === s - 1 ? 'new' : ''}" style="position:absolute;left:${p[0]}px;top:${p[1]}px;width:290px;height:90px;display:flex;align-items:center;font-size:19px;line-height:1.15;${on ? '' : 'opacity:.25'}">${on ? f : ''}</div>`;
      });
      const flow = s >= 7 ? `<div class="col new" style="gap:6px"><div class="card white c"><b>Store</b> <span class="sm">ERP Fusion</span></div><div class="c">${pix(ARROW_D, { s: 3 })}</div><div class="card white c"><b>DC</b> <span class="sm">RAMCO Marshall ERP with Cobra</span></div><div class="c">${pix(ARROW_D, { s: 3 })}</div><div class="card white c"><b>Supplier</b> <span class="sm">SAP</span></div></div>` : '<div class="card white lg c" style="margin-top:60px">Technology flow appears here.</div>';
      return `<div class="row" style="gap:20px;align-items:flex-start"><div style="position:relative;width:700px;height:390px;flex:none"><svg width="700" height="390" style="position:absolute;left:0;top:0" shape-rendering="crispEdges">${lines}</svg>${cards}
        <div class="card red c" style="position:absolute;left:295px;top:175px;width:110px;height:80px;display:flex;align-items:center;justify-content:center;padding:0"><span class="mid" style="font-size:28px">RKFL</span></div></div>
        <div class="col grow" style="gap:10px"><h3 class="mid" style="font-size:26px">Technology flow</h3>${flow}${s >= 8 ? '<div class="card gold new cap"><b>Exceptions:</b> buns and Coke bypass the DC. Coke also trains restaurant staff in water management to keep potable water safe.</div>' : ''}</div></div>`;
    } }
  ]
};
