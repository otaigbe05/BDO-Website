// /site/intake/:token : everything we need to build the customer's site. Works on a phone.
// Answers are kept in this browser while they type, so a closed tab does not lose them.
// After a preview the same link reopens the form filled in with their answers ("edit" mode),
// plus a box for anything else they want changed.
import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { Plus, Trash2, Loader2 } from 'lucide-react';
import { Shell, Card, Field, Text, Area, Submit, Problems, Notice, api, inputClass, loadCatalog } from './ui';
import DesignGuide from './DesignGuide';
import { designProblems, TEAM_NEEDS } from '../../../api/_lib/design-rules.js';
import { exactWordsProblems } from '../../../api/_lib/words.js';
import DesignExtras from './DesignExtras';
import { REGIONS, REGION_LABEL, POSTAL_LABEL, DEFAULT_REGION, PHONE_HINT, tidyPostal, countryList, timeZoneList, browserTimeZone, browserCountry } from '@/lib/countries';

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const DAY_NAMES = { Mon: 'Monday', Tue: 'Tuesday', Wed: 'Wednesday', Thu: 'Thursday', Fri: 'Friday', Sat: 'Saturday', Sun: 'Sunday' };
const MAX_WORK = 40;
// Designs built around the work need a minimum number of work photos (keep in step with
// api/_lib/schemas.js PHOTO_NEEDS). priced: each needs a price (T01's flash wall).
const PHOTO_NEEDS = { T01: { work: 4, priced: true }, T04: { work: 2 }, T13: { work: 4 }, T14: { work: 4 }, T15: { work: 3 }, S09: { work: 3 }, S14: { work: 4 }, B12: { work: 4 } };
const timeClass = inputClass.replace('px-4', 'px-2');

// Examples in the form match the customer's trade (first letter of the template id).
const TRADE = {
  T: { tagline: 'Custom tattoos and walk-ins in downtown Hamilton.', role: 'Role, for example Fine line artist or Piercer', service: 'Service, for example Hourly rate', photo: 'use the photo of the sleeve as the main photo', rules: 'Deposits, cancellations, age and ID, aftercare, how you sterilize your tools.' },
  B: { tagline: 'Fades and beard trims, walk-ins welcome.', role: 'Role, for example Barber or Senior barber', service: 'Service, for example Skin fade', photo: 'use the photo of the fade as the main photo', rules: 'Deposits, cancellations, lateness, walk-ins, payment.' },
  A: { tagline: 'Honest brake, tire, and engine repair in Brantford.', role: 'Role, for example Licensed mechanic or Service advisor', service: 'Service, for example Brake pads and rotors', photo: 'use the photo of the shop as the main photo', rules: 'Estimates and approvals, drop-off and pickup, the warranty you offer, payment.' },
  S: { tagline: 'Gel nails and lash extensions in a quiet studio.', role: 'Role, for example Nail tech or Lash artist', service: 'Service, for example Gel manicure', photo: 'use the nail art photo as the main photo', rules: 'Deposits, cancellations, lateness, patch tests, payment.' },
  P: { tagline: 'Small-group strength training for adults.', role: 'Role, for example Personal trainer or Coach', service: 'Service, for example 1-on-1 session (60 min)', photo: 'use the group class photo as the main photo', rules: 'Cancellations, packages and when they expire, what to bring, payment.' },
};

// Extra questions some designs need (keep in step with api/_lib/schemas.js DESIGN_EXTRAS).
// 'required': the design cannot be built without the answer.
const DESIGN_EXTRAS = {
  P03: { classes: 'optional' }, P07: { classes: 'optional' }, P10: { classes: 'optional' },
  P11: { classes: 'required' }, P13: { classes: 'required' },
  P12: { interval: 'required' }, P14: { blocks: 'required' }, P15: { route: 'required' },
  A09: { makes: 'optional' }, A14: { makes: 'required' },
  A10: { steps: 'optional' }, B03: { steps: 'optional' }, P02: { steps: 'optional' },
  A13: { steps: 'required', stepTimes: true }, T12: { steps: 'required' }, S15: { steps: 'required' },
  A07: { packages: 'optional' }, S07: { packages: 'optional' }, P01: { packages: 'optional' }, P06: { packages: 'optional' }, P09: { packages: 'optional' },
  S12: { colours: 'required' },
  // Made for one studio: work shown by artist, a first-screen line, more studio photos.
  T90: { steps: 'required', line: 'optional', workByArtist: 'required', studio: true },
};
// More photos of the space, for designs with studio: true.
const MAX_STUDIO = 3;
// What the steps are about, in the trade's words.
const STEP_HINT = {
  T: 'From the first message to healed: for example Consult, Drawing, Stencil, Session, Healed.',
  A: 'A visit at your shop: for example Drop-off, We take a look, Quote by text, The repair, Pickup.',
  B: 'How your signature service goes: for example Hot towel, Lather, First pass, Cold towel.',
  S: 'Your signature treatment from arrival to rest: for example Arrive, Warm towels, Scrub, Rest.',
  P: 'Your first month or first visit: for example Intro call, Movement check, Week 1, Check-in.',
};
const blankExtras = () => ({
  classes: [],
  steps: [],
  packages: [],
  makes: '',
  interval: { name: '', work: '', rest: '', rounds: '', note: '' },
  blocks: { name: '', list: [] },
  route: { name: '', distance: '', meet: '', stops: [] },
  colours: [],
  line: '',
});

// Country names and time zones come from the browser (src/lib/countries.js).
const COUNTRIES = countryList();
const ZONES = timeZoneList();

const blankService = () => ({ name: '', price: '', duration: '', description: '' });
const blankMember = () => ({ name: '', role: '', specialty: '', bio: '', instagram: '', bookingUrl: '', photo: null });

