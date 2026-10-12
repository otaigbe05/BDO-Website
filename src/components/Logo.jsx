import React from 'react';

// The BDO mark: a lowercase "b" whose stem is a rising bar (the data side) and whose bowl
// is a clock face with one booked slot filled in (the booking side). The slot sweeps in
// once on load; visitors who ask for less motion see it already filled.
export const LogoMark = ({ className = 'h-9 w-9', animate = false, title }) => (
  <svg viewBox="0 0 48 48" className={className} role={title ? 'img' : undefined} aria-hidden={title ? undefined : true} aria-label={title}>
    <defs>
      <linearGradient id="bdo-mark-bg" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#1D4ED8" />
        <stop offset="1" stopColor="#0F766E" />
      </linearGradient>
    </defs>
    <rect width="48" height="48" rx="12" fill="url(#bdo-mark-bg)" />
    <path d="M11 11.5 A3.5 3.5 0 0 1 18 11.5 V40.5 H11 Z" fill="#FFFFFF" />
    <circle cx="26" cy="29" r="8.5" fill="none" stroke="#FFFFFF" strokeWidth="6" />
    <path className={animate ? 'logo-slot' : undefined} d="M26 29 L26 23.5 A5.5 5.5 0 0 1 31.5 29 Z" fill="#6EE7B7" />
  </svg>
);

const Logo = ({ animate = false }) => (
  <span className="flex items-center gap-2.5">
    <LogoMark animate={animate} />
    <span className="flex flex-col leading-none">
      <span className="text-xl font-black tracking-tight text-slate-900">BDO</span>
      <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-slate-600">Analytics Solutions</span>
    </span>
  </span>
);

export default Logo;
