// The BDO blog's shared core: reads a post (front matter + Markdown) and turns it into HTML.
// Used in the browser (src/lib/blog.js, through Vite) and at build time (tools/seo.js, in Node), so
// it has no imports and no dependencies.
//
// A post is a file in src/content/blog/, named after its address:
//   winter-tire-season-auto-shops.md -> /blog/winter-tire-season-auto-shops
// Front matter (between --- lines at the top), checked here so a bad post fails the build:
//   title        the question in the searcher's words, 60 characters or fewer
//   description  about 150 characters (80 to 170), for search results and sharing
//   date         first published, "2026-11-15"; updated: last reviewed (optional)
//   topic        one of TOPICS
//   trade        optional: barbers | tattoo | auto | spa | personal-training (the next-step box)
//   faq          optional list of { q, a }: real questions answered in the post (FAQ data)
//   sources      optional list of { title, url }: shown at the end of the post
//   draft        true keeps it off the site, the feed and the sitemap
// Rules (omis-sites docs/SEO-CONTENT-PLAN.md): no invented statistics, reviews or quotes; sources
// linked; our own prices only come from src/data/pricing.js (the post page shows them, never the
// Markdown); BDO and ChurchNow stay separate (a post that mentions churchnow fails the build).

// /blog's own title and description (the page and tools/seo.js both use these).
export const BLOG_TITLE = 'Blog: Practical Guides for Appointment-Based Shops | BDO Analytics Solutions';
export const BLOG_DESCRIPTION = 'Plain, practical guides for barbers, tattoo studios, auto shops, spas, salons and trainers in Canada: getting found on Google, online booking, websites and reviews.';

export const TOPICS = ['Getting found', 'Online booking', 'Website cost', 'Reviews', 'Seasonal'];
export const TRADE_SLUGS = ['barbers', 'tattoo', 'auto', 'spa', 'personal-training'];
const DATE = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/;
const SLUG = /^[a-z0-9]+(-[a-z0-9]+)*$/;

const fail = (slug, msg) => {
  throw new Error(`[blog] ${slug}.md: ${msg}`);
};

