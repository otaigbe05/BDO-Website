// /api/stripe-webhook : Stripe tells us when something was paid or stopped.
//   checkout.session.completed      setup paid -> record it and carry on with Publish
//                                   care started -> record it, tell the owner
//   customer.subscription.deleted   an OMIS plan ended (cancelled, or a trial that was not
//                                   kept) -> email the customer their two choices for the site;
//                                   website care ended -> tell the owner to hand the site over
// Only signed requests are accepted (SITES_STRIPE_WEBHOOK_SECRET). Every event is answered 200
// once handled so Stripe does not retry it; failures answer 500 so Stripe tries again.
import { db, reply, sendEmail, siteUrl } from './_lib/services.js';
import { stripe, verifyWebhook, paidEvent, isOmisSubscription, isCareSubscription } from './_lib/stripe.js';
import { customerPublished } from './_lib/publish.js';

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
  const lead = await db.leadById(leadId);
  if (!lead) return;
  const detail = { session: session.id, customer: session.customer, amount: session.amount_total, plan, subscription: session.subscription ?? null };

  if (purpose === 'setup') {
    if (await paidEvent(lead.id, 'paid')) return;
    await db.insert('events', { lead_id: lead.id, kind: 'paid', detail });
    await customerPublished(lead);
    return;
  }
  if (purpose === 'care') {
    if (await paidEvent(lead.id, 'care')) return;
    await db.insert('events', { lead_id: lead.id, kind: 'care', detail });
    await tellOwner(`Kept online: ${lead.business}`, `${lead.business} chose website care, so ${lead.live_url ?? 'their site'} stays online.`);
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
    if (paid?.detail?.plan !== 'with-omis' || (await paidEvent(lead.id, 'care')) || (await paidEvent(lead.id, 'omis_ended'))) continue;
    await db.insert('events', { lead_id: lead.id, kind: 'omis_ended', detail: { subscription: sub.id } });
    await sendEmail({
      to: lead.email,
      subject: `Your ${lead.business} website`,
      paragraphs: [
        `Hi ${lead.name}, your OMIS plan has ended. Your website is still yours, and it is still online.`,
        'You can keep it online with us for $12 a month (hosting and up to 3 updates a month, cancel any time), or take it with you: we send you the site files and you host it wherever you like.',
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
    if (event.type === 'checkout.session.completed') await checkoutDone(event.data.object);
    else if (event.type === 'customer.subscription.deleted') await subscriptionEnded(event.data.object);
    reply(res, 200, { ok: true });
  } catch (err) {
    console.error(err);
    reply(res, 500, { ok: false });
  }
}

// Stripe signs the exact bytes it sent, so the body must not be parsed first.
export const config = { api: { bodyParser: false } };
