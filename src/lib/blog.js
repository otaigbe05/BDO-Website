// The blog's posts in the browser: every src/content/blog/*.md file, read through the shared core
// (src/lib/blog-core.js; tools/seo.js reads the same files in Node to write each post's page,
// the RSS feed and the sitemap).
import { parsePost, sortPosts } from '@/lib/blog-core';

const files = import.meta.glob('../content/blog/*.md', { as: 'raw', eager: true });

export const posts = sortPosts(
  Object.entries(files).map(([path, raw]) => parsePost(path.replace(/^.*\//, '').replace(/\.md$/, ''), raw)),
);

export const postBySlug = (slug) => posts.find((p) => p.slug === slug);
