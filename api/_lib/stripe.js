// Server-only Stripe helpers for website payments. Talks to the Stripe API with fetch (no SDK).
// The key is a RESTRICTED key in Vercel (SITES_STRIPE_KEY) with: Checkout Sessions write,
// Customers read, Subscriptions read, Prices read. It never edits OMIS products or plans.
// Without the key, payments are off and Publish works as it did before.
import { createHmac, timingSafeEqual } from 'node:crypto';
import { db } from './services.js';

export const paymentsOn = () => Boolean(process.env.SITES_STRIPE_KEY);
/** "live" or "test" from the key's prefix (sk_live_, rk_test_, ...), shown on ?check=1. */
export const keyMode = () => (/^(sk|rk)_live_/.test(process.env.SITES_STRIPE_KEY ?? '') ? 'live' : /^(sk|rk)_test_/.test(process.env.SITES_STRIPE_KEY ?? '') ? 'test' : 'unknown');

/** Prices are found by the lookup keys the owner set in Stripe. */
export const KEYS = {
  withOmis: 'website_setup_with_omis',
  alone: 'website_setup',
  careMonthly: 'website_care_monthly',
  careYearly: 'website_care_yearly',
};
const isWebsitePrice = (price) => String(price?.lookup_key ?? '').startsWith('website_');

/** Form-encode nested params the way Stripe expects: a[b][0][c]=1 */
function form(params, prefix = '', out = new URLSearchParams()) {
  for (const [k, v] of Object.entries(params)) {
    if (v === undefined || v === null) continue;
    const key = prefix ? `${prefix}[${k}]` : k;
    if (typeof v === 'object') form(v, key, out);
    else out.append(key, String(v));
  }
  return out;
}

export async function stripe(path, params, method = params ? 'POST' : 'GET') {
  const url = new URL(`https://api.stripe.com/v1/${path}`);
  if (method === 'GET' && params) form(params).forEach((v, k) => url.searchParams.append(k, v));
  const res = await fetch(url, {
    method,
    headers: { Authorization: `Bearer ${process.env.SITES_STRIPE_KEY}`, 'Content-Type': 'application/x-www-form-urlencoded' },
    ...(method === 'POST' ? { body: form(params ?? {}) } : {}),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(`Stripe ${res.status}: ${data?.error?.message ?? 'error'}`);
  return data;
}

export async function prices() {
  const { data } = await stripe('prices', { lookup_keys: Object.values(KEYS), active: true, limit: 10 }, 'GET');
  const by = Object.fromEntries(data.map((p) => [p.lookup_key, p]));
  if (!by[KEYS.withOmis] || !by[KEYS.alone] || !by[KEYS.careMonthly]) throw new Error('Website prices are missing in Stripe (check the lookup keys).');
  return by;
}

/**
 * Does this email have a PAID OMIS plan? Any subscription in the account that is not a website
 * price is an OMIS plan. Only "active" counts (owner, 2026-10-20): a free trial does not get the
 * OMIS website price, but is reported (trial: true) so the page can say it unlocks after the
 * first OMIS payment. Read-only.
 */
export async function omisPlan(email) {
  const { data: customers } = await stripe('customers', { email, limit: 10 }, 'GET');
  let trial = null;
  for (const c of customers) {
    const { data: subs } = await stripe('subscriptions', { customer: c.id, status: 'all', limit: 20 }, 'GET');
    const omis = subs.filter((s) => s.items.data.some((i) => !isWebsitePrice(i.price)));
    if (omis.some((s) => s.status === 'active')) return { customer: c.id, status: 'active' };
    if (omis.some((s) => s.status === 'trialing')) trial = { customer: c.id, status: 'trialing', trial: true };
  }
  return trial;
}
/** A plan that gets the OMIS website price (paid, not a trial). */
export const omisPaid = (plan) => plan?.status === 'active';

export const isOmisSubscription = (sub) => sub.items.data.some((i) => !isWebsitePrice(i.price));
export const isCareSubscription = (sub) => sub.items.data.some((i) => String(i.price?.lookup_key ?? '').startsWith('website_care'));

/** Verify a webhook from Stripe (Stripe-Signature header, 5 minute tolerance). */
export function verifyWebhook(raw, header) {
  const secret = process.env.SITES_STRIPE_WEBHOOK_SECRET;
  if (!secret || !header) return false;
  const parts = Object.fromEntries(header.split(',').map((p) => p.split('=')).filter((p) => p.length === 2 && p[0] !== 'v1'));
  const sigs = header.split(',').filter((p) => p.startsWith('v1=')).map((p) => p.slice(3));
  const t = Number(parts.t);
  if (!t || Math.abs(Date.now() / 1000 - t) > 300) return false;
  const expected = createHmac('sha256', secret).update(`${t}.${raw}`).digest('hex');
  return sigs.some((s) => s.length === expected.length && timingSafeEqual(Buffer.from(s), Buffer.from(expected)));
}

/**
 * Was this Checkout paid? Asks Stripe directly (like ChurchNow), so a missed webhook cannot strand
 * a paying customer. Only "complete" sessions whose money is in (or nothing was due) count; a bank
 * payment still clearing does not.
 */
export async function paidSession(sessionId) {
  if (!/^cs_(test|live)_[A-Za-z0-9]+$/.test(String(sessionId ?? ''))) return null;
  const s = await stripe(`checkout/sessions/${sessionId}`);
  return s.status === 'complete' && ['paid', 'no_payment_required'].includes(s.payment_status) ? s : null;
}

/** Payments are kept in the events table: kind "paid" (setup) or "care" (hosting plan). */
export async function paidEvent(leadId, kind) {
  const rows = await db.events(leadId, kind);
  return rows[0] ?? null;
}