function initial(lead) {
  // The country picked on the first form (or a guess from the browser), and the browser's time zone.
  const country = lead.country ?? browserCountry();
  return {
    business: { name: lead.business, tagline: '', phone: lead.phone ?? '', email: lead.email ?? '', street: '', city: lead.city ?? '', country, province: DEFAULT_REGION[country] ?? '', postal: '', timeZone: browserTimeZone() ?? '', instagram: '', facebook: '', googleBusinessUrl: '' },
    hours: Object.fromEntries(DAYS.map((d, i) => [d, { open: i < 5, from: '09:00', to: '17:00' }])),
    hoursNote: '',
    services: [blankService(), blankService(), blankService()],
    team: [],
    photos: { logo: null, hero: null, about: null },
    studio: [],
    work: [],
    aboutNotes: '',
    policyNotes: '',
    faqNotes: '',
    extraNotes: '',
    exactWords: false,
    reviews: [],
    reviewsReal: false,
    omisUrl: '',
    bookingLabel: '',
    domain: lead.domain ?? '',
    extras: blankExtras(),
    consent: false,
  };
}

/** Saved answers -> form state (edit mode). photoUrls: short-lived links to their uploads. */
function fromIntake(p, urls) {
  const photo = (x) => (x ? { key: x.key, preview: urls[x.key] ?? '', member: x.member ?? '' } : null);
  const byKind = (k) => p.photos.find((x) => x.kind === k);
  const open = new Map(p.hours.map((h) => [h.day, h]));
  const b = p.business;
  return {
    business: { name: b.name, tagline: b.tagline ?? '', phone: b.phone, email: b.email ?? '', street: b.street, city: b.city, country: b.country ?? 'CA', province: b.province ?? '', postal: b.postal ?? '', timeZone: b.timeZone ?? browserTimeZone() ?? '', instagram: b.instagram ?? '', facebook: b.facebook ?? '', googleBusinessUrl: b.googleBusinessUrl ?? '' },
    hours: Object.fromEntries(DAYS.map((d) => [d, open.has(d) ? { open: true, from: open.get(d).open, to: open.get(d).close } : { open: false, from: '09:00', to: '17:00' }])),
    hoursNote: p.hoursNote ?? '',
    services: p.services.map((s) => ({ name: s.name, price: s.price, duration: s.duration ?? '', description: s.description ?? '' })),
    team: p.team.map((m) => ({ name: m.name, role: m.role, specialty: m.specialty ?? '', bio: m.bio ?? '', instagram: m.instagram ?? '', bookingUrl: m.bookingUrl ?? '', photo: photo(p.photos.find((x) => x.kind === 'team' && x.member === m.name)) })),
    photos: { logo: photo(byKind('logo')), hero: photo(byKind('hero')), about: photo(byKind('about')) },
    studio: p.photos.filter((x) => x.kind === 'about').slice(1).map(photo),
    work: p.photos.filter((x) => x.kind === 'work').map((x) => ({ key: x.key, preview: urls[x.key] ?? '', caption: x.caption ?? '', member: x.member ?? '', price: x.price ?? '', colour: x.colour ?? '' })),
    aboutNotes: p.aboutNotes ?? '',
    policyNotes: p.policyNotes ?? '',
    faqNotes: p.faqNotes ?? '',
    extraNotes: p.extraNotes ?? '',
    exactWords: p.exactWords === true,
    reviews: p.reviews.map((r) => ({ quote: r.quote, author: r.author, source: r.source ?? '' })),
    reviewsReal: p.reviews.length > 0,
    omisUrl: p.omisUrl ?? '',
    bookingLabel: p.bookingLabel ?? '',
    domain: p.domain ?? '',
    extras: fromExtras(p.extras ?? {}),
    consent: false,
    changeNotes: '',
  };
}

/** Saved extra answers -> form state (numbers back to text fields). */
function fromExtras(x) {
  const e = blankExtras();
  const txt = (v) => (v == null ? '' : String(v));
  if (x.classes) e.classes = x.classes.map((c) => ({ day: c.day, time: c.time, name: c.name, minutes: txt(c.minutes), coach: c.coach ?? '' }));
  if (x.steps) e.steps = x.steps.map((st) => ({ title: st.title, text: st.text, time: st.time ?? '' }));
  if (x.packages) e.packages = x.packages.map((k) => ({ name: k.name, price: k.price, length: k.length ?? '', includes: k.includes ?? '' }));
  if (x.makes) e.makes = x.makes.join(', ');
  if (x.line) e.line = x.line;
  if (x.interval) e.interval = { name: x.interval.name, work: txt(x.interval.work), rest: txt(x.interval.rest), rounds: txt(x.interval.rounds), note: x.interval.note ?? '' };
  if (x.blocks) e.blocks = { name: x.blocks.name, list: x.blocks.list.map((b) => ({ name: b.name, weeks: txt(b.weeks), sessions: txt(b.sessions), focus: b.focus })) };
  if (x.route) e.route = { name: x.route.name, distance: x.route.distance, meet: x.route.meet, stops: x.route.stops.map((st) => ({ name: st.name, note: st.note, distance: st.distance ?? '' })) };
  if (x.colours) e.colours = x.colours.map((c) => ({ name: c.name, hex: c.hex }));
  return e;
}


// The content release. Bump CONSENT_VERSION in api/_lib/schemas.js when this wording changes.
const CONSENT_POINTS = [
  'I own, or have permission to use, every photo, logo, and piece of text I send. None of it copies anyone else\'s work or trademark without permission.',
  'Nothing I send is sexually explicit, hateful, defamatory, or unlawful.',
  'People who can be recognized in my photos have agreed to appear on my website, and I have a parent\'s or guardian\'s permission for any child.',
  'Any reviews I add are real, copied word for word, with the name the reviewer used.',
  'BDO Analytics Solutions may store, crop, resize, and edit what I send, write site text from my answers, and publish it on my website.',
];

