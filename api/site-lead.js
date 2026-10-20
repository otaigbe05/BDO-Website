// POST /api/site-lead: "Use this design" form. Saves the lead, emails the owner, and emails
// the customer their private intake link.
import { leadSchema, problems } from './_lib/schemas.js';
import { db, sendEmail, siteUrl, reply, handle } from './_lib/services.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') return reply(res, 405, { ok: false, error: 'POST only' });
  await handle(res, async () => {
    const parsed = leadSchema.safeParse(req.body ?? {});
    if (!parsed.success) return reply(res, 400, { ok: false, problems: problems(parsed.error) });
    const f = parsed.data;
    const lead = await db.insertLead({
      name: f.name, email: f.email, phone: f.phone ?? null, business: f.business, city: f.city ?? null,
      template: f.template, palette: f.palette, package: f.package, has_domain: f.hasDomain ?? null, domain: f.domain ?? null,
      status: f.package === 'store' ? 'new' : 'intake_sent',
    });
    await db.insert('events', { lead_id: lead.id, kind: 'lead', detail: { template: f.template, package: f.package } });
    // The designs to build the preview in (read by the build pipeline, omis-sites pipeline/job.mjs).
    const designs = [...new Set([f.template, ...(f.designs ?? [])])].filter((id) => id[0] === f.template[0]).slice(0, 10);
    // The country prefills the details form (api/site-intake.js); the leads table has no column for it.
    if (f.country) await db.insert('events', { lead_id: lead.id, kind: 'country', detail: { country: f.country } });
    if (designs.length > 1) await db.insert('events', { lead_id: lead.id, kind: 'shortlist', detail: { designs } });
    // Read by the build pipeline at go-live (omis-sites pipeline/job.mjs), which buys and connects it.
    if (f.wantDomain && !f.domain) await db.insert('events', { lead_id: lead.id, kind: 'domain_wanted', detail: { name: f.wantDomain } });

    const first = f.name.split(/\s+/)[0];
    if (f.package === 'store') {
      // Online stores are custom work: the owner follows up personally.
      await sendEmail({
        to: f.email,
        subject: 'We got your request',
        paragraphs: [`Hi ${first},`, `Thanks for asking about a website with an online store for ${f.business}. Stores are built to order, so we will email you within one business day to ask a few questions about your products.`],
      });
    } else {
      await sendEmail({
        to: f.email,
        subject: `Next step for the ${f.business} website`,
        paragraphs: [
          `Hi ${first},`,
          `Thanks for choosing template ${f.template}. The next step is a short form about your business: hours, services and prices, your team, and your photos. It takes about 15 minutes, and you can do it on your phone.`,
          'When you send it, we build a preview of your site and email you the link.',
        ],
        links: [{ label: 'Fill in your details', url: `${siteUrl()}/site/intake/${lead.intake_token}` }],
      });
    }
    if (process.env.SITES_OWNER_EMAIL) {
      await sendEmail({
        to: process.env.SITES_OWNER_EMAIL,
        subject: `[Sites] New lead: ${f.business} (${f.template}, ${f.package})`,
        paragraphs: [`${f.name} <${f.email}> ${f.phone ?? ''}`, `${f.business}, ${[f.city, f.country].filter(Boolean).join(', ')}`, `Template ${f.template}${f.designs?.length > 1 ? ` (preview in ${f.designs.length}: ${f.designs.join(', ')})` : ''}, palette ${f.palette}, package ${f.package}, domain: ${f.domain ?? (f.hasDomain ? 'has one' : f.wantDomain ? `buy ${f.wantDomain} for them at go-live` : 'none yet')}`],
      });
    }
    reply(res, 200, { ok: true, store: f.package === 'store' });
  });
}
