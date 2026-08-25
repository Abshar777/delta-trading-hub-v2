import type { Metadata } from 'next'
import { EVENT } from '@/lib/event'

/* The /seminar route is a client component, so it can't export its own
   metadata — this layout supplies it (and covers /seminar/thank-you too).
   Values come from EVENT so the title/description track the event details. */
const title = `${EVENT.title} — Online · Delta Trading Academy`
const description =
  `Join the ${EVENT.title} — a live online trading session on ${EVENT.date}, ${EVENT.time}, hosted on Google Meet. ` +
  `Expert mentors, live Q&A and hands-on strategy — seats limited to 50. Reserve yours for ₹199.`

export const metadata: Metadata = {
  metadataBase: new URL('https://deltatradinghub.com'),
  title,
  description,
  /* Seminar-only favicon (the bootcamp poster). Set explicitly so this route
     overrides the site-wide delta favicon.ico — the home page keeps delta. */
  icons: {
    icon: [{ url: '/favicon.ico', type: 'image/png' }],
    shortcut: ['/favicon.ico'],
    apple: [{ url: '/seminar-favicon.png' }],
  },
  keywords: [
    'Forex Trading Bootcamp',
    'online forex bootcamp',
    'live trading webinar',
    'Google Meet trading session',
    'Delta Trading Academy',
    'live trading workshop India',
  ],
  alternates: { canonical: '/seminar' },
  openGraph: {
    title,
    description,
    url: '/seminar',
    siteName: 'Delta Trading Academy',
    locale: 'en_IN',
    type: 'website',
    images: [{ url: '/seminar-favicon.png', alt: `${EVENT.title} — ${EVENT.venue}` }],
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description,
    images: ['/seminar-favicon.png'],
  },
  robots: { index: true, follow: true },
}

export default function SeminarLayout({ children }: { children: React.ReactNode }) {
  return children
}
