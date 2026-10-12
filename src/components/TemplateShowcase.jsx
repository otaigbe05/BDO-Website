import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { ArrowRight, Pause, Play, MousePointerClick, ClipboardList, Eye } from 'lucide-react';
import { useCatalog } from '@/lib/useCatalog';

// Home page: the website templates (served by the omis-sites gallery behind /templates).
// Everything shown comes from /templates/catalog.json, so counts and names are always real.
// Motion: two strips of screenshots drifting in opposite directions (CSS, pausable, still with
// reduced motion), trade filters that rearrange the grid, and a three-step "how it works".

const TRADES = [
  { id: 'T', label: 'Tattoo & piercing' },
  { id: 'B', label: 'Barbershops' },
  { id: 'A', label: 'Auto repair' },
  { id: 'S', label: 'Spas & salons' },
  { id: 'P', label: 'Personal training' },
];

const STEPS = [
  { icon: MousePointerClick, title: 'Pick a design', text: 'Choose the one that fits your shop and its colours.' },
  { icon: ClipboardList, title: 'Tell us about your business', text: 'Hours, prices, photos, your team. One form, on your phone.' },
  { icon: Eye, title: 'See your preview', text: 'Your own site, usually within the hour. Ask for changes, then publish.' },
];

/** Spread the strips across trades: T, B, A, S, P, T, B, ... */
function interleave(list) {
  const by = TRADES.map((t) => list.filter((x) => x.vertical === t.id && x.thumb));
  const out = [];
  for (let i = 0; by.some((g) => g[i]); i++) for (const g of by) if (g[i]) out.push(g[i]);
  return out;
}

function StripCard({ t, hidden }) {
  return (
    <li className="w-64 shrink-0 sm:w-72">
      <a
        href={`/templates/${t.path}`}
        tabIndex={hidden ? -1 : undefined}
        className="group block overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-700"
      >
        <img src={t.thumb} alt={hidden ? '' : `${t.name} website template for ${t.verticalName.toLowerCase()}`} loading="lazy" decoding="async" width="640" height="400" className="aspect-[16/10] w-full object-cover object-top" />
        <span className="flex items-center justify-between gap-2 px-3 py-2 text-sm">
          <span className="font-bold text-slate-900">{t.name}</span>
          <span className="text-slate-600">{t.verticalName}</span>
        </span>
      </a>
    </li>
  );
}

function Strip({ items, direction, paused }) {
  if (!items.length) return null;
  return (
    <div className={`template-strip ${paused ? 'is-paused' : ''}`}>
      <div className={`template-strip__track template-strip__track--${direction} flex w-max`}>
        <ul className="template-strip__row flex gap-5 pr-5">
          {items.map((t) => <StripCard key={t.id} t={t} />)}
        </ul>
        <ul className="template-strip__row template-strip__copy flex gap-5 pr-5" aria-hidden="true">
          {items.map((t) => <StripCard key={t.id} t={t} hidden />)}
        </ul>
      </div>
    </div>
  );
}

