// Manage or leave, for BDO websites (docs/SPEC-cancel.md in omis-sites). Shared by the manage page
// (api/site-manage.js), the care page (api/site-checkout.js) and the Stripe webhook.
// Records in the events table:
//   leaving { until, how }   the plan stops on "until" (end of the paid period, or now)
//   stayed                   changed their mind before that date
//   left / deleted           written by the pipeline (omis-sites pipeline/job.mjs "leaving", daily):
//                            website ZIP sent on "until", files deleted 30 days later
import { db, sendEmail, siteUrl } from './services.js';
import { stripe, paidEvent, prices, KEYS } from './stripe.js';
import { careActive, money } from './payments.js';
import { termsEnd } from './omis-terms.js';

export const KEEP_DAYS = 30;
const day = (iso) => new Date(iso).toLocaleDateString('en-CA', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'America/Toronto' });
export const manageUrl = (lead) => `${siteUrl()}/site/manage/${lead.intake_token}`;

/** Leaving, if it is on: the newest "leaving" that is newer than any "stayed". */
export async function leavingNow(leadId) {
  const [leaving, stayed] = await Promise.all([paidEvent(leadId, 'leaving'), paidEvent(leadId, 'stayed')]);
  return leaving && (!stayed || new Date(leaving.at) > new Date(stayed.at)) ? leaving : null;
}

/** The Stripe subscription that keeps this site online: care (after OMIS ended), or setup + care. */
export async function siteSubscription(lead) {
  if (await careActive(lead.id)) return (await paidEvent(lead.id, 'care'))?.detail?.subscription ?? null;
  const paid = await paidEvent(lead.id, 'paid');
  return paid?.detail?.plan === 'alone' ? paid.detail.subscription ?? null : null;
}

/**
 * Everything the manage page shows: the plan, its dates, and what is owed. Owed = unpaid invoices
 * of their subscription, plus (OMIS price, within 6 months, not yet paid) the difference between
 * the two setup prices, as in the terms they ticked.
 */
export async function planFor(lead) {
  const paid = await paidEvent(lead.id, 'paid');
  const subId = await siteSubscription(lead);
  let sub = null;
  let invoices = { owed: 0, payUrl: null, currency: 'cad' };
  if (subId) {
    const s = await stripe(`subscriptions/${subId}`);
    const end = s.current_period_end ?? s.items?.data?.[0]?.current_period_end;
    const item = s.items?.data?.find((i) => String(i.price?.lookup_key ?? '').startsWith('website_care'));
    sub = { id: subId, customer: s.customer, status: s.status, stopping: s.cancel_at_period_end, periodEnd: end ? new Date(end * 1000).toISOString() : null, price: item ? `${money(item.price.unit_amount, item.price.currency)}/${item.price.recurring?.interval ?? 'month'}` : null };
    const open = (await stripe('invoices', { subscription: subId, status: 'open', limit: 10 }, 'GET')).data;
    invoices = { owed: open.reduce((n, i) => n + i.amount_remaining, 0), payUrl: open[0]?.hosted_invoice_url ?? null, currency: open[0]?.currency ?? 'cad' };
  }
  let difference = 0;
  let termsUntil = null;
  if (paid?.detail?.plan === 'with-omis' && !(await paidEvent(lead.id, 'handover'))) {
    const until = termsEnd(paid.at);
    if (until > new Date()) {
      const p = await prices();
      difference = p[KEYS.alone].unit_amount - p[KEYS.withOmis].unit_amount;
      termsUntil = until.toISOString();
    }
  }
  return {
    kind: subId ? 'subscription' : paid?.detail?.plan === 'with-omis' ? 'omis' : paid ? 'paid' : 'none',
    sub,
    owed: { invoices: invoices.owed, invoiceUrl: invoices.payUrl, difference, termsUntil, currency: invoices.currency },
    customer: sub?.customer ?? paid?.detail?.customer ?? null,
  };
}

/** Start leaving: record it and tell the customer and the owner. until: when the plan stops. */
export async function startLeaving(lead, until, how) {
  if (await leavingNow(lead.id)) return;
  await db.insert('events', { lead_id: lead.id, kind: 'leaving', detail: { until, how } });
  const now = new Date(until) <= new Date();
  await sendEmail({
    to: lead.email,
    subject: now ? `Your ${lead.business} website: your files are on their way` : `Your ${lead.business} website: your plan stops on ${day(until)}`,
    paragraphs: [
      `Hi ${lead.name}, ${now ? 'your plan has stopped.' : `your plan stops on ${day(until)}, the end of the period you paid for. Your site stays live until then.`}`,
      `${now ? 'Within a day' : 'On that day'} we email you your website as a ZIP file, ready to put online anywhere, with your photos, your words and a short guide. If we bought your domain, reply to that email and we send you the code to move it.`,
      `After that, your address shows a short "this site has moved" page for ${KEEP_DAYS} days, then your files are deleted.${now ? '' : ' Changed your mind before then? Use the link below to keep your plan.'}`,
    ],
    links: now ? [] : [{ label: 'Keep my plan', url: manageUrl(lead) }],
  });
  if (process.env.SITES_OWNER_EMAIL) {
    await sendEmail({
      to: process.env.SITES_OWNER_EMAIL,
      subject: `[Sites] Leaving: ${lead.business}`,
      paragraphs: [`${lead.business} is leaving (${how}). Their plan stops on ${day(until)}; their website ZIP goes out that day automatically, the address shows a "moved" page, and everything is deleted ${KEEP_DAYS} days later.`, ...(lead.live_url ? [`Site: ${lead.live_url}`] : [])],
    });
  }
}
