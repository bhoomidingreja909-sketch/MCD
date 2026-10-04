/* =====================================================================
   PIXEL ART ENGINE. Every sprite is drawn here on a coarse grid and
   rendered as crisp inline SVG. No images, no icon packs, no fonts.
   ===================================================================== */
const PAL = {
  K: '#16293B', W: '#FFFFFF', C: '#E6E1D3', c: '#CFCBC0', R: '#D8281E', r: '#A81D15', G: '#FFC20E', g: '#D99A00',
  D: '#3A3A3F', d: '#55555C', S: '#8C8C8C', s: '#6F6F6F', L: '#F2F2F2', A: '#A9B858', a: '#6F8F3A', T: '#4A3A38',
  P: '#4A4A4A', B: '#7FB6EA', Q: '#5CCBB8', O: '#F0A35E', U: '#9B7FD6', N: '#4CAF50', H: '#6C8EAD',
  b: '#C98A3C', y: '#E9C27A', p: '#7A4A2A', k: '#4F2E1C', m: '#F4EFE0', f: '#F0C8A0', o: '#D9A878', w: '#CFE7F7', V: '#7F5A9F'
};

/* pix: draw a character grid ('.' = transparent) with a soft outline. A rounding filter turns the grid into smooth, clay-like shapes. */
function pix(rows, o = {}) {
  const pal = Object.assign({}, PAL, o.pal || {});
  const h = rows.length, w = Math.max(...rows.map(r => r.length));
  const g = rows.map(r => r.padEnd(w, '.'));
  const ol = o.o === undefined ? PAL.K : o.o;
  const P = ol ? 1 : 0;
  const at = (x, y) => (x < 0 || y < 0 || x >= w || y >= h) ? '.' : g[y][x];
  const fill = (x, y) => { const c = at(x, y); return c !== '.' && pal[c]; };
  const by = {};
  for (let y = -P; y < h + P; y++) for (let x = -P; x < w + P; x++) {
    let col = null;
    if (fill(x, y)) col = pal[at(x, y)];
    else if (ol && (fill(x - 1, y) || fill(x + 1, y) || fill(x, y - 1) || fill(x, y + 1))) col = ol;
    if (col) (by[col] = by[col] || []).push([x + P, y + P]);
  }
  const W = w + 2 * P, H = h + 2 * P;
  let paths = '';
  for (const col in by) {
    const pts = by[col].sort((a, b) => a[1] - b[1] || a[0] - b[0]);
    let d = '', i = 0;
    while (i < pts.length) {
      let j = i; while (j + 1 < pts.length && pts[j + 1][1] === pts[i][1] && pts[j + 1][0] === pts[j][0] + 1) j++;
      d += `M${pts[i][0]} ${pts[i][1]}h${j - i + 1}v1h-${j - i + 1}z`; i = j + 1;
    }
    paths += `<path fill="${col}" ${col === ol ? 'fill-opacity=".5"' : ''} d="${d}"/>`;
  }
  return svgWrap(W, H, paths, o);
}
const SOFT = '<defs><filter id="sf" x="-8%" y="-8%" width="116%" height="116%" color-interpolation-filters="sRGB"><feGaussianBlur stdDeviation="0.3"/><feColorMatrix values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -8"/></filter></defs>';
function svgWrap(W, H, inner, o = {}) {
  const s = o.s || 4;
  return `<svg class="spr ${o.cls || ''}" viewBox="0 0 ${W} ${H}" width="${W * s}" height="${H * s}" style="${o.style || ''}">${SOFT}<g filter="url(#sf)">${inner}</g></svg>`;
}
/* rect helpers for buildings and vehicles */
const col = c => PAL[c] || c;
const rc = (x, y, w, h, f) => [[x, y, w, h, col(f)]];
const bx = (x, y, w, h, f, ol = 'K') => [[x, y, w, h, col(ol)], [x + 1, y + 1, w - 2, h - 2, col(f)]];
function gr(rows, ox, oy, o = {}) {
  const out = [], pal = Object.assign({}, PAL, o.pal || {});
  if (o.ol) { // outline by drawing dark copies one pixel away
    rows.forEach((r, y) => [...r].forEach((c, x) => { if (c !== '.') [[-1, 0], [1, 0], [0, -1], [0, 1]].forEach(([dx, dy]) => out.push([ox + x + dx, oy + y + dy, 1, 1, PAL.K])); }));
  }
  rows.forEach((r, y) => { let x = 0; while (x < r.length) { const c = r[x]; if (c === '.') { x++; continue; } let e = x; while (e + 1 < r.length && r[e + 1] === c) e++; out.push([ox + x, oy + y, e - x + 1, 1, pal[c]]); x = e + 1; } });
  return out;
}
function rs(W, H, parts, o = {}) {
  let inner = '';
  parts.forEach(p => { (typeof p[0] === 'number' ? [p] : p).forEach(r => { inner += `<rect x="${r[0]}" y="${r[1]}" width="${r[2]}" height="${r[3]}" fill="${r[4]}"/>`; }); });
  return svgWrap(W, H, inner, o);
}


