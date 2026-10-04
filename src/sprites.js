/* =====================================================================
   PIXEL ART ENGINE. Every sprite is drawn here on a coarse grid and
   rendered as crisp inline SVG. No images, no icon packs, no fonts.
   ===================================================================== */
const PAL = {
  K: '#2B2622', W: '#FFFFFF', C: '#E6E1D3', c: '#CFCBC0', R: '#D2403F', r: '#A82B2E', G: '#F5C518', g: '#B8860B',
  D: '#3A3A3F', d: '#55555C', S: '#8C8C8C', s: '#6F6F6F', L: '#F2F2F2', A: '#A9B858', a: '#6F8F3A', T: '#4A3A38',
  P: '#4A4A4A', B: '#7FB6EA', Q: '#5CCBB8', O: '#F0A35E', U: '#9B7FD6', N: '#4CAF50', H: '#6C8EAD',
  b: '#C98A3C', y: '#E9C27A', p: '#7A4A2A', k: '#4F2E1C', m: '#F4EFE0', f: '#F0C8A0', o: '#D9A878', w: '#CFE7F7', V: '#7F5A9F'
};

/* pix: draw a character grid. '.' is transparent. Auto 1-pixel dark outline. */
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
    paths += `<path fill="${col}" d="${d}"/>`;
  }
  return svgWrap(W, H, paths, o);
}
function svgWrap(W, H, inner, o = {}) {
  const s = o.s || 4;
  return `<svg class="spr ${o.cls || ''}" viewBox="0 0 ${W} ${H}" width="${W * s}" height="${H * s}" shape-rendering="crispEdges" style="${o.style || ''}">${inner}</svg>`;
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

const ARCH = ['..GGGGG....GGGGG..', '.GGGGGGG..GGGGGGG.', 'GGGGGGGGGGGGGGGGGG', 'GGGgg.GGGGGG.ggGGG', 'GGG....GGGG....GGG', 'GGG....GGGG....GGG', 'GGG....GGGG....GGG', 'GGg....GGgg....gGG'];
const ARCH_S = ['.GG..GG.', 'GGGGGGGG', 'GG.GG.GG', 'GG.GG.GG'];
const TREE = ['....aaaaaaaa....', '..aaAAAAAAAAaa..', '.aAAAAAAAAAAAAa.', 'aAAAAaAAAAAAAAAa', 'aAAAAAAAAAaAAAAa', 'aAAAaAAAAAAAAAAa', '.aAAAAAAAAaAAAa.', '..aaAAAAAAAAaa..', '....aaaaaaaa....', '......TTTT......', '......TTTT......', '......TTTT......', '.....TTTTTT.....'];
const LAMP = ['PPPPPP', 'PLLLLP', '.PPPP.', '..PP..', '..PP..', '..PP..', '..PP..', '..PP..', '..PP..', '..PP..', '..PP..', '..PP..', '..PP..', '..PP..', '.PPPP.', 'PPPPPP'];

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
  crate: ['bbbbbbbbbbbb', 'bkkkkkkkkkkb', 'bkWWWWWWWWkb', 'bkWRRRRRRWkb', 'bkWWWWWWWWkb', 'bkkkkkkkkkkb', 'bbbbbbbbbbbb'],
  cross: ['RR....RR', 'RRR..RRR', '.RRRRRR.', '..RRRR..', '..RRRR..', '.RRRRRR.', 'RRR..RRR', 'RR....RR'],
  tick: ['.......NN', '......NNN', 'N....NNN.', 'NN..NNN..', 'NNNNNN...', '.NNNN....', '..NN.....'],
  snow: ['..W..W..', 'W..WW..W', '.W.WW.W.', '..WWWW..', '..WWWW..', '.W.WW.W.', 'W..WW..W', '..W..W..'],
  bin: ['.SSSSSS.', 'SSSSSSSS', '.sSsSsS.', '.sSsSsS.', '.sSsSsS.', '.sSsSsS.', '.ssssss.'],
  gear: ['..SS..SS..', '.SSSSSSSS.', 'SSSS..SSSS', '.SS....SS.', '.SS....SS.', 'SSSS..SSSS', '.SSSSSSSS.', '..SS..SS..'],
  eye: ['..SSSSSS..', '.SWWWWWWS.', 'SWWUUUUWWS', 'SWWUKKUWWS', '.SWWUUWWS.', '..SSSSSS..'],
  shield: ['WWWWWWWW', 'WWWWWWWW', 'WWWWWWWW', 'WWWWWWWW', '.WWWWWW.', '..WWWW..', '...WW...'],
  arch: ARCH, archS: ARCH_S, tree: TREE, lamp: LAMP
};
const SP = {};
Object.keys(GRIDS).forEach(k => { SP[k] = (s = 4, o = {}) => pix(GRIDS[k], Object.assign({ s }, o)); });
SP.person = (s = 4, color = '#D2403F') => pix(GRIDS.person, { s, pal: { X: color } });
SP.shield = (s = 4, color = '#4CAF50') => pix(GRIDS.shield, { s, pal: { W: color } });
SP.archG = (s = 4) => pix(ARCH, { s, o: PAL.g });