/** Shrink a photo in the browser (max 2000px) so uploads are fast and under the size limit. */
async function shrink(file, keepPng) {
  const bitmap = await createImageBitmap(file).catch(() => null);
  if (!bitmap) throw new Error('This file is not a photo we can read. Use JPEG or PNG.');
  const scale = Math.min(1, 2000 / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement('canvas');
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  canvas.getContext('2d').drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  const type = keepPng && file.type === 'image/png' ? 'image/png' : 'image/jpeg';
  return new Promise((resolve) => canvas.toBlob((b) => resolve(b), type, 0.85));
}

export default function SiteIntake() {
  const { token } = useParams();
  // Arrived from "Choose this design" in the preview (/site/design): say what changed.
  const [query] = useSearchParams();
  const switchedTo = query.get('design');
  const [lead, setLead] = useState(null);
  const [mode, setMode] = useState('first');
  const [info, setInfo] = useState({});
  // How many work photos the design's sample shows, so the form can say what looks best, not just the minimum.
  const [sample, setSample] = useState(null);
  const [designName, setDesignName] = useState('');
  useEffect(() => {
    if (lead?.template) loadCatalog().then((list) => { const t = list.find((x) => x.id === lead.template); setSample(t?.sample ?? null); setDesignName(t?.name ?? ''); });
  }, [lead?.template]);
  const [state, setState] = useState('loading');
  const [f, setF] = useState(null);
  const [busy, setBusy] = useState(false);
  const [uploading, setUploading] = useState(0);
  const [problems, setProblems] = useState([]);
  const storeKey = `site-intake-${token}-${mode}`;

  useEffect(() => {
    api(`/api/site-intake?t=${encodeURIComponent(token)}`).then((r) => {
      if (!r.ok) return setState('invalid');
      setLead(r.lead);
      setInfo({ previewUrl: r.previewUrl, roundsLeft: r.roundsLeft, status: r.status });
      if (!r.open) return setState('closed');
      setMode(r.mode);
      let saved = null;
      try {
        saved = JSON.parse(localStorage.getItem(`site-intake-${token}-${r.mode}`) || 'null');
      } catch {
        saved = null;
      }
      const fresh = r.previous ? fromIntake(r.previous, r.photoUrls ?? {}) : initial(r.lead);
      // A draft saved on this device before the form gained new questions gets their blanks.
      setF(saved ? { ...fresh, ...saved, business: { ...fresh.business, ...saved.business }, extras: { ...blankExtras(), ...saved.extras } } : fresh);
      setState('open');
    });
  }, [token]);

  useEffect(() => {
    if (!f || state !== 'open') return;
    try {
      localStorage.setItem(storeKey, JSON.stringify(f));
    } catch {
      /* private window: answers are not kept, the form still works */
    }
  }, [f, storeKey]);

  if (state === 'loading') return <Shell title="Your website details"><p className="text-slate-600">Loading...</p></Shell>;
  if (state === 'invalid')
    return (
      <Shell title="Link not valid">
        <Notice title="This link is not valid">
          <p>Check the email we sent you, or start again from our templates page.</p>
        </Notice>
      </Shell>
    );
  if (state === 'closed' && info.status === 'live')
    return (
      <Shell title="Your site is live">
        <Notice title="Your site is live">
          <p>To change anything now, reply to any of our emails and tell us what to change.</p>
        </Notice>
      </Shell>
    );
  if (state === 'over-limit')
    return (
      <Shell title="We have your request">
        <Notice title="We have your request">
          <p>Your plan includes {info.updatesPerMonth ?? 3} website updates a month, and this month's are used. Your live site stays as it is.</p>
          <p>We have passed your request to our team, and we will get back to you about it. Your included updates start again on the 1st of next month.</p>
        </Notice>
      </Shell>
    );
  if (state === 'closed' || state === 'sent')
    return (
      <Shell title="We are building your site">
        <Notice title={mode === 'edit' && state === 'sent' ? 'Got your changes' : 'We are building your preview'}>
          <p>
            Thanks{lead ? `, ${lead.name.split(' ')[0]}` : ''}. {mode === 'edit' && state === 'sent' ? 'We are updating' : 'We have your details and are working on'} the {lead?.business} website now.
          </p>
          <p>Your private preview link arrives by email, usually within 20 minutes.</p>
          <p className="text-sm text-slate-500">
            Nothing after 20 minutes? Check your Promotions, Spam or Junk folder for an email from BDO Analytics Websites, and mark it "Not spam" so the next ones reach you. Still nothing? Reply to our earlier email and we will sort it out.
          </p>
        </Notice>
      </Shell>
    );

  const set = (path, value) =>
    setF((s) => {
      const next = structuredClone(s);
      let o = next;
      const keys = path.split('.');
      for (const k of keys.slice(0, -1)) o = o[k];
      o[keys.at(-1)] = value;
      return next;
    });
  const b = f.business;
  const trade = TRADE[lead.template[0]] ?? TRADE.B;
  const need = DESIGN_EXTRAS[lead.template] ?? {};
  const regions = REGIONS[b.country];
  const countries = COUNTRIES;
  const zones = b.timeZone && !ZONES.includes(b.timeZone) ? [b.timeZone, ...ZONES] : ZONES;
  const postalLabel = POSTAL_LABEL[b.country] ?? 'Postal code';
  // Canada and the US check the postal code; elsewhere it is optional.
  const postalNeeded = b.country === 'CA' || b.country === 'US';

  async function upload(file, kind) {
    setUploading((n) => n + 1);
    try {
      const blob = await shrink(file, kind === 'logo');
      const r = await fetch(`/api/site-upload?t=${encodeURIComponent(token)}&name=${encodeURIComponent(file.name)}`, { method: 'POST', headers: { 'Content-Type': blob.type }, body: blob });
      const body = await r.json().catch(() => ({}));
      if (!r.ok || !body.key) throw new Error(body.error || 'Upload failed. Try again.');
      return { key: body.key, preview: URL.createObjectURL(blob) };
    } finally {
      setUploading((n) => n - 1);
    }
  }

  async function pickSingle(kind, files) {
    if (!files?.[0]) return;
    try {
      set(`photos.${kind}`, await upload(files[0], kind));
    } catch (err) {
      setProblems([err.message]);
    }
  }

  async function pickWork(files) {
    const room = MAX_WORK - f.work.length;
    for (const file of [...files].slice(0, room)) {
      try {
        const up = await upload(file, 'work');
        setF((s) => ({ ...s, work: [...s.work, { ...up, caption: '', member: '' }] }));
      } catch (err) {
        setProblems([err.message]);
      }
    }
  }

  async function pickStudio(files) {
    const room = MAX_STUDIO - f.studio.length;
    for (const file of [...files].slice(0, room)) {
      try {
        const up = await upload(file, 'about');
        setF((s) => ({ ...s, studio: [...s.studio, up] }));
      } catch (err) {
        setProblems([err.message]);
      }
    }
  }

  async function pickMemberPhoto(i, files) {
    if (!files?.[0]) return;
    try {
      const up = await upload(files[0], 'team');
      setF((s) => {
        const team = [...s.team];
        team[i] = { ...team[i], photo: up };
        return { ...s, team };
      });
    } catch (err) {
      setProblems([err.message]);
    }
  }

  /** Only the extra answers this design asks for, with empty rows left out. */
  function extrasPayload() {
    const clean = (o) => Object.fromEntries(Object.entries(o).filter(([, v]) => v !== '' && v != null));
    const x = f.extras;
    const out = {};
    if (need.classes) out.classes = x.classes.filter((c) => c.name.trim()).map((c) => clean({ ...c, minutes: Number(c.minutes) || '' }));
    if (need.steps) out.steps = x.steps.filter((st) => st.title.trim() || st.text.trim()).map((st) => clean({ ...st, time: need.stepTimes ? st.time : '' }));
    if (need.packages) out.packages = x.packages.filter((k) => k.name.trim()).map(clean);
    if (need.makes) out.makes = x.makes.split(/[,\n]/).map((m) => m.trim()).filter(Boolean);
    if (need.interval && (x.interval.work || x.interval.rest)) out.interval = clean({ ...x.interval, work: Number(x.interval.work) || '', rest: Number(x.interval.rest) || '', rounds: Number(x.interval.rounds) || '' });
    if (need.blocks && x.blocks.list.some((b) => b.name.trim())) out.blocks = { name: x.blocks.name, list: x.blocks.list.filter((b) => b.name.trim()).map((b) => ({ ...b, weeks: Number(b.weeks) || '', sessions: Number(b.sessions) || '' })) };
    if (need.route && x.route.stops.some((st) => st.name.trim())) out.route = { name: x.route.name, distance: x.route.distance, meet: x.route.meet, stops: x.route.stops.filter((st) => st.name.trim()).map(clean) };
    if (need.colours) out.colours = x.colours.filter((c) => c.name.trim());
    if (need.line && x.line.trim()) out.line = x.line.trim();
    return Object.fromEntries(Object.entries(out).filter(([, v]) => !(Array.isArray(v) && v.length === 0)));
  }

  /** The same checks the server makes, so problems show before sending. */
  function extrasIssues() {
    const req = (k) => need[k] === 'required';
    const x = extrasPayload();
    const out = [];
    if (req('classes') && (x.classes?.length ?? 0) < 3) out.push('Class times: add at least 3 classes from your weekly timetable.');
    if (req('steps') && (x.steps?.length ?? 0) < 3) out.push('Steps: add at least 3 steps.');
    if (req('makes') && (x.makes?.length ?? 0) < 3) out.push('Makes: list at least 3 makes you work on.');
    if (req('interval') && !x.interval) out.push('Interval: add your work time, rest time, and number of rounds.');
    if (req('blocks') && (x.blocks?.list.length ?? 0) < 2) out.push('Programme: add at least 2 blocks.');
    if (req('route') && (x.route?.stops.length ?? 0) < 3) out.push('Route: add your meeting point and at least 3 stops.');
    if (req('colours')) {
      const names = new Set((x.colours ?? []).map((c) => c.name));
      const shown = new Set(f.work.filter((w) => w.colour && names.has(w.colour)).map((w) => w.colour));
      if (names.size < 3) out.push('Colours: add at least 3 colours you offer.');
      else if (shown.size < 3) out.push('Colours: pick a colour for your work photos so at least 3 colours each have a photo.');
    }
    if (req('workByArtist') && f.work.some((w) => !w.member)) out.push('Your work: pick whose work each photo is (under each photo).');
    return out;
  }

  function toPayload() {
    const clean = (o) => Object.fromEntries(Object.entries(o).filter(([, v]) => v !== '' && v != null));
    const team = f.team.filter((m) => m.name.trim());
    const photos = [
      ...['logo', 'hero', 'about'].filter((k) => f.photos[k]).map((k) => clean({ key: f.photos[k].key, kind: k, member: k === 'hero' && need.workByArtist ? f.photos.hero.member : '' })),
      ...(need.studio && f.photos.about ? f.studio.map((x) => ({ key: x.key, kind: 'about' })) : []),
      ...team.filter((m) => m.photo).map((m) => ({ key: m.photo.key, kind: 'team', member: m.name.trim() })),
      ...f.work.map((w) => clean({ key: w.key, kind: 'work', caption: w.caption, member: w.member, price: w.price, colour: need.colours ? w.colour : '' })),
    ];
    return clean({
      domain: f.domain.trim().toLowerCase(),
      business: clean({ ...b, email: b.email || undefined }),
      hours: DAYS.filter((d) => f.hours[d].open).map((d) => ({ day: d, open: f.hours[d].from, close: f.hours[d].to })),
      hoursNote: f.hoursNote,
      omisUrl: f.omisUrl,
      bookingLabel: f.bookingLabel,
      services: f.services.filter((s) => s.name.trim() || s.price.trim()).map(clean),
      team: team.map(({ photo, ...m }) => clean(m)),
      photos,
      aboutNotes: f.aboutNotes,
      policyNotes: f.policyNotes,
      faqNotes: f.faqNotes,
      extraNotes: f.extraNotes,
      exactWords: f.exactWords,
      reviews: f.reviewsReal ? f.reviews.filter((r) => r.quote.trim() && r.author.trim()).map(clean) : [],
      extras: extrasPayload(),
      // The server stamps the wording version and time.
      consent: { accepted: f.consent === true },
    });
  }

  async function submit(e) {
    e.preventDefault();
    if (uploading) return setProblems(['Please wait for your photos to finish uploading.']);
    const need = PHOTO_NEEDS[lead.template];
    const photoCount = f.work.length + ['hero', 'about'].filter((k) => f.photos[k]).length + f.team.filter((m) => m.photo).length;
    if (!photoCount) return setProblems(['Photos: add at least one photo of your work or your space. Your site is built around it.']);
    if (need && f.work.length < need.work) return setProblems([`Photos: this design needs at least ${need.work} photos of your work.`]);
    if (need?.priced && f.work.filter((w) => w.price?.trim()).length < need.work) return setProblems([`Photos: this design shows a price on each piece. Add a price to at least ${need.work} work photos.`]);
    const designIssues = designProblems(lead.template, { team: f.team, services: f.services });
    if (designIssues.length) return setProblems(designIssues);
    const extraIssues = extrasIssues();
    if (extraIssues.length) return setProblems(extraIssues);
    if (!DAYS.some((d) => f.hours[d].open) && !f.hoursNote.trim()) return setProblems(['Opening hours: tick at least one open day, or (by appointment only) say so in the box under the days.']);
    if (f.exactWords) {
      const words = exactWordsProblems(f).map((p) => p.message);
      if (words.length) return setProblems(words);
    }
    if (f.reviews.some((r) => r.quote.trim()) && !f.reviewsReal) return setProblems(['Reviews: tick the box to confirm they are real reviews from your customers, or remove them.']);
    if (!f.consent) return setProblems(['Content release: please read it and tick the box at the bottom of the form.']);
    setBusy(true);
    setProblems([]);
    const r = await api('/api/site-intake', { method: 'POST', body: JSON.stringify({ t: token, data: toPayload(), ...(mode === 'edit' ? { changeNotes: f.changeNotes ?? '' } : {}) }) });
    setBusy(false);
    if (r.ok) {
      try {
        localStorage.removeItem(storeKey);
      } catch {
        /* ignore */
      }
      setState(r.overLimit ? 'over-limit' : 'sent');
      window.scrollTo(0, 0);
    } else setProblems(r.problems ?? [r.error ?? 'Something went wrong.']);
  }

  const PhotoSlot = ({ kind, label, hint }) => (
    <Field label={label} hint={hint} htmlFor={`photo-${kind}`}>
      <div className="flex items-center gap-4">
        {f.photos[kind] && <img src={f.photos[kind].preview} alt="" className="w-20 h-20 object-cover rounded-lg border border-slate-200" />}
        <input id={`photo-${kind}`} type="file" accept="image/jpeg,image/png,image/webp" onChange={(e) => pickSingle(kind, e.target.files)} className="text-sm" />
        {f.photos[kind] && (
          <button type="button" className="text-sm text-red-700 underline" onClick={() => set(`photos.${kind}`, null)}>
            Remove
          </button>
        )}
      </div>
    </Field>
  );

  return (
    <Shell title="Your website details">
      <form onSubmit={submit} className="space-y-6">
        <header className="space-y-2">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900">{mode === 'edit' ? 'Change your website' : 'Your website details'}</h1>
          <p className="text-lg text-slate-600">
            {mode === 'edit'
              ? info.status === 'live'
                ? `Your site stays online while we prepare the update. Change anything below and tell us anything else in the box. You get a preview to check, then publish it; there is no extra charge.${info.updatesLeft !== undefined ? ` Updates left this month: ${info.updatesLeft} of ${info.updatesPerMonth}.` : ''}`
                : `Your answers are filled in. Change anything below, add or remove photos, and tell us anything else in the box. Changes included: ${info.roundsLeft ?? 0} more.`
              : `For the ${lead.business} website (design ${lead.template}). Only fields marked * are needed; the more you tell us, the better your site. Your answers are saved on this device as you type.`}
          </p>
        </header>

        {mode === 'edit' && switchedTo && switchedTo === lead.template && (
          <div role="status" className="rounded-2xl border border-blue-200 bg-blue-50 p-5 text-slate-800">
            <p className="font-semibold">Your design is now {designName || switchedTo}.</p>
            <p>Your answers are all here. Add anything this design asks for below, then press Send at the bottom to get your new preview.</p>
          </div>
        )}
        {mode === 'edit' && <DesignGuide token={token} template={lead.template} previewUrl={info.previewUrl} have={info.have} showLink={false} />}

        {mode === 'edit' && (
          <Card title="Anything else to change?" intro="For things the form does not cover: wording, which photo goes first, what to leave out.">
            {info.previewUrl && (
              <p>
                <a className="text-blue-700 underline font-medium" href={info.previewUrl} target="_blank" rel="noreferrer">Open your current preview</a> in another tab.
              </p>
            )}
            <Area id="change-notes" rows={5} value={f.changeNotes} onChange={(v) => set('changeNotes', v)} maxLength={3000} placeholder={`For example: make the about text shorter, ${trade.photo}.`} />
          </Card>
        )}

        <Card title="Your business">
          <div className="grid sm:grid-cols-2 gap-5">
            <Field label="Business name" htmlFor="b-name" required>
              <Text id="b-name" value={b.name} onChange={(v) => set('business.name', v)} required />
            </Field>
            <Field label="Phone customers call" htmlFor="b-phone" required hint={postalNeeded ? undefined : PHONE_HINT}>
              <Text id="b-phone" type="tel" value={b.phone} onChange={(v) => set('business.phone', v)} required />
            </Field>
            <Field label="Street address" htmlFor="b-street" required>
              <Text id="b-street" value={b.street} onChange={(v) => set('business.street', v)} required autoComplete="street-address" />
            </Field>
            <Field label="City" htmlFor="b-city" required>
              <Text id="b-city" value={b.city} onChange={(v) => set('business.city', v)} required />
            </Field>
            <Field label="Country" htmlFor="b-country" required>
              <select
                id="b-country"
                className={inputClass}
                value={b.country ?? 'CA'}
                onChange={(e) => setF((s) => ({ ...s, business: { ...s.business, country: e.target.value, province: DEFAULT_REGION[e.target.value] ?? '', postal: '' } }))}
              >
                {countries.map(([code, name]) => (
                  <option key={code} value={code}>{name}</option>
                ))}
              </select>
            </Field>
            {regions ? (
              <Field label={REGION_LABEL[b.country]} htmlFor="b-prov" required>
                <select id="b-prov" className={inputClass} value={b.province} onChange={(e) => set('business.province', e.target.value)}>
                  {regions.map((p) => (
                    <option key={p}>{p}</option>
                  ))}
                </select>
              </Field>
            ) : (
              <Field label="State or region" htmlFor="b-prov" hint="Optional, for example Lagos State.">
                <Text id="b-prov" value={b.province} onChange={(v) => set('business.province', v)} maxLength={60} autoComplete="address-level1" />
              </Field>
            )}
            <Field label={postalLabel} htmlFor="b-postal" required={postalNeeded} hint={postalNeeded ? undefined : 'Optional.'}>
              <Text id="b-postal" value={b.postal} onChange={(v) => set('business.postal', v.toUpperCase())} onBlur={(e) => set('business.postal', tidyPostal(b.country, e.target.value))} required={postalNeeded} maxLength={12} placeholder={b.country === 'US' ? '14201' : b.country === 'CA' ? 'N1R 1A1' : ''} autoComplete="postal-code" />
            </Field>
            <Field label="Time zone" htmlFor="b-tz" hint="For your opening hours and the 'open now' sign. We filled in the one your device uses.">
              <select id="b-tz" className={inputClass} value={b.timeZone} onChange={(e) => set('business.timeZone', e.target.value)}>
                {!b.timeZone && <option value="">Choose your time zone</option>}
                {zones.map((z) => (
                  <option key={z}>{z}</option>
                ))}
              </select>
            </Field>
            <Field label="Email shown on the site" htmlFor="b-email">
              <Text id="b-email" type="email" value={b.email} onChange={(v) => set('business.email', v)} />
            </Field>
            <Field label="Instagram" htmlFor="b-ig" hint="Your handle, like @yourshop">
              <Text id="b-ig" value={b.instagram} onChange={(v) => set('business.instagram', v)} />
            </Field>
            <Field label="Facebook page" htmlFor="b-fb" hint="Optional. The link to your page.">
              <Text id="b-fb" type="url" value={b.facebook} onChange={(v) => set('business.facebook', v)} placeholder="https://www.facebook.com/..." />
            </Field>
          </div>
          <Field label="One line about you" htmlFor="b-tag" hint={`Optional. For example: ${trade.tagline}`}>
            <Text id="b-tag" value={b.tagline} onChange={(v) => set('business.tagline', v)} maxLength={140} />
          </Field>
          <Field label="Google Business Profile link" htmlFor="b-gbp" hint="Optional. Used for the map button.">
            <Text id="b-gbp" type="url" value={b.googleBusinessUrl} onChange={(v) => set('business.googleBusinessUrl', v)} placeholder="https://" />
          </Field>
        </Card>

        <Card title="Opening hours" intro="Tick the days you are open. By appointment only? Untick every day and say so in the box below.">
          <div className="space-y-3">
            {DAYS.map((d) => (
              <div key={d} className="grid grid-cols-2 sm:grid-cols-[7.5rem_1fr_1fr] items-center gap-x-3 gap-y-1">
                <label className="col-span-2 sm:col-span-1 flex items-center gap-2 font-medium text-slate-900">
                  <input type="checkbox" checked={f.hours[d].open} onChange={(e) => set(`hours.${d}.open`, e.target.checked)} />
                  {DAY_NAMES[d]}
                </label>
                <input aria-label={`${DAY_NAMES[d]} opens`} type="time" className={timeClass} disabled={!f.hours[d].open} value={f.hours[d].from} onChange={(e) => set(`hours.${d}.from`, e.target.value)} />
                <input aria-label={`${DAY_NAMES[d]} closes`} type="time" className={timeClass} disabled={!f.hours[d].open} value={f.hours[d].to} onChange={(e) => set(`hours.${d}.to`, e.target.value)} />
              </div>
            ))}
          </div>
          <Field label="Anything else about hours" htmlFor="h-note" hint="For example: By appointment on Sundays. Needed if you untick every day.">
            <Text id="h-note" value={f.hoursNote} onChange={(v) => set('hoursNote', v)} maxLength={200} />
          </Field>
        </Card>

        <Card title="Services and prices" intro="Write prices the way you say them: $45, From $120, $150 per hour.">
          <div className="space-y-4">
            {f.services.map((s, i) => (
              <div key={i} className="grid sm:grid-cols-[2fr_1fr_1fr_auto] gap-3 items-start border-b border-slate-100 pb-4">
                <Text aria-label="Service" placeholder={trade.service} value={s.name} onChange={(v) => set(`services.${i}.name`, v)} />
                <Text aria-label="Price" placeholder="Price" value={s.price} onChange={(v) => set(`services.${i}.price`, v)} />
                <Text aria-label="Time (optional)" placeholder="Time (optional)" value={s.duration} onChange={(v) => set(`services.${i}.duration`, v)} />
                <button type="button" aria-label="Remove service" className="p-3 text-slate-500 hover:text-red-700" onClick={() => set('services', f.services.filter((_, j) => j !== i))}>
                  <Trash2 className="w-5 h-5" />
                </button>
                <div className="sm:col-span-3">
                  <Text aria-label="Short description (optional)" placeholder="Short description (optional)" value={s.description} onChange={(v) => set(`services.${i}.description`, v)} />
                </div>
              </div>
            ))}
          </div>
          <button type="button" className="inline-flex items-center gap-2 font-bold text-blue-700" onClick={() => set('services', [...f.services, blankService()])}>
            <Plus className="w-5 h-5" /> Add a service
          </button>
        </Card>

        <Card title="Your team" intro={TEAM_NEEDS[lead.template] ? `Everyone customers can book with. This design is built around your team, so add at least ${TEAM_NEEDS[lead.template] === 1 ? 'one person' : `${TEAM_NEEDS[lead.template]} people`}, with a photo of each if you can.` : 'Everyone customers can book with. Add as many as you have; skip this if it is just the business.'}>
          {f.team.map((m, i) => (
            <div key={i} className="rounded-xl border border-slate-200 p-4 space-y-3">
              <div className="grid sm:grid-cols-2 gap-3">
                <Text aria-label="Name" placeholder="Name" value={m.name} onChange={(v) => set(`team.${i}.name`, v)} />
                <Text aria-label="Role" placeholder={trade.role} value={m.role} onChange={(v) => set(`team.${i}.role`, v)} />
                <Text aria-label="What they are known for (optional)" placeholder="Known for (optional)" value={m.specialty} onChange={(v) => set(`team.${i}.specialty`, v)} />
                <Text aria-label="Instagram (optional)" placeholder="Instagram (optional)" value={m.instagram} onChange={(v) => set(`team.${i}.instagram`, v)} />
              </div>
              <Area aria-label="Their story (optional)" rows={3} placeholder="Their story (optional). Leave a blank line between paragraphs." value={m.bio} onChange={(v) => set(`team.${i}.bio`, v)} maxLength={3600} />
              {lead.package === 'site-omis' && (
                <Text aria-label="Their own booking link (optional)" placeholder="Their own OMIS booking link (optional)" type="url" value={m.bookingUrl} onChange={(v) => set(`team.${i}.bookingUrl`, v)} />
              )}
              <div className="flex flex-wrap items-center gap-4">
                {m.photo && <img src={m.photo.preview} alt="" className="w-16 h-16 object-cover rounded-lg" />}
                <label className="text-sm text-slate-700">
                  Photo of {m.name || 'them'}{' '}
                  <input type="file" accept="image/jpeg,image/png,image/webp" className="text-sm" onChange={(e) => pickMemberPhoto(i, e.target.files)} />
                </label>
                <button type="button" className="ml-auto text-sm text-red-700 underline" onClick={() => set('team', f.team.filter((_, j) => j !== i))}>
                  Remove person
                </button>
              </div>
            </div>
          ))}
          <button type="button" className="inline-flex items-center gap-2 font-bold text-blue-700" onClick={() => set('team', [...f.team, blankMember()])}>
            <Plus className="w-5 h-5" /> Add a person
          </button>
        </Card>

        <Card title="Photos" intro="Your own photos work best. Please no photos with brand logos, licence plates, or children's faces; we leave those out.">
          {(() => {
            const need = PHOTO_NEEDS[lead.template]?.work ?? 1;
            const shown = sample?.galleryPhotos ?? 0;
            const best = Math.max(need + 1, shown, 4);
            return (
              <p className="rounded-xl bg-blue-50 border border-blue-200 p-3 text-slate-800">
                {PHOTO_NEEDS[lead.template]
                  ? <>This design needs at least <strong>{need} photos of your work</strong>{PHOTO_NEEDS[lead.template].priced ? ', each with a price' : ''} to work at all. </>
                  : <>One photo is enough to build your site. </>}
                It looks best with <strong>{best} or more</strong>{shown >= best ? ', like the design sample' : ''}: different jobs, close-ups, and your space. Add as many good ones as you have.
              </p>
            );
          })()}
          <PhotoSlot kind="hero" label="Main photo" hint="The big photo at the top. Your best shot of your work or your space. If you skip it, we pick your strongest photo." />
          {need.workByArtist && f.photos.hero && f.team.some((m) => m.name.trim()) && (
            <Field label="Whose work is the main photo?" htmlFor="hero-member">
              <select id="hero-member" className={inputClass} value={f.photos.hero.member ?? ''} onChange={(e) => set('photos.hero.member', e.target.value)}>
                <option value="">Choose</option>
                {f.team.filter((m) => m.name.trim()).map((m) => (
                  <option key={m.name}>{m.name.trim()}</option>
                ))}
              </select>
            </Field>
          )}
          <PhotoSlot kind="logo" label="Logo" hint="Optional." />
          <PhotoSlot kind="about" label="Photo of you or your space" hint="Optional." />
          {need.studio && f.photos.about && (
            <Field label={`More photos of your space (up to ${MAX_STUDIO})`} htmlFor="studio" hint="Optional.">
              <input id="studio" type="file" multiple accept="image/jpeg,image/png,image/webp" disabled={f.studio.length >= MAX_STUDIO} onChange={(e) => pickStudio(e.target.files)} className="text-sm" />
              {f.studio.length > 0 && (
                <ul className="flex flex-wrap gap-3 mt-3">
                  {f.studio.map((x, i) => (
                    <li key={x.key} className="space-y-1">
                      <img src={x.preview} alt="" className="w-20 h-20 object-cover rounded-lg border border-slate-200" />
                      <button type="button" className="text-sm text-red-700 underline" onClick={() => set('studio', f.studio.filter((_, j) => j !== i))}>Remove</button>
                    </li>
                  ))}
                </ul>
              )}
            </Field>
          )}
          <Field label={`Your work (up to ${MAX_WORK})`} htmlFor="work" hint="Pick several at once.">
            <input id="work" type="file" multiple accept="image/jpeg,image/png,image/webp" onChange={(e) => pickWork(e.target.files)} className="text-sm" />
          </Field>
          {uploading > 0 && (
            <p className="flex items-center gap-2 text-slate-600">
              <Loader2 className="w-4 h-4 animate-spin" /> Uploading {uploading} photo{uploading > 1 ? 's' : ''}...
            </p>
          )}
          {f.work.length > 0 && (
            <ul className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {f.work.map((w, i) => (
                <li key={w.key} className="space-y-2">
                  <img src={w.preview} alt="" className="w-full aspect-square object-cover rounded-lg" />
                  <Text aria-label="Caption (optional)" placeholder="Caption (optional)" value={w.caption} onChange={(v) => set(`work.${i}.caption`, v)} />
                  {PHOTO_NEEDS[lead.template]?.priced && (
                    <Text aria-label="Price" placeholder="Price, e.g. $120" value={w.price} onChange={(v) => set(`work.${i}.price`, v)} />
                  )}
                  {need.colours && f.extras.colours.some((c) => c.name.trim()) && (
                    <select aria-label="Colour in this photo" className={inputClass} value={w.colour ?? ''} onChange={(e) => set(`work.${i}.colour`, e.target.value)}>
                      <option value="">Which colour?</option>
                      {f.extras.colours.filter((c) => c.name.trim()).map((c) => (
                        <option key={c.name}>{c.name.trim()}</option>
                      ))}
                    </select>
                  )}
                  {f.team.some((m) => m.name.trim()) && (
                    <select aria-label="Whose work" className={inputClass} value={w.member} onChange={(e) => set(`work.${i}.member`, e.target.value)}>
                      <option value="">Whose work?</option>
                      {f.team.filter((m) => m.name.trim()).map((m) => (
                        <option key={m.name}>{m.name.trim()}</option>
                      ))}
                    </select>
                  )}
                  <button type="button" className="text-sm text-red-700 underline" onClick={() => set('work', f.work.filter((_, j) => j !== i))}>
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          )}
        </Card>

        {Object.keys(need).length > 0 && <DesignExtras need={need} x={f.extras} set={set} stepHint={STEP_HINT[lead.template[0]] ?? ''} />}

        <Card title="In your own words" intro={f.exactWords ? 'These go on your site exactly as you write them, so check spelling and punctuation.' : 'Write it like you would say it. We turn it into the text on your site, using only what you tell us.'}>
          <label className="flex items-start gap-3 text-slate-900">
            <input type="checkbox" className="mt-1" checked={f.exactWords} onChange={(e) => set('exactWords', e.target.checked)} />
            Use my words exactly as I write them (about, rules and questions), with no rewording.
          </label>
          <Field label="About your business" htmlFor="about" hint="How it started, what you are known for, who you serve.">
            <Area id="about" rows={5} value={f.aboutNotes} onChange={(v) => set('aboutNotes', v)} maxLength={3000} />
          </Field>
          <Field label="Rules customers should know" htmlFor="policies" hint={f.exactWords ? 'One paragraph per rule, starting with its title and a colon. For example: Deposit: A deposit is needed to book.' : trade.rules}>
            <Area id="policies" value={f.policyNotes} onChange={(v) => set('policyNotes', v)} maxLength={2000} />
          </Field>
          <Field label="Questions customers ask you" htmlFor="faq" hint={f.exactWords ? 'Start each question with Q: and each answer with A: on the next line.' : 'With your answers.'}>
            <Area id="faq" value={f.faqNotes} onChange={(v) => set('faqNotes', v)} maxLength={3000} />
          </Field>
          <Field label="Anything else" htmlFor="extra">
            <Area id="extra" rows={3} value={f.extraNotes} onChange={(v) => set('extraNotes', v)} maxLength={2000} />
          </Field>
        </Card>

        <Card title="Reviews" intro="Optional. Copy real reviews from Google or Instagram, word for word, with the person's name as it appears.">
          {f.reviews.map((r, i) => (
            <div key={i} className="grid sm:grid-cols-[3fr_1fr_1fr_auto] gap-3 items-start">
              <Area aria-label="Review" rows={2} placeholder="Review" value={r.quote} onChange={(v) => set(`reviews.${i}.quote`, v)} maxLength={400} />
              <Text aria-label="Name" placeholder="Name" value={r.author} onChange={(v) => set(`reviews.${i}.author`, v)} />
              <Text aria-label="Where (optional)" placeholder="Google" value={r.source} onChange={(v) => set(`reviews.${i}.source`, v)} />
              <button type="button" aria-label="Remove review" className="p-3 text-slate-500 hover:text-red-700" onClick={() => set('reviews', f.reviews.filter((_, j) => j !== i))}>
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          ))}
          {f.reviews.length < 12 && (
            <button type="button" className="inline-flex items-center gap-2 font-bold text-blue-700" onClick={() => set('reviews', [...f.reviews, { quote: '', author: '', source: '' }])}>
              <Plus className="w-5 h-5" /> Add a review
            </button>
          )}
          {f.reviews.length > 0 && (
            <label className="flex items-start gap-3 text-slate-900">
              <input type="checkbox" className="mt-1" checked={f.reviewsReal} onChange={(e) => set('reviewsReal', e.target.checked)} />
              These are real reviews from real customers, copied word for word.
            </label>
          )}
        </Card>

        <Card title="Booking and web address">
          {lead.package === 'site-omis' && (
            <Field label="Your OMIS booking link" htmlFor="omis" hint="If you already use OMIS. If not, leave it empty and we will set it up with you.">
              <Text id="omis" type="url" value={f.omisUrl} onChange={(v) => set('omisUrl', v)} placeholder="https://www.omis-crm.com/book/..." />
            </Field>
          )}
          <Field label="Words on your booking button" htmlFor="book-label" hint="Optional. For example: Book a free consultation. If empty: Book now.">
            <Text id="book-label" value={f.bookingLabel} onChange={(v) => set('bookingLabel', v)} maxLength={40} />
          </Field>
          <Field label="Your domain" htmlFor="domain" hint="If you own one, like yourshop.ca. If not, leave it empty; your site works without one and we can help you get one in your name.">
            <Text id="domain" value={f.domain} onChange={(v) => set('domain', v)} placeholder="yourshop.ca" />
          </Field>
        </Card>

        <Card title="Content release">
          <p className="text-slate-700">By sending this form I confirm that:</p>
          <ul className="list-disc pl-5 space-y-1.5 text-slate-700">
            {CONSENT_POINTS.map((c) => (
              <li key={c}>{c}</li>
            ))}
          </ul>
          <p className="text-sm text-slate-600">
            We may remove anything that breaks these points. This is part of our{' '}
            <a className="text-blue-700 underline" href="/terms-of-service" target="_blank" rel="noreferrer">Terms of Service</a> (user content and acceptable use) and{' '}
            <a className="text-blue-700 underline" href="/privacy-policy" target="_blank" rel="noreferrer">Privacy Policy</a>.
          </p>
          <label className="flex items-start gap-3 font-medium text-slate-900">
            <input type="checkbox" className="mt-1 w-5 h-5" checked={f.consent === true} onChange={(e) => set('consent', e.target.checked)} required />
            I confirm all of the above and agree to the Terms of Service.
          </label>
        </Card>

        <Problems list={problems} />
        <Submit busy={busy || uploading > 0}>{mode === 'edit' ? 'Send changes' : 'Send and build my preview'}</Submit>
      </form>
    </Shell>
  );
}
