// What a site contains, counted the same way as omis-sites/src/lib/sample.ts counts a
// template's sample (catalog.json "sample"). Keep the two in step.
export function summarize(c) {
  if (!c) return null;
  const n = (v) => (Array.isArray(v) ? v.length : 0);
  return {
    heroPhoto: Boolean(c.images?.hero),
    galleryPhotos: n(c.gallery),
    team: n(c.team),
    teamPhotos: (c.team ?? []).filter((m) => m.photo).length,
    services: n(c.services),
    servicePhotos: (c.services ?? []).filter((s) => s.photo).length,
    about: Boolean(c.about),
    aboutPhoto: Boolean(c.images?.about),
    faq: n(c.faq),
    policies: n(c.policies),
  };
}
