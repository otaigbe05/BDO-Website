// /api/site-design
//   GET  ?t=<intake token>                  -> the business and its current design
//   POST { t, template }                    -> switch the lead to another design of the same trade
// Reached from "Choose this design" in the multi-design preview (omis-sites
// scripts/build-previews.mjs). Switching only changes the design; the customer then reopens their
// form (answers kept) to add anything the new design needs and sends it, which rebuilds the
// preview the usual way. Changes happen only on POST from a confirm button, never on a plain
// link, so email link scanners cannot switch a design by "clicking" it.
import { db, reply, handle, siteUrl, sendEmail } from './_lib/services.js';
// Switch policy (owner-approved 2026-10-19): free before launch; one free switch in the first 30
// days live; after that a new design is a paid change, arranged by the team (not automatic).
const FREE_DAYS = 30;

const TEMPLATE_RE = /^[TBASP]\d{2}$/;

/** The design exists in the gallery catalog (so a typo or an old id cannot be saved). */
async function inCatalog(id) {
  try {
    const res = await fetch(`${siteUrl()}/templates/catalog.json`);
    if (!res.ok) return null;
    const t = ((await res.json()).templates ?? []).find((x) => x.id === id);
    return t ? { id: t.id, name: t.name } : null;
  } catch {
    return null;
  }
}

export default async function handler(req, res) {
  await handle(res, async () => {
    const token = req.method === 'GET' ? req.query.t : req.body?.t;
    const lead = await db.leadByToken('intake_token', token);
    if (!lead) return reply(res, 404, { ok: false, error: 'This link is not valid. Check the email we sent you.' });
    if (req.method === 'GET') return reply(res, 200, { ok: true, business: lead.business, template: lead.template, status: lead.status, previewUrl: lead.preview_url });
    if (req.method !== 'POST') return reply(res, 405, { ok: false, error: 'GET or POST only' });

    const template = String(req.body?.template ?? '');
    // Same trade only: the answers were collected for this kind of business.
    if (!TEMPLATE_RE.test(template) || template[0] !== lead.template[0]) return reply(res, 400, { ok: false, error: 'That design is not available for your business.' });
    if (template === lead.template) return reply(res, 200, { ok: true, same: true });
    if (!['preview', 'review', 'live'].includes(lead.status)) return reply(res, 409, { ok: false, error: 'Your site is being built or changed right now. Try again when the next email arrives.' });
    const found = await inCatalog(template);
    if (!found) return reply(res, 400, { ok: false, error: 'That design is not available right now.' });

    const live = lead.status === 'live' || !!lead.live_url;
    if (live) {
      const lives = await db.events(lead.id, 'live');
      const since = lives.length ? lives[lives.length - 1].at : lead.updated_at;
      const days = (Date.now() - new Date(since).getTime()) / 86400000;
      const used = await db.countEvents(lead.id, 'design_switch', since, '&detail->>live=eq.true');
      if (days > FREE_DAYS || used > 0) {
        if (process.env.SITES_OWNER_EMAIL) {
          await sendEmail({
            to: process.env.SITES_OWNER_EMAIL,
            subject: `[Sites] Paid design switch asked: ${lead.business} (${lead.template} to ${template})`,
            paragraphs: [`${lead.name} <${lead.email}> asked to switch their live site from ${lead.template} to ${template} (${found.name}).`, `Live for ${Math.floor(days)} days, free switches used: ${used}. This is outside the free switch, so it is a paid new design. Reply to them to arrange it.`],
          });
        }
        await db.insert('events', { lead_id: lead.id, kind: 'design_switch_asked', detail: { from: lead.template, to: template } });
        return reply(res, 402, { ok: false, paid: true, error: `Your free design switch was for the first ${FREE_DAYS} days after launch. A new design now is a paid change: we have passed your request to the team, and they will email you shortly.` });
      }
    }

    // A new design starts on its first colour palette and needs the customer's and owner's OK again.
    await db.update(lead.id, { template, palette: 1, customer_ok: false, owner_ok: false });
    await db.insert('events', { lead_id: lead.id, kind: 'design_switch', detail: { from: lead.template, to: template, live } });
    reply(res, 200, { ok: true, template: found });
  });
}
