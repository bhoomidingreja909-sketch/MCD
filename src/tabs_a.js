/* =====================================================================
   TABS 1 to 3
   ===================================================================== */
const INDIA = [
  '...........####.............', '..........######............', '.........########...........', '........##########..........',
  '.......############.....##..', '......##############...####.', '.....################.#####.', '....##################.####.',
  '....###################..##.', '...######################...', '...#####################....', '..######################....',
  '..#####################.....', '..####################......', '..####################......', '...###################......',
  '...##################.......', '...##################.......', '....################........', '....###############.........',
  '.....##############.........', '.....#############..........', '......############..........', '......###########...........',
  '.......##########...........', '.......#########............', '........########............', '........#######.............',
  '.........######.............', '.........#####..............', '..........####..............', '..........###...............',
  '...........##...............', '...........#................'
];
const ARROW_D = ['...RR...', '...RR...', '...RR...', 'RRRRRRRR', '.RRRRRR.', '..RRRR..', '...RR...'];
const indiaMap = (pins = '') => `<div class="mapbox">${pix(INDIA, { s: 12, pal: { '#': '#A9B858' } })}${pins}</div>`;
const mapPin = (x, y, txt, cls = '') => `<div class="pin ${cls}" style="left:${(x + 1) * 12}px;top:${(y + 1) * 12}px">${txt}</div>`;

/* seeds are added to the top bun at step 7 */
const BURGER_LAYERS = {
  top: ['......bbbbbbbb......', '....bbbbbbbbbbbb....', '..bbbbbbbbbbbbbbbb..', '.bbbbbbbbbbbbbbbbbb.', '.bbbbbbbbbbbbbbbbbb.'],
  mayo: ['..mmmm.mmmm.mmmm.mmm', '.mmmmmmmmmmmmmmmmmmm'],
  onion: ['mwmwmwmwmwmwmwmwmwmw', 'wmwmwmwmwmwmwmwmwmwm'],
  lettuce: ['AaAAaAAaAAaAAaAAaAAa', 'aAAaAAaAAaAAaAAaAAaA', 'AAAAAAAAAAAAAAAAAAAA'],
  cheese: ['GGGGGGGGGGGGGGGGGGGG', 'GGGGGGGGGGGGGGGGGGGG', 'GG....GG.....GG...GG'],
  patty: ['pppppppppppppppppppp', 'kppkpppkpppkppkppkpp', 'kkkkkkkkkkkkkkkkkkkk', 'kkkkkkkkkkkkkkkkkkkk'],
  bot: ['bbbbbbbbbbbbbbbbbbbb', 'bbbbbbbbbbbbbbbbbbbb', '.bbbbbbbbbbbbbbbbbb.']
};
const SEEDS = [[7, 1], [11, 1], [5, 2], [9, 2], [13, 2], [8, 3], [12, 3], [4, 3], [15, 3]];
function burgerStack(s) {
  const L = BURGER_LAYERS, order = [['top', 1], ['mayo', 6], ['onion', 5], ['lettuce', 4], ['cheese', 3], ['patty', 2], ['bot', 1]];
  return order.map(([k, at]) => {
    let rows = L[k];
    if (k === 'top' && s >= 7) rows = rows.map((r, y) => [...r].map((ch, x) => SEEDS.some(p => p[0] === x && p[1] === y) ? 'y' : ch).join(''));
    if (s < at) return `<div class="dashed" style="height:${rows.length * 10}px;width:200px;margin:2px auto"></div>`;
    const fresh = s === at || (k === 'bot' && s === 1) || (k === 'top' && s === 7);
    return `<div class="layer ${fresh ? 'new drop' : ''}" style="margin-top:-2px">${pix(rows, { s: 10 })}</div>`;
  }).join('');
}

