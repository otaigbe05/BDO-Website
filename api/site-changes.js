// /api/site-changes
//   GET  ?t=<intake token>        -> preview link and how many change rounds are left
//   POST { t, request }           -> save the request and start the changes job
import { changeSchema, problems } from './_lib/schemas.js';
import { db, startJob, reply, handle } from './_lib/services.js';

const ROUNDS = 2;

export default async function handler(req, res) {
  await handle(res, async () => {
    const token = req.method === 'GET' ? req.query.t : req.body?.t;
    const lead = await db.leadByToken('intake_token', token);
    if (!lead) return reply(res, 404, { ok: false, error: 'This link is not valid. Check the email we sent you.' });
    const left = Math.max(0, ROUNDS - lead.change_rounds);
    if (req.method === 'GET') return reply(res, 200, { ok: true, business: lead.business, status: lead.status, previewUrl: lead.preview_url, liveUrl: lead.live_url, roundsLeft: left });
    if (req.method !== 'POST') return reply(res, 405, { ok: false, error: 'GET or POST only' });

    const parsed = changeSchema.safeParse(req.body ?? {});
    if (!parsed.success) return reply(res, 400, { ok: false, problems: problems(parsed.error) });
    if (!['preview', 'changes_requested'].includes(lead.status)) return reply(res, 409, { ok: false, error: lead.status === 'live' ? 'Your site is already live. Reply to our email for changes.' : 'Your site is being updated. Please wait for the next email.' });
    await db.insert('change_requests', { lead_id: lead.id, request: parsed.data.request });
    await db.update(lead.id, { status: 'changes_requested' });
    await db.insert('events', { lead_id: lead.id, kind: 'change_request', detail: { length: parsed.data.request.length } });
    // Over the included rounds, the job emails the owner instead of rebuilding.
    await startJob('changes', lead.id);
    reply(res, 200, { ok: true, roundsLeft: left });
  });
}
