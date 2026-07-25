import type { Metadata } from 'next'
import { EVENT } from '@/lib/event'

/* The /seminar route is a client component, so it can't export its own
   metadata — this layout supplies it (and covers /seminar/thank-you too).
   Values come from EVENT so the title/description track the event details. */
const title = `${EVENT.title} in ${EVENT.city} · Delta Trading Academy`
const description =
  `Join the ${EVENT.title} on ${EVENT.date} at ${EVENT.venue}. One focused day of live trading, ` +
  `expert mentors and a premium buffet lunch — seats are limited. Reserve yours for ₹299.`

export const metadata: Metadata = {
  metadataBase: new URL('https://deltatradinghub.com'),
  title,
  description,
  keywords: [
    'Forex Trading Bootcamp',
    'trading seminar Bangalore',
    'forex seminar Bengaluru',
    'Delta Trading Academy',
    'live trading workshop',
    'The Oberoi Bengaluru',
  ],
  alternates: { canonical: '/seminar' },
  openGraph: {
    title,
    description,
    url: '/seminar',
    siteName: 'Delta Trading Academy',
    locale: 'en_IN',
    type: 'website',
    images: [{ url: '/oberoi-ballroom.webp', alt: `${EVENT.title} — ${EVENT.venue}` }],
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description,
    images: ['/oberoi-ballroom.webp'],
  },
  robots: { index: true, follow: true },
}

export default function SeminarLayout({ children }: { children: React.ReactNode }) {
  return children
}
