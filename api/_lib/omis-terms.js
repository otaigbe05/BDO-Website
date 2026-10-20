// The OMIS website price terms (owner, 2026-10-20). The lower setup price is for customers on a
// PAID OMIS plan (a free trial does not count). If their OMIS plan ends within MONTHS of paying
// for the website, they either keep the site online with website care, or pay the difference
// between the two setup prices to take their site files. After MONTHS, the files are free to take.
// The customer ticks a box with this exact text before paying; the text and version are saved
// (events "omis_terms"), shown on Stripe's page, and emailed to them with their receipt.
// Shared by the server and the Publish page. Change VERSION whenever the wording changes.
export const OMIS_TERMS_VERSION = '2026-10-20';
export const OMIS_TERMS_MONTHS = 6;

/** The terms in plain words, with the real prices ("$12/month", "$250"). */
export const omisTermsText = ({ care, difference }) =>
  `This lower setup price is for customers who keep a paid OMIS plan. If my OMIS plan ends within ${OMIS_TERMS_MONTHS} months of paying for my website, I can keep my site online with website care (${care}), or take my site files after paying the difference between the two setup prices (${difference}). After ${OMIS_TERMS_MONTHS} months, I can take my site files at no charge.`;

/** The date the free hand-over starts: MONTHS after the setup was paid. */
export function termsEnd(paidAt) {
  const d = new Date(paidAt);
  d.setMonth(d.getMonth() + OMIS_TERMS_MONTHS);
  return d;
}
