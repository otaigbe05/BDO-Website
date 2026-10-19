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
    // The shortlist to preview (favourite first), same trade, up to 10.
    designs: z.array(z.string().regex(/^[TBASP]\d{2}$/)).max(10).optional(),
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
    colour: opt(24), // work photos for colour-led designs (S12): which of the owner's colours
  })
  .strict();

// Facts some designs need that the basic form does not cover. COPY of omis-sites/pipeline/
// intake.mjs (extrasSchema, DESIGN_EXTRAS, extrasProblems); keep the two in step.
const num = (min, max) => z.coerce.number().int().min(min).max(max);
export const extrasSchema = z
  .object({
    classes: z.array(z.object({ day: z.enum(DAYS), time: z.string().regex(TIME_RE), name: str(40), minutes: num(10, 180), coach: opt(40) }).strict()).max(60).optional(),
    steps: z.array(z.object({ title: str(40), text: str(260), time: z.string().regex(TIME_RE).optional() }).strict()).max(6).optional(),
    packages: z.array(z.object({ name: str(60), price: str(40), length: opt(40), includes: opt(300) }).strict()).max(8).optional(),
    makes: z.array(str(24)).max(24).optional(),
    interval: z.object({ name: str(40), work: num(5, 600), rest: num(5, 600), rounds: num(1, 30), note: opt(160) }).strict().optional(),
    blocks: z.object({ name: str(50), list: z.array(z.object({ name: str(30), weeks: num(1, 8), sessions: num(1, 6), focus: str(200) }).strict()).min(2).max(5) }).strict().optional(),
    route: z.object({ name: str(50), distance: str(30), meet: str(160), stops: z.array(z.object({ name: str(50), note: str(140), distance: opt(20) }).strict()).min(3).max(7) }).strict().optional(),
    colours: z.array(z.object({ name: str(24), hex: z.string().regex(/^#[0-9A-Fa-f]{6}$/) }).strict()).max(8).optional(),
  })
  .strict();

// Which designs ask which extra questions. 'required': the design cannot be built without it.
export const DESIGN_EXTRAS = {
  P03: { classes: 'optional' }, P07: { classes: 'optional' }, P10: { classes: 'optional' },
  P11: { classes: 'required' }, P13: { classes: 'required' },
  P12: { interval: 'required' }, P14: { blocks: 'required' }, P15: { route: 'required' },
  A09: { makes: 'optional' }, A14: { makes: 'required' },
  A10: { steps: 'optional' }, B03: { steps: 'optional' }, P02: { steps: 'optional' },
  A13: { steps: 'required' }, T12: { steps: 'required' }, S15: { steps: 'required' },
  A07: { packages: 'optional' }, S07: { packages: 'optional' }, P01: { packages: 'optional' }, P06: { packages: 'optional' }, P09: { packages: 'optional' },
  S12: { colours: 'required' },
};

/** Plain-words problems when a design's required extra details are missing (empty when fine). */
export function extrasProblems(template, extras = {}, photos = []) {
  const need = DESIGN_EXTRAS[template] ?? {};
  const out = [];
  const req = (k) => need[k] === 'required';
  if (req('classes') && (extras.classes?.length ?? 0) < 3) out.push('Class times: add at least 3 classes from your weekly timetable.');
  if (req('steps') && (extras.steps?.length ?? 0) < 3) out.push('Steps: add at least 3 steps of how a visit or service goes.');
  if (req('makes') && (extras.makes?.length ?? 0) < 3) out.push('Makes: list at least 3 makes you work on.');
  if (req('interval') && !extras.interval) out.push('Interval: add your work time, rest time, and number of rounds.');
  if (req('blocks') && !extras.blocks) out.push('Programme: add at least 2 blocks of your programme.');
  if (req('route') && !extras.route) out.push('Route: add your meeting point and at least 3 stops.');
  if (req('colours')) {
    const names = new Set((extras.colours ?? []).map((c) => c.name));
    const shown = new Set(photos.filter((p) => p.kind === 'work' && p.colour && names.has(p.colour)).map((p) => p.colour));
    if (names.size < 3) out.push('Colours: add at least 3 colours you offer.');
    else if (shown.size < 3) out.push('Colours: tag your work photos so at least 3 of your colours each have a photo.');
  }
  return out;
}

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
    // Answers to the design's extra questions (DESIGN_EXTRAS).
    extras: extrasSchema.default({}),
    // The content release (SiteIntake.jsx CONSENT_TEXT). The server stamps version and time.
    consent: z.object({ accepted: z.literal(true, { error: 'Please tick the box to confirm the content release.' }), version: str(20), at: str(40) }).strict(),
  })
  .strict();

// Bump when the release wording in SiteIntake.jsx changes, so each intake records what was agreed.
export const CONSENT_VERSION = '2026-10-07';

// Designs that need a minimum number of work photos (keep in step with SiteIntake.jsx).
export const PHOTO_NEEDS = { T01: { work: 4, priced: true }, T04: { work: 2 }, T13: { work: 4 }, T14: { work: 4 }, T15: { work: 3 }, S09: { work: 3 }, S14: { work: 4 }, B12: { work: 4 } };

/** Problems with the photos for this template, in plain words (empty when fine). */
export { TEAM_NEEDS, designProblems } from './design-rules.js';

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