export default function TemplateShowcase() {
  const { status, templates } = useCatalog();
  const reduce = useReducedMotion();
  const [paused, setPaused] = useState(false);
  const [trade, setTrade] = useState('T');

  const mixed = useMemo(() => interleave(templates), [templates]);
  const half = Math.ceil(mixed.length / 2);
  const rowA = mixed.slice(0, Math.min(half, 14));
  const rowB = mixed.slice(half, half + 14);
  const counts = useMemo(() => Object.fromEntries(TRADES.map((t) => [t.id, templates.filter((x) => x.vertical === t.id).length])), [templates]);
  // Newest designs first (the higher numbers are the newest, with motion).
  const picked = templates.filter((x) => x.vertical === trade).sort((a, b) => b.id.localeCompare(a.id)).slice(0, 6);
  const total = templates.length;

  return (
    <section id="templates" aria-labelledby="templates-heading" className="relative scroll-mt-24 overflow-hidden border-b border-slate-200 bg-gradient-to-b from-white via-slate-50 to-white py-24">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="mx-auto mb-12 max-w-3xl text-center"
        >
          <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-1.5 text-sm font-bold text-emerald-800">
            <span className="relative flex h-2 w-2" aria-hidden="true">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-60 motion-reduce:hidden" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-600" />
            </span>
            New: websites for your business
          </span>
          <h2 id="templates-heading" className="mb-5 text-4xl font-bold text-slate-900 md:text-5xl text-balance">
            A website made for your trade, ready to preview today.
          </h2>
          <p className="text-xl font-medium leading-relaxed text-slate-700">
            {total > 0 ? `${total} designs` : 'Designs'} for tattoo studios, barbershops, auto shops, spas and salons, and personal trainers. Pick one, tell us about your business, and see your own site. Nothing goes live until you say so.
          </p>
        </motion.div>
      </div>

      {status === 'ready' && rowA.length > 0 && (
        <div className="relative mb-16">
          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-12 bg-gradient-to-r from-slate-50 to-transparent sm:w-24" />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-12 bg-gradient-to-l from-slate-50 to-transparent sm:w-24" />
          <div className="space-y-5">
            <Strip items={rowA} direction="left" paused={paused} />
            <Strip items={rowB} direction="right" paused={paused} />
          </div>
          {!reduce && (
            <div className="container mx-auto mt-4 flex justify-end px-4">
              <button
                type="button"
                onClick={() => setPaused((p) => !p)}
                aria-pressed={paused}
                className="inline-flex min-h-11 items-center gap-2 rounded-full border border-slate-300 bg-white px-4 text-sm font-bold text-slate-800 hover:border-blue-400 hover:text-blue-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-700"
              >
                {paused ? <Play className="h-4 w-4" aria-hidden="true" /> : <Pause className="h-4 w-4" aria-hidden="true" />}
                {paused ? 'Play' : 'Pause'} the designs
              </button>
            </div>
          )}
        </div>
      )}

      <div className="container mx-auto px-4">
        {status === 'ready' && total > 0 && (
          <div className="mx-auto mb-16 max-w-6xl">
            <div role="tablist" aria-label="Choose your trade" className="mb-8 flex flex-wrap justify-center gap-2">
              {TRADES.map((t) => {
                const on = t.id === trade;
                return (
                  <button
                    key={t.id}
                    type="button"
                    role="tab"
                    aria-selected={on}
                    aria-controls="templates-grid"
                    onClick={() => setTrade(t.id)}
                    className={`relative min-h-11 rounded-full px-5 text-sm font-bold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700 ${on ? 'text-white' : 'text-slate-800 hover:text-blue-800'}`}
                  >
                    {on && <motion.span layoutId="trade-pill" className="absolute inset-0 rounded-full bg-blue-700" transition={{ type: 'spring', stiffness: 420, damping: 34 }} />}
                    <span className="relative">
                      {t.label} <span className={on ? 'text-blue-100' : 'text-slate-500'}>{counts[t.id]}</span>
                    </span>
                  </button>
                );
              })}
            </div>

            <motion.ul id="templates-grid" role="tabpanel" layout className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <AnimatePresence mode="popLayout" initial={false}>
                {picked.map((t, i) => (
                  <motion.li
                    key={t.id}
                    layout
                    initial={{ opacity: 0, y: 16, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1, transition: { delay: i * 0.05, duration: 0.35 } }}
                    exit={{ opacity: 0, scale: 0.97, transition: { duration: 0.15 } }}
                  >
                    <a
                      href={`/templates/${t.path}`}
                      className="group flex h-full flex-col overflow-hidden rounded-3xl border border-slate-300 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-blue-400 hover:shadow-2xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-700"
                    >
                      <span className="relative block overflow-hidden">
                        {t.thumb ? (
                          <img src={t.thumb} alt="" loading="lazy" decoding="async" width="640" height="400" className="aspect-[16/10] w-full object-cover object-top transition-transform duration-500 group-hover:scale-[1.04]" />
                        ) : (
                          <span className="block aspect-[16/10] w-full bg-slate-100" />
                        )}
                      </span>
                      <span className="flex flex-1 flex-col gap-2 p-5">
                        <span className="flex items-center justify-between gap-3">
                          <span className="text-lg font-bold text-slate-900">{t.name}</span>
                          <span className="flex gap-1" aria-label={`${t.palettes.length} colour choices`}>
                            {t.palettes.map((p) => (
                              <span key={p.name} title={p.name} className="h-4 w-4 rounded-full border border-slate-300" style={{ background: p.accent }} />
                            ))}
                          </span>
                        </span>
                        <span className="text-sm font-medium leading-relaxed text-slate-700">{t.summary}</span>
                        <span className="mt-auto inline-flex items-center pt-2 text-sm font-bold text-blue-700">
                          See this design <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                        </span>
                      </span>
                    </a>
                  </motion.li>
                ))}
              </AnimatePresence>
            </motion.ul>
          </div>
        )}

        <ol className="relative mx-auto mb-12 grid max-w-5xl gap-6 md:grid-cols-3">
          <motion.span
            aria-hidden="true"
            className="absolute left-[16%] right-[16%] top-8 hidden h-0.5 origin-left bg-gradient-to-r from-blue-200 via-blue-400 to-emerald-300 md:block"
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.9, ease: 'easeInOut' }}
          />
          {STEPS.map((st, i) => (
            <motion.li
              key={st.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ delay: 0.2 + i * 0.15, duration: 0.45 }}
              className="relative flex flex-col items-center text-center"
            >
              <span className="relative z-10 mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-blue-200 bg-white text-blue-700 shadow-md">
                <st.icon className="h-7 w-7" aria-hidden="true" />
              </span>
              <span className="text-xs font-extrabold uppercase tracking-widest text-slate-500">Step {i + 1}</span>
              <h3 className="mt-1 text-xl font-bold text-slate-900">{st.title}</h3>
              <p className="mt-2 max-w-xs font-medium text-slate-700">{st.text}</p>
            </motion.li>
          ))}
        </ol>

        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          <a
            href="/templates/"
            className="inline-flex h-14 items-center rounded-full bg-blue-700 px-8 text-lg font-bold text-white shadow-lg shadow-blue-700/25 transition-transform hover:scale-105 hover:bg-blue-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
          >
            Browse {total > 0 ? `all ${total}` : 'the'} designs <ArrowRight className="ml-2 h-5 w-5" aria-hidden="true" />
          </a>
          <span className="text-sm font-medium text-slate-600">Add OMIS bookings to any design, or get the website on its own.</span>
        </div>
      </div>
    </section>
  );
}
