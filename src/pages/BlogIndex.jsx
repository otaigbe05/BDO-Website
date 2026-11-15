import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { ArrowRight, Rss } from 'lucide-react';
import { posts } from '@/lib/blog';
import { TOPICS, longDate, BLOG_TITLE as TITLE, BLOG_DESCRIPTION as DESCRIPTION } from '@/lib/blog-core';

const SITE = 'https://www.bdoanalyticssolutions.com';

// /blog - every post, newest first, with a topic filter.
const BlogIndex = () => {
  const [topic, setTopic] = useState(null);
  const used = TOPICS.filter((t) => posts.some((p) => p.meta.topic === t));
  const shown = topic ? posts.filter((p) => p.meta.topic === topic) : posts;
  return (
    <>
      <Helmet>
        <title>{TITLE}</title>
        <meta name="description" content={DESCRIPTION} />
        <link rel="canonical" href={`${SITE}/blog`} />
        <meta property="og:title" content={TITLE} />
        <meta property="og:description" content={DESCRIPTION} />
        <meta property="og:url" content={`${SITE}/blog`} />
        <link rel="alternate" type="application/rss+xml" title="BDO Analytics Solutions blog" href="/blog/rss.xml" />
      </Helmet>
      <div className="bg-white font-sans">
        <section className="hero-night relative overflow-hidden text-white">
          <div aria-hidden="true" className="hero-night__grid pointer-events-none absolute inset-0" />
          <div className="container relative mx-auto px-4 pb-16 pt-14 sm:px-6 lg:px-8">
            <p className="text-sm font-bold uppercase tracking-widest text-blue-300">Blog</p>
            <h1 className="mt-3 max-w-3xl text-4xl font-extrabold leading-tight text-white md:text-5xl">Guides for shops that run on appointments</h1>
            <p className="mt-4 max-w-2xl text-lg text-slate-200">Getting found on Google, filling your book, and websites that pull their weight. Plain steps, Canadian facts, sources linked.</p>
            <a href="/blog/rss.xml" className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-blue-200 hover:text-white hover:underline"><Rss className="h-4 w-4" aria-hidden="true" /> RSS feed</a>
          </div>
        </section>

        <section className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
          {used.length > 1 && (
            <div className="mb-8 flex flex-wrap gap-2" role="group" aria-label="Filter by topic">
              <button type="button" onClick={() => setTopic(null)} aria-pressed={topic === null} className={`rounded-full border px-4 py-2 text-sm font-bold ${topic === null ? 'border-slate-900 bg-slate-900 text-white' : 'border-slate-300 text-slate-800 hover:border-slate-900'}`}>All</button>
              {used.map((t) => (
                <button key={t} type="button" onClick={() => setTopic(t)} aria-pressed={topic === t} className={`rounded-full border px-4 py-2 text-sm font-bold ${topic === t ? 'border-slate-900 bg-slate-900 text-white' : 'border-slate-300 text-slate-800 hover:border-slate-900'}`}>{t}</button>
              ))}
            </div>
          )}
          {shown.length === 0 ? (
            <p className="text-slate-600">The first posts are on their way.</p>
          ) : (
            <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {shown.map((p) => (
                <li key={p.slug}>
                  <Link to={`/blog/${p.slug}`} className="group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg">
                    <img src={`/blog/${p.slug}.png`} alt="" width="1200" height="630" loading="lazy" className="aspect-[1200/630] w-full object-cover" onError={(e) => { e.currentTarget.src = '/og.png'; }} />
                    <div className="flex flex-1 flex-col p-5">
                      <p className="text-xs font-bold uppercase tracking-wider text-blue-700">{p.meta.topic}</p>
                      <h2 className="mt-2 text-lg font-extrabold leading-snug text-slate-900 group-hover:text-blue-800">{p.meta.title}</h2>
                      <p className="mt-2 flex-1 text-sm text-slate-600">{p.meta.description}</p>
                      <p className="mt-4 flex items-center justify-between text-xs font-semibold text-slate-500">
                        <span>{longDate(p.meta.date)} &middot; {p.minutes} min read</span>
                        <ArrowRight className="h-4 w-4 text-blue-700" aria-hidden="true" />
                      </p>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </>
  );
};

export default BlogIndex;
