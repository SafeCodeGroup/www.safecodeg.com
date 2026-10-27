// Local preview server for the static site (no dependencies).
// contact.php needs PHP, so POSTs to it return 501 here and the form shows its
// error message; test real sending on the HostGator host.

'use strict';

const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.resolve(__dirname, '..');
const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.ico': 'image/x-icon',
};
// Only the files that are deployed are served
const ALLOWED = [/^\/index\.html$/, /^\/css\/[\w.-]+\.css$/, /^\/js\/[\w.-]+\.js$/];

function createServer() {
  return http.createServer((req, res) => {
    const url = new URL(req.url, 'http://localhost');
    let pathname = decodeURIComponent(url.pathname);
    if (pathname === '/') pathname = '/index.html';

    if (pathname === '/contact.php') {
      res.writeHead(501, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ ok: false, error: 'contact.php needs PHP — test sending on the live host.' }));
      return;
    }
    const file = path.join(ROOT, pathname);
    if (!ALLOWED.some(re => re.test(pathname)) || !file.startsWith(ROOT + path.sep)) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('Not found');
      return;
    }
    fs.readFile(file, (err, data) => {
      if (err) {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Not found');
        return;
      }
      res.writeHead(200, { 'Content-Type': TYPES[path.extname(file)] || 'application/octet-stream' });
      res.end(data);
    });
  });
}

if (require.main === module) {
  const port = Number(process.env.PORT) || 8080;
  createServer().listen(port, '127.0.0.1', () => {
    console.log(`Safe Code Group site: http://127.0.0.1:${port}  (Ctrl+C to stop)`);
  });
}

module.exports = { createServer };
