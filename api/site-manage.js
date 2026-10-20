// /api/site-manage : "Manage my plan or leave" (docs/SPEC-cancel.md in omis-sites). The customer's
// intake token is the key, as on the Publish and care pages.
//   GET  ?t=                         -> their plan, dates, what is owed, whether they are leaving
//   POST { t, action: "card" }       -> Stripe's billing page (card and invoices only, no cancel)
//   POST { t, action: "leave" }      -> stop at the end of the paid period (or now, for the OMIS
//                                       price); anything owed is paid first
//   POST { t, action: "pay" }        -> pay what is owed: the open invoice's page, or a Checkout
//                                       for the OMIS terms difference (then the plan stops)
//   POST { t, action: "keep" }       -> changed their mind before the stop date
import { db, reply, handle, siteUrl, sendEmail } from './_lib/services.js';
import { paymentsOn, stripe, KEYS, prices } from './_lib/stripe.js';
import { planFor, leavingNow, startLeaving, manageUrl, KEEP_DAYS } from './_lib/leave.js';
import { money, tellOwnerOnce } from './_lib/payments.js';

/** Stripe's billing page settings for websites (card and invoices only), made once, found by metadata. */
async function billingConfig() {
  const { data } = await stripe('billing_portal/configurations', { active: true, limit: 100 }, 'GET');
  const mine = data.find((c) => c.metadata?.app === 'bdo-websites');
  if (mine) return mine.id;
  return (await stripe('billing_portal/configurations', {
    business_profile: { headline: 'BDO Analytics Solutions: update your card or download your invoices' },
    features: {
      payment_method_update: { enabled: true },
      invoice_history: { enabled: true },
      customer_update: { enabled: true, allowed_updates: ['email', 'address'] },
      subscription_cancel: { enabled: false },
      subscription_update: { enabled: false },
    },
    metadata: { app: 'bdo-websites' },
  })).id;
}

export default async function handler(req, res) {
  await handle(res, async () => {
    const t = req.method === 'GET' ? req.query.t : req.body?.t;
    const lead = await db.leadByToken('intake_token', t);
    if (!lead) return reply(res, 404, { ok: false, error: 'This link is not valid. Check the email we sent you.' });
    const left = (await db.events(lead.id, 'left'))[0];
    const base = { business: lead.business, liveUrl: lead.live_url, keepDays: KEEP_DAYS };
    if (left) return reply(res, 200, { ok: true, ...base, state: 'left' });
    if (!lead.live_url) return reply(res, 200, { ok: true, ...base, state: 'not-live' });
    if (!paymentsOn()) return reply(res, 200, { ok: true, ...base, state: 'no-payments' });

    let plan;
    try {
      plan = await planFor(lead);
    } catch (err) {
      console.error(err);
      await tellOwnerOnce(lead, 'payment_error', `Manage page not working: ${lead.business}`, [`${lead.business} opened their manage page but Stripe answered: ${String(err.message).slice(0, 300)}`, `Check: ${siteUrl()}/api/site-checkout?check=1`]);
      return reply(res, 503, { ok: false, error: 'This page is not available right now. Please try again in a little while; we have been told.' });
    }
    const leaving = await leavingNow(lead.id);
    const owedTotal = plan.owed.invoices + plan.owed.difference;

    if (req.method === 'GET') {
      return reply(res, 200, {
        ok: true,
        ...base,
        state: leaving ? 'leaving' : 'active',
        leavingUntil: leaving?.detail?.until ?? null,
        kind: plan.kind,
        price: plan.sub?.price ?? null,
        periodEnd: plan.sub?.periodEnd ?? null,
        card: Boolean(plan.customer && plan.kind === 'subscription'),
        owed: {
          total: owedTotal ? money(owedTotal, plan.owed.currency) : null,
          invoices: plan.owed.invoices ? money(plan.owed.invoices, plan.owed.currency) : null,
          difference: plan.owed.difference ? money(plan.owed.difference, plan.owed.currency) : null,
          termsUntil: plan.owed.termsUntil,
        },
        terms: plan.owed.difference ? (await db.events(lead.id, 'omis_terms'))[0]?.detail?.text ?? null : null,
      });
    }
    if (req.method !== 'POST') return reply(res, 405, { ok: false, error: 'GET or POST only' });
    const action = req.body?.action;

    if (action === 'card') {
      if (!plan.customer || plan.kind !== 'subscription') return reply(res, 400, { ok: false, error: 'There is no card on file for this website.' });
      const s = await stripe('billing_portal/sessions', { customer: plan.customer, configuration: await billingConfig(), return_url: manageUrl(lead) });
      return reply(res, 200, { ok: true, url: s.url });
    }

    if (action === 'pay') {
      // An unpaid invoice first (Stripe's own page), then the OMIS terms difference.
      if (plan.owed.invoices && plan.owed.invoiceUrl) return reply(res, 200, { ok: true, url: plan.owed.invoiceUrl });
      if (plan.owed.difference) {
        const p = await prices();
        const meta = { lead_id: lead.id, purpose: 'handover' };
        const session = await stripe('checkout/sessions', {
          mode: 'payment',
          line_items: [{ quantity: 1, price_data: { currency: p[KEYS.alone].currency, unit_amount: plan.owed.difference, product_data: { name: `Website files: ${lead.business}`, description: 'The difference between the two setup prices (leaving within 6 months of the OMIS price).' } } }],
          customer_email: lead.email,
          payment_intent_data: { metadata: meta },
          metadata: meta,
          client_reference_id: lead.id,
          success_url: `${manageUrl(lead)}?paid=1`,
          cancel_url: manageUrl(lead),
          ...(process.env.SITES_STRIPE_TAX !== '0' ? { automatic_tax: { enabled: true }, billing_address_collection: 'required' } : {}),
        });
        return reply(res, 200, { ok: true, url: session.url });
      }
      return reply(res, 200, { ok: true, nothingOwed: true });
    }

    if (action === 'leave') {
      if (leaving) return reply(res, 200, { ok: true, state: 'leaving', leavingUntil: leaving.detail?.until });
      // Anything owed is paid first (owner, 2026-10-20).
      if (owedTotal) return reply(res, 402, { ok: false, needsPayment: true, error: `Please pay ${money(owedTotal, plan.owed.currency)} first.` });
      let until = new Date().toISOString();
      if (plan.sub) {
        await stripe(`subscriptions/${plan.sub.id}`, { cancel_at_period_end: true });
        until = plan.sub.periodEnd ?? until;
      }
      await startLeaving(lead, until, 'manage page');
      return reply(res, 200, { ok: true, state: 'leaving', leavingUntil: until });
    }

    if (action === 'keep') {
      if (!leaving) return reply(res, 200, { ok: true, state: 'active' });
      if (new Date(leaving.detail?.until) <= new Date()) return reply(res, 409, { ok: false, error: 'Your plan has already stopped. Reply to any of our emails and we will help you restart it.' });
      if (plan.sub) await stripe(`subscriptions/${plan.sub.id}`, { cancel_at_period_end: false });
      await db.insert('events', { lead_id: lead.id, kind: 'stayed' });
      if (process.env.SITES_OWNER_EMAIL) await sendEmail({ to: process.env.SITES_OWNER_EMAIL, subject: `[Sites] Staying: ${lead.business}`, paragraphs: [`${lead.business} changed their mind and kept their plan.`] });
      return reply(res, 200, { ok: true, state: 'active' });
    }
    reply(res, 400, { ok: false, error: 'Unknown request.' });
  });
}
