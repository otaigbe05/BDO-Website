// /site/approve/:id/:token : the owner's one-click check before a site goes live.
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Shell, Card, Notice, Problems, api } from './ui';

export default function SiteApprove() {
  const { id, token } = useParams();
  const [info, setInfo] = useState(null);
  const [busy, setBusy] = useState(false);
  const [problems, setProblems] = useState([]);
  const [state, setState] = useState(null);

  useEffect(() => {
    api(`/api/site-golive?id=${encodeURIComponent(id)}&t=${encodeURIComponent(token)}`).then((r) => setInfo(r.ok ? r : { invalid: true }));
  }, [id, token]);

  async function act(action) {
    setBusy(true);
    const r = await api('/api/site-golive', { method: 'POST', body: JSON.stringify({ who: 'owner', id, t: token, action }) });
    setBusy(false);
    if (r.ok) setState(r.state);
    else setProblems([r.error ?? 'Something went wrong.']);
  }

  if (!info) return <Shell title="Approve"><p className="text-slate-600">Loading...</p></Shell>;
  if (info.invalid) return <Shell title="Link not valid"><Notice title="This link is not valid"><p>Use the link in the latest email.</p></Notice></Shell>;
  if (state)
    return (
      <Shell title="Done">
        <Notice title={{ held: 'Held', publishing: 'Publishing', 'sent-to-customer': 'Sent to the customer', live: 'Already live' }[state] ?? 'Done'}>
          <p>
            {{
              held: 'The customer will not see this preview until you send it.',
              publishing: 'The customer had already pressed Publish, so the site is going live now.',
              'sent-to-customer': 'The customer has the preview now. It goes live when they press Publish.',
              live: 'This site is already live.',
            }[state]}
          </p>
        </Notice>
      </Shell>
    );

  const r = info.report ?? {};
  return (
    <Shell title={`Approve ${info.business}`}>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-slate-900">{info.business}</h1>
        <Card>
          <p className="text-slate-700">
            {info.city} | Template {info.template} | {info.package} | Status: <strong>{info.status}</strong> | Customer pressed Publish: <strong>{info.customerOk ? 'yes' : 'not yet'}</strong>
          </p>
          {info.previewUrl && (
            <p>
              <a className="text-blue-700 underline font-bold" href={info.previewUrl} target="_blank" rel="noreferrer">Open the preview</a>
            </p>
          )}
          <div>
            <h2 className="font-bold text-slate-900">Photos left out</h2>
            {r.rejectedPhotos?.length ? (
              <ul className="list-disc pl-5">{r.rejectedPhotos.map((p) => <li key={p.file}>{p.file}: {p.problem}</li>)}</ul>
            ) : (
              <p className="text-slate-600">None</p>
            )}
          </div>
          <div>
            <h2 className="font-bold text-slate-900">Notes from the draft</h2>
            {r.notesForOwner?.length ? <ul className="list-disc pl-5">{r.notesForOwner.map((n) => <li key={n}>{n}</li>)}</ul> : <p className="text-slate-600">None</p>}
          </div>
        </Card>
        <Problems list={problems} />
        {info.status === 'live' ? (
          <p className="text-slate-700">This site is live{info.liveUrl ? <>: <a className="text-blue-700 underline" href={info.liveUrl}>{info.liveUrl}</a></> : ''}.</p>
        ) : (
          <div className="flex flex-wrap gap-3">
            <button type="button" disabled={busy || info.ownerOk} onClick={() => act('approve')} className="px-8 py-4 rounded-xl bg-blue-700 hover:bg-blue-800 disabled:opacity-60 text-white font-bold text-lg">
              {info.ownerOk ? 'Sent to customer' : info.status === 'preview' ? 'Approve' : 'Send to customer'}
            </button>
            <button type="button" disabled={busy} onClick={() => act('hold')} className="px-8 py-4 rounded-xl border-2 border-slate-400 text-slate-900 font-bold text-lg">
              Hold
            </button>
          </div>
        )}
      </div>
    </Shell>
  );
}