SP.truck = (s = 4, o = {}) => rs(38, 18, [
  bx(0, 1, 25, 12, 'W'), rc(1, 6, 23, 2, 'B'), rc(1, 8, 23, 1, 'R'), rc(2, 3, 4, 2, 'w'),
  bx(25, 4, 12, 9, 'R'), bx(30, 5, 6, 4, 'D'), rc(26, 5, 2, 3, 'r'),
  rc(0, 13, 37, 2, 's'),
  bx(4, 12, 6, 6, 'D'), rc(6, 14, 2, 2, 'S'), bx(27, 12, 6, 6, 'D'), rc(29, 14, 2, 2, 'S'), rc(36, 11, 2, 2, 'G')
], Object.assign({ s }, o));
SP.van = (s = 4, o = {}) => rs(30, 16, [
  bx(0, 2, 20, 11, 'W'), rc(1, 4, 6, 2, 'B'), rc(7, 4, 6, 2, 'Q'), rc(13, 4, 6, 2, 'O'),
  bx(20, 5, 9, 8, 'R'), bx(24, 6, 4, 3, 'D'),
  rc(0, 12, 29, 2, 's'), bx(3, 11, 5, 5, 'D'), rc(5, 13, 1, 1, 'S'), bx(21, 11, 5, 5, 'D'), rc(23, 13, 1, 1, 'S')
], Object.assign({ s }, o));
SP.cab = (s = 4) => rs(10, 17, [bx(0, 4, 9, 10, 'R'), bx(3, 6, 6, 4, 'D'), bx(1, 12, 6, 5, 'D'), rc(3, 14, 2, 2, 'S')], { s });
SP.scooter = (s = 4, o = {}) => rs(30, 18, [
  bx(0, 2, 11, 9, 'R'), rc(2, 5, 7, 3, 'G'),
  rc(10, 11, 12, 2, 'D'), bx(16, 5, 3, 7, 'R'), rc(17, 3, 7, 2, 'P'),
  bx(18, 0, 5, 4, 'f'), rc(19, 5, 4, 5, 'H'),
  bx(2, 11, 7, 7, 'D'), rc(4, 13, 3, 3, 'S'), bx(20, 11, 7, 7, 'D'), rc(22, 13, 3, 3, 'S')
], Object.assign({ s }, o));

