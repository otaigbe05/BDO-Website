// /api/site-golive
//   GET  ?id=<lead id>&t=<approve token>                          -> owner's review summary
//   POST { who: "customer", t: <intake token> }                   -> customer presses Publish
//   POST { who: "owner", id, t: <approve token>, action }         -> owner approves or holds
// Go-live needs both (owner approval is automatic when AUTO_APPROVE is on in the pipeline).
// Changes happen only on POST from a confirm button, never on a plain link, so email link
// scanners cannot publish a site by "clicking" it.
import { timingSafeEqual } from 'node:crypto';
import { db, startJob, reply, handle } from './_lib/services.js';

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
        customerOk: lead.customer_ok, ownerOk: lead.owner_ok, report: lead.report,
      });
    }
    if (req.method !== 'POST') return reply(res, 405, { ok: false, error: 'GET or POST only' });

    const { who, t, id, action } = req.body ?? {};
    const lead = who === 'customer' ? await db.leadByToken('intake_token', t) : who === 'owner' ? await ownerLead(id, t) : null;
    if (!lead) return reply(res, 404, { ok: false, error: 'This link is not valid.' });
    if (lead.status === 'live') return reply(res, 200, { ok: true, state: 'live', url: lead.live_url });
    if (!['preview', 'held'].includes(lead.status)) return reply(res, 409, { ok: false, error: 'This site is not ready to publish yet.' });

    if (who === 'owner' && action === 'hold') {
      await db.update(lead.id, { status: 'held', owner_ok: false });
      await db.insert('events', { lead_id: lead.id, kind: 'held' });
      return reply(res, 200, { ok: true, state: 'held' });
    }
    if (who === 'customer' && lead.status === 'held') {
      await db.update(lead.id, { customer_ok: true });
      return reply(res, 200, { ok: true, state: 'waiting-owner' });
    }
    const patch = who === 'customer' ? { customer_ok: true } : { owner_ok: true, status: 'preview' };
    await db.update(lead.id, patch);
    await db.insert('events', { lead_id: lead.id, kind: `${who}_ok` });
    const next = { ...lead, ...patch };
    if (next.customer_ok && next.owner_ok) {
      await startJob('publish', lead.id);
      return reply(res, 200, { ok: true, state: 'publishing' });
    }
    reply(res, 200, { ok: true, state: who === 'customer' ? 'waiting-owner' : 'waiting-customer' });
  });
}
