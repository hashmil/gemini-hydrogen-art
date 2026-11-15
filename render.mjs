import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rendersDir = path.join(__dirname, 'renders');
fs.mkdirSync(rendersDir, { recursive: true });

const mimeTypes = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
};

const exportHtml = `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>Export</title></head>
<body>
<script type="module">
import { ARTWORKS } from '/src/registry.js';
const canvas = document.createElement('canvas');
canvas.width = 1200;
canvas.height = 1200;
const ctx = canvas.getContext('2d');

for (let i = 0; i < ARTWORKS.length; i++) {
  const art = ARTWORKS[i];
  ctx.clearRect(0, 0, 1200, 1200);
  art.draw(ctx, 1200, 1200, (i + 1) * 101);
  const dataUrl = canvas.toDataURL('image/png');
  await fetch('/save?id=' + encodeURIComponent(art.id), {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain' },
    body: dataUrl,
  });
}
await fetch('/done', { method: 'POST' });
document.body.textContent = 'DONE';
</script>
</body>
</html>`;

let server;
let chrome;
const saved = [];

server = http.createServer((req, res) => {
  const url = new URL(req.url, 'http://127.0.0.1');

  if (url.pathname === '/_export.html') {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(exportHtml);
    return;
  }

  if (url.pathname === '/save' && req.method === 'POST') {
    const id = url.searchParams.get('id').replace(/[^a-zA-Z0-9_-]/g, '');
    const chunks = [];
    req.on('data', (c) => chunks.push(c));
    req.on('end', () => {
      const body = Buffer.concat(chunks).toString('utf8');
      const base64 = body.replace(/^data:image\/png;base64,/, '');
      const outPath = path.join(rendersDir, `${id}.png`);
      fs.writeFileSync(outPath, Buffer.from(base64, 'base64'));
      saved.push(outPath);
      console.log('Rendered:', outPath);
      res.writeHead(200);
      res.end('ok');
    });
    return;
  }

  if (url.pathname === '/done' && req.method === 'POST') {
    res.writeHead(200);
    res.end('ok');
    setTimeout(() => {
      if (chrome) chrome.kill('SIGTERM');
      server.close();
      console.log(`All ${saved.length} artworks rendered successfully.`);
      process.exit(0);
    }, 100);
    return;
  }

  const safePath = path.normalize(url.pathname).replace(/^(\.\.[/\\])+/, '');
  const filePath = path.join(__dirname, safePath === '/' ? 'index.html' : safePath);
  if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
    const ext = path.extname(filePath);
    res.writeHead(200, { 'Content-Type': mimeTypes[ext] || 'application/octet-stream' });
    fs.createReadStream(filePath).pipe(res);
  } else {
    res.writeHead(404);
    res.end('Not found');
  }
});

server.listen(0, '127.0.0.1', () => {
  const { port } = server.address();
  const chromePath = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
  const targetUrl = `http://127.0.0.1:${port}/_export.html`;
  chrome = spawn(
    chromePath,
    [
      '--headless',
      '--disable-gpu',
      '--no-sandbox',
      '--virtual-time-budget=20000',
      targetUrl,
    ],
    { stdio: ['ignore', 'ignore', 'pipe'] }
  );

  chrome.stderr.on('data', (d) => {
    const msg = d.toString();
    if (msg.includes('ERROR') || msg.includes('CONSOLE')) {
      process.stderr.write(msg);
    }
  });

  setTimeout(() => {
    console.error('Timed out waiting for Chrome export.');
    if (chrome) chrome.kill('SIGKILL');
    process.exit(1);
  }, 30000);
});