TABS[0] = {
  modes: [
    { name: 'Build the Burger Map', max: 9, render(c) {
      const s = c.step, shown = s >= 8 ? SUPPLIERS.length : Math.min(s, 7);
      let pins = '', rows = '';
      SUPPLIERS.slice(0, shown).forEach((e, i) => {
        const fresh = (s <= 7 && i === s - 1) || (s === 8 && i >= 7);
        e.sup.forEach(p => { pins += mapPin(p[2], p[3], i + 1, fresh ? 'cur new' : ''); });
        rows += `<div class="${fresh ? 'new wipe' : ''}" style="margin-bottom:3px"><span class="chip ${fresh ? 'g' : ''}" style="padding:0 7px;font-size:16px;box-shadow:2px 2px 0 var(--ink)">${i + 1}</span> <b>${esc(e.ing)}:</b> ${e.sup.map(p => esc(p[0]) + ' (' + esc(p[1]) + ')').join(', ')}${e.asof ? b13() : ''}</div>`;
      });
      if (s >= 9) {
        LOCAL_PINS.forEach(p => { pins += mapPin(p.x, p.y, 'L', 'local new'); });
        rows += `<div class="new wipe" style="margin-top:6px"><span class="chip g" style="padding:0 7px;font-size:16px">LOCAL</span> <b>Milk:</b> local authorised regional suppliers</div>
          <div class="new wipe"><span class="chip g" style="padding:0 7px;font-size:16px">LOCAL</span> <b>Buns:</b> Taloja factory <span class="chip" style="font-size:15px;padding:0 6px">2013: Phillaur. Today: Taloja.</span></div>`;
      }
      return `<div class="row" style="align-items:flex-start;height:100%;gap:14px">
        <div style="width:236px;flex:none;padding-top:6px">${burgerStack(Math.min(s, 7))}<div class="c mt lg">${s ? esc(SUPPLIERS[Math.min(s, 7) - 1].ing) : 'Press Space'}</div></div>
        ${indiaMap(pins)}
        <div class="col grow" style="gap:6px"><div class="card white legend" style="font-size:18px;line-height:1.15;padding:6px 10px;min-height:150px">${rows || '<span class="lg">Each ingredient gets a pin on the map.</span>'}</div>
        ${s >= 9 ? `<div class="card gold new" style="font-size:19px">Short shelf life = sourced close to the store. Frozen and processed items travel through the DC network.</div>` : ''}</div></div>`;
    } },
    { name: 'Tier Ladder', max: 4, render(c) {
      const s = c.step;
      const row = (n, title, sub, icons, col, extra = '') => `<div class="card ${col} new left row" style="gap:14px;min-height:92px"><div class="mid" style="font-size:30px;width:130px">${title}</div><div class="grow"><div class="lg">${sub}</div><div class="sm">${extra}</div></div>${icons}</div>`;
      const arrow = `<div class="c new">${pix(ARROW_D, { s: 5 })}</div>`;
      let left = '';
      if (s >= 1) left += row(0, 'Tier-2', 'Growers and processors', `${SP.lettuce(5)}${SP.person(5, '#4CAF50')}`, '', 'Lettuce, potato, poultry, coating systems');
      if (s >= 2) left += arrow + row(0, 'Tier-1', 'Core suppliers', `${SP.factory(4)}`, 'white', 'Vista Processed Foods: veg and chicken patties. McCain Foods India: fries, wedges, hashbrowns');
      if (s >= 3) left += arrow + row(0, 'DC', 'Distribution centre', `${SP.dc(4)}`, 'red');
      if (!s) left = '<div class="card white lg c" style="margin-top:80px">Three tiers feed one distribution centre.</div>';
      let ring = '';
      if (s >= 4) {
        for (let i = 0; i < 40; i++) { const a = -90 + i * 9, x = 120 + Math.cos(a * Math.PI / 180) * 104 - 7, y = 120 + Math.sin(a * Math.PI / 180) * 104 - 7; ring += `<i class="${i < 14 ? 'on new' : ''}" style="left:${x}px;top:${y}px;${i < 14 ? `animation-delay:${i * 45}ms` : ''}"></i>`; }
      }
      const right = s >= 4 ? `<div class="col" style="align-items:center;gap:6px"><div class="ring">${ring}<div style="position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center"><div class="big">14</div><div class="sm">of 40 suppliers</div><div class="sm">are Tier-1</div></div></div>
        <div class="card red new c" style="width:300px"><div class="xl">80%</div><div class="sm">of demand fulfilled by those 14. First choice for every new restaurant.</div></div></div>` : '';
      return `<div class="row" style="align-items:flex-start;gap:20px;height:100%"><div class="col grow" style="gap:6px;max-width:${s >= 4 ? 780 : 1200}px">${left}</div>${right}</div>`;
    } },
    { name: 'One Product, One Supplier', max: 3, render(c) {
      const s = c.step;
      const tiles = ONE_SUPPLIER.map((t, i) => {
        const held = s >= 2 && i === ONE_SUPPLIER.length - 1;
        return `<div class="card tile ${held ? 'held new shake' : s >= 1 ? 'glow' : ''}" style="background:${held ? '' : '#fff'}">${SP[t[2]] ? SP[t[2]](4) : ''}<div><div style="line-height:1;font-size:20px">${esc(t[0])}</div><div class="sm">${esc(t[1])}</div></div>${held ? '<span class="stamp" style="position:absolute;right:-6px;bottom:-10px;font-size:22px;border-width:4px">HELD</span>' : ''}</div>`;
      }).join('');
      return `<div class="col" style="height:100%;gap:12px">
        <div class="row" style="flex-wrap:wrap;gap:12px;justify-content:center">${s ? tiles : '<div class="card white lg c" style="margin-top:90px">Every ingredient has its own dedicated supplier.</div>'}</div>
        ${s >= 2 ? `<div class="card red new c lg">Sugar sachets: shortage! Item held or paused. Cannot be substituted from another store’s stock or repackaged into different cartons.</div>` : ''}
        ${s >= 3 ? `<div class="card gold new c lg">40 suppliers across the menu. One failure does not stop the whole system.</div>` : ''}</div>`;
    } }
  ]
};

