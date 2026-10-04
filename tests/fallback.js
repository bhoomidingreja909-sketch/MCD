const { launch } = require('./lib');
(async () => {
  const { b, p, errs } = await launch();
  await p.keyboard.press('Space');
  await p.evaluate(() => { TABS[4].modes[0].render = () => { throw new Error('boom'); }; });
  await p.keyboard.press('5'); await p.waitForTimeout(300);
  await p.screenshot({ path: '/tmp/claude-0/shots/fallback.png' });
  console.log('placeholder text:', await p.evaluate(() => $('#bd').innerText.replace(/\n/g, ' | ')));
  await p.keyboard.press('Space'); await p.keyboard.press('Space'); await p.keyboard.press('Space');
  console.log('QB opened after fallback:', await p.evaluate(() => !!S.qb));
  // offline check: no external urls in file
  const html = require('fs').readFileSync('/home/user/MCD/index.html', 'utf8');
  console.log('external refs:', (html.match(/https?:\/\/[^\s"')]+/g) || []).join(', ') || 'none');
  await b.close();
})();
