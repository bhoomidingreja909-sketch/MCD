const { chromium } = require('/opt/node-tools/node_modules/playwright');
exports.launch = async (w = 1366, h = 768) => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: w, height: h } });
  const errs = []; p.on('pageerror', e => errs.push('PAGEERR ' + e.message)); p.on('console', m => { if (['error', 'warning'].includes(m.type())) errs.push(m.type() + ': ' + m.text()); });
  p.on('requestfailed', r => errs.push('REQFAIL ' + r.url()));
  await p.goto('file:///home/user/MCD/index.html');
  return { b, p, errs };
};
