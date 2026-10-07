// /api/site-golive
//   GET  ?id=<lead id>&t=<approve token>                          -> owner's review summary
//   POST { who: "owner", id, t: <approve token>, action }         -> "approve" (send to customer) or "hold"
//   POST { who: "customer", t: <intake token> }                   -> customer presses Publish
// Every new preview waits in "review" for the owner. Approving sends the customer the preview;
// the customer's Publish then puts the site live. (With AUTO_APPROVE on in the pipeline the
// owner step is skipped.) Changes happen only on POST from a confirm button, never on a plain
// link, so email link scanners cannot approve or publish by "clicking" it.
import { timingSafeEqual } from 'node:crypto';
import { db, startJob, reply, handle, emailCustomerPreview } from './_lib/services.js';

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
      const firstLook = lead.status !== 'preview';
      await db.update(lead.id, { owner_ok: true, status: 'preview' });
      await db.insert('events', { lead_id: lead.id, kind: 'owner_ok' });
      if (lead.customer_ok) {
        await startJob('publish', lead.id);
        return reply(res, 200, { ok: true, state: 'publishing' });
      }
      if (firstLook) await emailCustomerPreview(lead);
      return reply(res, 200, { ok: true, state: 'sent-to-customer' });
    }

    if (lead.status !== 'preview') return reply(res, 409, { ok: false, error: 'Your preview is still being prepared. We will email you when it is ready.' });
    await db.update(lead.id, { customer_ok: true });
    await db.insert('events', { lead_id: lead.id, kind: 'customer_ok' });
    if (lead.owner_ok) {
      await startJob('publish', lead.id);
      return reply(res, 200, { ok: true, state: 'publishing' });
    }
    reply(res, 200, { ok: true, state: 'waiting-owner' });
  });
}
