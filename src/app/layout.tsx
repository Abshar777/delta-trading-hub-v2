import type { Metadata } from 'next'
import './globals.css'
import SmoothScroll from '@/components/SmoothScroll'
import AnalyticsLoader from '@/components/AnalyticsLoader'
import CookieConsentBanner from '@/components/CookieConsentBanner'
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

export const metadata: Metadata = {
  title: 'Forex Trading Course In Dubai',
  description: 'Get better at trading, every year',
  /* Site-wide delta favicon. Defined here (not via app/favicon.ico) so a
     nested route — /seminar — can cleanly override it with its own icon. */
  icons: {
    icon: [{ url: '/favicon.ico' }],
    shortcut: ['/favicon.ico'],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={cn("font-sans", geist.variable)}>
      <head>
        <meta name="p:domain_verify" content="0993d6cf29c0d0c63730891dcd11461f"/>
      </head>
      <body>
        {/* GTM/GA4/Clarity load only once the visitor accepts analytics cookies */}
        <AnalyticsLoader />

        <SmoothScroll />
        {children}
        <CookieConsentBanner />
      </body>
    </html>
  )
}
