// Designed email layout, generated from omis-sites functions-church/_email.ts (the same design the
// ChurchNow and BDO build-pipeline emails use). Regenerate rather than edit: npx esbuild <that file> --format=esm
const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
const para = (s) => esc(s).replace(/\r?\n\r?\n/g, '</p><p style="margin:0 0 12px">').replace(/\r?\n/g, "<br>");
const HEX = /^#[0-9a-fA-F]{6}$/;
const FONT = "-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif";
const COND = "'Barlow Condensed','Arial Narrow','Helvetica Neue',Arial,sans-serif";
function wordmark(site) {
  const the = /^The\s+/i.test(site);
  const w = site.replace(/^The\s+/i, "").split(/\s+/);
  if (w.length === 1) return [the ? "The" : "", w[0], ""];
  return [the ? "The" : "", w.slice(0, -1).join(" "), w[w.length - 1]];
}
function emailHtml(o) {
  const brand = HEX.test(o.brand) ? o.brand : "#1611A8";
  const glow = HEX.test(o.glow) ? o.glow : "#FFB648";
  const [the, main, sub] = wordmark(o.site);
  const host = o.siteUrl ? new URL(o.siteUrl).host : "";
  const row = (r) => {
    let v;
    if (r.long) v = `<div style="margin-top:6px;padding:16px 18px;border-left:4px solid ${glow};background:#F6F5FF;border-radius:0 10px 10px 0;font-family:Georgia,'Times New Roman',serif;font-size:17px;line-height:1.6;color:#141836"><p style="margin:0 0 12px">${para(r.value)}</p></div>`;
    else if (r.chip) v = `<span style="display:inline-block;margin-top:4px;padding:4px 12px;border-radius:999px;background:${brand};color:#FFFFFF;font-size:13px;font-weight:600">${esc(r.value)}</span>`;
    else if (r.verse) v = `<div style="margin-top:4px;font-family:Georgia,'Times New Roman',serif;font-style:italic;font-size:17px;color:${brand}">${esc(r.value)}</div>`;
    else v = `<div style="margin-top:2px;font-size:16px;color:#141836">${esc(r.value)}</div>`;
    return `<tr><td style="padding:12px 0;border-bottom:1px solid #ECEDF5"><div style="font-size:11px;font-weight:700;letter-spacing:1.4px;text-transform:uppercase;color:#6B7090">${esc(r.label)}</div>${v}</td></tr>`;
  };
  const replyBtn = o.replyTo ? `<tr><td style="padding:24px 0 4px"><a href="mailto:${esc(o.replyTo.email)}" style="display:inline-block;padding:13px 24px;border-radius:999px;background:${glow};color:#141836;font-weight:700;font-size:15px;text-decoration:none">Reply to ${esc(o.replyTo.name)}</a></td></tr>` : o.rows.length ? `<tr><td style="padding:20px 0 0;font-size:14px;color:#6B7090">No email address was given, so there is no way to reply directly.</td></tr>` : "";
  let when;
  try {
    when = new Intl.DateTimeFormat("en-US", { timeZone: o.tz || "UTC", weekday: "long", month: "long", day: "numeric", hour: "numeric", minute: "2-digit", timeZoneName: "short" }).format(/* @__PURE__ */ new Date());
  } catch {
    when = (/* @__PURE__ */ new Date()).toUTCString();
  }
  return `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="color-scheme" content="light"><title>${esc(o.title)}</title></head>
<body style="margin:0;padding:0;background:#EEF0FA">
<div style="display:none;max-height:0;overflow:hidden">${esc(o.intro.split(/\n\n+/)[0])}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#EEF0FA"><tr><td align="center" style="padding:28px 12px">
<table role="presentation" width="600" cellpadding="0" cellspacing="0" style="width:100%;max-width:600px;border-collapse:separate;border-radius:18px;overflow:hidden;background:#FFFFFF;font-family:${FONT}">
  <tr><td style="background:${brand};padding:34px 36px 30px;text-align:center">
    ${the ? `<div style="font-family:${COND};font-size:17px;color:#FFFFFF;line-height:1">${esc(the)}</div>` : ""}
    <div style="font-family:${COND};font-size:30px;font-weight:700;color:#FFFFFF;line-height:1.05;letter-spacing:-0.3px">${esc(main)}</div>
    ${sub ? `<div style="font-family:${COND};font-size:12px;color:#FFFFFF;letter-spacing:7px;text-transform:uppercase;line-height:1.6;padding-left:7px">${esc(sub)}</div>` : ""}
    <div style="width:56px;height:3px;background:${glow};margin:20px auto 14px;border-radius:3px;font-size:0;line-height:0">&nbsp;</div>
    <div style="font-size:12px;font-weight:700;letter-spacing:2.4px;text-transform:uppercase;color:${glow}">${esc(o.title)}</div>
  </td></tr>
  <tr><td style="padding:30px 36px 34px">
    ${o.intro.split(/\n\n+/).map((p) => `<p style="margin:0 0 12px;font-size:16px;line-height:1.55;color:#141836">${esc(p)}</p>`).join("")}
    ${(o.buttons ?? []).length ? `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:18px 0 8px"><tr><td>${o.buttons.map((b, i) => `<a href="${esc(b.url)}" style="display:inline-block;margin:0 8px 10px 0;padding:13px 22px;border-radius:999px;font-weight:700;font-size:15px;text-decoration:none;${i === 0 ? `background:${glow};color:#141836` : `background:#FFFFFF;color:${brand};border:2px solid ${brand}`}">${esc(b.label)}</a>`).join("")}</td></tr></table>` : ""}
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">${o.rows.map(row).join("")}${replyBtn}</table>
    ${o.rows.length ? `<p style="margin:22px 0 0;font-size:12px;color:#8A8FAD">Received ${esc(when)}. This was sent privately to you and is not shown on the website.</p>` : ""}
  </td></tr>
  <tr><td style="background:${o.footer && HEX.test(o.footer) ? o.footer : "#0E0B4D"};padding:22px 36px;text-align:center;font-size:12px;line-height:1.7;color:#C9CCE6">
    ${host ? `Sent from <a href="${esc(o.siteUrl)}" style="color:${glow};text-decoration:none">${esc(host)}</a> &middot; ` : ""}Website by <a href="${esc(o.credit?.url ?? "https://churchnow.ca")}" style="color:${glow};text-decoration:none">${esc(o.credit?.name ?? "ChurchNow")}</a>
    ${o.unsubscribe ? `<br><a href="${esc(o.unsubscribe)}" style="color:#C9CCE6;text-decoration:underline">Unsubscribe from these emails</a>` : ""}
  </td></tr>
</table>
</td></tr></table>
</body></html>`;
}
function emailText(o) {
  const lines = [o.title.toUpperCase(), "", o.intro, "", ...(o.buttons ?? []).map((b) => `${b.label}: ${b.url}`), ...o.buttons?.length ? [""] : []];
  for (const r of o.rows) lines.push(`${r.label}:${r.long ? "\n" : " "}${r.value}`, "");
  if (o.replyTo) lines.push(`Reply: ${o.replyTo.email}`, "");
  lines.push(`-- ${o.site}${o.siteUrl ? ` (${o.siteUrl})` : ""}. Website by ${o.credit?.name ?? "ChurchNow"}.`);
  if (o.unsubscribe) lines.push(`Unsubscribe: ${o.unsubscribe}`);
  return lines.join("\n");
}
async function sign(value, secret) {
  const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(`optout:${secret}`), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const mac = new Uint8Array(await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(value.toLowerCase())));
  return btoa(String.fromCharCode(...mac)).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}
async function unsubscribeUrl(siteUrl, email, secret) {
  const u = new URL("/api/unsubscribe", siteUrl);
  u.searchParams.set("e", email.toLowerCase());
  u.searchParams.set("s", await sign(email, secret));
  return u.toString();
}
async function verifyUnsubscribe(email, sig, secret) {
  return !!email && !!sig && await sign(email, secret) === sig;
}
export {
  emailHtml,
  emailText,
  unsubscribeUrl,
  verifyUnsubscribe
};
