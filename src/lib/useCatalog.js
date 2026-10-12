import { useEffect, useState } from 'react';

// The website templates come from the omis-sites gallery behind /templates. One fetch is
// shared by every component on the page.
let pending = null;
const load = () => {
  pending ??= fetch('/templates/catalog.json')
    .then((r) => (r.ok ? r.json() : Promise.reject(new Error(String(r.status)))))
    .then((d) => d.templates ?? [])
    .catch((e) => { pending = null; throw e; });
  return pending;
};

export function useCatalog() {
  const [state, setState] = useState({ status: 'loading', templates: [] });
  useEffect(() => {
    let live = true;
    load()
      .then((templates) => live && setState({ status: 'ready', templates }))
      .catch(() => live && setState({ status: 'error', templates: [] }));
    return () => { live = false; };
  }, []);
  return state;
}

/** Newest first, so the latest designs lead. */
export const forTrade = (templates, code) =>
  templates.filter((x) => x.vertical === code && x.thumb).sort((a, b) => b.id.localeCompare(a.id));
