// /site/care/:token : after an OMIS plan ends, the customer picks what happens to their website.
// Keep it online (website care through Stripe Checkout) or take it with them (we send the files).
import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { Shell, Notice, Problems, api } from './ui';
import { WEBSITE, money } from '@/data/pricing';

const DONE = {
  care: 'Thank you. Your website stays online. To stop website care at any time, reply to any of our emails.',
  handover: 'Thank you. We will email you your site files within two business days, with simple steps to put them online wherever you like.',
  handoverPaid: 'Payment received, thank you. We will email you your site files within two business days, with simple steps to put them online wherever you like.',
};

export default function SiteCare() {
  const { token } = useParams();
  const [params] = useSearchParams();
  const [busy, setBusy] = useState(null);
  const [problems, setProblems] = useState([]);
  const [state, setState] = useState(params.get('paid') ? 'care' : params.get('handover') ? 'handoverPaid' : null);
  // Prices from Stripe, and whether taking the files costs the difference (OMIS ended early).
  const [info, setInfo] = useState(null);
  useEffect(() => {
    api(`/api/site-checkout?t=${encodeURIComponent(token)}&care=1`).then((r) => setInfo(r.ok ? r : {}));
  }, [token]);
  const monthly = info?.care?.monthly ?? money(WEBSITE.careMonthly);
  const yearly = info?.care?.yearly ?? money(WEBSITE.careYearly);
  const handoverPrice = info?.handover?.price;

  async function choose(purpose, interval) {
    setBusy(purpose + (interval ?? ''));
    setProblems([]);
    const r = await api('/api/site-checkout', { method: 'POST', body: JSON.stringify({ t: token, purpose, interval }) });
    if (r.url) return window.location.assign(r.url);
    setBusy(null);
    if (r.ok) setState(r.state);
    else setProblems([r.error ?? 'Something went wrong.']);
  }

  if (state) return <Shell title="Your website"><Notice title="All set"><p>{DONE[state]}</p></Notice></Shell>;

  const btn = 'w-full rounded-2xl border-2 p-5 text-left transition-colors disabled:opacity-60';
  return (
    <Shell title="Your website">
      <div className="space-y-6">
        <Notice title="Your website is yours">
          <p>Your OMIS plan has ended, and your website is still online. Choose what happens next. There is no contract either way.</p>
        </Notice>
        <div className="grid gap-4 sm:grid-cols-2">
          <button type="button" disabled={Boolean(busy)} onClick={() => choose('care', 'month')} className={`${btn} border-blue-700 hover:bg-blue-50`}>
            <span className="block text-lg font-extrabold text-slate-900">Keep it online</span>
            <span className="block text-slate-700">{monthly}/month for hosting, the security certificate and up to 3 updates a month. Stop any time.</span>
            {busy === 'caremonth' && <span className="mt-2 block text-sm text-slate-600">Opening Stripe...</span>}
          </button>
          <button type="button" disabled={Boolean(busy)} onClick={() => choose('handover')} className={`${btn} border-slate-300 hover:border-slate-500`}>
            <span className="block text-lg font-extrabold text-slate-900">Take it with me</span>
            <span className="block text-slate-700">
              {handoverPrice
                ? `We send you your site files to put online wherever you like, after you pay ${handoverPrice}: the difference between the two setup prices, as agreed because OMIS ended before ${info.handover.until}.`
                : 'We send you your site files to put online wherever you like. Free.'}
            </span>
            {busy === 'handover' && handoverPrice && <span className="mt-2 block text-sm text-slate-600">Opening Stripe...</span>}
          </button>
        </div>
        <p className="text-sm text-slate-600">
          Prefer to pay yearly ({yearly}/year)?{' '}
          <button type="button" disabled={Boolean(busy)} onClick={() => choose('care', 'year')} className="font-bold text-blue-700 underline">Keep it online, paid yearly</button>.
          Want OMIS back instead? Restart it from your OMIS account and hosting is included again.
        </p>
        <Problems list={problems} />
      </div>
    </Shell>
  );
}
