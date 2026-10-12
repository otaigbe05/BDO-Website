import React, { useState } from 'react';
import { Pause, Play } from 'lucide-react';

// A slow strip of plain facts about what we offer. It moves with CSS only, stops on hover and
// keyboard focus, and has a pause button (anything that moves for more than 5 seconds needs
// one). Visitors who ask for less motion get a still, wrapped list instead.
const ITEMS = [
  'Built for Canadian small business',
  'OMIS: live in 5 appointment-based industries',
  'Website templates for 5 trades',
  'Preview your website before it goes live',
  'Power BI consulting',
  'Your data stays yours',
  'Hands-on implementation support',
  'Designed for owners, not data scientists',
];

const TrustTicker = () => {
  const [paused, setPaused] = useState(false);

  const row = (hidden) => (
    <ul className="trust-ticker__row flex shrink-0 items-center gap-12 pr-12" aria-hidden={hidden || undefined}>
      {ITEMS.map((item) => (
        <li key={item} className="flex items-center gap-3 whitespace-nowrap">
          <span className="h-2 w-2 rounded-full bg-blue-300" aria-hidden="true" />
          {item}
        </li>
      ))}
    </ul>
  );

  return (
    <div className={`trust-ticker group relative flex items-center bg-blue-700 text-white border-y border-blue-800 font-sans ${paused ? 'is-paused' : ''}`}>
      <div className="relative flex-1 overflow-hidden py-4 text-sm font-bold uppercase tracking-wider">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-blue-700 to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-blue-700 to-transparent" />
        <div className="trust-ticker__track flex w-max">
          {row(false)}
          {row(true)}
        </div>
      </div>
      <button
        type="button"
        onClick={() => setPaused((p) => !p)}
        aria-pressed={paused}
        aria-label={paused ? 'Play the scrolling list' : 'Pause the scrolling list'}
        className="trust-ticker__toggle mx-2 flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-white hover:bg-blue-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
      >
        {paused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
      </button>
    </div>
  );
};

export default TrustTicker;
