const { launch } = require('./lib');
const assert = (c, m) => { if (!c) { console.log('FAIL:', m); process.exitCode = 1; } else console.log('ok  :', m); };
(async () => {
  const { b, p, errs } = await launch();
  const cur = () => p.evaluate(() => S.cur);
  const key = async k => { await p.keyboard.press(k); await p.waitForTimeout(120); };
  assert(await cur() === 0, 'opening screen');
  await key('Space'); assert(await cur() === 1, 'Space starts tab 1');
  for (const k of '234567890') { await key(k); }
  assert(await cur() === 10, 'key 0 -> tab 10');
  await key('5'); assert(await cur() === 5, 'key 5 -> tab 5');
  await key('PageDown'); assert(await cur() === 6, 'PageDown -> 6');
  await key('PageUp'); await key('PageUp'); assert(await cur() === 4, 'PageUp x2 -> 4');
  // truck moves
  await key('1'); const x1 = await p.evaluate(() => $('#truck').style.left); await key('7'); await p.waitForTimeout(800);
  const x7 = await p.evaluate(() => $('#truck').getBoundingClientRect().left);
  const x7s = await p.evaluate(() => $('#truck').style.left); assert(x1 !== x7s, 'truck left changes between tabs: ' + x1 + ' -> ' + x7s);
  // Question break flow in tabs 1..9
  for (let t = 1; t <= 9; t++) {
    await key(String(t)); await key('r');
    const mx = await p.evaluate(() => (hasOp() ? modeObj().max + 1 : modeObj().max));
    for (let i = 0; i < mx; i++) await key('Space');
    assert(!(await p.evaluate(() => S.qb)), `tab ${t}: QB not open after last step (${mx})`);
    await key('Space');
    assert(await p.evaluate(() => !!S.qb && S.qb.n === +document.querySelector('.tabsign.on').dataset.v), `tab ${t}: Space after last step opens QB`);
    const q = await p.evaluate(() => $('.tq').textContent);
    assert(q.length > 20, `tab ${t}: question shown`);
    assert(await p.evaluate(() => !$('.stamp.gold', $('#qb'))), `tab ${t}: answer hidden first`);
    await key('Space'); assert(await p.evaluate(() => !!$('.stamp.gold', $('#qb'))), `tab ${t}: Space reveals answer`);
    const before = await p.evaluate(() => S.score.burger + S.score.fries);
    await key(t % 2 ? 'b' : 'y'); const after = await p.evaluate(() => S.score.burger + S.score.fries);
    assert(after === before + 1, `tab ${t}: point awarded`);
    await key('Space'); assert(await cur() === t + 1, `tab ${t}: Space moves to next tab`);
  }
  // T and Esc
  await key('3'); await key('t'); assert(await p.evaluate(() => !!S.qb), 'T opens QB'); await key('Escape'); assert(await p.evaluate(() => !S.qb), 'Esc closes QB');
  await key('s'); assert(await p.evaluate(() => !S.qb), 'S ignored when no QB');
  await key('t'); await key('s'); assert(await p.evaluate(() => S.score.burger + S.score.fries) === 9, 'S before reveal does nothing');
  await key('Escape');
  // tab 10 has no QB
  await key('0'); await key('t'); assert(await p.evaluate(() => !S.qb), 'tab 10 has no question');
  for (let i = 0; i < 20; i++) await key('Space'); assert(await p.evaluate(() => !S.qb && S.cur === 10), 'tab 10 end: Space does nothing more');
  // concepts
  await key('2'); await key('c'); assert(await p.evaluate(() => $('#concepts').classList.contains('on')), 'C shows concept chips'); await key('c');
  // reset + score persistence
  await key('1'); await key('r'); await key('Space'); await key('Space'); assert(await p.evaluate(() => TS(1).step) === 2, 'steps advance'); await key('r'); assert(await p.evaluate(() => TS(1).step) === 0, 'R resets tab'); assert(await p.evaluate(() => S.score.burger + S.score.fries) === 9, 'R keeps scores');
  // mode cycle
  await key('m'); assert(await p.evaluate(() => TS(1).mode) === 1, 'M cycles mode');
  await key('m'); await key('m'); assert(await p.evaluate(() => TS(1).mode) === 0, 'M wraps');
  // back/forward arrows
  await key('ArrowRight'); await key('ArrowRight'); await key('ArrowLeft'); assert(await p.evaluate(() => TS(1).step) === 1, 'arrows step');
  // stopwatch
  await key('p'); await p.waitForTimeout(1300); const sw = await p.evaluate(() => $('#sw').textContent); assert(sw !== '0:00', 'stopwatch runs ' + sw); await key('p'); await key('p');
  assert(await p.evaluate(() => $('#sw').textContent) === '0:00', 'stopwatch resets');
  // hint
  await key('h'); assert(await p.evaluate(() => $('#hint').classList.contains('on')), 'H shows hint'); await key('h');
  // tab 6 arrows
  await key('6'); await key('r'); for (let i = 0; i < 4; i++) await key('Space'); // opener(1)+scene1,2,3
  assert(await p.evaluate(() => effStep()) === 3, 'tab 6 at scene 3');
  await key('ArrowUp'); assert(await p.evaluate(() => TS(6).st.n) === 3, 'ArrowUp overrides to 3 cases');
  await key('ArrowDown'); assert(await p.evaluate(() => TS(6).st.n) === 2, 'ArrowDown back to 2');
  // tab 8 drag and drop
  await key('8'); await key('r');
  const drag = async (name, zone) => {
    const it = p.locator('.item[data-drag]', { hasText: name }).first(); const zn = p.locator(`[data-drop="${zone}"]`).first();
    const ib = await it.boundingBox(), zb = await zn.boundingBox();
    await p.mouse.move(ib.x + 20, ib.y + 10); await p.mouse.down(); await p.mouse.move(zb.x + zb.width / 2, zb.y + zb.height / 2, { steps: 8 }); await p.mouse.up(); await p.waitForTimeout(200);
  };
  await drag('Fries', 'frozen'); assert(await p.evaluate(() => TS(8).st.placed.length) === 1, 'tab 8: correct drop accepted');
  await drag('Cheese', 'dry'); assert(await p.evaluate(() => TS(8).st.placed.length) === 1 && await p.evaluate(() => !!TS(8).st.wrong), 'tab 8: wrong drop rejected with Damaged tag');
  assert(await p.evaluate(() => /Damaged/.test($('#bd').textContent)), 'tab 8: Damaged! shown');
  await p.waitForTimeout(1600);
  await drag('Cheese', 'chilled'); assert(await p.evaluate(() => TS(8).st.placed.length) === 2, 'tab 8: second correct drop');
  await p.locator('[data-a="door"]').first().click(); assert(await p.evaluate(() => TS(8).st.door) === 'frozen', 'tab 8: door opens one zone');
  // tab 9 mode B drag to waste
  await key('9'); await key('m'); await key('m'); await key('m'); await key('m'); // back around: 3 modes -> m,m,m returns to A, so go to B
  const m9 = await p.evaluate(() => TS(9).mode); if (m9 !== 1) { while ((await p.evaluate(() => TS(9).mode)) !== 1) await key('m'); }
  await key('Space'); await key('Space');
  const it = p.locator('.item[data-drag]').first(), bin = p.locator('[data-drop="bin"]');
  const ib = await it.boundingBox(), bb = await bin.boundingBox();
  await p.mouse.move(ib.x + 20, ib.y + 10); await p.mouse.down(); await p.mouse.move(bb.x + 50, bb.y + 50, { steps: 8 }); await p.mouse.up(); await p.waitForTimeout(200);
  assert(await p.evaluate(() => TS(9).st.waste) === 1, 'tab 9: dragged item to Raw Waste');
  // banned words
  const bad = ['Case study', 'case study', 'Chapter', 'textbook', 'Interview', 'interview', 'Source:', '[', 'Section ', 'Study notes'];
  let found = [];
  for (let t = 1; t <= 10; t++) { await key(String(t % 10)); const n = await p.evaluate(() => mdl(S.cur).modes.length); for (let m = 0; m < n; m++) { const mx = await p.evaluate(() => maxStep()); for (let s = 0; s <= mx; s++) { const txt = await p.evaluate(() => document.querySelector('#app').innerText); bad.forEach(w => { if (txt.includes(w)) found.push(`${w} @tab${t}m${m}s${s}`); }); if (s < mx) await key('Space'); } await key('m'); } }
  assert(found.length === 0, 'no source names/tags/brackets on screen: ' + found.join(', '));
  console.log(errs.join('\n') || 'console clean');
  await b.close();
})();
