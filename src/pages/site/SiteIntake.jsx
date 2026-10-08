// /site/intake/:token : everything we need to build the customer's site. Works on a phone.
// Answers are kept in this browser while they type, so a closed tab does not lose them.
// After a preview the same link reopens the form filled in with their answers ("edit" mode),
// plus a box for anything else they want changed.
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Plus, Trash2, Loader2 } from 'lucide-react';
import { Shell, Card, Field, Text, Area, Submit, Problems, Notice, api, inputClass } from './ui';

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const DAY_NAMES = { Mon: 'Monday', Tue: 'Tuesday', Wed: 'Wednesday', Thu: 'Thursday', Fri: 'Friday', Sat: 'Saturday', Sun: 'Sunday' };
const PROVINCES = ['ON', 'QC', 'BC', 'AB', 'MB', 'SK', 'NS', 'NB', 'NL', 'PE', 'YT', 'NT', 'NU'];
const MAX_WORK = 40;
// Designs built around the work need a minimum number of work photos (keep in step with
// api/_lib/schemas.js PHOTO_NEEDS). priced: each needs a price (T01's flash wall).
const PHOTO_NEEDS = { T01: { work: 4, priced: true }, T04: { work: 2 }, S09: { work: 3 } };
const timeClass = inputClass.replace('px-4', 'px-2');

// Examples in the form match the customer's trade (first letter of the template id).
const TRADE = {
  T: { tagline: 'Custom tattoos and walk-ins in downtown Hamilton.', role: 'Role, for example Fine line artist or Piercer', service: 'Service, for example Hourly rate', photo: 'use the photo of the sleeve as the main photo', rules: 'Deposits, cancellations, age and ID, aftercare, how you sterilize your tools.' },
  B: { tagline: 'Fades and beard trims, walk-ins welcome.', role: 'Role, for example Barber or Senior barber', service: 'Service, for example Skin fade', photo: 'use the photo of the fade as the main photo', rules: 'Deposits, cancellations, lateness, walk-ins, payment.' },
  A: { tagline: 'Honest brake, tire, and engine repair in Brantford.', role: 'Role, for example Licensed mechanic or Service advisor', service: 'Service, for example Brake pads and rotors', photo: 'use the photo of the shop as the main photo', rules: 'Estimates and approvals, drop-off and pickup, the warranty you offer, payment.' },
  S: { tagline: 'Gel nails and lash extensions in a quiet studio.', role: 'Role, for example Nail tech or Lash artist', service: 'Service, for example Gel manicure', photo: 'use the nail art photo as the main photo', rules: 'Deposits, cancellations, lateness, patch tests, payment.' },
  P: { tagline: 'Small-group strength training for adults.', role: 'Role, for example Personal trainer or Coach', service: 'Service, for example 1-on-1 session (60 min)', photo: 'use the group class photo as the main photo', rules: 'Cancellations, packages and when they expire, what to bring, payment.' },
};

const blankService = () => ({ name: '', price: '', duration: '', description: '' });
const blankMember = () => ({ name: '', role: '', specialty: '', instagram: '', bookingUrl: '', photo: null });

function initial(lead) {
  return {
    business: { name: lead.business, tagline: '', phone: lead.phone ?? '', email: lead.email ?? '', street: '', city: lead.city ?? '', province: 'ON', postal: '', instagram: '', googleBusinessUrl: '' },
    hours: Object.fromEntries(DAYS.map((d, i) => [d, { open: i < 5, from: '09:00', to: '17:00' }])),
    hoursNote: '',
    services: [blankService(), blankService(), blankService()],
    team: [],
    photos: { logo: null, hero: null, about: null },
    work: [],
    aboutNotes: '',
    policyNotes: '',
    faqNotes: '',
    extraNotes: '',
    reviews: [],
    reviewsReal: false,
    omisUrl: '',
    domain: lead.domain ?? '',
    consent: false,
  };
}

