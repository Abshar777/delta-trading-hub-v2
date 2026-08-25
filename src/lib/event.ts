/* Seminar event details — shared by the email and PDF invitation. */
export const EVENT = {
  title: 'Forex Trading Bootcamp',
  city: 'Online',
  date: 'Sunday, 30 August 2026',
  time: '6:00 PM - 9:00 PM IST',
  /* Event venue (shown in "Event details") — now a live online session */
  venue: 'Live on Google Meet',
  /* Repurposed for the online format — "how to join", not a physical address */
  venueAddress: 'The Google Meet link will be emailed and shared on WhatsApp before the session.',
  /* Company contact (shown in the footer / contact line) */
  email: 'deltainternational.blr@gmail.com',
  phone: '+91 9187236408',
  officeAddress: '4th Floor, Prestige Towers (Bangalore Branch & ATM), 99/100, Residency Rd, Shanthala Nagar, Ashok Nagar, Bengaluru, Karnataka 560025',
}

/* Tags each registration with the specific event occurrence (city + date).
   Seat counting filters by this, so when the event's date/format changes,
   availability naturally resets instead of counting registrations from a
   past occurrence — no manual reset needed. */
export const EVENT_TAG = `${EVENT.city} — ${EVENT.date}`