const GRIDS = {
  burger: ['....bbbbbbbb....', '..bbbbybbbbbbb..', '.bbybbbbbybbbbb.', '.bbbbbbbbbbbbbb.', 'AAaAAaAAaAAaAAaA', 'GGGGGGGGGGGGGGGG', 'pppppppppppppppp', 'kkkkkkkkkkkkkkkk', 'RRRRRRRRRRRRRRRR', '.bbbbbbbbbbbbbb.', '..bbbbbbbbbb..'],
  fries: ['..y.yy.y.y..', '.yyyyyyyyyy.', '.yyeyyyyeyy.', 'RRRRRRRRRRRR', 'RRRRRRRRRRRR', '.RRGRRGRRGR.', '.RRRRRRRRRR.', '.RRGRRGRRGR.', '..RRRRRRRR..', '..RRRRRRRR..'],
  cup: ['....rr....', '....rr....', 'WWWWWWWWWW', '.RRRRRRRR.', '.RRRRRRRR.', '.RWWWWWWR.', '.RWWWWWWR.', '.RRRRRRRR.', '..RRRRRR..', '..RRRRRR..'],
  tray: ['..bbb..RR..yyy....', '.bbbbb.RRR.yyyyy..', 'SSSSSSSSSSSSSSSSSS', 'sSSSSSSSSSSSSSSSSs', '.ssssssssssssssss.'],
  lettuce: ['...AA..AA...', '..AAaAAaAA..', '.AAaAAAAaAA.', 'AAAAaAAaAAAA', 'AaAAAAAAAaAA', 'AAAaAAAAaAAA', '.AAAAaAAAAA.', '..AAAAAAAA..', '....aaaa....'],
  cheese: ['........GGGG', '....GGGGGGGG', 'GGGGGGGGgGGG', 'GGgGGGGGGGGG', 'GGGGGGGGGGGG', '.GGGGGGGGGG.'],
  milk: ['..rrrr..', '..WWWW..', '.WWWWWW.', 'WWWWWWWW', 'WBBBBBBW', 'WBWWWWBW', 'WBBBBBBW', 'WWWWWWWW', 'WWWWWWWW', 'WWWWWWWW'],
  bun: ['....bbbbbb....', '..bbbbybbbbb..', '.bbybbbbbybbb.', 'bbbbbbbbbbbbbb', 'bbbbbbbbbbbbbb', '.bbbbbbbbbbbb.'],
  thermometer: ['..WW..', '.WWWW.', '.WWWW.', '.WWWW.', '.WRRW.', '.WRRW.', '.WRRW.', 'WWRRWW', 'WRRRRW', 'WRRRRW', '.WRRW.', '..WW..'],
  clipboard: ['...SSSS...', 'pppSSSSppp', 'pWWWWWWWWp', 'pWKKKKKKWp', 'pWWWWWWWWp', 'pWKKKKWWWp', 'pWWWWWWWWp', 'pWKKKKKKWp', 'pWWWWWWWWp', 'pWNNWWWWWp', 'pWWWWWWWWp', 'pppppppppp'],
  handshake: ['HHHH..ffff..RRRR', 'HHHHffffffffRRRR', 'HHHHfofofofoRRRR', 'HHHHffffffffRRRR', 'HHHH.ffffff.RRRR', '.....oooooo.....'],
  receipt: ['WWWWWWWWW', 'WKKKKKKKW', 'WWWWWWWWW', 'WKKKKKWWW', 'WWWWWWWWW', 'WKKKKKKKW', 'WWWWWWWWW', 'WKKKWWKKW', 'WWWWWWWWW', 'W.WW.WW.W'],
  person: ['..ff..', '.ffff.', '.ffff.', '..XX..', '.XXXX.', 'XXXXXX', 'XXXXXX', '.PPPP.', '.P..P.', '.P..P.'],
  farmer: ['...yyyyyy...', '..yyyyyyyy..', '....ffff...S', '....ffff...T', '...RRRRRR..T', '..RRRRRRRR.T', '..RRRRRRRR.T', '...HHHHHH..T', '...HH..HH..T', '...PP..PP..T'],
  courier: ['...RRRRRR...', '..RRRRRRRR..', '....ffff....', '....ffff....', '..GGGGGGGG..', 'bbbGGGGGGGG.', 'bkbbGGGGGGG.', 'bbbbPPPPPP..', '....PP..PP..', '....PP..PP..'],
  crate: ['bbbbbbbbbbbb', 'bkkkkkkkkkkb', 'bkWWWWWWWWkb', 'bkWRRRRRRWkb', 'bkWWWWWWWWkb', 'bkkkkkkkkkkb', 'bbbbbbbbbbbb'],
  cross: ['RR....RR', 'RRR..RRR', '.RRRRRR.', '..RRRR..', '..RRRR..', '.RRRRRR.', 'RRR..RRR', 'RR....RR'],
  tick: ['.......NN', '......NNN', 'N....NNN.', 'NN..NNN..', 'NNNNNN...', '.NNNN....', '..NN.....'],
  snow: ['..W..W..', 'W..WW..W', '.W.WW.W.', '..WWWW..', '..WWWW..', '.W.WW.W.', 'W..WW..W', '..W..W..'],
  bin: ['.SSSSSS.', 'SSSSSSSS', '.sSsSsS.', '.sSsSsS.', '.sSsSsS.', '.sSsSsS.', '.ssssss.'],
  gear: ['..SS..SS..', '.SSSSSSSS.', 'SSSS..SSSS', '.SS....SS.', '.SS....SS.', 'SSSS..SSSS', '.SSSSSSSS.', '..SS..SS..'],
  eye: ['..SSSSSS..', '.SWWWWWWS.', 'SWWUUUUWWS', 'SWWUKKUWWS', '.SWWUUWWS.', '..SSSSSS..'],
  shield: ['WWWWWWWW', 'WWWWWWWW', 'WWWWWWWW', 'WWWWWWWW', '.WWWWWW.', '..WWWW..', '...WW...'],
};
const SP = {};
Object.keys(GRIDS).forEach(k => { SP[k] = (s = 4, o = {}) => pix(GRIDS[k], Object.assign({ s }, o)); });
SP.person = (s = 4, color = '#D2403F') => pix(GRIDS.person, { s, pal: { X: color } });
SP.shield = (s = 4, color = '#4CAF50') => pix(GRIDS.shield, { s, pal: { W: color } });


