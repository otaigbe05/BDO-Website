import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { ArrowRight, ExternalLink } from 'lucide-react';
import ShopPreview from '@/components/ShopPreview';
import { TRADES, savedTrade, saveTrade } from '@/data/trades';

// Home page hero. The visitor says what they run, and the whole hero turns to face them:
// headline, the website design shown, the OMIS day beside it, and where the buttons go.
// The choice is remembered on this device so the rest of the site can use it.
const HomeHero = () => {
  const reduce = useReducedMotion();
  const [trade, setTrade] = useState(null);
  useEffect(() => { setTrade(savedTrade()); }, []);
  const shown = trade ?? TRADES[0];

  const pick = (t) => {
    setTrade(t);
    saveTrade(t.slug);
  };

  return (
    <section className="hero-night relative overflow-hidden text-white">
      <div aria-hidden="true" className="hero-night__grid pointer-events-none absolute inset-0" />
      <div aria-hidden="true" className="pointer-events-none absolute -left-40 top-[-10rem] h-[32rem] w-[32rem] rounded-full bg-blue-600/30 blur-3xl" />
      <div aria-hidden="true" className="pointer-events-none absolute -right-32 bottom-[-12rem] h-[30rem] w-[30rem] rounded-full bg-teal-500/20 blur-3xl" />

      <div className="container relative mx-auto grid items-center gap-14 px-4 pb-24 pt-16 sm:px-6 lg:grid-cols-[1.05fr_1fr] lg:gap-10 lg:px-8 lg:pb-28 lg:pt-20">
        <div className="min-w-0">
          <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-bold uppercase tracking-[0.14em] text-teal-200">
            Websites + OMIS booking &middot; Ontario, Canada
          </p>

          <h1 className="min-h-[2.3em] text-white text-4xl font-black leading-[1.08] tracking-tight text-balance sm:text-5xl xl:text-6xl">
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={trade?.slug ?? 'any'}
                initial={reduce ? false : { opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduce ? undefined : { opacity: 0, y: -10 }}
                transition={{ duration: 0.35 }}
                className="block"
              >
                {trade ? trade.hero : <>A website that books.<br className="hidden sm:block" /> <span className="bg-gradient-to-r from-sky-300 to-emerald-300 bg-clip-text text-transparent">A system that runs the shop.</span></>}
              </motion.span>
            </AnimatePresence>
          </h1>

          <p className="mt-5 max-w-xl text-lg leading-relaxed text-slate-200">
            {trade ? trade.pitch : 'Pick a design made for your trade and see your own site before you pay. Its Book button runs on OMIS: online booking, reminders and deposits, built by us in Ontario.'}
          </p>

          <fieldset className="mt-8">
            <legend className="mb-3 text-sm font-bold text-slate-300">I run a&hellip;</legend>
            <div className="flex flex-wrap gap-2">
              {TRADES.map((t) => {
                const on = trade?.slug === t.slug;
                return (
                  <button
                    key={t.slug}
                    type="button"
                    aria-pressed={on}
                    onClick={() => pick(t)}
                    className={`relative min-h-[44px] rounded-full px-4 text-sm font-bold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-300 ${on ? 'text-slate-950' : 'border border-white/20 text-white hover:border-white/50 hover:bg-white/5'}`}
                  >
                    {on && <motion.span layoutId="trade-pill" className="absolute inset-0 rounded-full bg-white" transition={{ type: 'spring', stiffness: 420, damping: 34 }} />}
                    <span className="relative">{t.label}</span>
                  </button>
                );
              })}
            </div>
          </fieldset>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <a
              href={trade ? `/templates/${trade.slug}/` : '/templates/'}
              className="group inline-flex h-14 items-center justify-center gap-2 rounded-full bg-white px-7 text-base font-extrabold text-slate-950 shadow-lg shadow-black/30 transition-transform hover:scale-[1.03] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-300"
            >
              Pick your website design
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
            </a>
            {trade ? (
              <Link
                to={`/for/${trade.slug}`}
                className="inline-flex h-14 items-center justify-center gap-2 rounded-full border border-white/30 px-7 text-base font-bold text-white transition-colors hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-300"
              >
                See it all for {trade.plural}
              </Link>
            ) : (
              <a
                href="https://www.omis-crm.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-14 items-center justify-center gap-2 rounded-full border border-white/30 px-7 text-base font-bold text-white transition-colors hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-300"
              >
                Try OMIS free for 14 days <ExternalLink className="h-4 w-4" aria-hidden="true" />
              </a>
            )}
          </div>
          <p className="mt-4 text-sm text-slate-300">
            OMIS: 14 days free, no credit card, from $29/month CAD. Need dashboards or reporting instead?{' '}
            <Link to="/services" className="font-bold text-teal-200 underline underline-offset-4 hover:text-white">See our data consulting</Link>.
          </p>
        </div>

        <div className="min-w-0 pt-6 lg:pt-0">
          <ShopPreview trade={shown} />
          <p className="mt-12 text-center text-xs text-slate-400 sm:mt-14">
            A real design from our gallery, shown with a fictional sample shop. Bookings are sample data.
          </p>
        </div>
      </div>
    </section>
  );
};

export default HomeHero;
