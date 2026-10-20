// The customer's "Publish" step, shared by /api/site-golive (no payment needed) and the Stripe
// webhook (after payment). Returns the state shown to the customer.
import { db, startJob, sendEmail, siteUrl } from './services.js';

/** quiet: the owner was already emailed (the "Paid" email), so skip "Ready to go live". */
export async function customerPublished(lead, { quiet = false } = {}) {
  await db.update(lead.id, { customer_ok: true, ...(lead.owner_ok ? {} : { status: 'review' }) });
  await db.insert('events', { lead_id: lead.id, kind: 'customer_ok' });
  if (lead.owner_ok) {
    await startJob('publish', lead.id);
    return 'publishing';
  }
  if (process.env.SITES_OWNER_EMAIL && !quiet) {
    await sendEmail({
      to: process.env.SITES_OWNER_EMAIL,
      subject: `[Sites] Ready to go live: ${lead.business}`,
      paragraphs: [`${lead.business} pressed Publish. One click to approve and it goes live.`],
      links: [
        { label: 'Open preview', url: lead.preview_url },
        { label: 'Approve or hold', url: `${siteUrl()}/site/approve/${lead.id}/${lead.approve_token}` },
      ],
    });
  }
  return 'waiting-owner';
}
