const { launch } = require('./lib');
const only = process.argv[2] ? process.argv[2].split(',').map(Number) : null;
(async () => {
  const { b, p, errs } = await launch();
  await p.keyboard.press('Space');
  const info = await p.evaluate(() => TABS.map(t => t.modes.map(m => [m.name, m.max + (t.opener ? 1 : 0)])));
  for (let t = 1; t <= 10; t++) {
    if (only && !only.includes(t)) continue;
    await p.keyboard.press(String(t % 10));
    for (let m = 0; m < info[t - 1].length; m++) {
      if (m > 0) await p.keyboard.press('m');
      const mx = info[t - 1][m][1] - (m > 0 && info[t - 1][0][1] > 0 && [4,5,6].includes(t) ? 1 : 0);
      for (let s = 0; s <= mx; s++) {
        if (s > 0) await p.keyboard.press('Space');
        await p.waitForTimeout(900);
        await p.screenshot({ path: `/tmp/claude-0/shots/t${t}m${m}s${s}.png` });
      }
      await p.keyboard.press('r');
    }
  }
  console.log(errs.join('\n') || 'no errors');
  await b.close();
})();
