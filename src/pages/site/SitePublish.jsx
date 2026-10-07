// /site/publish/:token : the customer confirms they are happy. A button (not the email link
// itself) does it, so email link scanners cannot publish by accident.
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Shell, Notice, Submit, Problems, api } from './ui';

const MESSAGES = {
  publishing: 'Your site is being published. You will get an email with the link in a few minutes.',
  'waiting-owner': 'Thanks. We do a final check of every site before it goes live; you will get an email when it is published, usually the same business day.',
  live: 'Your site is already live.',
};

export default function SitePublish() {
  const { token } = useParams();
  const [info, setInfo] = useState(null);
  const [busy, setBusy] = useState(false);
  const [problems, setProblems] = useState([]);
  const [state, setState] = useState(null);

  useEffect(() => {
    api(`/api/site-changes?t=${encodeURIComponent(token)}`).then((r) => setInfo(r.ok ? r : { invalid: true }));
  }, [token]);

  async function publish(e) {
    e.preventDefault();
    setBusy(true);
    const r = await api('/api/site-golive', { method: 'POST', body: JSON.stringify({ who: 'customer', t: token }) });
    setBusy(false);
    if (r.ok) setState(r.state);
    else setProblems([r.error ?? 'Something went wrong.']);
  }

  if (!info) return <Shell title="Publish"><p className="text-slate-600">Loading...</p></Shell>;
  if (info.invalid) return <Shell title="Link not valid"><Notice title="This link is not valid"><p>Check the email we sent you.</p></Notice></Shell>;
  if (state || info.status === 'live') return <Shell title="Publish"><Notice title="Thank you"><p>{MESSAGES[state ?? 'live']}</p></Notice></Shell>;

  return (
    <Shell title="Publish your site">
      <form onSubmit={publish} className="space-y-6">
        <Notice title={`Publish the ${info.business} website?`}>
          {info.previewUrl && (
            <p>
              Last look: <a className="text-blue-700 underline" href={info.previewUrl} target="_blank" rel="noreferrer">open your preview</a>.
            </p>
          )}
          <p>
            Want something changed first? <Link className="text-blue-700 underline" to={`/site/intake/${token}`}>Change something</Link>.
          </p>
        </Notice>
        <Problems list={problems} />
        <div className="text-center">
          <Submit busy={busy}>Yes, publish my site</Submit>
        </div>
      </form>
    </Shell>
  );
}
