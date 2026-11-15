import React, { useId, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Mail, Loader2 } from 'lucide-react';
import { NEWSLETTER_CONSENT, NEWSLETTER_SENDER } from '@/data/newsletter';

// The newsletter sign-up box (end of every blog post, the blog page and the home page).
// CASL: an unticked consent box with the exact wording that is stored, the sender's name and
// address, and a confirm email before anyone is added (api/newsletter.js).
const NewsletterSignup = ({ dark = false }) => {
  const id = useId();
  const { pathname } = useLocation();
  const [email, setEmail] = useState('');
  const [consent, setConsent] = useState(false);
  const [company, setCompany] = useState('');
  const [state, setState] = useState({ busy: false, done: false, error: '' });

  async function submit(e) {
    e.preventDefault();
    setState({ busy: true, done: false, error: '' });
    try {
      const res = await fetch('/api/newsletter', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'subscribe', email, consent, page: pathname, company }) });
      const body = await res.json().catch(() => ({}));
      if (res.ok && body.ok !== false) setState({ busy: false, done: true, error: '' });
      else setState({ busy: false, done: false, error: body.error ?? 'Something went wrong. Please try again in a few minutes.' });
    } catch {
      setState({ busy: false, done: false, error: 'Could not reach our server. Check your connection and try again.' });
    }
  }

  const tone = dark ? 'bg-slate-900 text-white border-slate-800' : 'bg-blue-50 text-slate-900 border-blue-100';
  const sub = dark ? 'text-slate-300' : 'text-slate-700';
  return (
    <section className={`rounded-2xl border p-6 md:p-8 ${tone}`} aria-labelledby={`${id}-h`}>
      <div className="flex items-start gap-3">
        <Mail className={`mt-1 h-6 w-6 shrink-0 ${dark ? 'text-blue-300' : 'text-blue-700'}`} aria-hidden="true" />
        <div className="min-w-0 flex-1">
          <h2 id={`${id}-h`} className={`text-xl font-extrabold ${dark ? 'text-white' : 'text-slate-900'}`}>One useful email a month</h2>
          <p className={`mt-1 ${sub}`}>New guides for barbers, tattoo studios, auto shops, spas, salons and trainers: getting found, filling your book, and websites that work. No spam, unsubscribe any time.</p>
          {state.done ? (
            <p role="status" className={`mt-4 rounded-xl p-4 font-semibold ${dark ? 'bg-white/10' : 'bg-white'}`}>Almost done: check your inbox and press the button in our email to confirm. (Not there in a few minutes? Check Promotions or Spam.)</p>
          ) : (
            <form onSubmit={submit} className="mt-4 space-y-3" noValidate>
              <div className="flex flex-col gap-2 sm:flex-row">
                <label htmlFor={`${id}-email`} className="sr-only">Your email address</label>
                <input id={`${id}-email`} type="email" required autoComplete="email" placeholder="you@yourshop.ca" value={email} onChange={(e) => setEmail(e.target.value)}
                  className="min-h-[48px] flex-1 rounded-xl border border-slate-300 bg-white px-4 text-slate-900 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600" />
                <button type="submit" disabled={state.busy || !consent || !email} className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-xl bg-blue-700 px-6 font-bold text-white hover:bg-blue-800 disabled:opacity-60">
                  {state.busy && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}Sign up
                </button>
              </div>
              {/* Hidden from people; bots fill it in. */}
              <div aria-hidden="true" className="absolute left-[-9999px] h-px w-px overflow-hidden">
                <label htmlFor={`${id}-company`}>Company</label>
                <input id={`${id}-company`} tabIndex={-1} autoComplete="off" value={company} onChange={(e) => setCompany(e.target.value)} />
              </div>
              <label className={`flex items-start gap-3 text-sm ${sub}`}>
                <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} className="mt-1 h-4 w-4 shrink-0" />
                <span>{NEWSLETTER_CONSENT}</span>
              </label>
              {state.error && <p role="alert" className={`text-sm font-semibold ${dark ? 'text-red-300' : 'text-red-700'}`}>{state.error}</p>}
              <p className={`text-xs ${dark ? 'text-slate-400' : 'text-slate-500'}`}>From {NEWSLETTER_SENDER.name}, {NEWSLETTER_SENDER.address}. We send a confirmation email first, and keep your email only for this newsletter.</p>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};

export default NewsletterSignup;
