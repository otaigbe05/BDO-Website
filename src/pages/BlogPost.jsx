import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useParams } from 'react-router-dom';
import { ArrowRight, ChevronLeft } from 'lucide-react';
import NotFoundPage from '@/pages/NotFoundPage';
import { posts, postBySlug } from '@/lib/blog';
import { longDate, related, jsonLd } from '@/lib/blog-core';
import { tradeBySlug } from '@/data/trades';
import { OMIS_PLANS, WEBSITE, money } from '@/data/pricing';
import NewsletterSignup from '@/components/NewsletterSignup';

const SITE = 'https://www.bdoanalyticssolutions.com';

// The one next step at the end of a post. Prices come only from src/data/pricing.js.
const NextStep = ({ trade }) => {
  const t = trade ? tradeBySlug(trade) : null;
  const starter = OMIS_PLANS[0];
  return (
    <aside className="mt-12 rounded-2xl bg-slate-900 p-6 text-white md:p-8" aria-label="How BDO can help">
      <p className="text-xs font-bold uppercase tracking-widest text-blue-300">How we can help</p>
      <h2 className="mt-2 text-2xl font-extrabold text-white">{t ? `Websites and online booking for ${t.plural}` : 'Websites and online booking for appointment-based shops'}</h2>
      <p className="mt-3 max-w-2xl text-slate-200">
        OMIS takes bookings around the clock, sends reminders and keeps every customer's history, from {money(starter.monthly)}/month with a 14-day free trial. A website with OMIS is a one-time {money(WEBSITE.setupWithOmis)} setup, with hosting included.
      </p>
      <div className="mt-5 flex flex-wrap gap-3">
        <Link to={t ? `/for/${t.slug}` : '/pricing'} className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 font-bold text-slate-900 hover:bg-blue-50">
          {t ? `See it for ${t.plural}` : 'See pricing'} <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
        <a href="/templates/" className="inline-flex items-center gap-2 rounded-xl border border-white/40 px-5 py-3 font-bold text-white hover:bg-white/10">Browse website designs</a>
      </div>
    </aside>
  );
};

// /blog/:slug - one post. tools/seo.js writes the same article into this address's HTML file, so
// search engines and link previews get the full text before this page loads.
const BlogPost = () => {
  const { slug } = useParams();
  const post = postBySlug(slug);
  if (!post) return <NotFoundPage />;
  const { meta } = post;
  const url = `${SITE}/blog/${post.slug}`;
  const more = related(posts, post);
  return (
    <>
      <Helmet>
        <title>{`${meta.title} | BDO Analytics Solutions`}</title>
        <meta name="description" content={meta.description} />
        <link rel="canonical" href={url} />
        <meta property="og:type" content="article" />
        <meta property="og:title" content={meta.title} />
        <meta property="og:description" content={meta.description} />
        <meta property="og:url" content={url} />
        <script type="application/ld+json">{JSON.stringify(jsonLd(post, SITE))}</script>
      </Helmet>
      <article className="bg-white font-sans">
        <header className="hero-night relative overflow-hidden text-white">
          <div aria-hidden="true" className="hero-night__grid pointer-events-none absolute inset-0" />
          <div className="container relative mx-auto max-w-4xl px-4 pb-14 pt-10 sm:px-6 lg:px-8">
            <Link to="/blog" className="inline-flex items-center gap-1 text-sm font-bold text-blue-200 hover:text-white hover:underline"><ChevronLeft className="h-4 w-4" aria-hidden="true" /> All posts</Link>
            <p className="mt-6 text-xs font-bold uppercase tracking-widest text-blue-300">{meta.topic}</p>
            <h1 className="mt-2 text-3xl font-extrabold leading-tight text-white md:text-5xl">{meta.title}</h1>
            <p className="mt-4 max-w-3xl text-lg text-slate-200">{meta.description}</p>
            <p className="mt-5 text-sm text-slate-300">
              Published {longDate(meta.date)}{meta.updated && meta.updated !== meta.date ? ` \u00b7 Last reviewed ${longDate(meta.updated)}` : ''} &middot; {post.minutes} min read
            </p>
          </div>
        </header>

        <div className="container mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
          {post.headings.length >= 3 && (
            <nav aria-label="In this post" className="mb-10 rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <p className="text-sm font-extrabold text-slate-900">In this post</p>
              <ul className="mt-2 space-y-1 text-sm">
                {post.headings.map((h) => <li key={h.id}><a href={`#${h.id}`} className="font-semibold text-blue-800 hover:underline">{h.text.replace(/\*\*/g, '')}</a></li>)}
              </ul>
            </nav>
          )}

          <div className="blog-prose" dangerouslySetInnerHTML={{ __html: post.html }} />

          {meta.faq.length > 0 && (
            <section className="mt-12" aria-labelledby="faq-h">
              <h2 id="faq-h" className="text-2xl font-extrabold text-slate-900">Questions owners ask</h2>
              <dl className="mt-4 divide-y divide-slate-200 border-y border-slate-200">
                {meta.faq.map((f) => (
                  <div key={f.q} className="py-4">
                    <dt className="font-bold text-slate-900">{f.q}</dt>
                    <dd className="mt-1 text-slate-700">{f.a}</dd>
                  </div>
                ))}
              </dl>
            </section>
          )}

          <NextStep trade={meta.trade} />

          <div className="mt-8"><NewsletterSignup /></div>

          {meta.sources.length > 0 && (
            <section className="mt-12" aria-labelledby="sources-h">
              <h2 id="sources-h" className="text-lg font-extrabold text-slate-900">Sources</h2>
              <ul className="mt-3 space-y-2 text-sm">
                {meta.sources.map((s) => <li key={s.url}><a href={s.url} target="_blank" rel="noopener noreferrer" className="text-blue-800 underline hover:text-blue-900">{s.title}</a></li>)}
              </ul>
            </section>
          )}

          {more.length > 0 && (
            <section className="mt-12 border-t border-slate-200 pt-10" aria-labelledby="more-h">
              <h2 id="more-h" className="text-lg font-extrabold text-slate-900">More from the blog</h2>
              <ul className="mt-4 grid gap-4 md:grid-cols-3">
                {more.map((p) => (
                  <li key={p.slug}><Link to={`/blog/${p.slug}`} className="block h-full rounded-xl border border-slate-200 p-4 hover:border-blue-700"><span className="text-xs font-bold uppercase tracking-wider text-blue-700">{p.meta.topic}</span><span className="mt-1 block font-bold text-slate-900">{p.meta.title}</span></Link></li>
                ))}
              </ul>
            </section>
          )}
        </div>
      </article>
    </>
  );
};

export default BlogPost;
