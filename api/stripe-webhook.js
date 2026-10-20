// /api/stripe-webhook : Stripe tells us when something was paid or stopped.
//   checkout.session.completed      setup paid -> record it, email the owner "Paid", carry on
//                                   with Publish; care started -> record it, tell the owner.
//                                   A bank payment still clearing is NOT treated as paid yet.
//   checkout.session.async_payment_succeeded / _failed   that bank payment cleared / failed
//   invoice.payment_failed          a website care renewal failed -> tell the owner
//   charge.refunded                 a website payment was refunded -> tell the owner
//   customer.subscription.deleted   an OMIS plan ended (cancelled, or a trial that was not
//                                   kept) -> email the customer their two choices for the site;
//                                   website care ended -> tell the owner to hand the site over
// Only signed requests are accepted (SITES_STRIPE_WEBHOOK_SECRET). Every event is answered 200
// once handled so Stripe does not retry it; failures answer 500 so Stripe tries again.
// The account is shared with OMIS: events without our lead_id (OMIS plans) are left alone, except
// a deleted OMIS plan, which is matched to its website by email.
// The Publish page and the owner's Approve page also ask Stripe directly (api/_lib/payments.js),
// so a missed or failed webhook delays nothing for long.
import { db, reply, sendEmail, siteUrl } from './_lib/services.js';
import { stripe, verifyWebhook, paidEvent, isOmisSubscription, isCareSubscription, prices, KEYS } from './_lib/stripe.js';
import { recordSetupPaid, careActive, money } from './_lib/payments.js';
import { termsEnd, OMIS_TERMS_MONTHS } from './_lib/omis-terms.js';

async function rawBody(req) {
  const chunks = [];
  for await (const c of req) chunks.push(typeof c === 'string' ? Buffer.from(c) : c);
  return Buffer.concat(chunks).toString('utf8');
}

async function tellOwner(subject, line) {
  if (process.env.SITES_OWNER_EMAIL) await sendEmail({ to: process.env.SITES_OWNER_EMAIL, subject: `[Sites] ${subject}`, paragraphs: [line] });
}

async function checkoutDone(session) {
  const { lead_id: leadId, purpose, plan } = session.metadata ?? {};
  if (!leadId) return; // not a website checkout (OMIS)
  const lead = await db.leadById(leadId);
  if (!lead) return;
  // Money not in yet (a bank payment clearing): wait for async_payment_succeeded.
  if (!['paid', 'no_payment_required'].includes(session.payment_status)) {
    await tellOwner(`Payment clearing: ${lead.business}`, `${lead.business} paid by a bank method that takes a few days to clear. Nothing goes live until it clears; you will get a "Paid" email then.`);
    return;
  }

  if (purpose === 'setup') {
    await recordSetupPaid(lead, session);
    return;
  }
  if (purpose === 'handover') {
    if (await paidEvent(lead.id, 'handover')) return;
    await db.insert('events', { lead_id: lead.id, kind: 'handover', detail: { session: session.id, amount: session.amount_total } });
    await tellOwner(`Hand over: ${lead.business}`, `${lead.business} paid the difference (${money(session.amount_total, session.currency)}) to take their website with them. Send them the site files, then take ${lead.live_url ?? 'the site'} offline.`);
    return;
  }
  if (purpose === 'care') {
    if (await careActive(lead.id)) return;
    const detail = { session: session.id, customer: session.customer, amount: session.amount_total, plan, subscription: session.subscription ?? null };
    await db.insert('events', { lead_id: lead.id, kind: 'care', detail });
    await tellOwner(`Kept online: ${lead.business}`, `${lead.business} chose website care (${money(session.amount_total, session.currency)}), so ${lead.live_url ?? 'their site'} stays online.`);
  }
}

async function asyncPaymentFailed(session) {
  const lead = await db.leadById(session.metadata?.lead_id);
  if (lead) await tellOwner(`Payment failed: ${lead.business}`, `${lead.business}'s bank payment did not go through, so nothing was published. They can pay again from their Publish link.`);
}

// Stripe has moved where an invoice keeps its subscription details between API versions; read both.
const invoiceMeta = (inv) => inv.parent?.subscription_details?.metadata ?? inv.subscription_details?.metadata ?? {};