SP.cloud = (s = 4) => V(20, 6, s, g => '<ellipse cx="100" cy="46" rx="96" ry="14" fill="#fff" opacity=".95"/><circle cx="66" cy="34" r="22" fill="#fff"/><circle cx="108" cy="26" r="28" fill="#fff"/><circle cx="146" cy="36" r="20" fill="#fff"/>');
SP.grass = (s = 4) => V(6, 3, s, g => '<path d="M4 30 Q8 6 14 30 Q20 0 28 30 Q34 8 40 30 Q46 4 52 30 Z" fill="#5BB353"/>');

/* Pixel digit helper for the dial */
function pixelDial(cx, cy, r, a0, a1, color, sz) {
  let out = '';
  for (let a = a0; a <= a1; a += 2) {
    const x = cx + Math.cos(a * Math.PI / 180) * r, y = cy - Math.sin(a * Math.PI / 180) * r;
    out += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${(sz * 0.62).toFixed(1)}" fill="${color}"/>`;
  }
  return out;
}

/* =====================================================================
   SMOOTH ILLUSTRATIONS (bright vector style): buildings, vehicles, people.
   These replace the grid sprites of the same name.
   ===================================================================== */
let _vg = 0;
const lgr = (c1, c2) => { const id = 'vg' + (++_vg); return [id, `<linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${c1}"/><stop offset="1" stop-color="${c2}"/></linearGradient>`]; };
function V(W, H, s, build, o = {}) {
  const defs = [], g = (c1, c2) => c1; // flat colours
  const body = build(g);
  return `<svg class="spr ${o.cls || ''}" viewBox="0 0 ${W * 10} ${H * 10}" width="${W * s}" height="${H * s}" style="${o.style || ''}"><defs>${defs.join('')}</defs>${body}</svg>`;
}
const CREAM = ['#F7EDD0'], REDG = ['#D8281E'], GOLDG = ['#FFC20E'], GLASS = ['#2B3F55'], GREYG = ['#A9B8C6'];
const wheel = (x, y, r) => `<circle cx="${x}" cy="${y}" r="${r}" fill="#1F2A33"/><circle cx="${x}" cy="${y}" r="${r * 0.46}" fill="#C7D2DA"/><circle cx="${x}" cy="${y}" r="${r * 0.16}" fill="#6B7A86"/>`;
const bunBadge = (x, y, r, g) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${g(...GOLDG)}"/><path d="M${x - r * 0.55} ${y - r * 0.05} Q${x} ${y - r * 0.85} ${x + r * 0.55} ${y - r * 0.05} Z" fill="#C98A3C"/><rect x="${x - r * 0.58}" y="${y}" width="${r * 1.16}" height="${r * 0.2}" rx="${r * 0.1}" fill="#5A3320"/><rect x="${x - r * 0.52}" y="${y + r * 0.26}" width="${r * 1.04}" height="${r * 0.22}" rx="${r * 0.11}" fill="#E0A24A"/>`;

