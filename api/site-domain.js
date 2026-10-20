// GET /api/site-domain?names=joesbarbers.ca,joesbarbers.com : the start form's name picker (same as
// ChurchNow's). For each name (up to 8): very likely free, taken, or unknown, from the public
// registration lookup (RDAP, no login). "Free" is a strong hint, not a promise: the name is
// checked again with the registrar before it is bought at go-live.
import { reply } from './_lib/services.js';

const DOMAIN_RE = /^(?=.{4,80}$)([a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,24}$/;
const clean = (v) => {
  const d = String(v ?? '').trim().toLowerCase().replace(/^https?:\/\//, '').replace(/[/?#].*$/, '').replace(/^www\./, '').replace(/\.$/, '');
  return DOMAIN_RE.test(d) ? d : '';
};

async function lookup(name) {
  try {
    const r = await fetch(`https://rdap.org/domain/${encodeURIComponent(name)}`, { headers: { accept: 'application/rdap+json', 'user-agent': 'BDO Analytics Solutions domain check (bdoanalyticssolutions.com)' }, redirect: 'follow', signal: AbortSignal.timeout(6000) });
    return { name, free: r.status === 404 ? true : r.ok ? false : null };
  } catch {
    return { name, free: null };
  }
}

export default async function handler(req, res) {
  if (req.method !== 'GET') return reply(res, 405, { ok: false });
  const names = [...new Set(String(req.query.names ?? '').split(',').map(clean).filter(Boolean))].slice(0, 8);
  reply(res, 200, { ok: true, results: await Promise.all(names.map(lookup)) });
}
