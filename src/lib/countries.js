// Countries for the website sign-up and details forms (owner, 2026-10-20: any country, not only
// Canada and the US). COPY of the form parts of omis-sites src/lib/countries.ts; keep in step.
// Names come from the browser (Intl.DisplayNames), so there is no long list to keep up to date.
// Canada, the US and Australia get a province/state list (and CA/US a checked postal code); every
// other country gets a free "state or region" box and an optional postal code.

export const PROVINCES = ['ON', 'QC', 'BC', 'AB', 'MB', 'SK', 'NS', 'NB', 'NL', 'PE', 'YT', 'NT', 'NU'];
export const STATES = ['AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'DC', 'FL', 'GA', 'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD', 'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ', 'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'];
export const AU_STATES = ['NSW', 'VIC', 'QLD', 'WA', 'SA', 'TAS', 'ACT', 'NT'];
export const REGIONS = { CA: PROVINCES, US: STATES, AU: AU_STATES };
export const REGION_LABEL = { CA: 'Province', US: 'State', AU: 'State or territory' };
export const POSTAL_LABEL = { CA: 'Postal code', US: 'ZIP code', AU: 'Postcode' };
/** The first choice in the province/state list when the country changes. */
export const DEFAULT_REGION = { CA: 'ON', US: 'NY', AU: 'NSW' };

// Region codes that are not countries (or not places people sign up from).
const NOT_COUNTRIES = new Set(['AC', 'AQ', 'BV', 'CP', 'CQ', 'DG', 'EA', 'EU', 'EZ', 'HM', 'IC', 'QO', 'TA', 'TF', 'UM', 'UN', 'XA', 'XB', 'ZZ']);

/** Every country as [code, name], sorted by name, Canada and the United States first. */
export function countryList(locale = 'en') {
  let dn;
  try { dn = new Intl.DisplayNames([locale], { type: 'region', fallback: 'none' }); } catch { return [['CA', 'Canada'], ['US', 'United States']]; }
  const out = [];
  for (let a = 65; a < 91; a++) {
    for (let b = 65; b < 91; b++) {
      const code = String.fromCharCode(a, b);
      const name = !NOT_COUNTRIES.has(code) && dn.of(code);
      if (name) out.push([code, name]);
    }
  }
  out.sort((x, y) => x[1].localeCompare(y[1]));
  const first = ['CA', 'US'];
  return [...first.map((c) => out.find((o) => o[0] === c)).filter(Boolean), ...out.filter((o) => !first.includes(o[0]))];
}

/** The visitor's own time zone (e.g. "Africa/Lagos"), or undefined. */
export function browserTimeZone() {
  try { return Intl.DateTimeFormat().resolvedOptions().timeZone || undefined; } catch { return undefined; }
}

/** Every time zone the browser knows, for the time zone picker. */
export function timeZoneList() {
  try { return Intl.supportedValuesOf('timeZone'); } catch { return []; }
}

/** A starting guess for the country, from the browser's language (en-NG -> NG). */
export function browserCountry() {
  try {
    const region = new Intl.Locale(navigator.language).maximize().region;
    return /^[A-Z]{2}$/.test(region ?? '') ? region : 'CA';
  } catch { return 'CA'; }
}

/** "n1r1a1" -> "N1R 1A1"; "14201 1234" -> "14201-1234"; other countries as typed. */
export function tidyPostal(country, v) {
  if (v == null || v === '') return '';
  if (country === 'US') {
    const d = String(v).replace(/\D/g, '');
    return d.length === 9 ? `${d.slice(0, 5)}-${d.slice(5)}` : d.length === 5 ? d : String(v).trim();
  }
  if (country !== 'CA') return String(v).trim().toUpperCase();
  const c = String(v).toUpperCase().replace(/[^A-Z0-9]/g, '');
  return /^[A-Z]\d[A-Z]\d[A-Z]\d$/.test(c) ? `${c.slice(0, 3)} ${c.slice(3)}` : String(v).trim();
}

export const PHONE_HINT = 'Outside Canada and the US, start with your country code, like +234 803 123 4567.';