/** Saved answers -> form state (edit mode). photoUrls: short-lived links to their uploads. */
function fromIntake(p, urls) {
  const photo = (x) => (x ? { key: x.key, preview: urls[x.key] ?? '' } : null);
  const byKind = (k) => p.photos.find((x) => x.kind === k);
  const open = new Map(p.hours.map((h) => [h.day, h]));
  const b = p.business;
  return {
    business: { name: b.name, tagline: b.tagline ?? '', phone: b.phone, email: b.email ?? '', street: b.street, city: b.city, province: b.province, postal: b.postal, instagram: b.instagram ?? '', googleBusinessUrl: b.googleBusinessUrl ?? '' },
    hours: Object.fromEntries(DAYS.map((d) => [d, open.has(d) ? { open: true, from: open.get(d).open, to: open.get(d).close } : { open: false, from: '09:00', to: '17:00' }])),
    hoursNote: p.hoursNote ?? '',
    services: p.services.map((s) => ({ name: s.name, price: s.price, duration: s.duration ?? '', description: s.description ?? '' })),
    team: p.team.map((m) => ({ name: m.name, role: m.role, specialty: m.specialty ?? '', instagram: m.instagram ?? '', bookingUrl: m.bookingUrl ?? '', photo: photo(p.photos.find((x) => x.kind === 'team' && x.member === m.name)) })),
    photos: { logo: photo(byKind('logo')), hero: photo(byKind('hero')), about: photo(byKind('about')) },
    work: p.photos.filter((x) => x.kind === 'work').map((x) => ({ key: x.key, preview: urls[x.key] ?? '', caption: x.caption ?? '', member: x.member ?? '', price: x.price ?? '' })),
    aboutNotes: p.aboutNotes ?? '',
    policyNotes: p.policyNotes ?? '',
    faqNotes: p.faqNotes ?? '',
    extraNotes: p.extraNotes ?? '',
    reviews: p.reviews.map((r) => ({ quote: r.quote, author: r.author, source: r.source ?? '' })),
    reviewsReal: p.reviews.length > 0,
    omisUrl: p.omisUrl ?? '',
    domain: p.domain ?? '',
    consent: false,
    changeNotes: '',
  };
}

