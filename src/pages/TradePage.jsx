import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useParams } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, Check, ExternalLink, Globe, CalendarCheck, Smartphone, Search } from 'lucide-react';
import ShopPreview from '@/components/ShopPreview';
import NotFoundPage from '@/pages/NotFoundPage';
import { TRADES, tradeBySlug, saveTrade } from '@/data/trades';
import { useCatalog, forTrade } from '@/lib/useCatalog';

const SITE = 'https://www.bdoanalyticssolutions.com';

// /for/:trade - everything from one trade's point of view: their website designs, what
// OMIS does in their shop, how the two connect, and what it costs.
const TradePage = () => {
  const { trade: slug } = useParams();
  const trade = tradeBySlug(slug);
  const reduce = useReducedMotion();
  const { status, templates } = useCatalog();
  useEffect(() => { if (trade) saveTrade(trade.slug); }, [trade]);
  if (!trade) return <NotFoundPage />;

  const designs = forTrade(templates, trade.code);
  const url = `${SITE}/for/${trade.slug}`;
  const rise = (i = 0) => (reduce ? {} : {
    initial: { opacity: 0, y: 18 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: '-60px' },
    transition: { duration: 0.5, delay: i * 0.06 },
  });

  const flow = [
    { icon: Search, title: 'They find you', text: 'Your website shows your prices, hours, photos and team, built for phones and set up for Google.' },
    { icon: Globe, title: 'They tap Book', text: 'The Book button on your site opens your OMIS booking page. No DMs, no phone tag.' },
    { icon: CalendarCheck, title: 'OMIS takes it from there', text: 'Confirmation, reminders and any deposit happen on their own.' },
    { icon: Smartphone, title: 'You see it on your phone', text: `The booking lands on your calendar, with the right ${trade.person}.` },
  ];

  return (
    <>
      <Helmet>
        <title>{trade.title}</title>
        <meta name="description" content={trade.description} />
        <link rel="canonical" href={url} />
        <meta property="og:title" content={trade.title} />
        <meta property="og:description" content={trade.description} />
        <meta property="og:url" content={url} />
      </Helmet>

      <div className="bg-white font-sans">
        <section className="hero-night relative overflow-hidden text-white">
          <div aria-hidden="true" className="hero-night__grid pointer-events-none absolute inset-0" />
          <div className="container relative mx-auto grid items-center gap-14 px-4 pb-24 pt-14 sm:px-6 lg:grid-cols-[1.05fr_1fr] lg:px-8">
            <div className="min-w-0">
              <nav aria-label="Other trades" className="mb-6 flex flex-wrap gap-2 text-sm">
                {TRADES.map((t) => (
                  <Link
                    key={t.slug}
                    to={`/for/${t.slug}`}
                    aria-current={t.slug === trade.slug ? 'page' : undefined}
                    className={`inline-flex min-h-[36px] items-center rounded-full px-3 font-bold transition-colors ${t.slug === trade.slug ? 'bg-white text-slate-950' : 'border border-white/20 text-slate-200 hover:bg-white/10'}`}
                  >
                    {t.label}
                  </Link>
                ))}
              </nav>
              <p className="mb-4 text-xs font-bold uppercase tracking-[0.14em] text-teal-200">For {trade.plural}</p>
              <h1 className="text-white text-4xl font-black leading-[1.08] tracking-tight text-balance sm:text-5xl">{trade.hero}</h1>
              <p className="mt-5 max-w-xl text-lg leading-relaxed text-slate-200">{trade.pitch}</p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <a href="#designs" className="group inline-flex h-14 items-center justify-center gap-2 rounded-full bg-white px-7 font-extrabold text-slate-950 shadow-lg transition-transform hover:scale-[1.03]">
                  See the designs <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                </a>
                <a href={trade.omis} target="_blank" rel="noopener noreferrer" className="inline-flex h-14 items-center justify-center gap-2 rounded-full border border-white/30 px-7 font-bold text-white transition-colors hover:bg-white/10">
                  Try OMIS free for 14 days <ExternalLink className="h-4 w-4" aria-hidden="true" />
                </a>
              </div>
            </div>
            <div className="min-w-0 pt-6 lg:pt-0">
              <ShopPreview trade={trade} />
            </div>
          </div>
        </section>

        {/* How the two halves connect */}
        <section className="border-b border-slate-200 py-20">
          <div className="container mx-auto px-4">
            <motion.h2 {...rise()} className="mx-auto mb-12 max-w-3xl text-center text-3xl font-bold text-slate-900 text-balance md:text-4xl">
              Your website brings them in. OMIS books them.
            </motion.h2>
            <ol className="mx-auto grid max-w-6xl gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {flow.map((s, i) => (
                <motion.li key={s.title} {...rise(i)} className="relative rounded-2xl border border-slate-200 bg-slate-50 p-6">
                  <span className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-blue-700 text-white">
                    <s.icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <span className="mb-1 block text-xs font-extrabold uppercase tracking-wider text-blue-800">Step {i + 1}</span>
                  <h3 className="mb-2 text-lg font-bold text-slate-900">{s.title}</h3>
                  <p className="text-slate-700">{s.text}</p>
                </motion.li>
              ))}
            </ol>
          </div>
        </section>

        {/* Website designs */}
        <section id="designs" className="scroll-mt-24 border-b border-slate-200 bg-slate-50 py-20">
          <div className="container mx-auto px-4">
            <motion.div {...rise()} className="mx-auto mb-10 max-w-3xl text-center">
              <h2 className="mb-4 text-3xl font-bold text-slate-900 text-balance md:text-4xl">Website designs for {trade.plural}</h2>
              <p className="text-lg text-slate-700">Pick one, tell us about your shop on one form, and see your own site before you pay. Your name, photos, prices and hours, not ours.</p>
            </motion.div>
            {status === 'error' ? (
              <p className="text-center text-slate-700">The designs didn&rsquo;t load. <a className="font-bold text-blue-700 underline" href={`/templates/${trade.slug}/`}>Open the gallery</a>.</p>
            ) : (
              <ul className="mx-auto grid max-w-6xl gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {(status === 'loading' ? Array.from({ length: 6 }) : designs.slice(0, 9)).map((t, i) => (
                  <li key={t?.id ?? i}>
                    {t ? (
                      <motion.a {...rise(i % 3)} href={`/templates/${t.path}`} className="group block overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                        <img src={t.thumb} alt={`${t.name} website design for ${trade.plural}`} loading="lazy" width="640" height="400" className="aspect-[16/10] w-full object-cover object-top" />
                        <span className="block p-4">
                          <span className="flex items-center justify-between font-bold text-slate-900">{t.name}<ArrowRight className="h-4 w-4 text-blue-700 transition-transform group-hover:translate-x-1" aria-hidden="true" /></span>
                          <span className="mt-1 block text-sm text-slate-600">{t.summary}</span>
                        </span>
                      </motion.a>
                    ) : (
                      <div className="aspect-[16/12] animate-pulse rounded-2xl bg-slate-200" />
                    )}
                  </li>
                ))}
              </ul>
            )}
            {designs.length > 9 && (
              <p className="mt-10 text-center">
                <a href={`/templates/${trade.slug}/`} className="inline-flex items-center gap-2 font-bold text-blue-700 hover:text-blue-800">
                  See all {designs.length} designs for {trade.plural} <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </a>
              </p>
            )}
          </div>
        </section>

        {/* OMIS for this trade */}
        <section className="border-b border-slate-200 py-20">
          <div className="container mx-auto px-4">
            <motion.div {...rise()} className="mx-auto mb-12 max-w-3xl text-center">
              <h2 className="mb-4 text-3xl font-bold text-slate-900 text-balance md:text-4xl">What OMIS does in your shop</h2>
              <p className="text-lg text-slate-700">The booking system behind your website&rsquo;s Book button. Built and supported by us, in Ontario.</p>
            </motion.div>
            <ul className="mx-auto grid max-w-6xl gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {trade.features.map(([title, text], i) => (
                <motion.li key={title} {...rise(i % 3)} className="flex gap-4 rounded-2xl border border-slate-200 p-6">
                  <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-700"><Check className="h-4 w-4" aria-hidden="true" /></span>
                  <span>
                    <h3 className="font-bold text-slate-900">{title}</h3>
                    <p className="mt-1 text-slate-700">{text}</p>
                  </span>
                </motion.li>
              ))}
            </ul>
          </div>
        </section>

        {/* Price and next step */}
        <section className="bg-slate-950 py-20 text-white">
          <div className="container mx-auto grid max-w-5xl gap-10 px-4 md:grid-cols-2">
            <div>
              <h2 className="mb-4 text-3xl font-bold text-white text-balance">Start with either half.</h2>
              <p className="text-lg text-slate-300">Your website and OMIS work best together, but you can start with one. You see your website before you pay for it.</p>
            </div>
            <div className="space-y-4">
              <a href={`/templates/${trade.slug}/`} className="group flex items-center justify-between gap-4 rounded-2xl bg-white p-6 text-slate-950 transition-transform hover:scale-[1.02]">
                <span>
                  <span className="block text-lg font-extrabold">Pick your website design</span>
                  <span className="block text-sm text-slate-600">See your own site first, ask for changes, then publish.</span>
                </span>
                <ArrowRight className="h-6 w-6 shrink-0 transition-transform group-hover:translate-x-1" aria-hidden="true" />
              </a>
              <a href={trade.omis} target="_blank" rel="noopener noreferrer" className="group flex items-center justify-between gap-4 rounded-2xl border border-white/20 p-6 transition-colors hover:bg-white/5">
                <span>
                  <span className="block text-lg font-extrabold">Try OMIS free for 14 days</span>
                  <span className="block text-sm text-slate-300">No credit card. From $29/month CAD, month to month.</span>
                </span>
                <ExternalLink className="h-5 w-5 shrink-0" aria-hidden="true" />
              </a>
              <p className="text-sm text-slate-400">Questions? Call <a className="font-bold text-white underline underline-offset-4" href="tel:+14164779893">+1 (416) 477-9893</a> or <Link className="font-bold text-white underline underline-offset-4" to="/book-demo">book a demo</Link>.</p>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default TradePage;
