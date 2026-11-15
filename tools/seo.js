#!/usr/bin/env node
// Runs after `vite build`. The site renders in the browser, so on its own every page sends
// the same empty <head>. This writes one HTML file per page with that page's title,
// description, canonical link and share-preview tags already in it (served by Vercel's
// cleanUrls: /about -> about.html), then writes sitemap.xml with the template gallery pages.
import fs from 'fs';
import path from 'path';
import { TRADES } from '../src/data/trades.js';
import { parsePost, sortPosts, longDate, jsonLd, rss, BLOG_TITLE, BLOG_DESCRIPTION } from '../src/lib/blog-core.js';

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

// ---------- Blog (src/content/blog/*.md, read through src/lib/blog-core.js) ----------
// Each post gets its own HTML file with its title, description, share image, Article data and the
// full article inside #root, so search engines and link previews see the post before the app loads
// (the app then renders the same post in its place). /blog lists the posts the same way.
const blogDir = path.resolve('src/content/blog');
const posts = sortPosts(
  (fs.existsSync(blogDir) ? fs.readdirSync(blogDir) : [])
    .filter((f) => f.endsWith('.md'))
    .map((f) => parsePost(f.replace(/\.md$/, ''), fs.readFileSync(path.join(blogDir, f), 'utf8'))),
);
const shareImage = (slug) => (fs.existsSync(path.resolve('public/blog', `${slug}.png`)) ? `${SITE}/blog/${slug}.png` : `${SITE}/og.png`);
const withBody = (html, body, extraHead = '') => html
  .replace('</head>', `${extraHead}</head>`)
  .replace('<div id="root"></div>', `<div id="root">${body}</div>`);
const imageTags = (html, img, alt) => html
  .replace(/(<meta property="og:image" content=")[^"]*"/, `$1${img}"`)
  .replace(/(<meta property="og:image:alt" content=")[^"]*"/, `$1${esc(alt)}"`);

fs.mkdirSync(path.join(dist, 'blog'), { recursive: true });
for (const p of posts) {
  const route = `/blog/${p.slug}`;
  const title = `${p.meta.title} | BDO Analytics Solutions`;
  let html = imageTags(headFor(base, { route, title, description: p.meta.description }), shareImage(p.slug), p.meta.title)
    .replace(/(<meta property="og:type" content=")[^"]*"/, '$1article"');
  const head = `<script type="application/ld+json">${JSON.stringify(jsonLd(p, SITE)).replace(/</g, '\\u003c')}</script>\n`
    + `<meta property="article:published_time" content="${p.meta.date}" />\n`
    + '<link rel="alternate" type="application/rss+xml" title="BDO Analytics Solutions blog" href="/blog/rss.xml" />\n';
  const faq = p.meta.faq.length ? `<h2>Questions owners ask</h2><dl>${p.meta.faq.map((f) => `<dt>${esc(f.q)}</dt><dd>${esc(f.a)}</dd>`).join('')}</dl>` : '';
  const sources = p.meta.sources.length ? `<h2>Sources</h2><ul>${p.meta.sources.map((x) => `<li><a href="${x.url}">${esc(x.title)}</a></li>`).join('')}</ul>` : '';
  const body = `<article><p><a href="/blog">All posts</a></p><p>${esc(p.meta.topic)}</p><h1>${esc(p.meta.title)}</h1><p>${esc(p.meta.description)}</p><p>Published ${longDate(p.meta.date)}</p>${p.html}${faq}${sources}</article>`;
  fs.writeFileSync(path.join(dist, 'blog', `${p.slug}.html`), withBody(html, body, head));
}
{
  const list = posts.map((p) => `<li><a href="/blog/${p.slug}">${esc(p.meta.title)}</a><p>${esc(p.meta.description)}</p></li>`).join('');
  const html = headFor(base, { route: '/blog', title: BLOG_TITLE, description: BLOG_DESCRIPTION });
  fs.writeFileSync(path.join(dist, 'blog.html'), withBody(html, `<h1>Blog</h1><ul>${list}</ul>`, '<link rel="alternate" type="application/rss+xml" title="BDO Analytics Solutions blog" href="/blog/rss.xml" />\n'));
  fs.writeFileSync(path.join(dist, 'blog', 'rss.xml'), rss(posts, SITE));
}

// Gallery pages live in the omis-sites project behind /templates. If the catalog can't be
// read, the sitemap still lists the gallery's front page.
// Only the gallery and its trade pages are listed. Each design's demo page (/templates/<trade>/<ID>/)
// shows a fictional sample business and is marked noindex on purpose, and /templates/view/ is
// blocked in robots.txt, so listing them only produced "Excluded by noindex" in Search Console.
let gallery = ['/templates/'];
try {
  const res = await fetch(GALLERY, { signal: AbortSignal.timeout(10000) });
  const { templates } = await res.json();
  const verticals = [...new Set(templates.map((t) => t.path.split('/')[0]))];
  gallery = gallery.concat(verticals.map((v) => `/templates/${v}/`));
} catch (e) {
  console.warn(`[seo] gallery catalog not read (${e.message}); sitemap lists /templates/ only`);
}

const today = new Date().toISOString().slice(0, 10);
const urls = [
  ...PAGES.map((p) => [p.route, p.priority]),
  ['/blog', 0.7],
  ...posts.map((p) => [`/blog/${p.slug}`, 0.6, p.meta.updated ?? p.meta.date]),
  ...gallery.map((g, i) => [g, i === 0 ? 0.9 : g.split('/').length === 4 ? 0.7 : 0.5]),
];
const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(([u, p, mod]) => `  <url><loc>${SITE}${u}</loc><lastmod>${mod ?? today}</lastmod><priority>${p.toFixed(1)}</priority></url>`).join('\n')}
</urlset>
`;
fs.writeFileSync(path.join(dist, 'sitemap.xml'), xml);
console.log(`[seo] ${PAGES.length} page heads, ${posts.length} blog posts, ${urls.length} sitemap URLs`);
