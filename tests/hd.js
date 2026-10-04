const { launch } = require('./lib');
(async () => {
  const { b, p, errs } = await launch(1920, 1080);
  await p.waitForTimeout(300); await p.screenshot({ path: '/tmp/claude-0/shots/hd_open.png' });
  const k = async x => { await p.keyboard.press(x); await p.waitForTimeout(900); };
  await k('Space'); await k('Space'); await k('Space'); await p.screenshot({ path: '/tmp/claude-0/shots/hd_t1.png' });
  await k('8'); await k('Space'); await k('Space'); await p.screenshot({ path: '/tmp/claude-0/shots/hd_t8.png' });
  await k('t'); await p.screenshot({ path: '/tmp/claude-0/shots/hd_qb.png' });
  console.log(errs.join('\n') || 'clean'); await b.close();
})();
