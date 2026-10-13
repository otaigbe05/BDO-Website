import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { ArrowRight, Check, ExternalLink, Globe, CalendarCheck, Store, BarChart2 } from 'lucide-react';
import { OMIS_PLANS, WEBSITE, money } from '@/data/pricing';

const SITE = 'https://www.bdoanalyticssolutions.com';

// /pricing - every way to buy, on one page: OMIS only, website + OMIS, website only,
// online store, and data consulting. A small calculator adds up the visitor's own total.
const PricingPage = () => {
  const reduce = useReducedMotion();
  const rise = (i = 0) => (reduce ? {} : {
    initial: { opacity: 0, y: 18 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: '-60px' },
    transition: { duration: 0.45, delay: i * 0.06 },
  });

  const starter = OMIS_PLANS[0];
  const options = [
    {
      icon: Globe,
      name: 'Website + OMIS',
      tag: 'Best value',
      price: money(WEBSITE.setupWithOmis),
      unit: 'one-time setup',
      plus: `plus your OMIS plan, from ${money(starter.monthly)}/month`,
      points: ['Your website on the design you pick', 'A Book button that takes bookings, deposits and reminders through OMIS', 'Hosting and care included while you are on OMIS', 'A free yourshop.bizsite.ca address, or your own domain'],
      cta: ['Pick your design', '/templates/'],
      highlight: true,
    },
    {
      icon: CalendarCheck,
      name: 'OMIS only',
      price: money(starter.monthly),
      unit: '/month to start',
      plus: '14 days free, no credit card',
      points: ['Online booking, reminders and deposits', 'A booking link for every staff member', 'Client files and a dashboard', 'Month to month, cancel any time'],
      cta: ['Start free trial', 'https://www.omis-crm.com/'],
    },
    {
      icon: Globe,
      name: 'Website only',
      price: money(WEBSITE.setupAlone),
      unit: 'one-time setup',
      plus: `plus ${money(WEBSITE.careMonthly)}/month hosting and care`,
      points: ['Your website on the design you pick', 'The Book button calls your phone', 'Hosting, security certificate and up to 3 updates a month', 'Stop any time and take your site with you'],
      cta: ['Pick your design', '/templates/'],
    },
    {
      icon: Store,
      name: 'Website + online store',
      price: `From ${money(WEBSITE.storeFrom)}`,
      unit: 'quoted per shop',
      plus: 'Built to order',
      points: ['For shops that sell products online', 'We plan it with you first', 'Works with OMIS for bookings', 'A written quote before any work'],
      cta: ['Talk to us', '/contact'],
    },
  ];

  return (
    <>
      <Helmet>
        <title>Pricing: Websites and OMIS | BDO Analytics Solutions</title>
        <meta name="description" content="Prices for websites and OMIS online booking for appointment-based shops in Ontario: website plus OMIS, OMIS only, website only, and online stores. Canadian dollars." />
        <link rel="canonical" href={`${SITE}/pricing`} />
      </Helmet>

      <div className="bg-white font-sans">
        <section className="hero-night relative overflow-hidden text-white">
          <div aria-hidden="true" className="hero-night__grid pointer-events-none absolute inset-0" />
          <div className="container relative mx-auto px-4 pb-16 pt-16 text-center sm:px-6 lg:px-8">
            <p className="mb-4 text-xs font-bold uppercase tracking-[0.14em] text-teal-200">Pricing &middot; Canadian dollars</p>
            <h1 className="mx-auto max-w-3xl text-4xl font-black leading-[1.08] tracking-tight text-white text-balance sm:text-5xl">Start with one half, or get both.</h1>
            <p className="mx-auto mt-5 max-w-2xl text-lg text-slate-200">A website that brings clients in, and OMIS to book them. No contracts, and no commission on your deposits.</p>
          </div>
        </section>

        {/* The four ways to buy */}
        <section className="relative -mt-2 border-b border-slate-200 bg-slate-50 py-16">
          <div className="container mx-auto px-4">
            <ul className="mx-auto grid max-w-7xl gap-6 md:grid-cols-2 xl:grid-cols-4">
              {options.map((o, i) => (
                <motion.li
                  key={o.name}
                  {...rise(i)}
                  className={`relative flex flex-col rounded-3xl border bg-white p-7 ${o.highlight ? 'border-blue-700 shadow-xl shadow-blue-900/10 ring-2 ring-blue-700' : 'border-slate-200 shadow-sm'}`}
                >
                  {o.tag && <span className="absolute -top-3 left-7 rounded-full bg-blue-700 px-3 py-1 text-xs font-extrabold uppercase tracking-wider text-white">{o.tag}</span>}
                  <span className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-700"><o.icon className="h-5 w-5" aria-hidden="true" /></span>
                  <h2 className="text-xl font-bold text-slate-900">{o.name}</h2>
                  <p className="mt-3 flex flex-wrap items-baseline gap-x-1.5">
                    <span className="text-4xl font-black tracking-tight text-slate-900 tabular-nums">{o.price}</span>
                    <span className="text-sm font-semibold text-slate-600">{o.unit}</span>
                  </p>
                  <p className="mt-1 text-sm font-semibold text-blue-800">{o.plus}</p>
                  <ul className="mt-6 flex-1 space-y-2.5">
                    {o.points.map((p) => (
                      <li key={p} className="flex gap-2.5 text-sm text-slate-700"><Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" aria-hidden="true" />{p}</li>
                    ))}
                  </ul>
                  {o.cta[1].startsWith('http') ? (
                    <a href={o.cta[1]} target="_blank" rel="noopener noreferrer" className="mt-7 inline-flex h-12 items-center justify-center gap-2 rounded-full border-2 border-slate-300 font-bold text-slate-900 transition-colors hover:border-blue-700 hover:text-blue-800">
                      {o.cta[0]} <ExternalLink className="h-4 w-4" aria-hidden="true" />
                    </a>
                  ) : o.cta[1].startsWith('/templates') ? (
                    <a href={o.cta[1]} className={`mt-7 inline-flex h-12 items-center justify-center gap-2 rounded-full font-bold transition-colors ${o.highlight ? 'bg-blue-700 text-white hover:bg-blue-800' : 'border-2 border-slate-300 text-slate-900 hover:border-blue-700 hover:text-blue-800'}`}>
                      {o.cta[0]} <ArrowRight className="h-4 w-4" aria-hidden="true" />
                    </a>
                  ) : (
                    <Link to={o.cta[1]} className="mt-7 inline-flex h-12 items-center justify-center gap-2 rounded-full border-2 border-slate-300 font-bold text-slate-900 transition-colors hover:border-blue-700 hover:text-blue-800">
                      {o.cta[0]} <ArrowRight className="h-4 w-4" aria-hidden="true" />
                    </Link>
                  )}
                </motion.li>
              ))}
            </ul>
            <p className="mx-auto mt-8 max-w-3xl text-center text-sm text-slate-600">Prices in Canadian dollars. Taxes extra where they apply. Every site includes a free yourshop.bizsite.ca address; your own domain is optional and registered in your name. You see your website before you pay for it.</p>
          </div>
        </section>

        <TotalCalculator />

        {/* OMIS plans in full */}
        <section id="omis-plans" className="scroll-mt-24 border-b border-slate-200 py-20">
          <div className="container mx-auto px-4">
            <motion.div {...rise()} className="mx-auto mb-10 max-w-3xl text-center">
              <h2 className="mb-4 text-3xl font-bold text-slate-900 md:text-4xl">OMIS plans</h2>
              <p className="text-lg text-slate-700">Every plan includes online booking, reminders, deposits and client files. Plans differ by how many people use it.</p>
            </motion.div>
            <ul className="mx-auto grid max-w-5xl gap-6 md:grid-cols-3">
              {OMIS_PLANS.map((p, i) => (
                <motion.li key={p.id} {...rise(i)} className={`rounded-3xl border p-7 ${p.popular ? 'border-blue-700 ring-2 ring-blue-700' : 'border-slate-200'}`}>
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold text-slate-900">{p.name}</h3>
                    {p.popular && <span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-extrabold uppercase tracking-wider text-blue-800">Most popular</span>}
                  </div>
                  <p className="mt-1 text-sm text-slate-600">{p.users}</p>
                  <p className="mt-4"><span className="text-4xl font-black text-slate-900 tabular-nums">{money(p.monthly)}</span><span className="text-sm font-semibold text-slate-600">/month</span></p>
                  <p className="mt-1 text-sm text-slate-600">or {money(p.annual)}/year</p>
                </motion.li>
              ))}
            </ul>
            <p className="mt-8 text-center">
              <a href="https://www.omis-crm.com/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 font-bold text-blue-700 hover:text-blue-800">
                Compare every OMIS feature <ExternalLink className="h-4 w-4" aria-hidden="true" />
              </a>
            </p>
          </div>
        </section>

        {/* Plain answers: no contract, and the site is theirs */}
        <section className="border-b border-slate-200 bg-slate-50 py-20">
          <div className="container mx-auto max-w-3xl px-4">
            <h2 className="mb-8 text-center text-3xl font-bold text-slate-900 md:text-4xl">No contract. Your site is yours.</h2>
            <dl className="divide-y divide-slate-200 rounded-3xl border border-slate-200 bg-white">
              {[
                ['Is there a contract?', 'No. The website setup is paid once, when you publish. OMIS and website care are month to month (or yearly, if you choose), and you can stop either one any time.'],
                ['What happens to my website if I stop OMIS?', `Your choice. Keep it online with us for ${money(WEBSITE.careMonthly)}/month, which covers hosting and up to 3 updates a month, or take it with you: we hand over your site's files and you host it wherever you like. Either way, the Book button changes to call your phone.`],
                ['Who owns the website?', 'You do. Your name, your photos, your words. If you ever want to leave, we hand it over.'],
                ['When do I pay for the website?', 'After you have seen it. You get a preview of your own site, ask for changes, and pay when you press Publish.'],
                ['Do I get a web address?', 'Yes. Every site goes live at a free address like yourshop.bizsite.ca, ready the moment you publish. Want your own domain, like yourshop.ca? Register it in your own name (usually $15 to $30 a year) and we connect it. We never touch your email settings.'],
                ['Can I get a refund?', `Yes, in full, if you ask before your site goes live. Once it is live, the setup fee is not refundable. Website care can be stopped any time and ends at the close of the period you have paid for.`],
              ].map(([q, a]) => (
                <div key={q} className="p-6">
                  <dt className="font-bold text-slate-900">{q}</dt>
                  <dd className="mt-2 text-slate-700">{a}</dd>
                </div>
              ))}
            </dl>
            <p className="mt-6 text-center text-sm text-slate-600">The full details are in section 5 of our <Link className="font-bold text-blue-700 underline" to="/terms-of-service">Terms of Service</Link>.</p>
          </div>
        </section>

        {/* Consulting */}
        <section className="py-16">
          <div className="container mx-auto flex max-w-5xl flex-col items-start gap-6 rounded-3xl border border-slate-200 bg-slate-50 p-8 px-4 sm:flex-row sm:items-center sm:px-8">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-700 text-white"><BarChart2 className="h-6 w-6" aria-hidden="true" /></span>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-slate-900">Data and analytics consulting</h2>
              <p className="mt-1 text-slate-700">Power BI dashboards, data cleanup and automated reporting are quoted per project, after a free call.</p>
            </div>
            <Link to="/book-demo" className="inline-flex h-12 shrink-0 items-center gap-2 rounded-full bg-slate-900 px-6 font-bold text-white hover:bg-slate-800">
              Book a call <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </section>
      </div>
    </>
  );
};

// "What would I pay?" - website yes/no, OMIS plan or none, monthly or yearly.
function TotalCalculator() {
  const [site, setSite] = useState(true);
  const [plan, setPlan] = useState('starter');
  const [yearly, setYearly] = useState(false);

  const p = OMIS_PLANS.find((x) => x.id === plan);
  const setup = site ? (p ? WEBSITE.setupWithOmis : WEBSITE.setupAlone) : 0;
  const care = site && !p ? WEBSITE.careMonthly : 0;
  const omisYear = p ? (yearly ? p.annual : p.monthly * 12) : 0;
  const firstYear = setup + omisYear + care * 12;
  const perMonth = p ? (yearly ? null : p.monthly) : care;
  const nothing = !site && !p;

  const chip = (on) => `min-h-[44px] rounded-full px-4 text-sm font-bold transition-colors ${on ? 'bg-slate-900 text-white' : 'border border-slate-300 text-slate-800 hover:border-slate-500'}`;

  return (
    <section className="border-b border-slate-200 py-20">
      <div className="container mx-auto grid max-w-5xl gap-10 px-4 md:grid-cols-[1.1fr_1fr] md:items-center">
        <div>
          <h2 className="mb-6 text-3xl font-bold text-slate-900 md:text-4xl">What would you pay?</h2>
          <fieldset className="mb-5">
            <legend className="mb-2 text-sm font-bold text-slate-700">Website</legend>
            <div className="flex flex-wrap gap-2">
              <button type="button" aria-pressed={site} onClick={() => setSite(true)} className={chip(site)}>Yes, a website</button>
              <button type="button" aria-pressed={!site} onClick={() => setSite(false)} className={chip(!site)}>No website</button>
            </div>
          </fieldset>
          <fieldset className="mb-5">
            <legend className="mb-2 text-sm font-bold text-slate-700">OMIS</legend>
            <div className="flex flex-wrap gap-2">
              {OMIS_PLANS.map((x) => (
                <button key={x.id} type="button" aria-pressed={plan === x.id} onClick={() => setPlan(x.id)} className={chip(plan === x.id)}>{x.name}</button>
              ))}
              <button type="button" aria-pressed={plan === 'none'} onClick={() => setPlan('none')} className={chip(plan === 'none')}>No OMIS</button>
            </div>
          </fieldset>
          {p && (
            <fieldset>
              <legend className="mb-2 text-sm font-bold text-slate-700">Pay OMIS</legend>
              <div className="flex flex-wrap gap-2">
                <button type="button" aria-pressed={!yearly} onClick={() => setYearly(false)} className={chip(!yearly)}>Monthly</button>
                <button type="button" aria-pressed={yearly} onClick={() => setYearly(true)} className={chip(yearly)}>Yearly</button>
              </div>
            </fieldset>
          )}
        </div>

        <div className="rounded-3xl bg-slate-950 p-8 text-white shadow-2xl" aria-live="polite">
          {nothing ? (
            <p className="text-lg text-slate-300">Pick a website, an OMIS plan, or both.</p>
          ) : (
            <>
              <p className="text-sm font-bold uppercase tracking-wider text-teal-200">Your first year</p>
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.p key={firstYear} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.25 }} className="mt-1 text-5xl font-black tabular-nums">
                  {money(firstYear)}
                </motion.p>
              </AnimatePresence>
              <dl className="mt-6 space-y-2 text-sm">
                {site && <div className="flex justify-between gap-4"><dt className="text-slate-300">Website setup, once</dt><dd className="font-bold tabular-nums">{money(setup)}</dd></div>}
                {p && <div className="flex justify-between gap-4"><dt className="text-slate-300">OMIS {p.name}, {yearly ? 'yearly' : '12 months'}</dt><dd className="font-bold tabular-nums">{money(omisYear)}</dd></div>}
                {care > 0 && <div className="flex justify-between gap-4"><dt className="text-slate-300">Hosting and care, 12 months</dt><dd className="font-bold tabular-nums">{money(care * 12)}</dd></div>}
              </dl>
              <p className="mt-6 border-t border-white/15 pt-4 text-sm text-slate-300">
                {perMonth ? <>After that: <span className="font-bold text-white">{money(perMonth)}/month</span>.</> : p ? <>After that: <span className="font-bold text-white">{money(p.annual)}/year</span>.</> : null}
                {site && p && ' Website hosting is included while you are on OMIS.'}
                {p && ' OMIS starts with 14 days free.'}
              </p>
            </>
          )}
        </div>
      </div>
    </section>
  );
}

export default PricingPage;
