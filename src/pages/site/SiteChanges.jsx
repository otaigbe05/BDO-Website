// /site/changes/:token : the customer asks for changes in plain words; the pipeline applies
// them and emails a new preview.
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Shell, Card, Field, Area, Submit, Problems, Notice, api } from './ui';

export default function SiteChanges() {
  const { token } = useParams();
  const [info, setInfo] = useState(null);
  const [request, setRequest] = useState('');
  const [busy, setBusy] = useState(false);
  const [problems, setProblems] = useState([]);
  const [sent, setSent] = useState(false);

  useEffect(() => {
    api(`/api/site-changes?t=${encodeURIComponent(token)}`).then((r) => setInfo(r.ok ? r : { invalid: true }));
  }, [token]);

  async function submit(e) {
    e.preventDefault();
    setBusy(true);
    setProblems([]);
    const r = await api('/api/site-changes', { method: 'POST', body: JSON.stringify({ t: token, request }) });
    setBusy(false);
    if (r.ok) setSent(true);
    else setProblems(r.problems ?? [r.error ?? 'Something went wrong.']);
  }

  if (!info) return <Shell title="Changes"><p className="text-slate-600">Loading...</p></Shell>;
  if (info.invalid)
    return (
      <Shell title="Link not valid">
        <Notice title="This link is not valid"><p>Check the email we sent you.</p></Notice>
      </Shell>
    );
  if (sent)
    return (
      <Shell title="Changes received">
        <Notice title="Got it">
          <p>{info.roundsLeft > 0 ? 'We are making your changes now. You will get an email with the new preview, usually within 30 minutes.' : 'You have used the included rounds of changes, so we will look at this ourselves and email you.'}</p>
        </Notice>
      </Shell>
    );
  if (info.status === 'live')
    return (
      <Shell title="Your site is live">
        <Notice title="Your site is live">
          <p>For changes now, reply to any of our emails and tell us what to change.</p>
          {info.liveUrl && <p><a className="text-blue-700 underline" href={info.liveUrl}>Open your website</a></p>}
        </Notice>
      </Shell>
    );

  return (
    <Shell title="Ask for changes">
      <form onSubmit={submit} className="space-y-6">
        <header className="space-y-2">
          <h1 className="text-3xl font-bold text-slate-900">Changes to the {info.business} website</h1>
          {info.previewUrl && (
            <p>
              <a className="text-blue-700 underline font-medium" href={info.previewUrl} target="_blank" rel="noreferrer">Open your preview</a> in another tab while you write.
            </p>
          )}
        </header>
        <Card>
          <Field
            label="What should we change?"
            htmlFor="req"
            hint={`Plain words are fine: "Change the Saturday hours to 10 to 4", "Remove the second photo", "Make the about text shorter". Rounds left: ${info.roundsLeft}.`}
          >
            <Area id="req" rows={7} value={request} onChange={setRequest} required minLength={3} maxLength={3000} />
          </Field>
          <p className="text-sm text-slate-500">New photos cannot be added here yet; reply to our email with them and we will add them.</p>
        </Card>
        <Problems list={problems} />
        <Submit busy={busy}>Send changes</Submit>
      </form>
    </Shell>
  );
}
