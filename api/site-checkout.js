// /api/site-checkout : website payments (Stripe Checkout). The customer's intake token is the key.
//   GET  ?t=<token>[&omisEmail=]   -> what they will pay: $199 if that email has an OMIS plan that
//                                    is active or in its free trial, otherwise $449 + care
//   POST { t, purpose: "setup", omisEmail?, interval? }   -> Checkout link for Publish
//   POST { t, purpose: "care", interval }                 -> Checkout link to keep the site online
//   POST { t, purpose: "handover" }                       -> customer takes their site instead
//   GET  ?check=1                  -> setup check for the owner (prices found, webhook secret set)
// The Stripe webhook (/api/stripe-webhook) records the payment and carries on with Publish.
import { db, reply, handle, sendEmail, siteUrl } from './_lib/services.js';
import { paymentsOn, prices, omisPlan, paidEvent, stripe, KEYS } from './_lib/stripe.js';

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const money = (cents) => `$${(cents / 100).toLocaleString('en-CA', { minimumFractionDigits: 0 })}`;

async function quote(lead, omisEmail) {
  const email = EMAIL.test(omisEmail ?? '') ? omisEmail.trim() : lead.email;
  const [p, omis] = await Promise.all([prices(), omisPlan(email)]);
  const yearly = p[KEYS.careYearly];
  return {
    email,
    omis: omis ? omis.status : null,
    customer: omis?.customer ?? null,
    setup: money((omis ? p[KEYS.withOmis] : p[KEYS.alone]).unit_amount),
    care: omis ? null : { monthly: money(p[KEYS.careMonthly].unit_amount), yearly: yearly ? money(yearly.unit_amount) : null },
    p,
  };
}

export default async function handler(req, res) {
  await handle(res, async () => {
    // ?check=1 : is Stripe set up? Says which prices were found and whether the webhook secret
    // is present. Shows no secrets and no customer data.
    if (req.method === 'GET' && req.query.check === '1') {
      const state = (v) => (v === undefined ? 'missing' : v.trim() === '' ? 'empty' : 'set');
      const out = {
        ok: true,
        payments: paymentsOn(),
        webhookSecret: Boolean(process.env.SITES_STRIPE_WEBHOOK_SECRET),
        settings: { SITES_STRIPE_KEY: state(process.env.SITES_STRIPE_KEY), SITES_STRIPE_WEBHOOK_SECRET: state(process.env.SITES_STRIPE_WEBHOOK_SECRET), env: process.env.VERCEL_ENV ?? 'unknown' },
        prices: {},
      };
      if (out.payments) {
        try {
          const { data } = await stripe('prices', { lookup_keys: Object.values(KEYS), active: true, limit: 10 }, 'GET');
          for (const k of Object.values(KEYS)) {
            const p = data.find((x) => x.lookup_key === k);
            out.prices[k] = p ? `${(p.unit_amount / 100).toFixed(2)} ${p.currency.toUpperCase()}${p.recurring ? `/${p.recurring.interval}` : ' once'}` : 'NOT FOUND';
          }
        } catch (err) {
          out.ok = false;
          out.error = err.message;
        }
      }
      return reply(res, 200, out);
    }
    const t = req.method === 'GET' ? req.query.t : req.body?.t;
    const lead = await db.leadByToken('intake_token', t);
    if (!lead) return reply(res, 404, { ok: false, error: 'This link is not valid. Check the email we sent you.' });
    if (!paymentsOn()) return reply(res, 200, { ok: true, payments: false });
    const back = `${siteUrl()}/site`;

    if (req.method === 'GET') {
      if (await paidEvent(lead.id, 'paid')) return reply(res, 200, { ok: true, payments: true, paid: true });
      const q = await quote(lead, req.query.omisEmail);
      return reply(res, 200, { ok: true, payments: true, paid: false, email: q.email, omis: q.omis, setup: q.setup, care: q.care, package: lead.package });
    }
    if (req.method !== 'POST') return reply(res, 405, { ok: false, error: 'GET or POST only' });

    const { purpose, omisEmail, interval } = req.body ?? {};
    const tax = process.env.SITES_STRIPE_TAX === '1' ? { automatic_tax: { enabled: true } } : {};

    if (purpose === 'setup') {
      if (lead.status !== 'preview') return reply(res, 409, { ok: false, error: 'Your preview is still being prepared. We will email you when it is ready.' });
      if (await paidEvent(lead.id, 'paid')) return reply(res, 200, { ok: true, paid: true });
      const q = await quote(lead, omisEmail);
      const meta = { lead_id: lead.id, purpose: 'setup', plan: q.omis ? 'with-omis' : 'alone' };
      const care = interval === 'year' && q.p[KEYS.careYearly] ? q.p[KEYS.careYearly] : q.p[KEYS.careMonthly];
      const session = await stripe('checkout/sessions', {
        ...(q.omis
          ? { mode: 'payment', line_items: [{ price: q.p[KEYS.withOmis].id, quantity: 1 }], customer: q.customer, payment_intent_data: { metadata: meta } }
          : { mode: 'subscription', line_items: [{ price: q.p[KEYS.alone].id, quantity: 1 }, { price: care.id, quantity: 1 }], customer_email: lead.email, subscription_data: { metadata: meta } }),
        metadata: meta,
        client_reference_id: lead.id,
        allow_promotion_codes: true,
        success_url: `${back}/publish/${lead.intake_token}?paid=1`,
        cancel_url: `${back}/publish/${lead.intake_token}`,
        ...tax,
      });
      await db.insert('events', { lead_id: lead.id, kind: 'checkout', detail: { session: session.id, plan: meta.plan } });
      return reply(res, 200, { ok: true, url: session.url });
    }

    if (purpose === 'care' || purpose === 'handover') {
      if (!lead.live_url) return reply(res, 409, { ok: false, error: 'This site is not live.' });
      if (await paidEvent(lead.id, 'care')) return reply(res, 200, { ok: true, state: 'care' });
      if (purpose === 'handover') {
        await db.insert('events', { lead_id: lead.id, kind: 'handover' });
        if (process.env.SITES_OWNER_EMAIL) {
          await sendEmail({
            to: process.env.SITES_OWNER_EMAIL,
            subject: `[Sites] Hand over: ${lead.business}`,
            paragraphs: [`${lead.business} chose to take their website with them. Send them the site files, then take ${lead.live_url ?? 'the site'} offline.`],
          });
        }
        return reply(res, 200, { ok: true, state: 'handover' });
      }
      const p = await prices();
      const care = interval === 'year' && p[KEYS.careYearly] ? p[KEYS.careYearly] : p[KEYS.careMonthly];
      const meta = { lead_id: lead.id, purpose: 'care' };
      const session = await stripe('checkout/sessions', {
        mode: 'subscription',
        line_items: [{ price: care.id, quantity: 1 }],
        customer_email: lead.email,
        subscription_data: { metadata: meta },
        metadata: meta,
        client_reference_id: lead.id,
        allow_promotion_codes: true,
        success_url: `${back}/care/${lead.intake_token}?paid=1`,
        cancel_url: `${back}/care/${lead.intake_token}`,
        ...tax,
      });
      return reply(res, 200, { ok: true, url: session.url });
    }

    reply(res, 400, { ok: false, error: 'Unknown request.' });
  });
}
