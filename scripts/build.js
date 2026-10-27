// Copies the files that go on the web host into dist/ — upload dist/'s
// contents to the site's web root (public_html).

'use strict';

const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.resolve(__dirname, '..');
const DIST = path.join(ROOT, 'dist');
const FILES = ['index.html', 'contact.php', 'css', 'js'];

fs.rmSync(DIST, { recursive: true, force: true });
fs.mkdirSync(DIST);
for (const name of FILES) {
  fs.cpSync(path.join(ROOT, name), path.join(DIST, name), { recursive: true });
}

const list = dir => fs.readdirSync(dir, { withFileTypes: true }).flatMap(e =>
  e.isDirectory() ? list(path.join(dir, e.name)) : [path.join(dir, e.name)]);
for (const f of list(DIST)) {
  console.log(`  ${path.relative(ROOT, f).padEnd(24)} ${fs.statSync(f).size} bytes`);
}
console.log('Built dist/ — upload its contents to the web root.');
