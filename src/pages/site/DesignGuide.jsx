// "Your site next to the design sample": the customer's preview and the template's sample in
// one frame (tabs), plus what the sample shows that their site does not have yet, each with a
// pointer to where in the form to add it. Counts come from catalog.json "sample" (the sample
// business) and the site-changes / site-intake APIs ("have", the customer's site).
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink, Check } from 'lucide-react';
import { loadCatalog } from './ui';

const plural = (n, one, many = `${one}s`) => `${n} ${n === 1 ? one : many}`;

// One row per thing a sample can show. gap() returns the advice, or null when the site has it.
const ROWS = [
  { key: 'heroPhoto', gap: (s, h) => s.heroPhoto && !h.heroPhoto && 'The sample opens with a big photo. Add a strong photo of your work or your space under Photos.' },
  { key: 'galleryPhotos', gap: (s, h) => s.galleryPhotos > h.galleryPhotos && `Photos of your work: the sample shows ${s.galleryPhotos}, your site has ${h.galleryPhotos}. Add more under Photos.` },
  { key: 'team', gap: (s, h) => s.team > 0 && h.team === 0 && `Your team: the sample introduces ${plural(s.team, 'person', 'people')}. Add them under Your team.` },
  { key: 'teamPhotos', gap: (s, h) => s.teamPhotos > 0 && h.team > 0 && h.teamPhotos < Math.min(s.teamPhotos, h.team) && 'Team photos: the sample shows a photo of each person. Add one for each person under Your team.' },
  { key: 'services', gap: (s, h) => s.services > h.services && h.services < 3 && `Services and prices: the sample lists ${s.services}, your site lists ${h.services}. Add the rest under Services and prices.` },
  { key: 'servicePhotos', gap: (s, h) => s.servicePhotos > 0 && h.servicePhotos === 0 && 'Service photos: the sample shows a photo beside services. Under Photos, mark which service a photo shows.' },
  { key: 'about', gap: (s, h) => s.about && !h.about && 'Your story: the sample has an About section. Write a few lines in About your business (under In your own words).' },
  { key: 'aboutPhoto', gap: (s, h) => s.aboutPhoto && !h.aboutPhoto && 'About photo: the sample shows a photo beside its story. Add one as Photo of you or your space.' },
  { key: 'faq', gap: (s, h) => s.faq > 0 && h.faq === 0 && `Questions and answers: the sample answers ${plural(s.faq, 'common question')}. Add them in Questions customers ask you.` },
  { key: 'policies', gap: (s, h) => s.policies > 0 && h.policies === 0 && 'Policies: the sample explains things like cancellations and late arrivals. Add them in Rules customers should know.' },
];

export default function DesignGuide({ token, template, previewUrl, have, showLink = true }) {
  const [tpl, setTpl] = useState(null);
  const [tab, setTab] = useState('mine');
  useEffect(() => {
    loadCatalog().then((list) => setTpl(list.find((t) => t.id === template) ?? null));
  }, [template]);
  if (!tpl) return null;

  const sampleUrl = `/templates/${tpl.path}`;
  const gaps = tpl.sample && have ? ROWS.map((r) => r.gap(tpl.sample, have)).filter(Boolean) : [];
  const frameUrl = tab === 'mine' ? previewUrl : sampleUrl;

  return (
    <section className="space-y-4 rounded-2xl border border-slate-300 bg-white p-5" aria-labelledby="guide-heading">
      <div>
        <h2 id="guide-heading" className="text-xl font-bold text-slate-900">Your site next to the design sample</h2>
        <p className="text-slate-600">The sample is {tpl.name} filled in for a made-up business. Compare them to see what you could add.</p>
      </div>

      <div role="tablist" aria-label="Which site to show" className="inline-flex rounded-xl bg-slate-100 p-1">
        {[['mine', 'Your site'], ['sample', 'Design sample']].map(([id, label]) => (
          <button
            key={id}
            type="button"
            role="tab"
            aria-selected={tab === id}
            onClick={() => setTab(id)}
            disabled={id === 'mine' && !previewUrl}
            className={`min-h-[44px] rounded-lg px-4 text-sm font-bold transition-colors disabled:opacity-50 ${tab === id ? 'bg-white text-slate-900 shadow' : 'text-slate-600 hover:text-slate-900'}`}
          >
            {label}
          </button>
        ))}
      </div>

      {frameUrl && (
        <div className="overflow-hidden rounded-xl border border-slate-200">
          <iframe key={frameUrl} src={frameUrl} title={tab === 'mine' ? 'Your site' : 'Design sample'} className="block h-[28rem] w-full bg-white" />
        </div>
      )}
      <p className="text-sm">
        <a className="inline-flex items-center gap-1 font-bold text-blue-700 underline" href={frameUrl} target="_blank" rel="noreferrer">
          Open {tab === 'mine' ? 'your site' : 'the sample'} full size <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
        </a>
      </p>

      {tpl.sample && have && (
        gaps.length ? (
          <div className="rounded-xl bg-amber-50 p-4">
            <p className="font-bold text-slate-900">The sample shows {plural(gaps.length, 'thing')} your site does not have yet:</p>
            <ul className="mt-2 list-disc space-y-1.5 pl-5 text-slate-800">
              {gaps.map((g) => <li key={g}>{g}</li>)}
            </ul>
            <p className="mt-3 text-sm text-slate-700">
              All optional: your site works without them, and we only show what you give us.
              {showLink && <> <Link className="font-bold text-blue-700 underline" to={`/site/intake/${token}`}>Add them in your form</Link>.</>}
            </p>
          </div>
        ) : (
          <p className="flex items-center gap-2 rounded-xl bg-emerald-50 p-4 font-bold text-emerald-900">
            <Check className="h-5 w-5" aria-hidden="true" /> Your site has everything the sample shows.
          </p>
        )
      )}
    </section>
  );
}
