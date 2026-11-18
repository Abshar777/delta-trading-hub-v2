'use client'

import { useEffect, useState } from 'react'
import Script from 'next/script'
import { COOKIE_CONSENT_EVENT, getCookieConsent } from '@/lib/cookieConsent'

/* OpenAI ads pixel. It is an advertising tag, so it loads only once the
   visitor has allowed Marketing cookies (Accept All, or Manage Preferences
   with Marketing on) — never before that. */
export default function OpenAIPixel() {
  const [marketingAllowed, setMarketingAllowed] = useState(false)

  useEffect(() => {
    const check = () => setMarketingAllowed(getCookieConsent()?.marketing === true)
    check()
    window.addEventListener(COOKIE_CONSENT_EVENT, check)
    window.addEventListener('storage', check)
    return () => {
      window.removeEventListener(COOKIE_CONSENT_EVENT, check)
      window.removeEventListener('storage', check)
    }
  }, [])

  if (!marketingAllowed) return null

  return (
    <Script id="openai-pixel" strategy="afterInteractive">
      {`!function(w,d,s,u){if(w.oaiq)return;var q=function(){q.q.push(arguments)};q.q=[];w.oaiq=q;var j=d.createElement(s);j.async=1;j.src=u;var f=d.getElementsByTagName(s)[0];f.parentNode.insertBefore(j,f)}(window,document,"script","https://bzrcdn.openai.com/sdk/oaiq.min.js");oaiq("init",{pixelId:"G5RhitfM2UuNounPV731Kq",debug:false});`}
    </Script>
  )
}