SP.store = (s = 4, o = {}) => V(72, 44, s, g => `
  <rect x="30" y="96" width="540" height="70" rx="6" fill="#FFC20E"/><rect x="30" y="112" width="540" height="8" fill="#FFD84D"/><rect x="70" y="62" width="460" height="40" rx="6" fill="#FFC20E"/>
  <rect x="236" y="14" width="128" height="100" rx="10" fill="#D8281E"/>${bunBadge(300, 62, 40, g)}
  <rect x="40" y="166" width="520" height="232" fill="#D8281E"/>
  <rect x="64" y="236" width="472" height="118" fill="#2B3F55"/>${[0, 1, 2, 3, 4, 5, 6].map(i => `<rect x="${64 + i * 78.5}" y="236" width="6" height="118" fill="#D8281E"/>`).join('')}
  <rect x="84" y="262" width="60" height="30" fill="#4A6683"/><rect x="396" y="262" width="60" height="30" fill="#4A6683"/><rect x="236" y="262" width="26" height="92" fill="#4A6683"/>
  <rect x="70" y="326" width="70" height="22" fill="#F08A2A"/><rect x="156" y="326" width="40" height="22" fill="#F08A2A"/>
  ${bunBadge(94, 202, 20, g)}${bunBadge(506, 202, 20, g)}
  <rect x="540" y="214" width="170" height="16" rx="3" fill="#FFC20E"/><rect x="684" y="214" width="8" height="190" fill="#A81D15"/>
  <rect x="40" y="380" width="520" height="22" fill="#A81D15"/>`, { ...o, raw: 1 });

SP.farm = (s = 4) => V(30, 16, s, g => `
  <rect x="0" y="116" width="300" height="44" rx="16" fill="${g('#86D07A', '#4FA14A')}"/><path d="M6 134 Q150 118 294 134" stroke="#6CBB62" stroke-width="7" fill="none"/>
  <path d="M16 64 L90 12 L164 64 Z" fill="#7A2E27" stroke="#7A2E27" stroke-width="10" stroke-linejoin="round"/>
  <rect x="30" y="58" width="120" height="66" rx="6" fill="${g(...REDG)}"/><rect x="68" y="76" width="44" height="48" rx="4" fill="#FFF3DC"/><path d="M68 76 L112 124 M112 76 L68 124" stroke="#E0C9A0" stroke-width="4"/><circle cx="90" cy="42" r="9" fill="#FFF3DC"/>
  <rect x="220" y="82" width="16" height="44" rx="6" fill="#7A4A2A"/><circle cx="228" cy="60" r="30" fill="#5DB556"/><circle cx="206" cy="78" r="20" fill="#4FA14A"/><circle cx="252" cy="76" r="22" fill="#6BC463"/><circle cx="220" cy="50" r="10" fill="#86D07A" opacity=".7"/>`);
SP.factory = (s = 4) => V(30, 16, s, g => `
  <rect x="0" y="126" width="300" height="34" rx="14" fill="${g('#B9C6CF', '#8FA3B2')}"/>
  <path d="M16 70 L16 38 L66 70 L66 38 L116 70 L116 38 L166 70 L166 38 L212 70 Z" fill="#7F93A3" stroke="#7F93A3" stroke-width="8" stroke-linejoin="round"/>
  <rect x="16" y="66" width="196" height="70" rx="8" fill="${g(...GREYG)}"/>
  ${[0, 1, 2, 3].map(i => `<rect x="${30 + i * 44}" y="80" width="30" height="26" rx="5" fill="${g(...GLASS)}"/>`).join('')}<rect x="150" y="104" width="38" height="32" rx="5" fill="#5E7385"/>
  <rect x="228" y="26" width="40" height="110" rx="6" fill="${g('#E8695B', '#B8352B')}"/><rect x="228" y="48" width="40" height="10" fill="#fff"/>
  <circle cx="248" cy="18" r="13" fill="#fff" opacity=".95"/><circle cx="272" cy="8" r="9" fill="#fff" opacity=".8"/><circle cx="232" cy="6" r="8" fill="#fff" opacity=".7"/>`);
