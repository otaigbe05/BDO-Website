import React from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { BellRing, CalendarCheck, Lock } from 'lucide-react';
import { useCatalog, forTrade } from '@/lib/useCatalog';

// "Your shop, both halves": the trade's newest real template in a browser frame, and the
// OMIS day beside it on a phone. Changing trade swaps both. The bookings are samples and
// say so. Every animation runs once per change; nothing loops.
const ShopPreview = ({ trade, dark = true }) => {
  const reduce = useReducedMotion();
  const { templates } = useCatalog();
  const tpl = forTrade(templates, trade.code)[0];
  const ease = [0.22, 1, 0.36, 1];

  return (
    <div className="relative mx-auto w-full max-w-xl pb-10 sm:pb-0 sm:pr-16 lg:pr-20">
      {/* Browser: their website */}
      <div className={`overflow-hidden rounded-2xl border shadow-2xl ${dark ? 'border-white/15 bg-slate-900 shadow-black/40' : 'border-slate-200 bg-white shadow-slate-300/60'}`}>
        <div className={`flex items-center gap-2 px-3 py-2.5 ${dark ? 'bg-slate-800' : 'bg-slate-100'}`}>
          <span className="flex gap-1.5" aria-hidden="true">
            <span className="h-2.5 w-2.5 rounded-full bg-rose-400" />
            <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
          </span>
          <span className={`ml-2 flex min-w-0 flex-1 items-center gap-1.5 truncate rounded-md px-2.5 py-1 text-xs ${dark ? 'bg-slate-900 text-slate-300' : 'bg-white text-slate-600'}`}>
            <Lock className="h-3 w-3 shrink-0" aria-hidden="true" />
            yourshop.ca
          </span>
        </div>
        <div className="relative aspect-[16/10] bg-slate-800">
          <AnimatePresence mode="popLayout" initial={false}>
            {tpl && (
              <motion.img
                key={tpl.id}
                src={tpl.thumb}
                alt={`${tpl.name}, a website design for ${trade.plural}`}
                width="640"
                height="400"
                initial={reduce ? false : { opacity: 0, scale: 1.04 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6, ease }}
                className="absolute inset-0 h-full w-full object-cover object-top"
              />
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Phone: the OMIS day */}
      <motion.div
        key={`phone-${trade.slug}`}
        initial={reduce ? false : { opacity: 0, y: 24, rotate: 2 }}
        animate={{ opacity: 1, y: 0, rotate: 0 }}
        transition={{ duration: 0.6, ease, delay: 0.1 }}
        className="absolute -bottom-2 right-0 w-56 rounded-[1.75rem] border border-white/20 bg-slate-950 p-2 shadow-2xl shadow-black/50 sm:-bottom-8 sm:w-60"
      >
        <div className="rounded-[1.35rem] bg-white p-3 text-left">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500">OMIS &middot; Today</span>
            <span className="rounded-full bg-slate-100 px-1.5 py-0.5 text-[10px] font-bold text-slate-600">Sample</span>
          </div>
          <ul className="space-y-1.5">
            {trade.day.map(([time, what, who, status], i) => (
              <motion.li
                key={`${trade.slug}-${time}`}
                initial={reduce ? false : { opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, ease, delay: 0.3 + i * 0.12 }}
                className="flex gap-2 rounded-xl bg-slate-50 px-2 py-1.5"
              >
                <span className="w-9 shrink-0 text-xs font-extrabold tabular-nums text-blue-700">{time}</span>
                <span className="min-w-0">
                  <span className="block truncate text-xs font-bold text-slate-900">{what}</span>
                  <span className="block truncate text-[11px] text-slate-600">{who} &middot; <span className="font-semibold text-emerald-700">{status}</span></span>
                </span>
              </motion.li>
            ))}
          </ul>
        </div>
      </motion.div>

      {/* The moment it connects: a booking from the website lands in OMIS */}
      <motion.div
        key={`ping-${trade.slug}`}
        initial={reduce ? false : { opacity: 0, y: -10, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease, delay: reduce ? 0 : 0.9 }}
        className="absolute -top-5 left-4 flex items-center gap-2.5 rounded-2xl border border-emerald-200 bg-white px-3 py-2 shadow-xl sm:left-auto sm:right-6"
      >
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
          {trade.ping[0] === 'New booking' ? <CalendarCheck className="h-4 w-4" aria-hidden="true" /> : <BellRing className="h-4 w-4" aria-hidden="true" />}
        </span>
        <span className="text-left leading-tight">
          <span className="block text-xs font-extrabold text-slate-900">{trade.ping[0]}</span>
          <span className="block text-[11px] text-slate-600">{trade.ping[1]}</span>
        </span>
      </motion.div>
    </div>
  );
};

export default ShopPreview;
