// /api/site-intake
//   GET  ?t=<intake token>  -> what we already know (to prefill the form) and the lead's state
//   POST { t, data }        -> save the intake and start the build job
import { intakeSchema, problems } from './_lib/schemas.js';
import { db, startJob, reply, handle } from './_lib/services.js';

const OPEN = ['new', 'intake_sent', 'failed'];

export default async function handler(req, res) {
  await handle(res, async () => {
    const token = req.method === 'GET' ? req.query.t : req.body?.t;
    const lead = await db.leadByToken('intake_token', token);
    if (!lead) return reply(res, 404, { ok: false, error: 'This link is not valid. Check the email we sent you.' });

    if (req.method === 'GET') {
      return reply(res, 200, {
        ok: true,
        open: OPEN.includes(lead.status),
        status: lead.status,
        lead: { name: lead.name, email: lead.email, phone: lead.phone, business: lead.business, city: lead.city, template: lead.template, palette: lead.palette, package: lead.package, domain: lead.domain },
      });
    }
    if (req.method !== 'POST') return reply(res, 405, { ok: false, error: 'GET or POST only' });
    if (!OPEN.includes(lead.status)) return reply(res, 409, { ok: false, error: 'We already have your details and are building your site. Watch your email.' });

    const parsed = intakeSchema.safeParse({ ...(req.body?.data ?? {}), template: lead.template, palette: lead.palette, package: lead.package === 'site-omis' ? 'site-omis' : 'site' });
    if (!parsed.success) return reply(res, 400, { ok: false, problems: problems(parsed.error) });
    // Photos must be ones this customer uploaded.
    if (parsed.data.photos.some((p) => !p.key.startsWith(`${lead.id}/`))) return reply(res, 400, { ok: false, problems: ['photos: please upload your photos again.'] });

    await db.insert('intakes', { lead_id: lead.id, data: parsed.data });
    await db.update(lead.id, { status: 'intake_done', ...(parsed.data.domain ? { domain: parsed.data.domain } : {}) });
    await db.insert('events', { lead_id: lead.id, kind: 'intake', detail: { photos: parsed.data.photos.length, team: parsed.data.team.length } });
    await startJob('build', lead.id);
    reply(res, 200, { ok: true });
  });
}
