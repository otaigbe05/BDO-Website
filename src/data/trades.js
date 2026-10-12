// One entry per trade we serve. Feature lists come from the matching OMIS page on
// omis-crm.com; keep them in step with it. Sample bookings are made up and are always
// shown with a "sample" label.
export const TRADES = [
  {
    slug: 'barbers',
    code: 'B',
    label: 'Barbershop',
    plural: 'barbershops',
    person: 'barber',
    hero: 'Your barbershop online, and every chair booked.',
    pitch: 'A website that looks like your shop, with a Book button that drops clients straight into your barbers\' books. Reminders go out on their own.',
    title: 'Barbershop Websites and Online Booking | BDO Analytics Solutions',
    description: 'A website for your barbershop plus OMIS booking: a link for every barber, text and email reminders, client preferences, and chair-rental payouts. Ontario, Canada.',
    omis: 'https://www.omis-crm.com/barbers',
    features: [
      ['A link for every barber', 'Regulars book their barber directly, and it lands on the shop calendar.'],
      ['Text and email reminders', 'They go out before the appointment, on their own.'],
      ['Client preferences', 'Guard number, fade, beard style and notes on the client file.'],
      ['Chair-rental payouts', 'Barbers who rent can connect their own Stripe account and be paid directly.'],
      ['Booking alerts', 'A notification and an email the moment someone books.'],
      ['Works on your phone', 'Run the shop from the floor, no laptop needed.'],
    ],
    day: [
      ['9:30', 'Skin fade', 'Jordan', 'Reminder sent'],
      ['10:15', 'Beard trim and line-up', 'Malik', 'Booked online'],
      ['11:00', 'Taper and design', 'Chris', 'Regular'],
    ],
    ping: ['New booking', '2:30 Skin fade with Andre'],
  },
  {
    slug: 'tattoo',
    code: 'T',
    label: 'Tattoo studio',
    plural: 'tattoo and piercing studios',
    person: 'artist',
    hero: 'Your studio online, with the deposit already paid.',
    pitch: 'A website that shows off your artists\' work, with booking that takes the deposit and gets the consent form signed before anyone sits down.',
    title: 'Tattoo Studio Websites with Booking and Deposits | BDO Analytics Solutions',
    description: 'A website for your tattoo or piercing studio plus OMIS: artist booking links, deposits into your own Stripe, consent forms signed on the client\'s phone, and reference photos. Ontario, Canada.',
    omis: 'https://www.omis-crm.com/tattoo',
    features: [
      ['Clients choose their artist', 'Every artist gets a profile and a link for their bio.'],
      ['Deposits', 'A flat deposit per service, paid into your Stripe account before the slot is confirmed.'],
      ['Consent signed on their phone', 'Your form and health questions, saved as a timestamped PDF.'],
      ['Reference photos', 'Clients attach their idea when they book.'],
      ['Booth-rental payouts', 'Artists who rent can be paid straight into their own Stripe account.'],
      ['Reminders', 'A text and an email go out on their own.'],
    ],
    day: [
      ['11:00', 'Forearm piece, session 2', 'Sam', 'Deposit paid'],
      ['14:00', 'Fine-line consult', 'Riley', 'Reference attached'],
      ['16:30', 'Helix piercing', 'Taylor', 'Consent signed'],
    ],
    ping: ['Deposit paid', 'Saturday 1:00 with Kai'],
  },
  {
    slug: 'auto',
    code: 'A',
    label: 'Auto shop',
    plural: 'auto repair shops',
    person: 'technician',
    hero: 'Your shop online, from booking to invoice.',
    pitch: 'A website that shows your prices and hours up front, with booking that feeds one work order from estimate to invoice.',
    title: 'Auto Repair Shop Websites and Online Booking | BDO Analytics Solutions',
    description: 'A website for your auto repair shop plus OMIS: online booking, work orders, estimate approval by text link, invoices from the job, and vehicle history. Ontario, Canada.',
    omis: 'https://www.omis-crm.com/auto',
    features: [
      ['Customers book online', 'Oil changes, tire swaps and inspections, at any hour.'],
      ['Work orders', 'Every job on one board, from estimate to completed.'],
      ['Approval by link', 'The customer approves the estimate from their phone.'],
      ['Invoices from the job', 'Generated from the work order, nothing re-typed.'],
      ['Vehicle history', 'Make, model, VIN, mileage and past work on one record.'],
      ['Service reminders', 'Nudge customers when they are due back.'],
    ],
    day: [
      ['8:00', 'Oil change, 2017 Civic', 'Pat', 'Booked online'],
      ['9:30', 'Front brakes', 'Dana', 'Estimate approved'],
      ['13:00', 'Winter tire swap', 'Lee', 'Reminder sent'],
    ],
    ping: ['Estimate approved', 'Rear brakes, 2019 RAV4'],
  },
  {
    slug: 'spa',
    code: 'S',
    label: 'Spa or salon',
    plural: 'spas and salons',
    person: 'stylist',
    hero: 'Your spa or salon online, and the day kept calm.',
    pitch: 'A website that feels like walking in, with booking that confirms by text, takes the deposit and sends the patch test before they arrive.',
    title: 'Spa and Salon Websites with Online Booking | BDO Analytics Solutions',
    description: 'A website for your spa or salon plus OMIS: a link for every stylist, text confirmations and reminders, deposits, patch-test and consent forms, and retail at checkout. Ontario, Canada.',
    omis: 'https://www.omis-crm.com/spa',
    features: [
      ['A link for every stylist', 'Colourists, stylists and estheticians each get their own.'],
      ['Confirmations and reminders', 'A text confirms the booking; reminders go out before the visit.'],
      ['Deposits', 'Paid before they sit down, into your Stripe or each chair renter\'s.'],
      ['Patch tests and consent', 'Signed from the client\'s phone before they arrive.'],
      ['Client history', 'Visits, patch tests, allergies and preferences on one file.'],
      ['Retail at checkout', 'Add a product to the sale in the same step.'],
    ],
    day: [
      ['10:00', 'Balayage', 'Morgan', 'Deposit paid'],
      ['12:30', 'Facial', 'Jess', 'Confirmed by text'],
      ['15:00', 'Cut and blow-dry', 'Alex', 'Patch test signed'],
    ],
    ping: ['New booking', 'Friday 11:00 colour with Nia'],
  },
  {
    slug: 'personal-training',
    code: 'P',
    label: 'Personal training',
    plural: 'personal trainers and studios',
    person: 'trainer',
    hero: 'Your training business online, and fewer missed sessions.',
    pitch: 'A website that shows how you coach and when you train, with booking and reminders so clients show up ready.',
    title: 'Personal Trainer Websites and Online Booking | BDO Analytics Solutions',
    description: 'A website for your personal training business plus OMIS: a link for every trainer, text and email reminders, goals and session notes, and independent-trainer payouts. Ontario, Canada.',
    omis: 'https://www.omis-crm.com/personal-training',
    features: [
      ['A link for every trainer', 'Clients book their person directly from a bio link.'],
      ['Reminders', 'A text confirms the booking; reminders go out before the session.'],
      ['Goals on file', 'Goals, program type and session notes on the client file.'],
      ['Session notes', 'Written right after, there for the next session.'],
      ['Independent-trainer payouts', 'Trainers can be paid straight into their own Stripe account.'],
      ['Works on your phone', 'Run the day from the gym floor.'],
    ],
    day: [
      ['6:15', 'Strength session', 'Robin', 'Reminder sent'],
      ['7:30', 'Assessment', 'Jamie', 'Booked online'],
      ['17:45', 'Small group', 'Casey', 'Notes saved'],
    ],
    ping: ['New booking', 'Tuesday 6:15 with Coach Ray'],
  },
];

export const tradeBySlug = (slug) => TRADES.find((t) => t.slug === slug);

const KEY = 'bdo-trade';
export const savedTrade = () => {
  try { return tradeBySlug(localStorage.getItem(KEY)) ?? null; } catch { return null; }
};
export const saveTrade = (slug) => {
  try { localStorage.setItem(KEY, slug); } catch { /* storage blocked: the choice just isn't remembered */ }
};