// ---------- Front matter (a small, strict YAML subset) ----------
// Supports: key: value; key: "quoted value"; true/false; and lists under a key, of plain items
// ("- text") or of small maps ("- q: ..." then "  a: ..." indented under it).
function scalar(v) {
  const t = v.trim();
  if (t === 'true') return true;
  if (t === 'false') return false;
  if ((t.startsWith('"') && t.endsWith('"')) || (t.startsWith("'") && t.endsWith("'"))) {
    return t.slice(1, -1).replace(/\\"/g, '"').replace(/''/g, "'");
  }
  return t;
}

function frontMatter(slug, text) {
  const out = {};
  const lines = text.split(/\r?\n/);
  let key = null;
  let item = null;
  for (const [n, raw] of lines.entries()) {
    if (!raw.trim() || raw.trim().startsWith('#')) continue;
    const top = raw.match(/^([a-z][a-zA-Z]*):\s*(.*)$/);
    if (top) {
      key = top[1];
      item = null;
      if (key in out) fail(slug, `front matter line ${n + 1}: "${key}" appears twice.`);
      out[key] = top[2] === '' ? [] : scalar(top[2]);
      continue;
    }
    const dash = raw.match(/^\s+-\s+(.*)$/);
    if (dash && key && Array.isArray(out[key])) {
      const kv = dash[1].match(/^([a-z][a-zA-Z]*):\s*(.*)$/);
      if (kv) {
        item = { [kv[1]]: scalar(kv[2]) };
        out[key].push(item);
      } else {
        item = null;
        out[key].push(scalar(dash[1]));
      }
      continue;
    }
    const more = raw.match(/^\s{3,}([a-z][a-zA-Z]*):\s*(.*)$/);
    if (more && item) {
      item[more[1]] = scalar(more[2]);
      continue;
    }
    fail(slug, `front matter line ${n + 1} is not understood: "${raw.trim()}"`);
  }
  return out;
}

function check(slug, m) {
  const allowed = ['title', 'description', 'date', 'updated', 'topic', 'trade', 'faq', 'sources', 'draft'];
  for (const k of Object.keys(m)) if (!allowed.includes(k)) fail(slug, `unknown field "${k}" (allowed: ${allowed.join(', ')}).`);
  const len = (k, min, max) => {
    if (typeof m[k] !== 'string' || m[k].length < min || m[k].length > max) fail(slug, `${k} must be ${min} to ${max} characters (it is ${typeof m[k] === 'string' ? m[k].length : 'missing'}).`);
  };
  len('title', 10, 60);
  len('description', 80, 170);
  if (!DATE.test(m.date ?? '')) fail(slug, 'date must look like "2026-11-15".');
  if (m.updated !== undefined && !DATE.test(m.updated)) fail(slug, 'updated must look like "2026-11-15".');
  if (!TOPICS.includes(m.topic)) fail(slug, `topic must be one of: ${TOPICS.join(', ')}.`);
  if (m.trade !== undefined && !TRADE_SLUGS.includes(m.trade)) fail(slug, `trade must be one of: ${TRADE_SLUGS.join(', ')}.`);
  const faq = m.faq ?? [];
  if (!Array.isArray(faq) || faq.some((f) => typeof f !== 'object' || !f.q || !f.a || Object.keys(f).length !== 2)) fail(slug, 'faq must be a list of items with q and a.');
  const sources = m.sources ?? [];
  if (!Array.isArray(sources) || sources.some((s) => typeof s !== 'object' || !s.title || !/^https:\/\/\S+$/.test(s.url ?? '') || Object.keys(s).length !== 2)) fail(slug, 'sources must be a list of items with title and an https url.');
  if (m.draft !== undefined && typeof m.draft !== 'boolean') fail(slug, 'draft must be true or false.');
  return { ...m, faq, sources, draft: m.draft === true };
}

// ---------- Markdown (the subset posts use) ----------
// Blocks: ## and ### headings, paragraphs, - and 1. lists, > quotes, | tables |.
// Inline: **bold**, *italic*, `code`, [links](https://...) and [links](/on-our-site).
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
export const headingId = (text) => text.toLowerCase().replace(/<[^>]+>/g, '').replace(/&[a-z]+;/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

function inline(text) {
  let s = esc(text);
  s = s.replace(/`([^`]+)`/g, '<code>$1</code>');
  s = s.replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (_, label, url) => {
    const ext = /^https?:\/\//.test(url);
    return `<a href="${url}"${ext ? ' target="_blank" rel="noopener noreferrer"' : ''}>${label}</a>`;
  });
  s = s.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  s = s.replace(/(^|[^*])\*([^*\s][^*]*)\*/g, '$1<em>$2</em>');
  return s;
}

function markdown(slug, body) {
  const lines = body.replace(/\r/g, '').split('\n');
  const html = [];
  const headings = [];
  let i = 0;
  const isBlockStart = (l) => /^(#{2,3}\s|[-*]\s|\d+\.\s|>\s?|\|)/.test(l);
  while (i < lines.length) {
    const line = lines[i];
    if (!line.trim()) { i++; continue; }
    const h = line.match(/^(#{2,3})\s+(.+)$/);
    if (h) {
      const level = h[1].length;
      const text = inline(h[2].trim());
      const id = headingId(h[2]);
      if (level === 2) headings.push({ id, text: h[2].trim() });
      html.push(`<h${level} id="${id}">${text}</h${level}>`);
      i++;
      continue;
    }
    if (/^#\s/.test(line)) fail(slug, 'use ## for headings in a post (the title is the only top heading).');
    if (/^[-*]\s/.test(line)) {
      const items = [];
      while (i < lines.length && /^[-*]\s/.test(lines[i])) {
        let t = lines[i].replace(/^[-*]\s+/, '');
        i++;
        while (i < lines.length && /^\s{2,}\S/.test(lines[i]) && !/^\s*[-*]\s/.test(lines[i])) { t += ` ${lines[i].trim()}`; i++; }
        items.push(`<li>${inline(t)}</li>`);
      }
      html.push(`<ul>${items.join('')}</ul>`);
      continue;
    }
    if (/^\d+\.\s/.test(line)) {
      const items = [];
      while (i < lines.length && /^\d+\.\s/.test(lines[i])) {
        let t = lines[i].replace(/^\d+\.\s+/, '');
        i++;
        while (i < lines.length && /^\s{2,}\S/.test(lines[i]) && !/^\s*\d+\.\s/.test(lines[i])) { t += ` ${lines[i].trim()}`; i++; }
        items.push(`<li>${inline(t)}</li>`);
      }
      html.push(`<ol>${items.join('')}</ol>`);
      continue;
    }
    if (/^>\s?/.test(line)) {
      const parts = [];
      while (i < lines.length && /^>\s?/.test(lines[i])) { parts.push(lines[i].replace(/^>\s?/, '')); i++; }
      html.push(`<blockquote><p>${inline(parts.join(' '))}</p></blockquote>`);
      continue;
    }
    if (/^\|/.test(line)) {
      const rows = [];
      while (i < lines.length && /^\|/.test(lines[i])) { rows.push(lines[i]); i++; }
      const cells = (r) => r.trim().replace(/^\||\|$/g, '').split('|').map((c) => c.trim());
      if (rows.length < 2 || !/^\|?\s*:?-{3,}/.test(rows[1])) fail(slug, 'a table needs a header row and a |---| row under it.');
      const head = cells(rows[0]).map((c) => `<th scope="col">${inline(c)}</th>`).join('');
      const bodyRows = rows.slice(2).map((r) => `<tr>${cells(r).map((c) => `<td>${inline(c)}</td>`).join('')}</tr>`).join('');
      html.push(`<div class="blog-table"><table><thead><tr>${head}</tr></thead><tbody>${bodyRows}</tbody></table></div>`);
      continue;
    }
    const para = [];
    while (i < lines.length && lines[i].trim() && !isBlockStart(lines[i])) { para.push(lines[i].trim()); i++; }
    html.push(`<p>${inline(para.join(' '))}</p>`);
  }
  return { html: html.join('\n'), headings };
}

// ---------- Posts ----------
export function parsePost(slug, raw) {
  if (!SLUG.test(slug)) fail(slug, 'name the file in lowercase words joined by hyphens.');
  if (/churchnow/i.test(raw)) fail(slug, 'BDO posts never mention or link to ChurchNow (owner decision 2026-11-15).');
  const m = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!m) fail(slug, 'start the file with front matter between --- lines.');
  const meta = check(slug, frontMatter(slug, m[1]));
  const { html, headings } = markdown(slug, m[2]);
  const words = m[2].split(/\s+/).filter(Boolean).length;
  return { slug, meta, html, headings, words, minutes: Math.max(1, Math.round(words / 220)) };
}

/** Newest first; drafts left out. */
export function sortPosts(posts) {
  return posts.filter((p) => !p.meta.draft).sort((a, b) => b.meta.date.localeCompare(a.meta.date) || a.slug.localeCompare(b.slug));
}

/** "2026-11-15" -> "November 15, 2026". */
export function longDate(iso) {
  const [y, mo, d] = iso.split('-').map(Number);
  return new Date(Date.UTC(y, mo - 1, d)).toLocaleDateString('en-CA', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' });
}

/** Up to n other posts, same trade or topic first. */
export function related(posts, post, n = 3) {
  const score = (p) => (p.meta.trade && p.meta.trade === post.meta.trade ? 2 : 0) + (p.meta.topic === post.meta.topic ? 1 : 0);
  return posts.filter((p) => p.slug !== post.slug).sort((a, b) => score(b) - score(a) || b.meta.date.localeCompare(a.meta.date)).slice(0, n);
}

/** Article (and FAQ, when the post has real questions) structured data. */
export function jsonLd(post, site) {
  const url = `${site}/blog/${post.slug}`;
  const org = { '@type': 'Organization', name: 'BDO Analytics Solutions', url: site, logo: `${site}/logo-512.png` };
  const out = [{
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.meta.title,
    description: post.meta.description,
    datePublished: post.meta.date,
    dateModified: post.meta.updated ?? post.meta.date,
    mainEntityOfPage: url,
    url,
    image: `${site}/blog/${post.slug}.png`,
    author: org,
    publisher: org,
  }];
  if (post.meta.faq.length) {
    out.push({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: post.meta.faq.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
    });
  }
  return out;
}

/** RSS 2.0 feed of the newest posts. */
export function rss(posts, site) {
  const x = (s) => esc(s).replace(/'/g, '&apos;');
  const items = posts.slice(0, 30).map((p) => `    <item>
      <title>${x(p.meta.title)}</title>
      <link>${site}/blog/${p.slug}</link>
      <guid isPermaLink="true">${site}/blog/${p.slug}</guid>
      <pubDate>${new Date(`${p.meta.date}T12:00:00Z`).toUTCString()}</pubDate>
      <category>${x(p.meta.topic)}</category>
      <description>${x(p.meta.description)}</description>
    </item>`).join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>BDO Analytics Solutions blog</title>
    <link>${site}/blog</link>
    <atom:link href="${site}/blog/rss.xml" rel="self" type="application/rss+xml" />
    <description>Plain, practical guides for barbers, tattoo studios, auto shops, spas, salons and trainers: getting found on Google, online booking, websites and reviews.</description>
    <language>en-ca</language>
${items}
  </channel>
</rss>
`;
}