/** "n1r1a1", "N1R-1A1", pasted spaces -> "N1R 1A1" (leaves anything else as typed). */
function tidyPostal(v) {
  const c = v.toUpperCase().replace(/[^A-Z0-9]/g, '');
  return /^[A-Z]\d[A-Z]\d[A-Z]\d$/.test(c) ? `${c.slice(0, 3)} ${c.slice(3)}` : v;
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
  const [lead, setLead] = useState(null);
  const [mode, setMode] = useState('first');
  const [info, setInfo] = useState({});
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
      const fresh = r.mode === 'edit' && r.previous ? fromIntake(r.previous, r.photoUrls ?? {}) : initial(r.lead);
      setF(saved ?? fresh);
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
  if (state === 'closed' || state === 'sent')
    return (
      <Shell title="We are building your site">
        <Notice title={mode === 'edit' && state === 'sent' ? 'Got your changes' : 'We are building your preview'}>
          <p>
            Thanks{lead ? `, ${lead.name.split(' ')[0]}` : ''}. {mode === 'edit' && state === 'sent' ? 'We are updating' : 'We have your details and are working on'} the {lead?.business} website now.
          </p>
          <p>You will get an email with your preview link, usually within the hour.</p>
          <p className="text-sm text-slate-500">Not in your inbox? Check your Promotions or Spam folder for an email from BDO Analytics Websites.</p>
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

  function toPayload() {
    const clean = (o) => Object.fromEntries(Object.entries(o).filter(([, v]) => v !== '' && v != null));
    const team = f.team.filter((m) => m.name.trim());
    const photos = [
      ...['logo', 'hero', 'about'].filter((k) => f.photos[k]).map((k) => ({ key: f.photos[k].key, kind: k })),
      ...team.filter((m) => m.photo).map((m) => ({ key: m.photo.key, kind: 'team', member: m.name.trim() })),
      ...f.work.map((w) => clean({ key: w.key, kind: 'work', caption: w.caption, member: w.member, price: w.price })),
    ];
    return clean({
      domain: f.domain.trim().toLowerCase(),
      business: clean({ ...b, email: b.email || undefined }),
      hours: DAYS.filter((d) => f.hours[d].open).map((d) => ({ day: d, open: f.hours[d].from, close: f.hours[d].to })),
      hoursNote: f.hoursNote,
      omisUrl: f.omisUrl,
      services: f.services.filter((s) => s.name.trim() || s.price.trim()).map(clean),
      team: team.map(({ photo, ...m }) => clean(m)),
      photos,
      aboutNotes: f.aboutNotes,
      policyNotes: f.policyNotes,
      faqNotes: f.faqNotes,
      extraNotes: f.extraNotes,
      reviews: f.reviewsReal ? f.reviews.filter((r) => r.quote.trim() && r.author.trim()).map(clean) : [],
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
      setState('sent');
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
              ? `Your answers are filled in. Change anything below, add or remove photos, and tell us anything else in the box. Changes included: ${info.roundsLeft ?? 0} more.`
              : `For the ${lead.business} website (design ${lead.template}). Only fields marked * are needed; the more you tell us, the better your site. Your answers are saved on this device as you type.`}
          </p>
        </header>

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
            <Field label="Phone customers call" htmlFor="b-phone" required>
              <Text id="b-phone" type="tel" value={b.phone} onChange={(v) => set('business.phone', v)} required />
            </Field>
            <Field label="Street address" htmlFor="b-street" required>
              <Text id="b-street" value={b.street} onChange={(v) => set('business.street', v)} required autoComplete="street-address" />
            </Field>
            <Field label="City" htmlFor="b-city" required>
              <Text id="b-city" value={b.city} onChange={(v) => set('business.city', v)} required />
            </Field>
            <Field label="Province (Canada)" htmlFor="b-prov" required>
              <select id="b-prov" className={inputClass} value={b.province} onChange={(e) => set('business.province', e.target.value)}>
                {PROVINCES.map((p) => (
                  <option key={p}>{p}</option>
                ))}
              </select>
            </Field>
            <Field label="Postal code" htmlFor="b-postal" required>
              <Text id="b-postal" value={b.postal} onChange={(v) => set('business.postal', v.toUpperCase())} onBlur={(e) => set('business.postal', tidyPostal(e.target.value))} required placeholder="N1R 1A1" autoComplete="postal-code" />
            </Field>
            <Field label="Email shown on the site" htmlFor="b-email">
              <Text id="b-email" type="email" value={b.email} onChange={(v) => set('business.email', v)} />
            </Field>
            <Field label="Instagram" htmlFor="b-ig" hint="Your handle, like @yourshop">
              <Text id="b-ig" value={b.instagram} onChange={(v) => set('business.instagram', v)} />
            </Field>
          </div>
          <Field label="One line about you" htmlFor="b-tag" hint={`Optional. For example: ${trade.tagline}`}>
            <Text id="b-tag" value={b.tagline} onChange={(v) => set('business.tagline', v)} maxLength={140} />
          </Field>
          <Field label="Google Business Profile link" htmlFor="b-gbp" hint="Optional. Used for the map button.">
            <Text id="b-gbp" type="url" value={b.googleBusinessUrl} onChange={(v) => set('business.googleBusinessUrl', v)} placeholder="https://" />
          </Field>
        </Card>

        <Card title="Opening hours" intro="Tick the days you are open.">
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
          <Field label="Anything else about hours" htmlFor="h-note" hint="Optional. For example: By appointment on Sundays.">
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

        <Card title="Your team" intro="Everyone customers can book with. Add as many as you have; skip this if it is just the business.">
          {f.team.map((m, i) => (
            <div key={i} className="rounded-xl border border-slate-200 p-4 space-y-3">
              <div className="grid sm:grid-cols-2 gap-3">
                <Text aria-label="Name" placeholder="Name" value={m.name} onChange={(v) => set(`team.${i}.name`, v)} />
                <Text aria-label="Role" placeholder={trade.role} value={m.role} onChange={(v) => set(`team.${i}.role`, v)} />
                <Text aria-label="What they are known for (optional)" placeholder="Known for (optional)" value={m.specialty} onChange={(v) => set(`team.${i}.specialty`, v)} />
                <Text aria-label="Instagram (optional)" placeholder="Instagram (optional)" value={m.instagram} onChange={(v) => set(`team.${i}.instagram`, v)} />
              </div>
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
          {PHOTO_NEEDS[lead.template] && (
            <p className="rounded-xl bg-blue-50 border border-blue-200 p-3 text-slate-800">
              Your design shows your work up front: add at least <strong>{PHOTO_NEEDS[lead.template].work} work photos</strong>
              {PHOTO_NEEDS[lead.template].priced ? ', each with a price' : ''}.
            </p>
          )}
          <PhotoSlot kind="hero" label="Main photo" hint="The big photo at the top. Your best shot of your work or your space. If you skip it, we pick your strongest photo." />
          <PhotoSlot kind="logo" label="Logo" hint="Optional." />
          <PhotoSlot kind="about" label="Photo of you or your space" hint="Optional." />
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

        <Card title="In your own words" intro="Write it like you would say it. We turn it into the text on your site, using only what you tell us.">
          <Field label="About your business" htmlFor="about" hint="How it started, what you are known for, who you serve.">
            <Area id="about" rows={5} value={f.aboutNotes} onChange={(v) => set('aboutNotes', v)} maxLength={3000} />
          </Field>
          <Field label="Rules customers should know" htmlFor="policies" hint={trade.rules}>
            <Area id="policies" value={f.policyNotes} onChange={(v) => set('policyNotes', v)} maxLength={2000} />
          </Field>
          <Field label="Questions customers ask you" htmlFor="faq" hint="With your answers.">
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
