'use client'

import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'
import { pushEvent } from '@/lib/dataLayer'
import { COOKIE_CONSENT_EVENT } from '@/lib/cookieConsent'

/* Pushes a page_view on every route change. If the visitor accepts analytics
   after the page has loaded, the current page is sent once at that point. */
export default function PageViewTracker() {
  const pathname = usePathname()
  const sentFor = useRef<string | null>(null)

  useEffect(() => {
    const send = () => {
      if (sentFor.current === pathname) return
      const ok = pushEvent('page_view', {
        page_path: pathname,
        page_title: document.title,
        page_location: window.location.href,
      })
      if (ok) sentFor.current = pathname
    }
    send()
    window.addEventListener(COOKIE_CONSENT_EVENT, send)
    return () => window.removeEventListener(COOKIE_CONSENT_EVENT, send)
  }, [pathname])

  return null
}
