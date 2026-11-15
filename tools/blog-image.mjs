#!/usr/bin/env node
// Makes a post's share image (1200 x 630 PNG) at public/blog/<slug>.png: BDO navy, the post's
// topic and title, and the site address. Run once per new post, before committing it:
//   node tools/blog-image.mjs <slug>          (or no slug: every post without an image)
// Needs the "sharp" package where Node can find it; it is not a dependency of this site (the
// image is committed, so Vercel never runs this). If sharp lives elsewhere, point to it:
//   SHARP_FROM=/path/to/a/project/package.json node tools/blog-image.mjs <slug>
import fs from 'fs';
import path from 'path';
import { createRequire } from 'module';
import { parsePost } from '../src/lib/blog-core.js';

const require = createRequire(process.env.SHARP_FROM ? path.resolve(process.env.SHARP_FROM) : import.meta.url);
const sharp = require('sharp');

const dir = path.resolve('src/content/blog');
const outDir = path.resolve('public/blog');
fs.mkdirSync(outDir, { recursive: true });
const wanted = process.argv[2];
const slugs = fs.readdirSync(dir).filter((f) => f.endsWith('.md')).map((f) => f.replace(/\.md$/, ''))
  .filter((s) => (wanted ? s === wanted : !fs.existsSync(path.join(outDir, `${s}.png`))));
if (wanted && !slugs.length) throw new Error(`No post src/content/blog/${wanted}.md`);

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
// Wrap the title to lines of about `max` characters (at most 4 lines).
function wrap(text, max) {
  const lines = [];
  let line = '';
  for (const w of text.split(/\s+/)) {
    if ((line + ' ' + w).trim().length > max && line) { lines.push(line); line = w; } else line = (line + ' ' + w).trim();
  }
  if (line) lines.push(line);
  return lines.slice(0, 4);
}

for (const slug of slugs) {
  const { meta } = parsePost(slug, fs.readFileSync(path.join(dir, `${slug}.md`), 'utf8'));
  const lines = wrap(meta.title, 26);
  const size = lines.length > 3 ? 60 : 68;
  const top = 250 - ((lines.length - 1) * size * 1.12) / 2;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#0F172A"/><stop offset="1" stop-color="#1E3A8A"/></linearGradient>
    <pattern id="grid" width="48" height="48" patternUnits="userSpaceOnUse"><path d="M48 0H0V48" fill="none" stroke="#FFFFFF" stroke-opacity="0.06" stroke-width="1"/></pattern>
  </defs>
  <rect width="1200" height="630" fill="url(#bg)"/>
  <rect width="1200" height="630" fill="url(#grid)"/>
  <rect x="72" y="72" width="10" height="56" rx="5" fill="#60A5FA"/>
  <text x="100" y="112" font-family="DejaVu Sans, Arial, Helvetica, sans-serif" font-size="28" font-weight="700" letter-spacing="3" fill="#93C5FD">${esc(meta.topic.toUpperCase())}</text>
  ${lines.map((l, i) => `<text x="72" y="${Math.round(top + i * size * 1.12 + size)}" font-family="DejaVu Sans, Arial, Helvetica, sans-serif" font-size="${size}" font-weight="800" fill="#FFFFFF">${esc(l)}</text>`).join('\n  ')}
  <rect x="72" y="520" width="1056" height="2" fill="#FFFFFF" fill-opacity="0.18"/>
  <text x="72" y="572" font-family="DejaVu Sans, Arial, Helvetica, sans-serif" font-size="30" font-weight="800" fill="#FFFFFF">BDO Analytics Solutions</text>
  <text x="1128" y="572" text-anchor="end" font-family="DejaVu Sans, Arial, Helvetica, sans-serif" font-size="26" font-weight="600" fill="#BFDBFE">bdoanalyticssolutions.com/blog</text>
</svg>`;
  const out = path.join(outDir, `${slug}.png`);
  await sharp(Buffer.from(svg)).png({ compressionLevel: 9 }).toFile(out);
  console.log(`[OK] ${path.relative(process.cwd(), out)}`);
}
