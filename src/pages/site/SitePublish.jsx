// /site/publish/:token : the customer confirms they are happy. A button (not the email link
// itself) does it, so email link scanners cannot publish by accident. With payments on, the
// button goes to Stripe Checkout first: $199 setup when the customer has an OMIS plan (active or
// in its free trial), otherwise $449 setup plus website care. Stripe's webhook then publishes.
import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import { Shell, Notice, Submit, Problems, Field, Text, api } from './ui';
import { WEBSITE, money } from '@/data/pricing';
import DesignGuide from './DesignGuide';

const MESSAGES = {
  publishing: 'Your site is being published. You will get an email with the link in a few minutes.',
  'waiting-owner': 'Thanks. We do a quick final check before your site goes live. You will get an email with the link, usually the same business day. (Not in your inbox? Check Promotions or Spam.)',
  live: 'Your site is already live.',
  paid: 'Payment received, thank you. We do a quick final check before your site goes live. You will get an email with the link, usually the same business day. (Not in your inbox? Check Promotions or Spam.)',
};

export default function SitePublish() {
  const { token } = useParams();
  const [params] = useSearchParams();
  const [info, setInfo] = useState(null);
  const [pay, setPay] = useState(null);
  const [omisEmail, setOmisEmail] = useState('');
  const [interval, setCycle] = useState('month');
  const [busy, setBusy] = useState(false);
  const [checking, setChecking] = useState(false);
  const [code, setCode] = useState('');
  const [codeSent, setCodeSent] = useState(false);
  const [codeNote, setCodeNote] = useState('');
  const [problems, setProblems] = useState([]);
  const [state, setState] = useState(params.get('paid') ? 'paid' : null);

  useEffect(() => {
    api(`/api/site-changes?t=${encodeURIComponent(token)}`).then((r) => setInfo(r.ok ? r : { invalid: true }));
    api(`/api/site-checkout?t=${encodeURIComponent(token)}`).then((r) => setPay(r.ok ? r : r.unavailable ? { payments: true, unavailable: true, error: r.error } : { payments: false }));
  }, [token]);

  const quoteFor = (email) => api(`/api/site-checkout?t=${encodeURIComponent(token)}&omisEmail=${encodeURIComponent(email)}`);

  // A different OMIS email is confirmed with a code sent to it; their own email needs none.
  async function sendCode() {
    setChecking(true);
    setCodeNote('');
    const q = await quoteFor(omisEmail);
    if (q.ok && !q.needsCode) {
      setChecking(false);
      setPay(q);
      if (!q.omis) setCodeNote('We could not find an OMIS plan for that email.');
      return;
    }
    const r = await api('/api/site-checkout', { method: 'POST', body: JSON.stringify({ t: token, purpose: 'omis-code', omisEmail }) });
    setChecking(false);
    if (r.ok) {
      setCodeSent(true);
      setCodeNote(`If ${omisEmail} has an OMIS plan, we just emailed it a 6-digit code. Enter it below.`);
    } else setCodeNote(r.error ?? 'Something went wrong.');
  }

  async function verifyCode() {
    setChecking(true);
    const r = await api('/api/site-checkout', { method: 'POST', body: JSON.stringify({ t: token, purpose: 'omis-verify', omisEmail, code }) });
    if (!r.ok) {
      setChecking(false);
      return setCodeNote(r.error ?? 'Something went wrong.');
    }
    const q = await quoteFor(omisEmail);
    setChecking(false);
    if (q.ok) setPay(q);
    setCodeNote(q.omis ? '' : 'Confirmed, but that OMIS plan is not active.');
  }

  async function publish(e) {
    e.preventDefault();
    setBusy(true);
    setProblems([]);
    const needsPay = pay?.payments && !pay.paid && pay.package !== 'store';
    const r = needsPay
      ? await api('/api/site-checkout', { method: 'POST', body: JSON.stringify({ t: token, purpose: 'setup', omisEmail: pay.email, interval }) })
      : await api('/api/site-golive', { method: 'POST', body: JSON.stringify({ who: 'customer', t: token }) });
    if (r.url) return window.location.assign(r.url);
    setBusy(false);
    if (r.ok) setState(r.paid ? 'paid' : r.state);
    else if (r.needsPayment) {
      // Payment was switched on after this page loaded: fetch the price and show it.
      const q = await api(`/api/site-checkout?t=${encodeURIComponent(token)}`);
      setPay(q.ok ? q : { payments: true, unavailable: true, error: q.error });
    } else setProblems([r.error ?? 'Something went wrong.']);
  }

  if (!info || !pay) return <Shell title="Publish"><p className="text-slate-600">Loading...</p></Shell>;
  if (info.invalid) return <Shell title="Link not valid"><Notice title="This link is not valid"><p>Check the email we sent you.</p></Notice></Shell>;
  if (state || info.status === 'live') return <Shell title="Publish"><Notice title="Thank you"><p>{MESSAGES[state ?? 'live']}</p></Notice></Shell>;

  const charge = pay.payments && !pay.paid && !pay.unavailable && pay.package !== 'store';

  return (
    <Shell title="Publish your site">
      <form onSubmit={publish} className="space-y-6">
        <Notice title={`Publish the ${info.business} website?`}>
          {info.previewUrl && (
            <p>
              Last look: <a className="text-blue-700 underline" href={info.previewUrl} target="_blank" rel="noreferrer">open your preview</a>.
            </p>
          )}
          <p>
            Want something changed first? <Link className="text-blue-700 underline" to={`/site/intake/${token}`}>Change something</Link>.
          </p>
        </Notice>

        {pay.unavailable && (
          <Notice title="Payment is not available right now">
            <p>Please try again in a little while; we have been told. Your preview is saved, so nothing is lost.</p>
          </Notice>
        )}

        {charge && (
          <section className="rounded-2xl border border-slate-300 bg-white p-5 space-y-4" aria-live="polite">
            {pay.omis ? (
              <>
                <p className="font-bold text-slate-900">We found your OMIS plan ({pay.omis === 'trialing' ? 'free trial' : 'active'}) for {pay.email}.</p>
                <p className="text-slate-700">Website setup: <span className="font-bold">{pay.setup}</span>, paid once. Hosting and care are included while you have OMIS.</p>
              </>
            ) : (
              <>
                <p className="text-slate-700">Website setup: <span className="font-bold">{pay.setup}</span>, paid once, plus website care (hosting, security certificate and up to 3 updates a month):</p>
                <div className="flex flex-wrap gap-3">
                  <label className={`flex items-center gap-2 rounded-xl border px-4 py-3 cursor-pointer ${interval === 'month' ? 'border-blue-700 ring-2 ring-blue-700' : 'border-slate-300'}`}>
                    <input type="radio" name="interval" checked={interval === 'month'} onChange={() => setCycle('month')} />
                    {pay.care.monthly}/month
                  </label>
                  {pay.care.yearly && (
                    <label className={`flex items-center gap-2 rounded-xl border px-4 py-3 cursor-pointer ${interval === 'year' ? 'border-blue-700 ring-2 ring-blue-700' : 'border-slate-300'}`}>
                      <input type="radio" name="interval" checked={interval === 'year'} onChange={() => setCycle('year')} />
                      {pay.care.yearly}/year
                    </label>
                  )}
                </div>
                <p className="text-sm text-slate-600">No contract: stop care any time and take your site with you.</p>
                <div className="rounded-xl bg-slate-50 p-4 space-y-3">
                  <p className="text-sm text-slate-700">
                    With an OMIS plan, setup is {money(WEBSITE.setupWithOmis)} and hosting is included.{' '}
                    <a className="text-blue-700 underline" href="https://www.omis-crm.com/" target="_blank" rel="noreferrer">Start a free OMIS trial</a>, then come back to this page.
                    Already have OMIS under a different email? Check it here:
                  </p>
                  <div className="flex flex-wrap items-end gap-2">
                    <div className="flex-1 min-w-[12rem]">
                      <Field label="Your OMIS email" htmlFor="omis-email">
                        <Text id="omis-email" type="email" value={omisEmail} onChange={(v) => { setOmisEmail(v); setCodeSent(false); setCodeNote(''); }} autoComplete="email" />
                      </Field>
                    </div>
                    <button type="button" onClick={sendCode} disabled={checking || !omisEmail} className="h-11 rounded-xl border border-slate-400 px-4 font-bold text-slate-900 disabled:opacity-50">
                      {checking && !codeSent ? 'Checking...' : codeSent ? 'Send a new code' : 'Check'}
                    </button>
                  </div>
                  {codeSent && (
                    <div className="flex flex-wrap items-end gap-2">
                      <div className="w-40">
                        <Field label="6-digit code" htmlFor="omis-code">
                          <Text id="omis-code" inputMode="numeric" autoComplete="one-time-code" maxLength={6} value={code} onChange={setCode} />
                        </Field>
                      </div>
                      <button type="button" onClick={verifyCode} disabled={checking || code.replace(/\D/g, '').length !== 6} className="h-11 rounded-xl bg-slate-900 px-4 font-bold text-white disabled:opacity-50">
                        {checking ? 'Checking...' : 'Confirm'}
                      </button>
                    </div>
                  )}
                  {codeNote && <p className="text-sm text-slate-700" role="status">{codeNote}</p>}
                </div>
              </>
            )}
            <p className="text-sm text-slate-600">Prices in Canadian dollars, plus HST/GST, which is worked out from your address on the payment page. You pay on Stripe&rsquo;s secure page.</p>
          </section>
        )}

        <DesignGuide token={token} template={info.template} previewUrl={info.previewUrl} have={info.have} />

        <Problems list={problems} />
        <div className="text-center">
          <Submit busy={busy} disabled={busy || pay.unavailable}>{charge ? 'Pay and publish my site' : 'Yes, publish my site'}</Submit>
        </div>
      </form>
    </Shell>
  );
}
