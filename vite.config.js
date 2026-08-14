import path from 'path'
import { fileURLToPath } from 'url'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// https://vite.dev/config/
function requireFields(obj, fields) {
  return fields.filter((f) => {
    const parts = f.split('.');
    let cur = obj;
    for (const p of parts) {
      if (cur == null || cur[p] === undefined || cur[p] === '') return true;
      cur = cur[p];
    }
    return false;
  });
}

function lessonRequestPlugin() {
  return {
    name: 'lesson-request-api',
    configureServer(server) {
      server.middlewares.use('/api/lesson-request', (req, res, next) => {
        if (req.method === 'OPTIONS') {
          res.statusCode = 204;
          res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
          res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
          res.end();
          return;
        }
        if (req.method !== 'POST') return next();
        const chunks = [];
        req.on('data', (c) => chunks.push(c));
        req.on('end', () => {
          let body = {};
          try {
            body = JSON.parse(Buffer.concat(chunks).toString('utf8') || '{}');
          } catch {
            res.statusCode = 400;
            res.setHeader('Content-Type', 'application/json; charset=utf-8');
            res.end(JSON.stringify({ success: false, error: 'Invalid JSON body' }));
            return;
          }
          const missing = requireFields(body, [
            'requestCategory',
            'contact.firstName',
            'contact.lastName',
            'contact.email',
          ]);
          if (missing.length) {
            res.statusCode = 400;
            res.setHeader('Content-Type', 'application/json; charset=utf-8');
            res.end(JSON.stringify({ success: false, error: 'Missing required fields', missing }));
            return;
          }
          if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(body.contact?.email || ''))) {
            res.statusCode = 400;
            res.setHeader('Content-Type', 'application/json; charset=utf-8');
            res.end(JSON.stringify({ success: false, error: 'Invalid email' }));
            return;
          }
          const id = body.id || `lr_${crypto.randomUUID().slice(0, 8)}`;
          console.log('[NA Classroom] lesson-request', {
            id,
            email: body.contact?.email,
            category: body.requestCategory,
            pillar: body.learningPath?.pillar,
          });
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json; charset=utf-8');
          res.setHeader('Cache-Control', 'no-store');
          res.end(JSON.stringify({ success: true, requestId: id, availability: 'generic' }));
        });
      });
    },
  };
}

export default defineConfig({
  plugins: [react(), lessonRequestPlugin()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
