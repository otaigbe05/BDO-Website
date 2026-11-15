import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useParams } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

// /newsletter/confirm/:token and /newsletter/unsubscribe/:token. A button (not the email link
// itself) does it, so email link scanners cannot confirm or unsubscribe anyone by opening the link.
const COPY = {
  confirm: {
    title: 'Confirm your subscription',
    ask: (e) => `Press the button to confirm that ${e} should get the BDO Analytics Solutions newsletter, one email a month.`,
    button: 'Yes, subscribe me',
    action: 'confirm',
    done: 'You are subscribed. The next issue arrives at the start of the month. Every email has an unsubscribe link at the bottom.',
    already: 'You are already subscribed. Thank you!',
  },
  unsubscribe: {
    title: 'Unsubscribe',
    ask: (e) => `Press the button to stop the BDO Analytics Solutions newsletter going to ${e}.`,
    button: 'Unsubscribe',
    action: 'unsubscribe',
    done: 'You are unsubscribed and will not get the newsletter again. If that was a mistake, you can sign up again on our blog.',
    already: 'This address is already unsubscribed. You will not get the newsletter.',
  },
};

const NewsletterAction = ({ mode }) => {
  const { token } = useParams();
  const c = COPY[mode];
  const [info, setInfo] = useState(null);
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch(`/api/newsletter?t=${encodeURIComponent(token)}`)
      .then((r) => r.json().then((b) => (r.ok ? b : { invalid: true, error: b.error })))
      .catch(() => ({ invalid: true, error: 'Could not reach our server. Check your connection and try again.' }))
      .then(setInfo);
  }, [token]);

  async function act() {
    setBusy(true);
    setError('');
    try {
      const r = await fetch('/api/newsletter', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: c.action, t: token }) });
      const b = await r.json().catch(() => ({}));
      if (r.ok && b.ok !== false) setDone(true);
      else setError(b.error ?? 'Something went wrong. Please try again.');
    } catch {
      setError('Could not reach our server. Check your connection and try again.');
    }
    setBusy(false);
  }

  const already = info && !info.invalid && ((mode === 'confirm' && info.status === 'confirmed') || (mode === 'unsubscribe' && info.status === 'unsubscribed'));
  return (
    <>
      <Helmet>
        <title>{`${c.title} | BDO Analytics Solutions`}</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <div className="min-h-[60vh] bg-slate-50 px-4 py-20 font-sans">
        <div className="mx-auto max-w-xl rounded-2xl border border-slate-200 bg-white p-8 text-center">
          <h1 className="text-2xl font-extrabold text-slate-900 md:text-3xl">{c.title}</h1>
          {!info && <p className="mt-4 text-slate-600">Loading...</p>}
          {info?.invalid && <p className="mt-4 text-slate-700">{info.error ?? 'This link is not valid.'}</p>}
          {info && !info.invalid && (done || already ? (
            <p role="status" className="mt-4 text-slate-700">{done ? c.done : c.already}</p>
          ) : (
            <>
              <p className="mt-4 text-slate-700">{c.ask(info.email)}</p>
              {error && <p role="alert" className="mt-3 font-semibold text-red-700">{error}</p>}
              <button type="button" onClick={act} disabled={busy} className="mt-6 inline-flex min-h-[48px] items-center gap-2 rounded-xl bg-blue-700 px-8 font-bold text-white hover:bg-blue-800 disabled:opacity-60">
                {busy && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}{c.button}
              </button>
            </>
          ))}
          <p className="mt-8 text-sm"><Link to="/blog" className="font-bold text-blue-800 underline">Read the blog</Link></p>
        </div>
      </div>
    </>
  );
};

export default NewsletterAction;