/* ---------------- TAB 2 ---------------- */
TABS[1] = {
  init: () => ({ pick: [] }),
  modes: [
    { name: 'The Gate Run', max: 5, render(c) {
      const s = c.step, gx = i => 176 + i * 216;
      const crateX = s === 0 ? 30 : s <= 4 ? gx(s - 1) + 63 : 1086;
      const prevX = s <= 1 ? 30 : s <= 4 ? gx(s - 2) + 63 : gx(3) + 63;
      const gates = GATES.map((g, i) => `<div class="gate" style="position:absolute;left:${gx(i)}px;top:0"><div class="gh" style="background:${g.color};color:${g.id === 'SQMS' ? '#2B2622' : '#fff'}">${SP.shield(2, g.id === 'SQMS' ? '#fff' : '#fff')}${g.name}${s > i ? `<span class="stamp green ${s === i + 1 ? '' : 'old'}" style="font-size:15px;border-width:3px;margin-left:auto;background:#fff">PASS</span>` : ''}</div><div class="gq">${esc(g.q)}</div></div>`).join('');
      const frames = GATES.map((g, i) => `<div class="frame" style="left:${gx(i) + 48}px;border-color:${g.color}"></div>`).join('');
      const act = s === 1 ? 'haccp' : s === 2 ? 'sqms' : s === 4 ? 'dqmp' : '';
      const brackets = `<div style="position:relative;height:84px;margin-top:6px">
        <div class="card ${act === 'sqms' ? 'pulse' : ''}" style="position:absolute;left:0;width:820px;top:0;height:78px;padding:2px 8px;border-color:#B8860B;background:#fbeaa0"><div class="sm">SQMS: over the plant</div>
          <div class="card ${act === 'haccp' ? 'pulse' : ''}" style="background:#cdeccd;width:560px;padding:0 8px;font-size:17px;border-color:#2d7a31;box-shadow:none">HACCP: base layer, inside SQMS</div></div>
        <div class="card ${act === 'dqmp' ? 'pulse' : ''}" style="position:absolute;left:836px;width:340px;top:0;height:78px;padding:2px 8px;border-color:#A82B2E;background:#f3c9c4"><div class="sm">DQMP: warehouse, transport and DC</div></div>
        <div class="card ghost" style="position:absolute;left:1190px;width:104px;top:0;height:78px;padding:0 4px;font-size:15px;line-height:1.1">QIP: at the store, see Segment 9</div></div>`;
      const facts = s >= 1 && s <= 4 ? GATES[s - 1].facts.map(f => `<span class="chip new" style="font-size:19px;background:${GATES[s - 1].color};color:${GATES[s - 1].id === 'SQMS' ? '#2B2622' : '#fff'}">${esc(f)}</span>`).join(' ') : s === 5 ? '<span class="chip g new lg">All four gates cleared. The crate reaches the DC.</span>' : '<span class="chip lg">Follow one crate of chicken nuggets from factory to DC.</span>';
      return `<div style="position:relative;height:100%">
        <div style="position:relative;height:150px">${gates}</div>
        <div class="beltwrap" style="position:relative"><div style="position:absolute;left:0;bottom:30px">${SP.factory(4)}</div><div style="position:absolute;left:1070px;bottom:30px">${SP.dc(4)}</div>${frames}
          <div class="belt"></div><div class="crate" data-tw="left|${prevX}px|${crateX}px|600" style="left:${prevX}px">${SP.crate(5)}</div></div>
        ${brackets}<div class="row" style="flex-wrap:wrap;margin-top:12px;gap:10px">${facts}</div></div>`;
    } },
    { name: 'Find the CCP', max: 16, render(c) {
      const s = c.step, rev = Math.min(s, 7);
      const tcol = { Biological: '#4CAF50', Chemical: '#9B7FD6', Physical: '#F0A35E' };
      const chips = `<div class="row" style="gap:12px;margin-bottom:8px"><span class="chip" style="border-color:${tcol.Biological}">Biological: Salmonella in chicken</span><span class="chip" style="border-color:${tcol.Chemical}">Chemical: detergent in food</span><span class="chip" style="border-color:${tcol.Physical}">Physical: metal fragment</span></div>`;
      const cards = HACCP_STAGES.map((h, i) => {
        const on = i < rev, ccp = s >= 9 && h.ccp;
        return `<div class="card stg ${ccp ? 'ccp pulse' : ''} ${i === s - 1 ? 'new' : ''}" style="background:${ccp ? '' : on ? '#fff' : 'var(--cream)'}"><h3>${i + 1}. ${esc(h.stage)}</h3>${on ? `<div class="chip" style="font-size:14px;padding:0 5px;background:${tcol[h.type]};color:#fff">${h.type}</div><div class="mt"><b>${esc(h.hazard)}</b></div><div class="mt" style="border-top:3px solid var(--ink);padding-top:4px">${esc(h.control)}</div>` : '<div class="big" style="opacity:.25;margin-top:40px">?</div>'}${ccp ? '<div class="stamp gold" style="font-size:20px;margin-top:6px;border-width:3px">CCP</div>' : ''}</div>`;
      }).join('');
      const prompt = s >= 8 ? `<div class="card ${s >= 9 ? 'gold' : 'red'} new c lg" style="margin-top:10px">${s >= 9 ? 'Cooking is the Critical Control Point. CCP = where we control it. Critical limit = how much control.' : 'Where is the Critical Control Point?'}</div>` : '';
      const lad = s >= 10 ? `<div class="row" style="gap:6px;margin-top:10px">${HACCP_PRINCIPLES.map((p, i) => `<div class="card ${i < s - 9 ? 'gold' : ''} ${i === s - 10 ? 'new' : ''}" style="flex:1;font-size:16px;line-height:1.1;padding:4px 4px;text-align:center;${i < s - 9 ? '' : 'opacity:.55'}"><b>${i + 1}</b> ${p}</div>`).join('')}</div>` : '';
      return chips + `<div class="step7">${cards}</div>` + prompt + lad;
    } },
    { name: 'Which Gate?', max: 6, render(c) {
      const s = c.step, i = Math.ceil(s / 2) - 1, sc = SCENARIOS[i], ans = s > 0 && s % 2 === 0, pick = c.st.pick[i];
      if (!s) return '<div class="card white mid c" style="margin-top:120px;padding:30px">Three scenarios. Which gate catches the problem?</div>';
      const cmp = { HACCP: 'Whole food chain', SQMS: 'Plant', DQMP: 'Warehouse and transport' };
      const btns = ['HACCP', 'SQMS', 'DQMP'].map(g => { const gt = GATES.find(x => x.id === g); const ok = ans && g === sc.answer; return `<button class="btn ${ans && !ok ? 'dis' : ''} ${ok ? 'pulse' : ''}" data-a="pick" data-v="${g}" style="background:${gt.color};color:${g === 'SQMS' ? '#2B2622' : '#fff'};font-size:28px;min-width:220px;padding:8px 20px">${g}</button>`; }).join('');
      return `<div class="col" style="align-items:center;gap:10px">
        <div class="chip d">Scenario ${i + 1} of 3</div>
        <div class="card white c new wipe" style="font:900 30px/1.3 var(--mono);padding:14px 30px;width:1100px">${esc(sc.text)}</div>
        <div class="row" style="gap:24px">${btns}</div>
        ${ans ? `<div class="row new" style="gap:20px"><span class="stamp ${''}" style="color:#2d7a31;border-color:#2d7a31">${sc.answer}</span><span class="lg">${esc(sc.why)}</span>${pick ? `<span class="chip ${pick === sc.answer ? 'g' : 'r'}">Your pick: ${pick} ${pick === sc.answer ? '✓' : '✗'}</span>` : ''}</div>
        <div class="row" style="gap:10px">${['SQMS', 'HACCP', 'DQMP'].map(g => `<div class="card ${g === sc.answer ? 'gold' : 'white'} c" style="width:350px;padding:2px 8px"><b>${cmp[g]}</b><div class="sm">${g}</div></div>`).join('')}</div>` : '<div class="lg">Click a gate, or say it aloud and press Space.</div>'}</div>`;
    }, act(a, v, c) { if (a === 'pick' && c.step % 2 === 1) { c.st.pick[Math.ceil(c.step / 2) - 1] = v; c.goEff(c.step + 1); } } }
  ]
};

