// /site/answer/:token/:q : answer our question about a change request. It shows their request and
// the question; they type only the answer, and the request runs again with it (no retyping).
// The owner's copy of the question email opens this page with ?o=<approve key> ("Answer for them").
// Whoever answers first wins; a second visit says it is already answered.
import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import { Shell, Notice, Card, Field, Area, Submit, Problems, api } from './ui';

export default function SiteAnswer() {
  const { token, q } = useParams();
  const [params] = useSearchParams();
  const o = params.get('o') ?? '';
  const [info, setInfo] = useState(null);
  const [text, setText] = useState('');
  const [busy, setBusy] = useState(false);
  const [problems, setProblems] = useState([]);
  const [sent, setSent] = useState(null);

  useEffect(() => {
    api(`/api/site-changes?t=${encodeURIComponent(token)}&q=${encodeURIComponent(q)}${o ? `&o=${encodeURIComponent(o)}` : ''}`).then((r) => setInfo(r.ok ? r : { invalid: true }));
  }, [token, q, o]);

  async function send(e) {
    e.preventDefault();
    setBusy(true);
    setProblems([]);
    const r = await api('/api/site-changes', { method: 'POST', body: JSON.stringify({ t: token, q, answer: text, ...(o ? { o } : {}) }) });
    setBusy(false);
    if (r.ok) setSent(r.already ? { already: true, answer: r.answer } : { by: r.by });
    else setProblems(r.problems ?? [r.error ?? 'Something went wrong.']);
  }

  if (!info) return <Shell title="Answer"><p className="text-slate-600">Loading...</p></Shell>;
  if (info.invalid) return <Shell title="Link not valid"><Notice title="This link is not valid"><p>Check the email we sent you.</p></Notice></Shell>;

  const already = sent?.already || (!sent && info.answered);
  if (already) {
    const shown = sent?.answer ?? info.answer;
    return (
      <Shell title="Already answered">
        <Notice title="Already answered, thank you">
          {shown && <p>The answer we have: "{shown}"</p>}
          <p>Your change is being made with it. You will get an email when it is ready.</p>
          <p>Anything else to change? <Link className="text-blue-700 underline" to={`/site/intake/${token}`}>Change something</Link>.</p>
        </Notice>
      </Shell>
    );
  }
  if (sent) {
    return (
      <Shell title="Thank you">
        <Notice title="Thank you">
          <p>{sent.by === 'owner' ? `Answered for ${info.business}. Their request runs again with this answer; they get the usual email when it is ready.` : 'We are making your change now. You will get an email when it is ready, usually within a few minutes.'}</p>
        </Notice>
      </Shell>
    );
  }

  return (
    <Shell title="One question about your change">
      <form onSubmit={send} className="space-y-6">
        <Card title={info.owner ? `Answer for ${info.business}` : 'One question about your change'} intro={info.owner ? 'You are answering for the customer (for example after a phone call). Whoever answers first wins.' : 'You do not need to type your request again: we kept it. Just answer the question.'}>
          <div className="space-y-1">
            <p className="text-sm font-bold text-slate-900">{info.owner ? 'Their request' : 'Your request'}</p>
            <p className="whitespace-pre-line rounded-xl bg-slate-50 p-4 text-slate-700">{info.request}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-bold text-slate-900">Our question</p>
            <p className="whitespace-pre-line rounded-xl border border-blue-200 bg-blue-50 p-4 text-lg font-semibold text-slate-900">{info.question}</p>
          </div>
          <Field label={info.owner ? 'Their answer' : 'Your answer'} htmlFor="answer" required>
            <Area id="answer" value={text} onChange={setText} rows={3} maxLength={2000} required autoFocus />
          </Field>
        </Card>
        <Problems list={problems} />
        <div className="text-center">
          <Submit busy={busy} disabled={busy || !text.trim()}>{info.owner ? "Send their answer" : "Send my answer"}</Submit>
        </div>
      </form>
    </Shell>
  );
}
