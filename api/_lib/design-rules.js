// Rules some designs have about people and services. No imports, so the intake form can use
// the same rules in the browser without loading the server's validation library.

// A12's car diagram: the words that place a service on a part of the car (same list and
// start-of-word matching as omis-sites src/templates/A12/zones.ts).
const CAR_PARTS = [
  ['oil', 'engine', 'tune', 'spark', 'diagnos', 'coolant', 'fluid', 'timing', 'belt'],
  ['brake', 'rotor', 'pad', 'caliper'],
  ['tire', 'tyre', 'alignment', 'wheel', 'rim', 'balanc'],
  ['battery', 'alternator', 'starter', 'electrical'],
  ['a/c', 'air condition', 'heater', 'heating', 'cabin', 'climate'],
  ['suspension', 'shock', 'strut', 'steering', 'ball joint', 'tie rod'],
  ['exhaust', 'muffler', 'catalytic', 'emission'],
  ['light', 'bulb', 'wiper', 'windshield', 'glass'],
];
const carParts = (services) => CAR_PARTS.filter((words) => services.some((s) => words.some((w) => new RegExp(`(^|[^a-z])${w.replace('/', '\\/')}`, 'i').test(s.name ?? '')))).length;

// People and services some designs are built around (found by scripts/minimal.mjs in omis-sites).
export const TEAM_NEEDS = { B04: 1, B10: 1, T10: 1, S10: 1, B15: 2 };

/** Team and service problems for the chosen design, in plain words (empty when fine). */
export function designProblems(template, data) {
  const out = [];
  const team = (data.team ?? []).filter((m) => m.name?.trim());
  const need = TEAM_NEEDS[template];
  if (need && team.length < need) out.push(`Your team: this design shows your team on the main screen, so add at least ${need === 1 ? 'one person' : `${need} people`} under Your team.`);
  const services = (data.services ?? []).filter((s) => s.name?.trim());
  if (template === 'S10' && services.length < 2) out.push('Services and prices: this design compares prices across your stylists, so add at least 2 services.');
  if (template === 'A12' && carParts(services) < 2) out.push('Services and prices: this design places your services on a picture of a car, so name at least 2 services for different parts (for example an oil change and brakes).');
  return out;
}
