// /api/newsletter - the BDO newsletter list (table newsletter_subscribers in the omis-sites project;
// omis-sites pipeline/migrations/2026-11-16-newsletter.sql). Canada's anti-spam law (CASL):
// double opt-in, the consent wording and page kept, a working unsubscribe in every email.
//   POST { action: "subscribe", email, consent: true, page }  -> "check your inbox" (sends the confirm email)
//   POST { action: "confirm", t }                             -> confirmed (the Confirm button on /newsletter/confirm/<t>)
//   POST { action: "unsubscribe", t }                         -> unsubscribed (the button on /newsletter/unsubscribe/<t>)
//   POST ?unsubscribe=<t>  (List-Unsubscribe-Post one-click from mail apps, RFC 8058) -> unsubscribed
//   GET  ?t=<token>                                           -> { status, email (masked) } for those pages
// The answer to "subscribe" is the same whether or not the address is already on the list, so the
// form never tells anyone who is subscribed.
import { randomBytes } from 'node:crypto';
import { rest, sendEmail, siteUrl, reply, handle } from './_lib/services.js';
import { NEWSLETTER_CONSENT, NEWSLETTER_SENDER } from '../src/data/newsletter.js';

const TOKEN = /^[0-9a-f]{48}$/;
const EMAIL = /^[^\s@<>()",;:]{1,64}@[^\s@<>()",;:]+\.[a-z]{2,}$/i;
const RESEND_AFTER_MS = 10 * 60 * 1000;
const TABLE = '/rest/v1/newsletter_subscribers';

const mask = (e) => e.replace(/^(.)[^@]*(@.*)$/, (_, a, d) => `${a}***${d}`);

async function byToken(t) {
  if (!TOKEN.test(t ?? '')) return null;
  const rows = await (await rest(`${TABLE}?token=eq.${t}&select=id,email,status,token`)).json();
  return rows[0] ?? null;
}

async function patch(id, body) {
  await rest(`${TABLE}?id=eq.${id}`, { method: 'PATCH', body: JSON.stringify(body) });
}

async function sendConfirm(email, token) {
  await sendEmail({
    to: email,
    subject: 'Please confirm: the BDO Analytics Solutions newsletter',
    paragraphs: [
      'Thanks for signing up. Please press the button below to confirm that you want the BDO Analytics Solutions newsletter: one email a month with practical guides for appointment-based shops.',
      'If you did not ask for this, ignore this email: you will not be added and will not hear from us.',
      `${NEWSLETTER_SENDER.name}, ${NEWSLETTER_SENDER.address}. ${NEWSLETTER_SENDER.email}`,
    ],
    links: [{ label: 'Yes, subscribe me', url: `${siteUrl()}/newsletter/confirm/${token}` }],
  });
}

async function subscribe(req, res) {
  const b = req.body ?? {};
  // A hidden field people never see; bots fill it in. Pretend it worked.
  if (b.company) return reply(res, 200, { ok: true });
  const email = String(b.email ?? '').trim().toLowerCase();
  if (!EMAIL.test(email) || email.length > 254) return reply(res, 400, { ok: false, error: 'Please enter a valid email address.' });
  if (b.consent !== true) return reply(res, 400, { ok: false, error: 'Please tick the box to agree to receive the newsletter.' });
  const page = String(b.page ?? '').slice(0, 200) || null;
  const now = new Date();
  const rows = await (await rest(`${TABLE}?email=eq.${encodeURIComponent(email)}&select=id,status,token,confirm_sent_at`)).json();
  const row = rows[0];
  if (!row) {
    const token = randomBytes(24).toString('hex');
    await rest(TABLE, { method: 'POST', body: JSON.stringify({ email, token, consent_text: NEWSLETTER_CONSENT, consent_page: page, confirm_sent_at: now.toISOString() }) });
    await sendConfirm(email, token);
  } else if (row.status !== 'confirmed') {
    // Pending or unsubscribed: they are asking again, so record this consent and send a fresh
    // confirm email (at most once every 10 minutes). They stay off the list until they confirm.
    const recent = row.confirm_sent_at && now - new Date(row.confirm_sent_at) < RESEND_AFTER_MS;
    await patch(row.id, { status: 'pending', consent_text: NEWSLETTER_CONSENT, consent_page: page, ...(recent ? {} : { confirm_sent_at: now.toISOString() }) });
    if (!recent) await sendConfirm(email, row.token);
  }
  reply(res, 200, { ok: true });
}

async function setStatus(res, t, status) {
  const row = await byToken(t);
  if (!row) return reply(res, 404, { ok: false, error: 'This link is not valid. It may have been copied incompletely.' });
  if (row.status !== status) {
    const when = new Date().toISOString();
    await patch(row.id, status === 'confirmed' ? { status, confirmed_at: when, unsubscribed_at: null } : { status, unsubscribed_at: when });
  }
  reply(res, 200, { ok: true, status, email: mask(row.email) });
}

export default async function handler(req, res) {
  await handle(res, async () => {
    if (req.method === 'GET') {
      const row = await byToken(req.query.t);
      if (!row) return reply(res, 404, { ok: false, error: 'This link is not valid. It may have been copied incompletely.' });
      return reply(res, 200, { ok: true, status: row.status, email: mask(row.email) });
    }
    if (req.method !== 'POST') return reply(res, 405, { ok: false, error: 'GET or POST only' });
    // One-click unsubscribe from the mail app's own button (List-Unsubscribe-Post).
    if (req.query.unsubscribe) return setStatus(res, String(req.query.unsubscribe), 'unsubscribed');
    const action = req.body?.action;
    if (action === 'subscribe') return subscribe(req, res);
    if (action === 'confirm') return setStatus(res, req.body.t, 'confirmed');
    if (action === 'unsubscribe') return setStatus(res, req.body.t, 'unsubscribed');
    reply(res, 400, { ok: false, error: 'Unknown action.' });
  });
}
