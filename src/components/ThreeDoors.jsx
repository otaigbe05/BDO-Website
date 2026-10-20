import React from 'react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, ExternalLink, LayoutTemplate, CalendarCheck, BarChart3 } from 'lucide-react';
import { OMIS_PLANS, WEBSITE, money } from '@/data/pricing';

// Home page hero: one company, three clear doors. Each product keeps one colour everywhere on the
// page (blue websites, green OMIS booking, purple data and analytics), so visitors always know
// which product they are reading about. PRODUCTS is shared with the bands further down the page.
export const PRODUCTS = {
  websites: { label: 'Websites', who: 'For shops that take appointments', dot: 'bg-blue-600', text: 'text-blue-700', band: 'bg-blue-50 border-blue-200', button: 'bg-blue-700 hover:bg-blue-800', card: 'bg-blue-50 ring-blue-200', icon: LayoutTemplate },
  omis: { label: 'OMIS booking', who: 'For shops that take appointments', dot: 'bg-emerald-600', text: 'text-emerald-700', band: 'bg-emerald-50 border-emerald-200', button: 'bg-emerald-700 hover:bg-emerald-800', card: 'bg-emerald-50 ring-emerald-200', icon: CalendarCheck },
  analytics: { label: 'Data & analytics', who: 'For any business', dot: 'bg-violet-600', text: 'text-violet-700', band: 'bg-violet-50 border-violet-200', button: 'bg-violet-700 hover:bg-violet-800', card: 'bg-violet-50 ring-violet-200', icon: BarChart3 },
};

// Shops first (owner, 2026-10-20): the words appointment businesses search for, and analytics named
// in the line under it.
const HEADLINE = { h1: 'Websites and booking for businesses that run on appointments.', sub: 'Plus data and analytics help for any business. Pick what you need: each one stands on its own, and they work even better together.' };

const DOORS = [
  { key: 'websites', text: `A website made for your trade, ready to preview today. From ${money(WEBSITE.setupAlone)}, or ${money(WEBSITE.setupWithOmis)} with OMIS.`, cta: 'See the designs', href: '/templates/', native: true },
  { key: 'omis', text: `Online booking, deposits, waivers and reminders, in one place. From ${money(OMIS_PLANS[0].monthly)}/month.`, cta: 'Try free for 14 days', href: 'https://omis-crm.com/', external: true },
  { key: 'analytics', text: 'Power BI dashboards, clean data, and reports that build themselves.', cta: 'Book a call', href: '/contact' },
];

const DoorButton = ({ door, className }) => {
  const inner = <>{door.cta} {door.external ? <ExternalLink className="ml-2 h-4 w-4" aria-hidden="true" /> : <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />}</>;
  if (door.external) return <a href={door.href} target="_blank" rel="noopener noreferrer" className={className}>{inner}</a>;
  // The template gallery is its own app behind /templates, so a normal link there.
  if (door.native) return <a href={door.href} className={className}>{inner}</a>;
  return <Link to={door.href} className={className}>{inner}</Link>;
};

const ThreeDoors = () => {
  const reduce = useReducedMotion();
  const head = HEADLINE;
  return (
    <>
      <section className="hero-night relative overflow-hidden text-white">
        <div aria-hidden="true" className="hero-night__grid pointer-events-none absolute inset-0" />
        <div aria-hidden="true" className="pointer-events-none absolute -left-40 top-[-10rem] h-[32rem] w-[32rem] rounded-full bg-blue-600/30 blur-3xl" />
        <div aria-hidden="true" className="pointer-events-none absolute -right-32 bottom-[-12rem] h-[30rem] w-[30rem] rounded-full bg-violet-500/20 blur-3xl" />
        <div className="container relative mx-auto px-4 pb-20 pt-14 sm:px-6 lg:px-8 lg:pb-24 lg:pt-20">
          <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-bold uppercase tracking-[0.14em] text-slate-200">Built in Ontario, Canada</p>
          <h1 className="max-w-4xl text-4xl font-black leading-[1.08] tracking-tight text-white text-balance sm:text-5xl xl:text-6xl">{head.h1}</h1>
          <p className="mt-5 max-w-2xl text-lg text-slate-300">{head.sub}</p>
          <ul className="mt-10 grid gap-5 lg:grid-cols-3" role="list">
            {DOORS.map((door, i) => {
              const p = PRODUCTS[door.key];
              const Icon = p.icon;
              return (
                <motion.li
                  key={door.key}
                  initial={reduce ? false : { opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.08 * i, duration: 0.45, ease: 'easeOut' }}
                  className={`flex flex-col rounded-3xl p-6 ring-1 ${p.card} text-slate-900 shadow-xl shadow-black/20`}
                >
                  <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-600">
                    <span className={`h-2.5 w-2.5 rounded-full ${p.dot}`} aria-hidden="true" />{p.who}
                  </span>
                  <h2 className="mt-3 flex items-center gap-2 text-2xl font-extrabold text-slate-900"><Icon className={`h-6 w-6 ${p.text}`} aria-hidden="true" />{p.label}</h2>
                  <p className="mt-2 flex-grow font-medium text-slate-700">{door.text}</p>
                  <DoorButton door={door} className={`mt-5 inline-flex w-fit items-center rounded-full px-5 py-3 text-sm font-bold text-white transition-colors ${p.button}`} />
                </motion.li>
              );
            })}
          </ul>
        </div>
      </section>

      {/* How the two shop products fit together. */}
      <section aria-label="Websites and OMIS together" className="border-y border-slate-200 bg-slate-50">
        <div className="container mx-auto flex flex-wrap items-center justify-center gap-3 px-4 py-6 text-center font-semibold text-slate-800 sm:px-6 lg:px-8">
          <span className="font-bold text-slate-900">Better together:</span>
          <span className="rounded-full bg-white px-4 py-2 ring-1 ring-blue-200"><span className="text-blue-700">Your website</span> is the shop window</span>
          <span aria-hidden="true">+</span>
          <span className="rounded-full bg-white px-4 py-2 ring-1 ring-emerald-200"><span className="text-emerald-700">OMIS</span> is the appointment book</span>
          <span aria-hidden="true">=</span>
          <span className="rounded-full bg-white px-4 py-2 ring-1 ring-slate-300">website setup only {money(WEBSITE.setupWithOmis)}</span>
        </div>
      </section>
    </>
  );
};

/** The coloured label that starts each product's part of the page. */
export const ProductBand = ({ product, children }) => {
  const p = PRODUCTS[product];
  return (
    <div className={`border-y ${p.band}`}>
      <div className="container mx-auto flex flex-wrap items-center gap-x-3 gap-y-1 px-4 py-3 sm:px-6 lg:px-8">
        <span className={`h-3 w-3 rounded-full ${p.dot}`} aria-hidden="true" />
        <span className={`font-extrabold uppercase tracking-wider ${p.text}`}>{p.label}</span>
        <span className="text-sm font-semibold text-slate-600">{children ?? p.who}</span>
      </div>
    </div>
  );
};

export default ThreeDoors;
