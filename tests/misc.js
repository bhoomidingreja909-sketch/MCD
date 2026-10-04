const { launch } = require('./lib');
(async () => {
  const { b, p, errs } = await launch();
  const k = async x => { await p.keyboard.press(x); await p.waitForTimeout(700); };
  await k('Space'); await k('5'); for (let i = 0; i < 5; i++) await k('Space'); await p.waitForTimeout(1200);
  await p.screenshot({ path: '/tmp/claude-0/shots/m5.png' });
  await k('4'); await k('r'); for (let i = 0; i < 9; i++) await k('Space'); await k('Space'); await p.locator('.opt').nth(1).click(); await p.waitForTimeout(300);
  await p.screenshot({ path: '/tmp/claude-0/shots/mq_pick.png' }); await k('Space'); await p.screenshot({ path: '/tmp/claude-0/shots/mq_rev.png' });
  await k('Escape'); await k('9'); await k('Space'); await k('Space'); await p.waitForTimeout(500); await p.screenshot({ path: '/tmp/claude-0/shots/m9.png' });
  console.log(errs.join('\n') || 'clean'); await b.close();
})();
