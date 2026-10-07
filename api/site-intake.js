// /api/site-intake
//   GET  ?t=<intake token>        -> what we know (to prefill the form), the lead's state, and in
//                                   edit mode the previous answers with links to their photos
//   POST { t, data, changeNotes } -> first time: save the intake and start the build job
//                                   edit mode (after a preview): save the updated answers plus the
//                                   customer's notes and start the changes job
import { intakeSchema, problems, photoProblems, CONSENT_VERSION } from './_lib/schemas.js';
import { db, startJob, reply, handle } from './_lib/services.js';

const FIRST = ['new', 'intake_sent', 'failed'];
const EDIT = ['preview'];
const ROUNDS = 2;

export default async function handler(req, res) {
  await handle(res, async () => {
    const token = req.method === 'GET' ? req.query.t : req.body?.t;
    const lead = await db.leadByToken('intake_token', token);
    if (!lead) return reply(res, 404, { ok: false, error: 'This link is not valid. Check the email we sent you.' });
    const mode = FIRST.includes(lead.status) ? 'first' : EDIT.includes(lead.status) ? 'edit' : 'closed';

    if (req.method === 'GET') {
      let previous = null;
      let photoUrls = {};
      if (mode === 'edit') {
        previous = await db.latestIntake(lead.id);
        photoUrls = previous ? await db.photoUrls(previous.photos.map((p) => p.key)) : {};
      }
      return reply(res, 200, {
        ok: true,
        mode,
        open: mode !== 'closed',
        status: lead.status,
        roundsLeft: Math.max(0, ROUNDS - lead.change_rounds),
        previewUrl: lead.preview_url,
        lead: { name: lead.name, email: lead.email, phone: lead.phone, business: lead.business, city: lead.city, template: lead.template, palette: lead.palette, package: lead.package, domain: lead.domain },
        previous,
        photoUrls,
      });
    }
    if (req.method !== 'POST') return reply(res, 405, { ok: false, error: 'GET or POST only' });
    if (mode === 'closed') {
      return reply(res, 409, { ok: false, error: lead.status === 'live' ? 'Your site is live. Reply to any of our emails to change it.' : 'We are working on your site right now. Watch your email for the next step.' });
    }

    const data = req.body?.data ?? {};
    const consent = data.consent?.accepted === true ? { accepted: true, version: CONSENT_VERSION, at: new Date().toISOString() } : data.consent;
    const parsed = intakeSchema.safeParse({ ...data, consent, template: lead.template, palette: lead.palette, package: lead.package === 'site-omis' ? 'site-omis' : 'site' });
    if (!parsed.success) return reply(res, 400, { ok: false, problems: problems(parsed.error) });
    // Photos must be ones this customer uploaded.
    if (parsed.data.photos.some((p) => !p.key.startsWith(`${lead.id}/`))) return reply(res, 400, { ok: false, problems: ['photos: please upload your photos again.'] });
    const photoIssues = photoProblems(lead.template, parsed.data.photos);
    if (photoIssues.length) return reply(res, 400, { ok: false, problems: photoIssues });

    await db.insert('intakes', { lead_id: lead.id, data: parsed.data });
    if (mode === 'first') {
      await db.update(lead.id, { status: 'intake_done', ...(parsed.data.domain ? { domain: parsed.data.domain } : {}) });
      await db.insert('events', { lead_id: lead.id, kind: 'intake', detail: { photos: parsed.data.photos.length, team: parsed.data.team.length, consent: CONSENT_VERSION } });
      await startJob('build', lead.id);
      return reply(res, 200, { ok: true, mode });
    }
    const notes = String(req.body?.changeNotes ?? '').trim().slice(0, 3000);
    await db.insert('change_requests', { lead_id: lead.id, request: notes.length >= 3 ? notes : 'Updated details in the form.' });
    await db.update(lead.id, { status: 'changes_requested', customer_ok: false });
    await db.insert('events', { lead_id: lead.id, kind: 'change_request', detail: { notes: notes.length, photos: parsed.data.photos.length } });
    await startJob('changes', lead.id);
    reply(res, 200, { ok: true, mode, roundsLeft: Math.max(0, ROUNDS - lead.change_rounds) });
  });
}