async function renewalFailed(invoice) {
  const lead = await db.leadById(invoiceMeta(invoice).lead_id);
  if (!lead) return; // an OMIS plan: the OMIS app handles its own
  await tellOwner(
    `Care payment failed: ${lead.business}`,
    `${lead.business}'s website care payment of ${money(invoice.amount_due, invoice.currency)} failed (attempt ${invoice.attempt_count ?? 1}). Stripe retries it and emails them; if the retries fail, the subscription ends and you get a "Care ended" email.`,
  );
}

async function refunded(charge) {
  // A setup paid with OMIS carries our lead_id; anything else is matched by the payer's email.
  let leads = [];
  const byId = await db.leadById(charge.metadata?.lead_id);
  if (byId) leads = [byId];
  else {
    const email = charge.billing_details?.email ?? charge.receipt_email;
    if (email) leads = await db.liveLeadsByEmail(email);
  }
  for (const lead of leads) {
    await tellOwner(`Refund: ${lead.business}`, `A payment from ${lead.business} was refunded (${money(charge.amount_refunded, charge.currency)}). If the website should stop, cancel their care subscription in Stripe and take ${lead.live_url ?? 'the site'} offline.`);
  }
}

/** "$12/month" from Stripe, so the email matches the real price. */
async function carePrice() {
  try {
    const p = (await prices())[KEYS.careMonthly];
    return `$${(p.unit_amount / 100).toFixed(p.unit_amount % 100 ? 2 : 0)} a month`;
  } catch {
    return 'a small monthly fee';
  }
}

async function subscriptionEnded(sub) {
  if (isCareSubscription(sub)) {
    const lead = await db.leadById(sub.metadata?.lead_id);
    if (!lead) return;
    await db.insert('events', { lead_id: lead.id, kind: 'care_ended', detail: { subscription: sub.id } });
    await tellOwner(`Care ended: ${lead.business}`, `${lead.business} stopped website care. Send them their site files, then take ${lead.live_url ?? 'the site'} offline.`);
    return;
  }
  if (!isOmisSubscription(sub)) return;

  // OMIS plans are created by the OMIS app, so match the customer to their website by email.
  const customer = await stripe(`customers/${sub.customer}`);
  for (const lead of await db.liveLeadsByEmail(customer.email)) {
    const paid = await paidEvent(lead.id, 'paid');
    if (paid?.detail?.plan !== 'with-omis' || (await careActive(lead.id)) || (await paidEvent(lead.id, 'omis_ended'))) continue;
    await db.insert('events', { lead_id: lead.id, kind: 'omis_ended', detail: { subscription: sub.id } });
    await sendEmail({
      to: lead.email,
      subject: `Your ${lead.business} website`,
      paragraphs: [
        `Hi ${lead.name}, your OMIS plan has ended. Your website is still yours, and it is still online.`,
        `You can keep it online with us for ${await carePrice()} (hosting and up to 3 updates a month, cancel any time), or take it with you: we send you the site files and you host it wherever you like${termsEnd(paid.at) > new Date() ? ` (as agreed when you paid, because OMIS ended within ${OMIS_TERMS_MONTHS} months, taking the files first needs the difference between the two setup prices; the link shows the amount)` : ''}.`,
        'Pick one with the link below. If we do not hear from you in 30 days, we will send you the files and take the site offline.',
      ],
      links: [{ label: 'Choose what happens to my website', url: `${siteUrl()}/site/care/${lead.intake_token}` }],
    });
    await tellOwner(`OMIS ended: ${lead.business}`, `${lead.business}'s OMIS plan ended. They were sent the keep-or-take-it email for ${lead.live_url ?? 'their site'}.`);
  }
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return reply(res, 405, { ok: false });
  const raw = await rawBody(req);
  if (!verifyWebhook(raw, req.headers['stripe-signature'])) return reply(res, 400, { ok: false, error: 'Bad signature' });
  const event = JSON.parse(raw);
  try {
    const o = event.data.object;
    if (event.type === 'checkout.session.completed' || event.type === 'checkout.session.async_payment_succeeded') await checkoutDone(o);
    else if (event.type === 'checkout.session.async_payment_failed') await asyncPaymentFailed(o);
    else if (event.type === 'customer.subscription.deleted') await subscriptionEnded(o);
    else if (event.type === 'invoice.payment_failed') await renewalFailed(o);
    else if (event.type === 'charge.refunded') await refunded(o);
    reply(res, 200, { ok: true });
  } catch (err) {
    console.error(err);
    reply(res, 500, { ok: false });
  }
}

// Stripe signs the exact bytes it sent, so the body must not be parsed first.
export const config = { api: { bodyParser: false } };
