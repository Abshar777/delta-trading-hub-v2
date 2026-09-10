'use client'

import { useEffect, useState } from 'react'
import Script from 'next/script'
import { COOKIE_CONSENT_EVENT, getCookieConsent } from '@/lib/cookieConsent'

/* Loads Google Tag Manager, GA4 and Microsoft Clarity only once the visitor
   has consented to analytics cookies (Accept All, or Manage Preferences with
   Analytics on) — none of these fire before that. */
export default function AnalyticsLoader() {
  const [analyticsAllowed, setAnalyticsAllowed] = useState(false)

  useEffect(() => {
    const check = () => setAnalyticsAllowed(getCookieConsent()?.analytics === true)
    check()
    window.addEventListener(COOKIE_CONSENT_EVENT, check)
    window.addEventListener('storage', check)
    return () => {
      window.removeEventListener(COOKIE_CONSENT_EVENT, check)
      window.removeEventListener('storage', check)
    }
  }, [])

  if (!analyticsAllowed) return null

  return (
    <>
      {/* ── Google Tag Manager ── */}
      <Script id="gtm" strategy="afterInteractive">
        {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','GTM-T39R8T47');`}
      </Script>
      <noscript>
        <iframe
          src="https://www.googletagmanager.com/ns.html?id=GTM-T39R8T47"
          height="0"
          width="0"
          style={{ display: 'none', visibility: 'hidden' }}
        />
      </noscript>

      {/* ── GA4 ── */}
      <Script
        src="https://www.googletagmanager.com/gtag/js?id=G-REGZ75NZ8D"
        strategy="afterInteractive"
      />
      <Script id="ga4" strategy="afterInteractive">
        {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','G-REGZ75NZ8D');`}
      </Script>

      {/* ── Microsoft Clarity ── */}
      <Script id="clarity" strategy="afterInteractive">
        {`(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src='https://www.clarity.ms/tag/'+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);})(window,document,'clarity','script','qc8unnxvmb');`}
      </Script>
    </>
  )
}
