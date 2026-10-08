// /api/site-golive
//   GET  ?id=<lead id>&t=<approve token>                          -> owner's summary
//   POST { who: "customer", t: <intake token> }                   -> customer presses Publish
//   POST { who: "owner", id, t: <approve token>, action }         -> "approve" or "hold"
// The customer sees every preview straight away. When they press Publish, the owner gets ONE
// email to approve going live (status "review"); approving publishes. An owner who approves
// early just lets the customer's Publish go straight through. (AUTO_APPROVE in the pipeline
// marks every preview owner-approved.) Changes happen only on POST from a confirm button,
// never on a plain link, so email link scanners cannot approve or publish by "clicking" it.
import { timingSafeEqual } from 'node:crypto';
import { db, startJob, reply, handle, sendEmail, siteUrl } from './_lib/services.js';

async function ownerLead(id, token) {
  const lead = await db.leadById(id);
  if (!lead || typeof token !== 'string' || token.length !== lead.approve_token.length) return null;
  return timingSafeEqual(Buffer.from(token), Buffer.from(lead.approve_token)) ? lead : null;
}

export default async function handler(req, res) {
  await handle(res, async () => {
    if (req.method === 'GET') {
      const lead = await ownerLead(req.query.id, req.query.t);
      if (!lead) return reply(res, 404, { ok: false, error: 'This link is not valid.' });
      return reply(res, 200, {
        ok: true,
        business: lead.business, city: lead.city, template: lead.template, package: lead.package,
        status: lead.status, previewUrl: lead.preview_url, liveUrl: lead.live_url,
        customerOk: lead.customer_ok, ownerOk: lead.owner_ok, report: lead.report, changeRounds: lead.change_rounds,
      });
    }
    if (req.method !== 'POST') return reply(res, 405, { ok: false, error: 'GET or POST only' });

    const { who, t, id, action } = req.body ?? {};
    const lead = who === 'customer' ? await db.leadByToken('intake_token', t) : who === 'owner' ? await ownerLead(id, t) : null;
    if (!lead) return reply(res, 404, { ok: false, error: 'This link is not valid.' });
    if (lead.status === 'live') return reply(res, 200, { ok: true, state: 'live', url: lead.live_url });

    if (who === 'owner') {
      if (!['review', 'preview', 'held'].includes(lead.status)) return reply(res, 409, { ok: false, error: 'This site is being built or changed right now. Try again when the next email arrives.' });
      if (action === 'hold') {
        await db.update(lead.id, { status: 'held', owner_ok: false });
        await db.insert('events', { lead_id: lead.id, kind: 'held' });
        return reply(res, 200, { ok: true, state: 'held' });
      }
      await db.update(lead.id, { owner_ok: true, ...(lead.status === 'held' ? { status: lead.customer_ok ? 'review' : 'preview' } : {}) });
      await db.insert('events', { lead_id: lead.id, kind: 'owner_ok' });
      if (lead.customer_ok) {
        await startJob('publish', lead.id);
        return reply(res, 200, { ok: true, state: 'publishing' });
      }
      return reply(res, 200, { ok: true, state: 'approved-early' });
    }

    if (lead.status === 'held') return reply(res, 409, { ok: false, error: 'We are checking a few things on your site first. We will email you shortly.' });
    if (lead.status !== 'preview') return reply(res, 409, { ok: false, error: 'Your preview is still being prepared. We will email you when it is ready.' });
    await db.update(lead.id, { customer_ok: true, ...(lead.owner_ok ? {} : { status: 'review' }) });
    await db.insert('events', { lead_id: lead.id, kind: 'customer_ok' });
    if (lead.owner_ok) {
      await startJob('publish', lead.id);
      return reply(res, 200, { ok: true, state: 'publishing' });
    }
    if (process.env.SITES_OWNER_EMAIL) {
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
    reply(res, 200, { ok: true, state: 'waiting-owner' });
  });
}
