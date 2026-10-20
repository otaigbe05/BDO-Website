// /site/manage/:token : "Manage my plan or leave" (docs/SPEC-cancel.md in omis-sites). Shows the
// plan, opens Stripe's billing page for card and invoices, and lets the customer leave and take
// their website: anything owed is shown and paid first, the plan stops at the end of the paid
// period, and the website ZIP is emailed that day. They can keep the plan until then.
import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { Shell, Notice, Problems, api } from './ui';

const day = (iso) => (iso ? new Date(iso).toLocaleDateString('en-CA', { year: 'numeric', month: 'long', day: 'numeric' }) : '');
const btn = 'inline-flex items-center justify-center min-h-[48px] px-6 rounded-xl font-bold disabled:opacity-60';

export default function SiteManage() {
  const { token } = useParams();
  const [params] = useSearchParams();
  const [info, setInfo] = useState(null);
  const [leaving, setLeaving] = useState(false);
  const [busy, setBusy] = useState(null);
  const [problems, setProblems] = useState([]);

  const load = () => api(`/api/site-manage?t=${encodeURIComponent(token)}`).then((r) => setInfo(r.ok ? r : { error: r.error ?? 'This link is not valid.' }));
  useEffect(() => { load(); }, [token]);

  async function act(action) {
    setBusy(action);
    setProblems([]);
    const r = await api('/api/site-manage', { method: 'POST', body: JSON.stringify({ t: token, action }) });
    if (r.url) return window.location.assign(r.url);
    setBusy(null);
    if (!r.ok) return setProblems([r.error ?? 'Something went wrong.']);
    setLeaving(false);
    load();
  }

  if (!info) return <Shell title="Your plan"><p className="text-slate-600">Loading...</p></Shell>;
  if (info.error) return <Shell title="Your plan"><Notice title="Not available"><p>{info.error}</p></Notice></Shell>;
  const title = `${info.business} website`;
  if (info.state === 'left') return <Shell title={title}><Notice title="Your plan has ended"><p>We emailed you your website. Questions? Reply to that email.</p></Notice></Shell>;
  if (info.state === 'not-live') return <Shell title={title}><Notice title="Nothing to manage yet"><p>Your plan starts when your site goes live.</p></Notice></Shell>;
  if (info.state === 'no-payments') return <Shell title={title}><Notice title="Your plan"><p>To change or stop your plan, reply to any of our emails.</p></Notice></Shell>;

  const stopsNow = !info.periodEnd;
  return (
    <Shell title={title}>
      <div className="space-y-6">
        {params.get('paid') && <Notice title="Payment received"><p>Thank you. Your website files are on their way by email.</p></Notice>}
        <section className="rounded-2xl border border-slate-300 bg-white p-5 space-y-3">
          <h1 className="text-2xl font-bold text-slate-900">{title}</h1>
          {info.kind === 'omis' ? (
            <p className="text-slate-700">Hosting and care are included with your OMIS plan.</p>
          ) : (
            <p className="text-slate-700">Website care{info.price ? `: ${info.price}` : ''}.</p>
          )}
          {info.state === 'leaving' ? (
            <p className="text-slate-900">Your plan stops on <strong>{day(info.leavingUntil)}</strong>. Your site stays live until then, and that day we email you your website.</p>
          ) : (
            info.periodEnd && <p className="text-slate-700">Next payment: <strong>{day(info.periodEnd)}</strong>.</p>
          )}
          {info.owed.invoices && <p className="rounded-xl bg-amber-50 p-3 text-slate-800">A payment of {info.owed.invoices} did not go through.</p>}
          <div className="flex flex-wrap gap-3 pt-2">
            {info.card && <button type="button" disabled={Boolean(busy)} onClick={() => act('card')} className={`${btn} border-2 border-slate-400 text-slate-900`}>{busy === 'card' ? 'Opening...' : 'Update card or see invoices'}</button>}
            {info.owed.invoices && <button type="button" disabled={Boolean(busy)} onClick={() => act('pay')} className={`${btn} bg-blue-700 text-white`}>Pay {info.owed.invoices}</button>}
            {info.state === 'leaving' && new Date(info.leavingUntil) > new Date() && (
              <button type="button" disabled={Boolean(busy)} onClick={() => act('keep')} className={`${btn} bg-blue-700 text-white`}>{busy === 'keep' ? 'Saving...' : 'Keep my plan'}</button>
            )}
          </div>
          {info.state !== 'leaving' && !leaving && (
            <p><button type="button" onClick={() => setLeaving(true)} className="text-blue-700 underline">Leave and take my website</button></p>
          )}
        </section>

        {leaving && info.state !== 'leaving' && (
          <section className="rounded-2xl border-2 border-slate-300 bg-white p-5 space-y-3" aria-live="polite">
            <h2 className="text-xl font-bold text-slate-900">Leave and take your website</h2>
            <p className="text-slate-700"><strong>When it stops:</strong> {stopsNow ? 'today. Your website is emailed to you within a day.' : `on ${day(info.periodEnd)}, the end of the period you already paid for. Your site stays live until then. Nothing is refunded for the rest of a period.`}</p>
            <p className="text-slate-700"><strong>What you owe:</strong> {info.owed.total ?? 'nothing.'}</p>
            {info.owed.difference && (
              <div className="rounded-xl bg-slate-50 p-3 text-sm text-slate-700">
                <p>{info.owed.difference} is the difference between the two setup prices, because you are leaving before {day(info.owed.termsUntil)}. These are the terms you agreed to when you paid:</p>
                {info.terms && <p className="mt-2 italic">{info.terms}</p>}
              </div>
            )}
            <p className="text-slate-700"><strong>What you get, by email:</strong> your website as a ZIP file, ready to put online anywhere, with a short guide; your photos and your words; and, if we bought your domain, the code to move it.</p>
            <p className="text-sm text-slate-600">After that, your address shows a short "this site has moved" page for {info.keepDays} days, then your files are deleted.</p>
            <div className="flex flex-wrap gap-3">
              {info.owed.total ? (
                <button type="button" disabled={Boolean(busy)} onClick={() => act('pay')} className={`${btn} bg-blue-700 text-white`}>{busy === 'pay' ? 'Opening Stripe...' : `Pay ${info.owed.total}${info.owed.difference && !info.owed.invoices ? ' and stop my plan' : ''}`}</button>
              ) : (
                <button type="button" disabled={Boolean(busy)} onClick={() => act('leave')} className={`${btn} bg-slate-900 text-white`}>{busy === 'leave' ? 'Stopping...' : 'Stop my plan'}</button>
              )}
              <button type="button" onClick={() => setLeaving(false)} className={`${btn} text-slate-700 underline`}>Not now</button>
            </div>
          </section>
        )}
        <Problems list={problems} />
      </div>
    </Shell>
  );
}