/* Strip buildings, 30 x 16 art pixels */
SP.farm = (s = 4) => rs(30, 16, [
  rc(0, 12, 30, 4, 'a'), rc(0, 13, 30, 1, 'A'), rc(0, 15, 30, 1, 'A'), rc(3, 11, 2, 1, 'A'), rc(7, 12, 1, 1, 'A'),
  bx(2, 1, 15, 4, 'r'), bx(3, 4, 13, 9, 'R'), bx(8, 7, 5, 6, 'C'), rc(10, 7, 1, 6, 'c'),
  gr(TREE.slice(0, 10), 19, 0, { ol: true }), rc(23, 10, 2, 3, 'T')
], { s });
SP.factory = (s = 4) => rs(30, 16, [
  bx(1, 6, 20, 9, 'S'), bx(1, 3, 6, 4, 'S'), bx(8, 3, 6, 4, 'S'), bx(15, 3, 6, 4, 'S'),
  rc(3, 9, 3, 3, 'w'), rc(9, 9, 3, 3, 'w'), rc(15, 9, 3, 3, 'w'), bx(21, 0, 5, 15, 's'), rc(22, 1, 1, 13, 'S'),
  rc(23, 0, 3, 1, 'R'), rc(27, 5, 2, 2, 'L'), rc(26, 2, 3, 2, 'c'), bx(26, 10, 3, 5, 'D')
], { s });
SP.dc = (s = 4) => rs(30, 16, [
  bx(1, 4, 28, 11, 'C'), bx(0, 2, 30, 4, 'R'), rc(1, 4, 28, 1, 'r'),
  bx(3, 8, 5, 7, 's'), bx(10, 8, 5, 7, 's'), bx(17, 8, 5, 7, 's'), bx(24, 8, 4, 7, 's'),
  rc(4, 10, 3, 1, 'S'), rc(4, 12, 3, 1, 'S'), rc(11, 10, 3, 1, 'S'), rc(11, 12, 3, 1, 'S'), rc(18, 10, 3, 1, 'S'), rc(18, 12, 3, 1, 'S'),
  rc(13, 3, 4, 2, 'G')
], { s });
SP.stop = (s = 4) => rs(30, 16, [
  rc(0, 14, 30, 2, 'c'), bx(2, 6, 17, 9, 'C'), bx(1, 4, 19, 4, 'R'), rc(2, 7, 17, 1, 'r'),
  bx(4, 9, 6, 5, 'D'), bx(12, 9, 5, 6, 'D'), rc(14, 12, 1, 1, 'G'),
  bx(23, 8, 4, 7, 'R'), rc(24, 9, 2, 2, 'W'), rc(25, 1, 1, 8, 'P'), bx(22, 0, 7, 4, 'G')
], { s });
SP.home = (s = 4) => rs(30, 16, [
  rc(0, 14, 30, 2, 'c'), bx(3, 7, 16, 8, 'C'), bx(2, 3, 18, 5, 'H'), rc(5, 1, 12, 3, 'H'), rc(2, 7, 18, 1, 'K'),
  bx(5, 9, 5, 4, 'D'), bx(13, 9, 4, 6, 's'), gr(GRIDS.person, 22, 4, { pal: { X: '#6C8EAD' } })
], { s });
/* the restaurant, copied from the reference description: cream box, red awning with golden arches */
SP.store = (s = 4, o = {}) => rs(72, 44, [
  gr(ARCH, 27, 0, { ol: true }),
  bx(2, 9, 60, 7, 'C'), bx(2, 15, 60, 27, 'C'),
  bx(0, 17, 64, 9, 'R'), rc(1, 24, 62, 2, 'r'),
  ...Array.from({ length: 16 }, (_, i) => i % 2 ? rc(i * 4 + 1, 26, 3, 2, 'R') : rc(i * 4 + 1, 26, 3, 1, 'r')),
  gr(ARCH_S, 6, 19, { ol: false }), gr(ARCH_S, 50, 19, { ol: false }),
  bx(5, 30, 20, 9, 'D'), rc(7, 32, 6, 1, 'd'), rc(7, 34, 3, 1, 'd'), bx(28, 30, 8, 12, 'D'), rc(30, 32, 1, 8, 'd'), rc(34, 36, 1, 2, 'G'),
  bx(39, 30, 20, 9, 'D'), rc(41, 32, 6, 1, 'd'),
  rc(2, 40, 60, 2, 'R'), rc(2, 42, 60, 1, 'r'),
  bx(65, 32, 7, 10, 'R'), gr(['.GG.', 'GGGG'], 66, 34), rc(66, 38, 5, 1, 'W'), rc(66, 40, 5, 1, 'W')
], Object.assign({ s }, o));

SP.cloud = (s = 4) => rs(20, 6, [rc(3, 3, 14, 3, 'W'), rc(6, 1, 8, 3, 'W'), rc(0, 4, 20, 2, 'L')], { s });
SP.grass = (s = 4) => pix(['a..a.a', 'aa.aaa', 'aaaaaa'], { s, o: false });

/* Pixel digit helper for the dial */
function pixelDial(cx, cy, r, a0, a1, color, sz) {
  let out = '';
  for (let a = a0; a <= a1; a += 2) {
    const x = Math.round((cx + Math.cos(a * Math.PI / 180) * r) / sz) * sz, y = Math.round((cy - Math.sin(a * Math.PI / 180) * r) / sz) * sz;
    out += `<rect x="${x}" y="${y}" width="${sz}" height="${sz}" fill="${color}"/>`;
  }
  return out;
}
