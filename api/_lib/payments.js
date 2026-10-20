// Recording website payments, shared by the Stripe webhook, the customer's return from Stripe, the
// Publish page and the owner's Approve page. Whichever sees the payment first records it; the
// others find it recorded. Recording is safe to repeat: a "paid" row is written once, and the
// Publish step runs again until it has gone through (customer_ok), so a failed email or GitHub
// call on the first try is retried instead of forgotten.
import { db, sendEmail, siteUrl } from './services.js';
import { paidEvent, paidSession } from './stripe.js';
import { termsEnd } from './omis-terms.js';
import { customerPublished } from './publish.js';

export const money = (cents, currency = 'cad') => (cents == null ? '' : `$${(cents / 100).toFixed(2)} ${currency.toUpperCase()}`);
const PLAN = { 'with-omis': 'setup with OMIS (hosting included)', alone: 'setup plus website care' };

/** Email the owner about a problem, at most once every 6 hours per customer and kind. */
export async function tellOwnerOnce(lead, kind, subject, paragraphs) {
  const last = (await db.events(lead.id, kind))[0];
  if (last && Date.now() - new Date(last.at).getTime() < 6 * 3600 * 1000) return;
  await db.insert('events', { lead_id: lead.id, kind, detail: { message: String(paragraphs[0] ?? '').slice(0, 300) } });
  if (process.env.SITES_OWNER_EMAIL) await sendEmail({ to: process.env.SITES_OWNER_EMAIL, subject: `[Sites] ${subject}`, paragraphs });
}

/** Setup paid: record it once, email the owner "Paid", then carry on with Publish. */
export async function recordSetupPaid(lead, session) {
  if (session.metadata?.lead_id !== lead.id || session.metadata?.purpose !== 'setup') return null;
  if (!(await paidEvent(lead.id, 'paid'))) {
    const detail = { session: session.id, customer: session.customer, amount: session.amount_total, currency: session.currency, tax: session.total_details?.amount_tax ?? null, plan: session.metadata.plan, subscription: session.subscription ?? null };
    await db.insert('events', { lead_id: lead.id, kind: 'paid', detail });
    if (process.env.SITES_OWNER_EMAIL) {
      await sendEmail({
        to: process.env.SITES_OWNER_EMAIL,
        subject: `[Sites] Paid: ${lead.business} (${money(session.amount_total, session.currency)})`,
        paragraphs: [
          `${lead.business} paid ${money(session.amount_total, session.currency)}${detail.tax ? ` (including ${money(detail.tax, session.currency)} tax)` : ''} for ${PLAN[detail.plan] ?? 'their website'}.`,
          lead.owner_ok ? 'You already approved it, so it is going live now.' : 'Check the preview, then approve it to go live.',
        ],
        links: [
          { label: 'Open preview', url: lead.preview_url },
          ...(lead.owner_ok ? [] : [{ label: 'Approve or hold', url: `${siteUrl()}/site/approve/${lead.id}/${lead.approve_token}` }]),
        ],
      });
    }
  }
  // OMIS price: the customer gets the terms they ticked, in writing, with the date they end.
  const terms = session.metadata.plan === 'with-omis' ? (await db.events(lead.id, 'omis_terms'))[0] : null;
  if (terms && !(await paidEvent(lead.id, 'terms_sent'))) {
    await db.insert('events', { lead_id: lead.id, kind: 'terms_sent', detail: { version: terms.detail?.version } });
    await sendEmail({
      to: lead.email,
      subject: `Your ${lead.business} website: payment received`,
      paragraphs: [
        `Hi ${lead.name}, thank you: we received ${money(session.amount_total, session.currency)} for your website setup. Stripe also emails you a receipt.`,
        `You agreed to these terms for the OMIS price, which apply until ${termsEnd(new Date()).toISOString().slice(0, 10)}:`,
        terms.detail?.text ?? '',
        'Keep this email for your records. Reply to it any time with questions.',
      ],
      links: [{ label: 'Manage my plan or leave', url: `${siteUrl()}/site/manage/${lead.intake_token}` }],
    });
  }
  // Publish once (customer_ok); the owner already had the "Paid" email, so no second one.
  if (!lead.customer_ok) return customerPublished(lead, { quiet: true });
  return lead.owner_ok ? 'publishing' : 'waiting-owner';
}

/**
 * Has this customer paid for setup? Checks our record, then asks Stripe about the session they
 * came back with and their recent Checkouts (a missed webhook would otherwise ask them to pay
 * twice). Records a payment it finds. Returns the "paid" row, or null.
 */
export async function setupPaid(lead, sessionId) {
  const known = await paidEvent(lead.id, 'paid');
  if (known) return known;
  const recent = (await db.events(lead.id, 'checkout')).slice(0, 3).map((e) => e.detail?.session);
  for (const id of [...new Set([sessionId, ...recent].filter(Boolean))]) {
    const session = await paidSession(id).catch(() => null);
    if (session && session.metadata?.lead_id === lead.id && session.metadata?.purpose === 'setup') {
      await recordSetupPaid(lead, session);
      return paidEvent(lead.id, 'paid');
    }
  }
  return null;
}

/** Website care is on when the latest "care" is newer than the latest "care_ended". */
export async function careActive(leadId) {
  const [care, ended] = await Promise.all([paidEvent(leadId, 'care'), paidEvent(leadId, 'care_ended')]);
  return Boolean(care && (!ended || new Date(care.at) > new Date(ended.at)));
}
