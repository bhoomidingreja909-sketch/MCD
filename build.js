// Build: node build.js  ->  writes index.html (and dist/index.html), one self-contained file, no external requests.
const fs=require('fs'),path=require('path');
const d=__dirname, rd=f=>fs.readFileSync(path.join(d,'src',f),'utf8');
const css=rd('style.css');
const js=['config.js','sprites.js','core.js','tabs_a.js','tabs_b.js','tabs_c.js','boot.js'].map(rd).join('\n');
const html=`<!DOCTYPE html>
<html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>McDonald's India Supply Chain</title>
<style>
${css}
</style></head>
<body>
<div id="app"></div>
<script>
${js}
</script>
</body></html>`;
fs.writeFileSync(path.join(d,'index.html'),html);
fs.mkdirSync(path.join(d,'dist'),{recursive:true});
fs.writeFileSync(path.join(d,'dist','index.html'),html);
console.log('built',html.length,'bytes');
