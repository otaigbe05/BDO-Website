// Form checks for the client-site funnel. The intake schema is a COPY of
// omis-sites/pipeline/intake.mjs (intakeSchema); keep the two in step when either changes.
import { z } from 'zod';

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const TIME_RE = /^([01]\d|2[0-3]):[0-5]\d$/;
const str = (max) => z.string().trim().min(1).max(max);
const opt = (max) => z.string().trim().max(max).optional().transform((v) => (v ? v : undefined));
const handle = z.string().trim().transform((v) => v.replace(/^@/, '')).pipe(z.string().regex(/^[A-Za-z0-9._]{0,30}$/)).optional().transform((v) => (v ? v : undefined));
const https = z.string().trim().max(300).optional().transform((v) => (v ? v : undefined)).pipe(z.url({ protocol: /^https$/ }).optional());
const phone = z.string().trim().refine((v) => v.replace(/\D/g, '').length >= 10, 'Phone needs at least 10 digits.');

export const PROVINCES = ['ON', 'QC', 'BC', 'AB', 'MB', 'SK', 'NS', 'NB', 'NL', 'PE', 'YT', 'NT', 'NU'];
export const STATES = ['AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'DC', 'FL', 'GA', 'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD', 'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ', 'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'];

/** "n1r1a1", "N1R-1A1" -> "N1R 1A1"; "14201 1234" -> "14201-1234". Anything else is left as typed. */
export function tidyPostal(country, v) {
  if (country === 'US') {
    const d = String(v).replace(/\D/g, '');
    return d.length === 9 ? `${d.slice(0, 5)}-${d.slice(5)}` : d.length === 5 ? d : String(v).trim();
  }
  const c = String(v).toUpperCase().replace(/[^A-Z0-9]/g, '');
  return /^[A-Z]\d[A-Z]\d[A-Z]\d$/.test(c) ? `${c.slice(0, 3)} ${c.slice(3)}` : String(v).trim();
}

export const leadSchema = z
  .object({
    name: str(80),
    email: z.email().max(200),
    phone: phone.optional(),
    business: str(80),
    city: opt(60),
    template: z.string().regex(/^[TBASP]\d{2}$/),
    palette: z.coerce.number().int().min(1).max(3).default(1),
    package: z.enum(['site', 'site-omis', 'store']),
    hasDomain: z.boolean().optional(),
    domain: z.string().trim().toLowerCase().regex(/^[a-z0-9.-]+\.[a-z]{2,}$/).optional().or(z.literal('').transform(() => undefined)),
    // Spam checks: a hidden field people never fill, and how long the form was open.
    website: z.string().max(0).optional(),
    openedMs: z.number().min(3000),
  })
  .strict();

const photo = z
  .object({
    key: str(300),
    kind: z.enum(['logo', 'hero', 'about', 'work', 'team', 'service']),
    member: opt(60),
    service: opt(80),
    caption: opt(120),
    price: opt(40),
  })
  .strict();

export const intakeSchema = z
  .object({
    template: z.string().regex(/^[TBASP]\d{2}$/),
    palette: z.int().min(1).max(3).default(1),
    package: z.enum(['site', 'site-omis']),
    domain: z.string().trim().toLowerCase().regex(/^[a-z0-9.-]+\.[a-z]{2,}$/).optional(),
    business: z
      .object({
        name: str(80),
        tagline: opt(140),
        phone,
        email: z.email().optional(),
        street: str(120),
        city: str(60),
        country: z.enum(['CA', 'US']).default('CA'),
        province: z.enum([...PROVINCES, ...STATES]), // province or state code
        postal: z.string(),
        instagram: handle,
        googleBusinessUrl: https,
        foundedYear: z.int().min(1900).max(new Date().getFullYear()).optional(),
      })
      .strict()
      // Accept any spacing or dashes from copy and paste; store as "N1R 1A1" or "14201".
      .transform((b) => ({ ...b, postal: tidyPostal(b.country, b.postal) }))
      .superRefine((b, ctx) => {
        const ca = b.country === 'CA';
        if (!(ca ? PROVINCES : STATES).includes(b.province)) ctx.addIssue({ code: 'custom', path: ['province'], message: ca ? 'Choose a province.' : 'Choose a state.' });
        if (!(ca ? /^[A-Z]\d[A-Z] \d[A-Z]\d$/ : /^\d{5}(-\d{4})?$/).test(b.postal)) ctx.addIssue({ code: 'custom', path: ['postal'], message: ca ? 'Postal code: 3 letters and 3 numbers, like N1R 1A1.' : 'ZIP code: 5 numbers, like 14201.' });
      }),
    hours: z.array(z.object({ day: z.enum(DAYS), open: z.string().regex(TIME_RE), close: z.string().regex(TIME_RE) }).strict()).min(1, 'Add at least one open day.'),
    hoursNote: opt(200),
    omisUrl: https,
    services: z
      .array(z.object({ name: str(80), price: str(40), duration: opt(60), description: opt(300), category: opt(60) }).strict())
      .min(1, 'Add at least one service with a price.'),
    team: z
      .array(z.object({ name: str(60), role: str(80), specialty: opt(120), instagram: handle, bookingUrl: https }).strict())
      .default([]),
    photos: z.array(photo).max(60).default([]),
    aboutNotes: opt(3000),
    policyNotes: opt(2000),
    faqNotes: opt(3000),
    extraNotes: opt(2000),
    reviews: z.array(z.object({ quote: str(400), author: str(60), source: opt(40) }).strict()).max(12).default([]),
    // The content release (SiteIntake.jsx CONSENT_TEXT). The server stamps version and time.
    consent: z.object({ accepted: z.literal(true, { error: 'Please tick the box to confirm the content release.' }), version: str(20), at: str(40) }).strict(),
  })
  .strict();

// Bump when the release wording in SiteIntake.jsx changes, so each intake records what was agreed.
export const CONSENT_VERSION = '2026-10-07';

// Designs that need a minimum number of work photos (keep in step with SiteIntake.jsx).
export const PHOTO_NEEDS = { T01: { work: 4, priced: true }, T04: { work: 2 }, S09: { work: 3 } };

/** Problems with the photos for this template, in plain words (empty when fine). */
export function photoProblems(template, photos) {
  if (!photos.length) return ['Photos: add at least one photo of your work or your space.'];
  const need = PHOTO_NEEDS[template];
  if (!need) return [];
  const work = photos.filter((p) => p.kind === 'work');
  if (work.length < need.work) return [`Photos: this design needs at least ${need.work} photos of your work.`];
  if (need.priced && work.filter((p) => p.price).length < need.work) return [`Photos: add a price to at least ${need.work} work photos.`];
  return [];
}

export const changeSchema = z.object({ t: z.string().regex(/^[0-9a-f]{48}$/), request: z.string().trim().min(3).max(3000) }).strict();

/** Plain-English list of problems for the form. */
export function problems(error) {
  return error.issues.map((i) => `${i.path.join(' > ') || 'form'}: ${i.message}`);
}
