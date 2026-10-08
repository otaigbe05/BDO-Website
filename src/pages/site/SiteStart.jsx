// /site/start?template=T10 : "Use this design". Short form; the long questions come later
// on the private intake page we email them.
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Shell, Card, Field, Text, Submit, Problems, Notice, api, loadCatalog } from './ui';

// Prices are shown only once the owner sets them (null = hidden).
export const PACKAGES = [
  { id: 'site', name: 'Website', price: null, text: 'Your site on this design with your own name, photos, prices, and hours. Booking button calls your phone.' },
  { id: 'site-omis', name: 'Website + online booking (OMIS)', price: null, text: 'The same site, with a Book button that takes appointments and deposits through OMIS.' },
  { id: 'store', name: 'Website + online store', price: null, text: 'Built to order for shops that sell products online. We will contact you to plan it.' },
];

export default function SiteStart() {
  const [params] = useSearchParams();
  const opened = useRef(Date.now());
  const [catalog, setCatalog] = useState([]);
  const [f, setF] = useState({ template: params.get('template') ?? '', palette: 1, package: 'site-omis', name: '', email: '', phone: '', business: '', city: '', hasDomain: false, domain: '', website: '' });
  const [country, setCountry] = useState('CA');
  const [busy, setBusy] = useState(false);
  const [problems, setProblems] = useState([]);
  const [done, setDone] = useState(null);
  const set = (k) => (v) => setF((s) => ({ ...s, [k]: v }));

  useEffect(() => {
    loadCatalog().then(setCatalog);
  }, []);
  const chosen = useMemo(() => catalog.find((t) => t.id === f.template), [catalog, f.template]);
  const byVertical = useMemo(() => {
    const groups = new Map();
    for (const t of catalog) groups.set(t.verticalName, [...(groups.get(t.verticalName) ?? []), t]);
    return [...groups];
  }, [catalog]);

  async function submit(e) {
    e.preventDefault();
    setBusy(true);
    setProblems([]);
    const body = { ...f, phone: f.phone || undefined, city: f.city || undefined, domain: f.hasDomain ? f.domain : undefined, openedMs: Date.now() - opened.current };
    const r = await api('/api/site-lead', { method: 'POST', body: JSON.stringify(body) });
    setBusy(false);
    if (r.ok) setDone(r.store ? 'store' : 'site');
    else setProblems(r.problems ?? [r.error ?? 'Something went wrong.']);
  }

  if (done) {
    return (
      <Shell title="Check your email" noindex={false}>
        <Notice title="Check your email">
          {done === 'store' ? (
            <p>Thanks. Online stores are built to order, so we will email you within one business day to plan yours.</p>
          ) : (
            <>
              <p>
                We sent a link to <strong>{f.email}</strong>. It opens a short form about your business: hours, services and prices, your team, and your photos.
              </p>
              <p>When you send it, we build a preview of your site and email it to you.</p>
            </>
          )}
          <p className="text-sm text-slate-500">Not in your inbox in a few minutes? Check your Promotions or Spam folder for an email from BDO Analytics Websites.</p>
        </Notice>
      </Shell>
    );
  }

  return (
    <Shell title="Start your website" noindex={false}>
      <form onSubmit={submit} className="space-y-6">
        <header className="space-y-2">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900">Start your website</h1>
          <p className="text-lg text-slate-600">Tell us who you are. We email you a short form for the rest, then build a preview from your answers.</p>
        </header>

        <Card title="Your design">
          {chosen ? (
            <div className="space-y-2">
              <p className="font-bold text-slate-900">
                {chosen.id} {chosen.name} <span className="font-normal text-slate-500">({chosen.verticalName})</span>
              </p>
              <p className="text-slate-600">{chosen.summary}</p>
              <a className="text-blue-700 underline" href={`/templates/${chosen.path}`} target="_blank" rel="noreferrer">
                See it again
              </a>
            </div>
          ) : null}
          <Field label="Design" htmlFor="template" required hint={catalog.length ? null : 'Type the template code, for example T10.'}>
            {catalog.length ? (
              <select id="template" className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-white" value={f.template} onChange={(e) => setF((s) => ({ ...s, template: e.target.value, palette: 1 }))} required>
                <option value="">Choose a design</option>
                {byVertical.map(([name, items]) => (
                  <optgroup key={name} label={name}>
                    {items.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.id} {t.name}
                      </option>
                    ))}
                  </optgroup>
                ))}
              </select>
            ) : (
              <Text id="template" value={f.template} onChange={(v) => set('template')(v.toUpperCase())} required pattern="[TBASP][0-9]{2}" />
            )}
          </Field>
          {chosen && (
            <fieldset className="space-y-2">
              <legend className="text-sm font-bold text-slate-900">Colours</legend>
              <div className="grid sm:grid-cols-3 gap-3">
                {chosen.palettes.map((p, i) => (
                  <label key={p.name} className={`flex items-center gap-3 rounded-xl border p-3 cursor-pointer ${f.palette === i + 1 ? 'border-blue-700 ring-2 ring-blue-700' : 'border-slate-300'}`}>
                    <input type="radio" name="palette" className="sr-only" checked={f.palette === i + 1} onChange={() => set('palette')(i + 1)} />
                    <span aria-hidden="true" className="flex shrink-0 rounded-md overflow-hidden border border-slate-300">
                      <span className="w-5 h-8" style={{ background: p.bg }} />
                      <span className="w-5 h-8" style={{ background: p.text }} />
                      <span className="w-5 h-8" style={{ background: p.accent }} />
                    </span>
                    <span className="text-sm text-slate-900">{p.name}</span>
                  </label>
                ))}
              </div>
            </fieldset>
          )}
        </Card>

        <Card title="What you need">
          <div className="space-y-3">
            {PACKAGES.map((p) => (
              <label key={p.id} className={`block rounded-xl border p-4 cursor-pointer ${f.package === p.id ? 'border-blue-700 ring-2 ring-blue-700' : 'border-slate-300'}`}>
                <span className="flex items-start gap-3">
                  <input type="radio" name="package" className="mt-1.5" checked={f.package === p.id} onChange={() => set('package')(p.id)} />
                  <span>
                    <span className="block font-bold text-slate-900">
                      {p.name}
                      {p.price && <span className="font-normal text-slate-600"> {p.price}</span>}
                    </span>
                    <span className="block text-slate-600">{p.text}</span>
                  </span>
                </span>
              </label>
            ))}
          </div>
        </Card>

        <Card title="About you">
          <div className="grid sm:grid-cols-2 gap-5">
            <Field label="Your name" htmlFor="name" required>
              <Text id="name" value={f.name} onChange={set('name')} required autoComplete="name" />
            </Field>
            <Field label="Business name" htmlFor="business" required>
              <Text id="business" value={f.business} onChange={set('business')} required autoComplete="organization" />
            </Field>
            <Field label="Email" htmlFor="email" required>
              <Text id="email" type="email" value={f.email} onChange={set('email')} required autoComplete="email" />
            </Field>
            <Field label="Phone" htmlFor="phone">
              <Text id="phone" type="tel" value={f.phone} onChange={set('phone')} autoComplete="tel" />
            </Field>
            <Field label="City" htmlFor="city">
              <Text id="city" value={f.city} onChange={set('city')} autoComplete="address-level2" />
            </Field>
            <Field label="Country" htmlFor="country">
              <select id="country" className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-white" value={country} onChange={(e) => setCountry(e.target.value)}>
                <option value="CA">Canada</option>
                <option value="US">United States</option>
                <option value="other">Somewhere else</option>
              </select>
            </Field>
          </div>
          {country === 'other' && (
            <p className="rounded-xl bg-blue-50 border border-blue-200 p-3 text-slate-800">
              We build sites for businesses in Canada and the United States right now. Email us at info@bdoanalyticssolutions.com and we will see what we can do.
            </p>
          )}
          <label className="flex items-center gap-3 text-slate-900">
            <input type="checkbox" checked={f.hasDomain} onChange={(e) => set('hasDomain')(e.target.checked)} />I already own a web address (domain)
          </label>
          {f.hasDomain && (
            <Field label="Your domain" htmlFor="domain" hint="For example: yourshop.ca">
              <Text id="domain" value={f.domain} onChange={set('domain')} placeholder="yourshop.ca" />
            </Field>
          )}
          {/* Hidden from people; bots fill it in. */}
          <div aria-hidden="true" style={{ position: 'absolute', left: '-9999px' }}>
            <label htmlFor="website">Leave this empty</label>
            <input id="website" tabIndex={-1} autoComplete="off" value={f.website} onChange={(e) => set('website')(e.target.value)} />
          </div>
        </Card>

        <Problems list={problems} />
        <Submit busy={busy} disabled={busy || country === 'other'}>Send</Submit>
        <p className="text-sm text-slate-500">We use your details only to build your site and to contact you about it.</p>
      </form>
    </Shell>
  );
}
