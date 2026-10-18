// /site/design/:token?template=B05 : "Choose this design" from the multi-design preview. Shows the
// design the customer picked next to their current one; the confirm button switches it (a button,
// not the link, so email link scanners cannot switch by accident), then their form reopens with
// every answer kept, so they can add anything the new design needs and send it to rebuild.
import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams, useNavigate, Link } from 'react-router-dom';
import { Shell, Notice, Submit, Problems, api, loadCatalog } from './ui';

export default function SiteDesign() {
  const { token } = useParams();
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const wanted = params.get('template') ?? '';
  const [info, setInfo] = useState(null);
  const [catalog, setCatalog] = useState([]);
  const [busy, setBusy] = useState(false);
  const [problems, setProblems] = useState([]);

  useEffect(() => {
    api(`/api/site-design?t=${encodeURIComponent(token)}`).then((r) => setInfo(r.ok ? r : { invalid: true }));
    loadCatalog().then(setCatalog);
  }, [token]);

  if (!info) return <Shell title="Choose a design"><p className="text-slate-600">Loading...</p></Shell>;
  if (info.invalid) return <Shell title="Link not valid"><Notice title="This link is not valid"><p>Check the email we sent you.</p></Notice></Shell>;

  const pick = catalog.find((t) => t.id === wanted);
  const current = catalog.find((t) => t.id === info.template);
  const preview = info.previewUrl ? info.previewUrl.replace(/\/$/, '') : null;
  if (wanted === info.template) {
    return (
      <Shell title="Choose a design">
        <Notice title={`${current?.name ?? 'This'} is already your design`}>
          <p>Nothing to change. When you are happy with your preview, press Publish.</p>
          <p className="flex flex-wrap justify-center gap-4 pt-2">
            {preview && <a className="font-semibold text-blue-700 underline" href={`${preview}/${wanted}/`}>Back to your preview</a>}
            <Link className="font-semibold text-blue-700 underline" to={`/site/publish/${token}`}>Publish my site</Link>
          </p>
        </Notice>
      </Shell>
    );
  }

  async function confirm(e) {
    e.preventDefault();
    setBusy(true);
    setProblems([]);
    const r = await api('/api/site-design', { method: 'POST', body: JSON.stringify({ t: token, template: wanted }) });
    setBusy(false);
    if (!r.ok) return setProblems([r.error ?? 'Something went wrong. Please try again.']);
    navigate(`/site/intake/${token}?design=${encodeURIComponent(wanted)}`);
  }

  return (
    <Shell title="Choose a design">
      <form onSubmit={confirm} className="space-y-6">
        <Notice title={`Switch ${info.business} to ${pick?.name ?? wanted}?`}>
          <p>
            Your preview shows your business in {pick?.name ?? 'this design'}
            {current ? <> instead of {current.name}</> : null}. Switching keeps every answer you gave us.
          </p>
          <p>Next, your form opens with your answers filled in. This design may ask for one or two extra things (they are marked). Send the form and we email you the new preview.</p>
          {pick?.summary && <p className="text-slate-500">{pick.summary}</p>}
          <Problems list={problems} />
          <div className="flex flex-wrap justify-center items-center gap-4 pt-2">
            <Submit busy={busy}>Switch to {pick?.name ?? 'this design'}</Submit>
            {preview && <a className="font-semibold text-blue-700 underline" href={`${preview}/${wanted}/`}>Keep looking</a>}
          </div>
        </Notice>
      </form>
    </Shell>
  );
}
