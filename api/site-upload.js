// POST /api/site-upload?t=<intake token>&name=<file name>
// Body: one image (the form shrinks photos to 2000px JPEG first, so they stay under Vercel's
// 4.5 MB request limit). Stores it in the private "intake" bucket and returns its key.
import { randomBytes } from 'node:crypto';
import { db, reply, handle } from './_lib/services.js';

const TYPES = { 'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp' };
const MAX = 4 * 1024 * 1024;

function readBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    let size = 0;
    req.on('data', (c) => {
      size += c.length;
      if (size > MAX) {
        reject(new Error('too-big'));
        req.destroy();
      } else chunks.push(c);
    });
    req.on('end', () => resolve(Buffer.concat(chunks)));
    req.on('error', reject);
  });
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return reply(res, 405, { ok: false, error: 'POST only' });
  await handle(res, async () => {
    const lead = await db.leadByToken('intake_token', req.query.t);
    if (!lead) return reply(res, 404, { ok: false, error: 'This link is not valid.' });
    if (!['new', 'intake_sent', 'failed', 'preview', 'review'].includes(lead.status)) return reply(res, 409, { ok: false, error: 'Uploads are closed for this site.' });
    const type = String(req.headers['content-type'] || '').split(';')[0];
    if (!TYPES[type]) return reply(res, 400, { ok: false, error: 'Please upload JPEG, PNG, or WebP photos.' });
    let body;
    try {
      body = await readBody(req);
    } catch {
      return reply(res, 413, { ok: false, error: 'That photo is too large.' });
    }
    if (!body.length) return reply(res, 400, { ok: false, error: 'Empty file.' });
    const base = String(req.query.name || 'photo').toLowerCase().replace(/\.[a-z0-9]+$/, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 40) || 'photo';
    const key = `${lead.id}/${randomBytes(4).toString('hex')}-${base}.${TYPES[type]}`;
    await db.upload(key, body, type);
    reply(res, 200, { ok: true, key });
  });
}