SP.dc = (s = 4) => V(30, 16, s, g => `
  
  <rect x="10" y="52" width="280" height="96" rx="10" fill="${g(...CREAM)}"/><rect x="0" y="34" width="300" height="32" rx="14" fill="${g(...REDG)}"/>${bunBadge(150, 50, 15, g)}
  ${[0, 1, 2, 3].map(i => `<rect x="${28 + i * 66}" y="82" width="52" height="66" rx="5" fill="${g('#BCC8D1', '#8493A0')}"/>${[0, 1, 2].map(k => `<rect x="${32 + i * 66}" y="${92 + k * 16}" width="44" height="4" rx="2" fill="#fff" opacity=".6"/>`).join('')}`).join('')}`);
SP.stop = (s = 4) => V(30, 16, s, g => `
  <rect x="0" y="136" width="300" height="24" rx="12" fill="${g('#D9D2BE', '#BDB59C')}"/>
  <rect x="22" y="64" width="170" height="78" rx="8" fill="${g(...CREAM)}"/>
  <rect x="12" y="36" width="190" height="32" rx="8" fill="#E8392F"/>${Array.from({ length: 5 }, (_, i) => `<rect x="${30 + i * 38}" y="36" width="19" height="32" fill="#fff"/>`).join('')}
  <rect x="38" y="82" width="72" height="42" rx="6" fill="${g(...GLASS)}"/><rect x="128" y="82" width="42" height="60" rx="5" fill="#1E4A5E"/>
  <rect x="226" y="82" width="38" height="60" rx="9" fill="${g(...REDG)}"/><rect x="234" y="90" width="22" height="18" rx="4" fill="#CFEFF5"/>
  <rect x="274" y="44" width="6" height="96" rx="3" fill="#4A5560"/><rect x="254" y="14" width="46" height="32" rx="9" fill="${g(...GOLDG)}"/>`);
SP.home = (s = 4) => V(30, 16, s, g => `
  <rect x="0" y="138" width="300" height="22" rx="11" fill="${g('#86D07A', '#5BB353')}"/>
  <path d="M26 76 L116 22 L206 76 Z" fill="#4F88B3" stroke="#4F88B3" stroke-width="10" stroke-linejoin="round"/>
  <rect x="42" y="72" width="150" height="68" rx="6" fill="${g(...CREAM)}"/><rect x="100" y="94" width="34" height="46" rx="5" fill="#E8392F"/>
  <rect x="54" y="88" width="34" height="30" rx="5" fill="${g(...GLASS)}"/><rect x="146" y="88" width="34" height="30" rx="5" fill="${g(...GLASS)}"/>
  <circle cx="250" cy="80" r="14" fill="#F5C8A0"/><path d="M236 76 Q250 58 264 76 Z" fill="#7A4A2A"/><rect x="236" y="96" width="28" height="44" rx="13" fill="#4F88B3"/><rect x="240" y="136" width="8" height="14" rx="3" fill="#24404F"/><rect x="252" y="136" width="8" height="14" rx="3" fill="#24404F"/>`);
SP.truck = (s = 4, o = {}) => V(38, 18, s, g => `
  
  <rect x="0" y="10" width="252" height="118" rx="14" fill="${g('#FFFFFF', '#D5E3EC')}"/><rect x="0" y="70" width="252" height="14" fill="#4AA8E0"/><rect x="0" y="88" width="252" height="8" fill="#E8392F"/>
  <path d="M252 40 H318 Q338 40 348 62 L368 96 Q374 108 374 120 V128 H252 Z" fill="${g(...REDG)}"/>
  <path d="M264 52 H312 Q324 52 332 68 L342 92 H264 Z" fill="${g('#C4EDF8', '#5FB5D4')}"/>
  <rect x="0" y="124" width="374" height="20" rx="7" fill="#39424B"/><circle cx="368" cy="114" r="7" fill="#FFD95A"/>
  ${wheel(64, 150, 26)}${wheel(122, 150, 26)}${wheel(306, 150, 26)}`, { ...o, raw: 1 });
