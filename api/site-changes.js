// /api/site-changes
//   GET  ?t=<intake token>        -> preview link and how many change rounds are left
//   POST { t, request }           -> save the request and start the changes job
// The question step (omis-sites docs/SPEC-change-requests.md, outcome "question"):
//   GET  ?t=<token>&q=<question id>        -> their request and our question (and the answer, if given)
//   POST { t, q, answer, o? }              -> save the answer once and run the request again with it
//   o is the owner's approve key ("Answer for them" in the owner's copy). Whoever answers first wins.
import { timingSafeEqual } from 'node:crypto';
import { changeSchema, answerSchema, problems } from './_lib/schemas.js';
import { db, rest, startJob, reply, handle, updatesLeft, updateOverLimit, UPDATES_PER_MONTH } from './_lib/services.js';
import { summarize } from './_lib/sample.js';

const ROUNDS = 2;
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
// While a job runs, a new request or answer would be missed: they wait for its email.
const READY = ['preview', 'changes_requested', 'live'];

async function questionRow(leadId, id) {
  if (!UUID.test(id ?? '')) return null;
  const rows = await (await rest(`/rest/v1/change_requests?id=eq.${id}&lead_id=eq.${leadId}&question=not.is.null&select=id,request,question,answer,answered_at,answered_by`)).json();
  return rows[0] ?? null;
}

const isOwner = (lead, key) => typeof key === 'string' && typeof lead.approve_token === 'string' && key.length === lead.approve_token.length && timingSafeEqual(Buffer.from(key), Buffer.from(lead.approve_token));

async function answer(req, res, lead) {
  const parsed = answerSchema.safeParse(req.body ?? {});
  if (!parsed.success) return reply(res, 400, { ok: false, problems: problems(parsed.error) });
  const { q, answer: text, o } = parsed.data;
  const row = await questionRow(lead.id, q);
  if (!row) return reply(res, 404, { ok: false, error: 'This link is not valid. Check the email we sent you.' });
  if (row.answered_at) return reply(res, 200, { ok: true, already: true, answer: row.answer });
  if (!READY.includes(lead.status)) return reply(res, 409, { ok: false, error: 'Your site is being updated right now. Please try again after the next email from us.' });
  const by = o && isOwner(lead, o) ? 'owner' : 'customer';
  // Claim it in one step, so a second answer (customer and owner at once) cannot run it twice.
  const claimed = await (await rest(`/rest/v1/change_requests?id=eq.${row.id}&answered_at=is.null`, {
    method: 'PATCH',
    headers: { Prefer: 'return=representation' },
    body: JSON.stringify({ answer: text, answered_at: new Date().toISOString(), answered_by: by }),
  })).json();
  if (!claimed.length) return reply(res, 200, { ok: true, already: true, answer: (await questionRow(lead.id, q))?.answer ?? '' });
  // The request runs again with everything together, so Claude keeps the context.
  await db.insert('change_requests', { lead_id: lead.id, from_id: row.id, request: `${row.request}\n\nWe asked: ${row.question}\n\nTheir answer: ${text}` });
  const live = Boolean(lead.live_url);
  await db.update(lead.id, { status: 'changes_requested', ...(live ? { customer_ok: false, owner_ok: false } : {}) });
  // Its own event kind: an answer finishes a request already made, so it does not count as a
  // new update this month or a new change round (owner decision 2026-11-14).
  await db.insert('events', { lead_id: lead.id, kind: 'change_answer', detail: { question: row.id, by, live } });
  await startJob('changes', lead.id);
  reply(res, 200, { ok: true, by });
}

export default async function handler(req, res) {
  await handle(res, async () => {
    const token = req.method === 'GET' ? req.query.t : req.body?.t;
    const lead = await db.leadByToken('intake_token', token);
    if (!lead) return reply(res, 404, { ok: false, error: 'This link is not valid. Check the email we sent you.' });
    const left = Math.max(0, ROUNDS - lead.change_rounds);
    if (req.method === 'GET' && req.query.q) {
      const row = await questionRow(lead.id, req.query.q);
      if (!row) return reply(res, 404, { ok: false, error: 'This link is not valid. Check the email we sent you.' });
      return reply(res, 200, { ok: true, business: lead.business, request: row.request, question: row.question, answered: Boolean(row.answered_at), answer: row.answer, answeredBy: row.answered_by, owner: isOwner(lead, req.query.o) });
    }
    if (req.method === 'GET') return reply(res, 200, { ok: true, business: lead.business, status: lead.status, previewUrl: lead.preview_url, liveUrl: lead.live_url, roundsLeft: left, template: lead.template, have: summarize(lead.client) });
    if (req.method !== 'POST') return reply(res, 405, { ok: false, error: 'GET or POST only' });
    if (req.body?.q) return answer(req, res, lead);

    const parsed = changeSchema.safeParse(req.body ?? {});
    if (!parsed.success) return reply(res, 400, { ok: false, problems: problems(parsed.error) });
    if (!READY.includes(lead.status)) return reply(res, 409, { ok: false, error: 'Your site is being updated. Please wait for the next email.' });
    // Has a live site (also while an update of it waits as a preview).
    const live = Boolean(lead.live_url);
    if (live && (await updatesLeft(lead)) === 0) {
      await updateOverLimit(lead, parsed.data.request);
      return reply(res, 200, { ok: true, overLimit: true, updatesPerMonth: UPDATES_PER_MONTH });
    }
    await db.insert('change_requests', { lead_id: lead.id, request: parsed.data.request });
    // On a live site the owner checks the update again before it replaces the live one.
    await db.update(lead.id, { status: 'changes_requested', ...(live ? { customer_ok: false, owner_ok: false } : {}) });
    await db.insert('events', { lead_id: lead.id, kind: 'change_request', detail: { length: parsed.data.request.length, live } });
    // Over the included rounds, the job emails the owner instead of rebuilding.
    await startJob('changes', lead.id);
    reply(res, 200, { ok: true, roundsLeft: left });
  });
}
