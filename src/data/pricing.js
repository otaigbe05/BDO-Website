// Every price on the site comes from here: the pricing page, the start form, and the
// OMIS plan table. Canadian dollars. Change a number once and it changes everywhere.
// Website prices must match the Stripe products the owner sets up.

export const OMIS_PLANS = [
  { id: 'starter', name: 'Starter', monthly: 29, annual: 290, users: '1 user' },
  { id: 'professional', name: 'Professional', monthly: 79, annual: 790, users: 'Up to 5 users', popular: true },
  { id: 'enterprise', name: 'Enterprise', monthly: 199, annual: 1990, users: 'Unlimited users' },
];

export const WEBSITE = {
  // One-time setup when the website comes with an OMIS plan.
  setupWithOmis: 199,
  // One-time setup for a website on its own, plus monthly hosting and care.
  setupAlone: 449,
  careMonthly: 12,
  // Online stores are quoted; this is the starting point shown.
  storeFrom: 1500,
};

export const money = (n) => `$${n.toLocaleString('en-CA')}`;