SP.van = (s = 4, o = {}) => V(30, 16, s, g => `
  
  <rect x="0" y="12" width="196" height="102" rx="14" fill="${g('#FFFFFF', '#D5E3EC')}"/>
  <rect x="12" y="60" width="52" height="12" rx="6" fill="#6EC1F5"/><rect x="72" y="60" width="52" height="12" rx="6" fill="#3FD0B4"/><rect x="132" y="60" width="52" height="12" rx="6" fill="#FFA94D"/>
  <path d="M196 44 H240 Q256 44 264 62 L284 96 Q290 106 290 116 V116 H196 Z" fill="${g(...REDG)}"/><path d="M206 54 H238 Q248 54 254 66 L262 88 H206 Z" fill="${g('#C4EDF8', '#5FB5D4')}"/>
  <rect x="0" y="110" width="292" height="14" rx="6" fill="#39424B"/>${wheel(52, 128, 22)}${wheel(236, 128, 22)}`, { ...o, raw: 1 });
SP.cab = (s = 4) => V(10, 17, s, g => `<path d="M6 60 H54 Q72 60 80 80 L92 108 Q96 118 96 128 V150 H6 Z" fill="${g(...REDG)}"/><path d="M16 70 H50 Q60 70 66 82 L72 100 H16 Z" fill="${g('#C4EDF8', '#5FB5D4')}"/>${wheel(52, 152, 18)}`);
SP.scooter = (s = 4, o = {}) => V(30, 18, s, g => `
  <rect x="6" y="20" width="108" height="86" rx="14" fill="${g(...REDG)}"/><rect x="26" y="46" width="68" height="26" rx="8" fill="${g(...GOLDG)}"/>
  <path d="M96 106 H204 Q214 106 214 116 V122 H96 Z" fill="#39424B"/><rect x="168" y="50" width="16" height="70" rx="6" fill="${g(...REDG)}"/><rect x="170" y="38" width="46" height="10" rx="5" fill="#4A5560"/>
  <circle cx="186" cy="22" r="16" fill="#F5C8A0"/><path d="M170 18 Q186 -2 202 18 Z" fill="#E8392F"/><rect x="172" y="40" width="26" height="46" rx="12" fill="#4F88B3"/>
  ${wheel(46, 142, 28)}${wheel(214, 142, 28)}`, { ...o, raw: 1 });
SP.farmer = (s = 4) => V(14, 12, s, g => `
  <rect x="116" y="26" width="6" height="90" rx="3" fill="#7A4A2A"/><path d="M108 28 V14 M119 28 V10 M130 28 V14 M108 28 H130" stroke="#9AA7B1" stroke-width="5" stroke-linecap="round" fill="none"/>
  <rect x="44" y="64" width="44" height="42" rx="16" fill="${g('#5FA0D0', '#3F76A0')}"/><rect x="36" y="64" width="12" height="32" rx="6" fill="#E8392F"/><rect x="84" y="64" width="12" height="32" rx="6" fill="#E8392F"/>
  <rect x="48" y="102" width="14" height="16" rx="5" fill="#5A3320"/><rect x="70" y="102" width="14" height="16" rx="5" fill="#5A3320"/>
  <circle cx="66" cy="46" r="17" fill="#F5C8A0"/><ellipse cx="66" cy="34" rx="38" ry="8" fill="#E9C27A"/><path d="M42 33 Q66 6 90 33 Z" fill="#F2D68A"/><rect x="42" y="30" width="48" height="6" rx="3" fill="#E8392F"/>`);
SP.courier = (s = 4) => V(14, 12, s, g => `
  <rect x="44" y="64" width="46" height="38" rx="14" fill="${g(...GOLDG)}"/><rect x="48" y="98" width="14" height="20" rx="5" fill="#24404F"/><rect x="72" y="98" width="14" height="20" rx="5" fill="#24404F"/>
  <rect x="8" y="62" width="46" height="40" rx="6" fill="#B87A3C"/><rect x="28" y="62" width="8" height="40" fill="#E8C98A"/>
  <circle cx="68" cy="46" r="17" fill="#F5C8A0"/><path d="M48 42 Q68 16 88 42 Z" fill="${g(...REDG)}"/><rect x="62" y="38" width="36" height="7" rx="3" fill="#C42E25"/>`);
SP.badge = (s = 4) => V(6, 6, s, g => bunBadge(30, 30, 27, g));
