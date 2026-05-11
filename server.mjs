import http from 'node:http';
import { createReadStream, existsSync, statSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DIST_DIR = path.join(__dirname, 'dist');
const INDEX_FILE = path.join(DIST_DIR, 'index.html');
const PORT = Number(process.env.PORT || 3000);
let activePort = PORT;
let hasRetriedPort = false;

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
  '.ico': 'image/x-icon',
  '.mp4': 'video/mp4',
  '.m4a': 'audio/mp4',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
};

function safeResolve(requestPath) {
  const normalized = decodeURIComponent(requestPath.split('?')[0]);
  const target = path.normalize(path.join(DIST_DIR, normalized));
  if (!target.startsWith(DIST_DIR)) return null;
  return target;
}

const server = http.createServer((req, res) => {
  if (!existsSync(DIST_DIR)) {
    res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('dist/ not found. Run "npm run build" first.');
    return;
  }

  const requested = safeResolve(req.url || '/');
  if (!requested) {
    res.writeHead(400, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('Bad request.');
    return;
  }

  let filePath = requested;
  if (filePath.endsWith(path.sep)) filePath = path.join(filePath, 'index.html');
  if (!path.extname(filePath)) filePath += '.html';

  const hasFile = existsSync(filePath) && statSync(filePath).isFile();
  const finalPath = hasFile ? filePath : INDEX_FILE;
  const ext = path.extname(finalPath).toLowerCase();

  res.writeHead(200, {
    'Content-Type': MIME_TYPES[ext] || 'application/octet-stream',
    'Cache-Control': ext === '.html' ? 'no-cache' : 'public, max-age=31536000, immutable',
  });

  createReadStream(finalPath).pipe(res);
});

server.on('error', (error) => {
  if (error?.code === 'EADDRINUSE' && !hasRetriedPort) {
    hasRetriedPort = true;
    activePort = PORT + 1;
    server.listen(activePort);
    return;
  }

  console.error(`Unable to start server on port ${activePort}.`, error);
  process.exit(1);
});

server.listen(PORT, () => {
  console.log(`Node server ready on http://localhost:${activePort}`);
});
