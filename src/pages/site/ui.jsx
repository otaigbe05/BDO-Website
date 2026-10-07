// Small shared pieces for the client-website funnel pages (/site/*).
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Loader2 } from 'lucide-react';

export const inputClass =
  'w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none transition-all text-slate-900 bg-white';

export function Shell({ title, noindex = true, children }) {
  return (
    <div className="bg-slate-50 min-h-screen pt-28 pb-20 px-4">
      <Helmet>
        <title>{title} | BDO Analytics Solutions</title>
        {noindex && <meta name="robots" content="noindex, nofollow" />}
      </Helmet>
      <div className="max-w-3xl mx-auto">{children}</div>
    </div>
  );
}

export function Card({ title, intro, children }) {
  return (
    <section className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8 space-y-5">
      {title && <h2 className="text-xl md:text-2xl font-bold text-slate-900">{title}</h2>}
      {intro && <p className="text-slate-600 -mt-2">{intro}</p>}
      {children}
    </section>
  );
}

export function Field({ label, hint, htmlFor, required, children }) {
  return (
    <div className="space-y-1.5 min-w-0">
      <label htmlFor={htmlFor} className="block text-sm font-bold text-slate-900">
        {label}
        {required && <span className="text-red-700"> *</span>}
      </label>
      {children}
      {hint && <p className="text-sm text-slate-500">{hint}</p>}
    </div>
  );
}

export function Text({ id, value, onChange, ...rest }) {
  return <input id={id} className={inputClass} value={value ?? ''} onChange={(e) => onChange(e.target.value)} {...rest} />;
}

export function Area({ id, value, onChange, rows = 4, ...rest }) {
  return <textarea id={id} rows={rows} className={inputClass} value={value ?? ''} onChange={(e) => onChange(e.target.value)} {...rest} />;
}

export function Submit({ busy, children, ...rest }) {
  return (
    <button
      type="submit"
      disabled={busy}
      className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-8 py-4 rounded-xl bg-blue-700 hover:bg-blue-800 disabled:opacity-60 text-white font-bold text-lg"
      {...rest}
    >
      {busy && <Loader2 className="w-5 h-5 animate-spin" aria-hidden="true" />}
      {children}
    </button>
  );
}

export function Problems({ list }) {
  if (!list?.length) return null;
  return (
    <div role="alert" className="rounded-xl border border-red-300 bg-red-50 p-4 text-red-900">
      <p className="font-bold mb-1">Please fix these and send again:</p>
      <ul className="list-disc pl-5 space-y-1">
        {list.map((p) => (
          <li key={p}>{p}</li>
        ))}
      </ul>
    </div>
  );
}

export function Notice({ title, children }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center space-y-3">
      <h1 className="text-2xl md:text-3xl font-bold text-slate-900">{title}</h1>
      <div className="text-slate-700 space-y-3">{children}</div>
    </div>
  );
}

/** fetch JSON from our /api; returns { ok, ...body } and never throws. */
export async function api(path, init) {
  try {
    const res = await fetch(path, { headers: { 'Content-Type': 'application/json' }, ...init });
    const body = await res.json().catch(() => ({}));
    return { status: res.status, ...body, ok: res.ok && body.ok !== false };
  } catch {
    return { ok: false, error: 'Could not reach our server. Check your connection and try again.' };
  }
}

/** The showcase catalog (/templates/catalog.json): templates and their colour palettes. */
export async function loadCatalog() {
  try {
    const res = await fetch('/templates/catalog.json');
    if (!res.ok) return [];
    return (await res.json()).templates ?? [];
  } catch {
    return [];
  }
}
