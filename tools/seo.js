#!/usr/bin/env node
// Runs after `vite build`. The site renders in the browser, so on its own every page sends
// the same empty <head>. This writes one HTML file per page with that page's title,
// description, canonical link and share-preview tags already in it (served by Vercel's
// cleanUrls: /about -> about.html), then writes sitemap.xml with the template gallery pages.
import fs from 'fs';
import path from 'path';
import { TRADES } from '../src/data/trades.js';

const SITE = 'https://www.bdoanalyticssolutions.com';
const GALLERY = 'https://omis-showcase.pages.dev/templates/catalog.json';
const dist = path.resolve('dist');

const fromPage = (file) => {
  const src = fs.readFileSync(path.resolve('src/pages', file), 'utf8');
  const title = src.match(/<title>([^<{]+)<\/title>/)?.[1].trim();
  const description = src.match(/<meta name="description" content="([^"]+)"/)?.[1];
  if (!title || !description) throw new Error(`[seo] no title or description in ${file}`);
  return { title, description };
};

const PAGES = [
  ['/', 'Home.jsx', 1.0],
  ['/omis-product', 'OmisProduct.jsx', 0.8],
  ['/services', 'Services.jsx', 0.7],
  ['/roi-calculator', 'ROICalculator.jsx', 0.5],
  ['/about', 'About.jsx', 0.5],
  ['/contact', 'ContactPage.jsx', 0.5],
  ['/book-demo', 'BookDemoPage.jsx', 0.6],
  ['/privacy-policy', 'PrivacyPolicy.jsx', 0.2],
  ['/terms-of-service', 'TermsOfService.jsx', 0.2],
  ['/account-deletion-request', 'AccountDeletionRequest.jsx', 0.1],
].map(([route, file, priority]) => ({ route, priority, ...fromPage(file) }));

PAGES.push({ route: '/pricing', priority: 0.9, ...fromPage('PricingPage.jsx') });
for (const t of TRADES) PAGES.push({ route: `/for/${t.slug}`, priority: 0.9, title: t.title, description: t.description });

const esc = (s) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
const base = fs.readFileSync(path.join(dist, 'index.html'), 'utf8');

const headFor = (html, { route, title, description }) => {
  const url = SITE + (route === '/' ? '/' : route);
  return html
    .replace(/<title>[^<]*<\/title>/, `<title>${esc(title)}</title>`)
    .replace(/(<meta data-seo name="description" content=")[^"]*"/, `$1${esc(description)}"`)
    .replace(/(<link data-seo rel="canonical" href=")[^"]*"/, `$1${url}"`)
    .replace(/(<meta data-seo property="og:title" content=")[^"]*"/, `$1${esc(title)}"`)
    .replace(/(<meta data-seo property="og:description" content=")[^"]*"/, `$1${esc(description)}"`)
    .replace(/(<meta data-seo property="og:url" content=")[^"]*"/, `$1${url}"`);
};

for (const page of PAGES) {
  const out = page.route === '/' ? path.join(dist, 'index.html') : path.join(dist, `${page.route.slice(1)}.html`);
  fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.writeFileSync(out, headFor(base, page));
}

// Gallery pages live in the omis-sites project behind /templates. If the catalog can't be
// read, the sitemap still lists the gallery's front page.
let gallery = ['/templates/'];
try {
  const res = await fetch(GALLERY, { signal: AbortSignal.timeout(10000) });
  const { templates } = await res.json();
  const verticals = [...new Set(templates.map((t) => t.path.split('/')[0]))];
  gallery = gallery.concat(verticals.map((v) => `/templates/${v}/`), templates.map((t) => `/templates/${t.path}`));
} catch (e) {
  console.warn(`[seo] gallery catalog not read (${e.message}); sitemap lists /templates/ only`);
}

const today = new Date().toISOString().slice(0, 10);
const urls = [
  ...PAGES.map((p) => [p.route, p.priority]),
  ...gallery.map((g, i) => [g, i === 0 ? 0.9 : g.split('/').length === 4 ? 0.7 : 0.5]),
];
const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(([u, p]) => `  <url><loc>${SITE}${u}</loc><lastmod>${today}</lastmod><priority>${p.toFixed(1)}</priority></url>`).join('\n')}
</urlset>
`;
fs.writeFileSync(path.join(dist, 'sitemap.xml'), xml);
console.log(`[seo] ${PAGES.length} page heads, ${urls.length} sitemap URLs`);
