import { useEffect } from 'react'

/* Freeze the page behind a modal while `active` is true, so wheel/touch scrolling
   only moves the modal's own scroll area. Restores the previous values on close. */
export function useScrollLock(active: boolean) {
  useEffect(() => {
    if (!active) return
    const html = document.documentElement
    const body = document.body
    const prev = { html: html.style.overflow, body: body.style.overflow }
    html.style.overflow = 'hidden'
    body.style.overflow = 'hidden'
    return () => {
      html.style.overflow = prev.html
      body.style.overflow = prev.body
    }
  }, [active])
}