/* ---------------- TAB 3 ---------------- */
function gauge(v, name, delay = 0) {
  const arcs = pixelDial(80, 80, 64, 0, 180, '#CFCBC0', 6) + pixelDial(80, 80, 64, 180 - v * 180, 180, '#D2403F', 6) + pixelDial(80, 80, 50, 0, 180, '#CFCBC0', 6);
  const deg = -90 + v * 180;
  return `<div class="gauge new"><div style="position:relative;width:160px;height:96px;margin:0 auto"><svg width="160" height="96" viewBox="0 0 160 96" shape-rendering="crispEdges">${arcs}</svg>
    <div class="needle" data-tw="transform|rotate(-90deg)|rotate(${deg}deg)|700" style="left:80px;bottom:10px;height:52px"></div><div style="position:absolute;left:68px;bottom:2px;width:24px;height:12px;background:var(--ink)"></div></div><div style="margin-top:4px">${esc(name)}</div></div>`;
}
TABS[2] = {
  modes: [
    { name: 'The 5-Person Control Room', max: 7, render(c) {
      const s = c.step, n = Math.min(s, 5);
      const people = Array.from({ length: 8 }, (_, i) => i < 5 ? SP.person(3, '#D2403F') : `<span style="opacity:.5">${SP.person(3, '#8C8C8C')}</span>`).join('');
      const oct = `<div style="width:310px;height:340px;background:var(--ink);clip-path:polygon(25% 0,75% 0,100% 20%,100% 80%,75% 100%,25% 100%,0 80%,0 20%);position:relative;flex:none"><div style="position:absolute;inset:6px;background:var(--cream);clip-path:polygon(25% 0,75% 0,100% 20%,100% 80%,75% 100%,25% 100%,0 80%,0 20%);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:8px;text-align:center;padding:40px 30px">
        <div class="row" style="gap:2px;align-items:flex-end;justify-content:center">${people}</div><div class="sm" style="line-height:1.1">5 people + 3 dashed for Quality Assurance: 8 including QA</div><div style="font-size:22px;line-height:1.1"><b>McDonald\u2019s corporate supply chain team</b></div>${b13()}</div></div>`;
      let right = '';
      if (s < 7) {
        right = OUTSOURCE.slice(0, n).map((o, i) => `<div class="row ${i === s - 1 ? 'new left' : ''}" style="gap:8px"><span class="chip g lg" style="width:270px">${o[0]}</span><span class="mid" style="font-size:24px">→</span><span class="card white lg grow" style="padding:4px 12px">${o[1]}${o[2] ? ` <span class="sm">(${o[2]})</span>` : ''}</span></div>`).join('') || '<div class="card white lg" style="margin-top:80px">Press Space to outsource one function at a time.</div>';
        if (s >= 6) right += `<div class="row new" style="gap:20px;margin-top:14px"><span class="stamp" style="font-size:40px">100% OUTSOURCED</span><span class="lg"><i>sui generis</i>: lean, no back-up staff, no frills</span></div>
          <div class="row" style="gap:14px"><div class="card white res"><b>40</b><span class="sm">cities ${b13()}</span></div><div class="card white res"><b>250</b><span class="sm">restaurants ${b13()}</span></div></div>`;
      } else {
        right = `<div class="row" style="gap:10px;flex-wrap:wrap">
          <div class="card white new" style="width:48%;min-height:96px"><b>Hardcastle Restaurants</b><div class="sm">Runs West &amp; South zone under licence</div></div>
          <div class="card white new" style="width:48%;min-height:96px"><b>Connaught Plaza</b><div class="sm">Runs North &amp; East</div></div>
          <div class="card white new" style="width:48%;min-height:96px"><b>HQ: Parel, Mumbai</b><div class="sm">Corporate HR, finance, back-office only</div></div>
          <div class="card red new" style="width:48%;min-height:96px"><b>RKFL is not part of McDonald’s</b><div class="sm">An independent logistics partner</div></div></div>
          <div class="card gold new lg c">All outlets are franchised. Hiring is done at store level.</div>
          <div class="row" style="gap:14px;margin-top:10px"><span class="stamp" style="font-size:28px">100% OUTSOURCED</span><span class="chip">40 cities ${b13()}</span><span class="chip">250 restaurants ${b13()}</span></div>`;
      }
      return `<div class="row" style="gap:20px;align-items:flex-start;height:100%">${oct}<div class="col grow" style="gap:8px">${right}</div></div>`;
    } },
    { name: 'Handshake vs Contract', max: 3, render(c) {
      const s = c.step;
      const contract = s >= 1 ? `<div class="card white new left row grow" style="gap:16px;min-height:${s >= 3 ? 130 : 200}px;position:relative"><span style="position:relative;flex:none">${SP.receipt(s >= 3 ? 5 : 8)}<span style="position:absolute;left:${s >= 3 ? 2 : 6}px;top:${s >= 3 ? 12 : 24}px">${SP.cross(s >= 3 ? 7 : 10)}</span></span><div class="lg" style="font-size:${s >= 3 ? 20 : 26}px">No legally signed supplier agreements. No legal SLA with RKFL.</div></div>` : '';
      const shake = s >= 2 ? `<div class="card gold new left row grow" style="gap:16px;min-height:${s >= 3 ? 130 : 200}px">${SP.handshake(s >= 3 ? 5 : 8)}<div class="lg" style="font-size:${s >= 3 ? 20 : 26}px">Built on faith. One product, one supplier, long-term.</div></div>` : '';
      let g = '';
      if (s >= 3) {
        const grp = (k, label) => `<div class="card white new" style="flex:${KPIS.filter(x => x.group === k).length}"><div class="chip d" style="font-size:16px">${label}</div><div class="row" style="justify-content:space-around;align-items:flex-start;margin-top:6px">${KPIS.filter(x => x.group === k).map(x => gauge(x.v, x.name)).join('')}</div></div>`;
        g = `<div class="row" style="gap:12px;align-items:stretch;margin-top:10px">${grp('warehouse', 'Warehouse: people and space')}${grp('transport', 'Transport: trips and trucks')}</div><div class="row" style="justify-content:space-between;margin-top:4px"><span class="lg"><b>Six KPIs replace the SLA.</b></span><span class="chip">illustrative, not real data</span></div>`;
      }
      return `<div class="row" style="gap:16px">${contract || '<div class="card white lg c grow" style="margin-top:80px">What holds this network together?</div>'}${shake}</div>${g}`;
    } },
    { name: 'The Extended Enterprise', max: 8, render(c) {
      const s = c.step, W = 1294, H = 410, cx = W / 2, cy = 200;
      const pts = NETWORK.map((n, i) => { const a = (-90 + i * 360 / NETWORK.length) * Math.PI / 180; return [cx + Math.cos(a) * 470, cy + Math.sin(a) * 160]; });
      const lines = pts.map((p, i) => i < s ? `<line x1="${cx}" y1="${cy}" x2="${p[0]}" y2="${p[1]}" stroke="#2B2622" stroke-width="4" stroke-dasharray="12 8"/>` : '').join('');
      const nodes = pts.map((p, i) => `<div style="position:absolute;left:${p[0]}px;top:${p[1]}px;transform:translate(-50%,-50%)"><div class="nd ${i < s ? 'on' : ''} ${i === s - 1 ? 'new' : ''}" style="${i < s ? '' : 'opacity:.45'}">${NETWORK[i]}${i === 1 && s >= 2 ? ' <span class="chip g" style="font-size:14px;padding:0 4px">3PL</span>' : ''}</div></div>`).join('');
      return `<div style="position:relative;width:${W}px;height:${H}px"><svg width="${W}" height="${H}" style="position:absolute;left:0;top:0" shape-rendering="crispEdges">${lines}</svg>${nodes}
        <div class="card red ${s >= 8 ? 'pulse' : ''}" style="position:absolute;left:${cx}px;top:${cy}px;transform:translate(-50%,-50%);text-align:center;width:250px"><div class="mid" style="font-size:26px">McDonald’s Corporation</div>${s >= 8 ? '<div class="sm new">What McDonald’s keeps: standards and oversight</div>' : ''}</div>
        ${s >= 7 ? `<div class="cap-bar" style="bottom:0">A loosely coupled, self-organising network of firms.</div>` : ''}</div>`;
    } }
  ]
};
