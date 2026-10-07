// Server-only helpers for the client-site funnel: Supabase (the separate "omis-sites"
// project, never OMIS), Resend email, and starting GitHub pipeline jobs.
// Keys live only in Vercel environment variables.

function env(name) {
  const v = process.env[name];
  if (!v) throw new Error(`Missing server setting ${name}`);
  return v;
}

export async function rest(path, init = {}) {
  const key = env('SITES_SUPABASE_SERVICE_ROLE_KEY');
  const res = await fetch(`${env('SITES_SUPABASE_URL')}${path}`, {
    ...init,
    headers: { apikey: key, Authorization: `Bearer ${key}`, 'Content-Type': 'application/json', ...(init.headers ?? {}) },
  });
  if (!res.ok) throw new Error(`Supabase ${res.status}: ${await res.text()}`);
  return res;
}

export const db = {
  async insertLead(row) {
    const res = await rest('/rest/v1/leads', { method: 'POST', headers: { Prefer: 'return=representation' }, body: JSON.stringify(row) });
    return (await res.json())[0];
  },
  async leadByToken(column, token) {
    if (!/^[0-9a-f]{48}$/.test(token ?? '')) return null;
    const rows = await (await rest(`/rest/v1/leads?${column}=eq.${token}&select=*`)).json();
    return rows[0] ?? null;
  },
  async leadById(id) {
    if (!/^[0-9a-f-]{36}$/.test(id ?? '')) return null;
    const rows = await (await rest(`/rest/v1/leads?id=eq.${id}&select=*`)).json();
    return rows[0] ?? null;
  },
  async update(id, patch) {
    await rest(`/rest/v1/leads?id=eq.${id}`, { method: 'PATCH', body: JSON.stringify({ ...patch, updated_at: new Date().toISOString() }) });
  },
  async insert(table, row) {
    await rest(`/rest/v1/${table}`, { method: 'POST', body: JSON.stringify(row) });
  },
  async upload(key, buffer, contentType) {
    await rest(`/storage/v1/object/intake/${key}`, { method: 'POST', headers: { 'Content-Type': contentType, 'x-upsert': 'false' }, body: buffer });
  },
  async latestIntake(leadId) {
    const rows = await (await rest(`/rest/v1/intakes?lead_id=eq.${leadId}&order=created_at.desc&limit=1&select=data`)).json();
    return rows[0]?.data ?? null;
  },
  /** Short-lived links so the customer's own photos show again when they reopen the form. */
  async photoUrls(keys) {
    if (!keys.length) return {};
    const res = await rest('/storage/v1/object/sign/intake', { method: 'POST', body: JSON.stringify({ expiresIn: 3600, paths: keys }) });
    const out = {};
    for (const r of await res.json()) if (r.signedURL) out[r.path] = `${env('SITES_SUPABASE_URL')}/storage/v1${r.signedURL}`;
    return out;
  },
};

const first = (name) => String(name).trim().split(/\s+/)[0];

/** The customer's preview email (same wording as omis-sites/pipeline/job.mjs emailCustomer). */
export async function emailCustomerPreview(lead) {
  const round = lead.change_rounds > 0;
  await sendEmail({
    to: lead.email,
    subject: round ? 'Your updated website preview is ready' : 'Your website preview is ready',
    paragraphs: [
      `Hi ${first(lead.name)},`,
      round ? 'We made your changes. Here is the new preview.' : `Here is a preview of the ${lead.business} website, built from your answers.`,
      'Take a look on your phone too. To change anything, open your form again: your answers are already filled in, and there is a box for anything else. When you are happy, press Publish.',
    ],
    links: [
      { label: 'See your preview', url: lead.preview_url },
      { label: 'Change something', url: `${siteUrl()}/site/intake/${lead.intake_token}` },
      { label: 'Publish my site', url: `${siteUrl()}/site/publish/${lead.intake_token}` },
    ],
  });
}

const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);

export async function sendEmail({ to, subject, paragraphs, links = [] }) {
  const html = `<div style="font:16px/1.55 system-ui,sans-serif;color:#1a1a1a;max-width:560px">${paragraphs.map((p) => `<p>${esc(p)}</p>`).join('')}${links
    .map((l) => `<p><a href="${esc(l.url)}" style="display:inline-block;background:#1a4fa0;color:#fff;padding:10px 18px;border-radius:6px;text-decoration:none">${esc(l.label)}</a></p>`)
    .join('')}</div>`;
  const text = [...paragraphs, ...links.map((l) => `${l.label}: ${l.url}`)].join('\n\n');
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${env('RESEND_API_KEY')}`, 'Content-Type': 'application/json' },
    // Replies go to the owner's inbox (the From address does not need a real mailbox).
    body: JSON.stringify({ from: env('SITES_MAIL_FROM'), to: [to], subject, html, text, ...(process.env.SITES_OWNER_EMAIL ? { reply_to: process.env.SITES_OWNER_EMAIL } : {}) }),
  });
  if (!res.ok) throw new Error(`Email failed: ${res.status} ${await res.text()}`);
}

/** Start a pipeline job in the omis-sites repo (.github/workflows/site-job.yml). */
export async function startJob(command, leadId) {
  const repo = process.env.SITES_GITHUB_REPO || 'otaigbe05/omis-sites';
  const res = await fetch(`https://api.github.com/repos/${repo}/actions/workflows/site-job.yml/dispatches`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${env('SITES_GITHUB_TOKEN')}`, Accept: 'application/vnd.github+json', 'X-GitHub-Api-Version': '2022-11-28' },
    body: JSON.stringify({ ref: process.env.SITES_GITHUB_REF || 'main', inputs: { command, lead_id: leadId } }),
  });
  if (!res.ok) throw new Error(`Could not start ${command}: ${res.status} ${await res.text()}`);
}

export const siteUrl = () => process.env.SITES_PUBLIC_URL || 'https://www.bdoanalyticssolutions.com';

/** Send JSON. Errors are logged on the server and shown to the visitor in plain words. */
export function reply(res, status, body) {
  res.status(status).setHeader('Cache-Control', 'no-store').json(body);
}

export async function handle(res, fn) {
  try {
    await fn();
  } catch (err) {
    console.error(err);
    reply(res, 500, { ok: false, error: 'Something went wrong on our side. Please try again in a few minutes.' });
  }
}
