// "Use my words exactly" (intake exactWords): how the about text, FAQ and policies are read
// when the owner wants them on the site as written. COPY of omis-sites/pipeline/intake.mjs
// (paragraphs, parseFaq, parsePolicies and the checks there); keep the two in step. No imports,
// so the intake form can show the same problems in the browser before sending.

/** Text -> paragraphs (split on blank lines, spaces tidied). */
export function paragraphs(text) {
  return (text ?? '').split(/\n\s*\n/).map((t) => t.replace(/\s+/g, ' ').trim()).filter(Boolean);
}

/** "Q: ...\nA: ..." lines -> [{ q, a }]. A line without "Q:" or "A:" continues the one above. */
export function parseFaq(text) {
  const out = [];
  let cur = null;
  let field = null;
  for (const raw of (text ?? '').split('\n')) {
    const line = raw.trim();
    const m = line.match(/^([QA])\s*[:.)-]\s*(.*)$/i);
    if (m && m[1].toUpperCase() === 'Q') {
      cur = { q: m[2], a: '' };
      out.push(cur);
      field = 'q';
    } else if (m && cur) {
      cur.a = cur.a ? `${cur.a} ${m[2]}` : m[2];
      field = 'a';
    } else if (line && cur && field) {
      cur[field] = `${cur[field]} ${line}`;
    }
  }
  return out.map((f) => ({ q: f.q.replace(/\s+/g, ' ').trim(), a: f.a.replace(/\s+/g, ' ').trim() }));
}

/** "Title: text" paragraphs -> [{ title, text }]. Paragraphs without a short title are skipped. */
export function parsePolicies(text) {
  return paragraphs(text)
    .map((p) => p.match(/^([^:]{2,60}):\s*(.+)$/))
    .filter(Boolean)
    .map((m) => ({ title: m[1].trim(), text: m[2].trim() }));
}

/** Problems with exact-words answers, in plain words: [{ path, message }] (empty when fine). */
export function exactWordsProblems(v) {
  const out = [];
  const add = (path, message) => out.push({ path, message });
  if (v.aboutNotes && v.aboutNotes.trim().length > 1500) add('aboutNotes', 'About (your exact words): 1500 characters at most.');
  const faq = parseFaq(v.faqNotes);
  if (v.faqNotes?.trim() && !faq.length) add('faqNotes', 'Questions (your exact words): start each question with "Q:" and each answer with "A:".');
  faq.forEach((f, i) => {
    if (!f.q || !f.a) add('faqNotes', `Question ${i + 1}: needs both a "Q:" line and an "A:" line.`);
    else if (f.q.length > 160 || f.a.length > 800) add('faqNotes', `Question ${i + 1}: the question up to 160 characters, the answer up to 800.`);
  });
  if (faq.length > 20) add('faqNotes', 'Questions (your exact words): 20 at most.');
  const pol = parsePolicies(v.policyNotes);
  if (v.policyNotes?.trim() && !pol.length) add('policyNotes', 'Rules (your exact words): one paragraph each, starting with its title and a colon, like "Deposit: ...".');
  pol.forEach((p, i) => {
    if (p.title.length > 60 || p.text.length > 400) add('policyNotes', `Rule ${i + 1}: the title up to 60 characters, the text up to 400.`);
  });
  return out;
}
