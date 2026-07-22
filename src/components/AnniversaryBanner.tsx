'use client'

import { useEffect, useState } from 'react'
import { CardSpotlight } from '@/components/ui/card-spotlight'
import { POPUP_EVENT } from './ContactPopup'

const DISMISS_KEY = 'anniversary-dismissed'
const SHOW_DELAY = 4500

export default function AnniversaryBanner() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    if (sessionStorage.getItem(DISMISS_KEY)) return
    const t = setTimeout(() => setShow(true), SHOW_DELAY)
    return () => clearTimeout(t)
  }, [])

  const close = () => {
    sessionStorage.setItem(DISMISS_KEY, '1')
    setShow(false)
  }

  const claimOffer = () => window.dispatchEvent(new Event(POPUP_EVENT))

  const viewCourses = () => {
    document.getElementById('courses')?.scrollIntoView({ behavior: 'smooth' })
  }

  if (!show) return null

  return (
    <div className="fixed z-[95] bottom-4 left-4 md:bottom-6 md:left-6 w-[calc(100%-2rem)] max-w-[350px] font-nb animate-anniv-in">
      <CardSpotlight
        radius={240}
        color="#1a1408"
        className="rounded-2xl border border-[#d4af37]/25 bg-[#0b0a08] p-6"
      >
        {/* Close */}
        <button
          onClick={close}
          aria-label="Dismiss"
          className="absolute z-20 top-3.5 right-3.5 w-7 h-7 rounded-full bg-white/[0.06] border border-white/10 text-white/55 hover:text-white hover:border-white/25 flex items-center justify-center transition-colors"
        >
          <svg width="10" height="10" viewBox="0 0 11 11" fill="none">
            <path d="M1 1l9 9M10 1L1 10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
        </button>

        <div className="relative z-20">
          {/* Badge */}
          <span className="inline-flex items-center gap-1.5 text-[10.5px] tracking-[0.14em] uppercase text-[#e6c14e] bg-[#d4af37]/[0.08] border border-[#d4af37]/25 px-2.5 py-1 rounded-full mb-4">
            <span className="text-[11px] leading-none">✦</span> 6+ Years Anniversary
          </span>

          {/* Heading */}
          <h3 className="text-[22px] leading-[1.15] tracking-[-0.02em] text-white mb-2">
            Anniversary <span className="anniversary-gold">Special Offer</span>
          </h3>

          {/* Body */}
          <p className="text-[13px] text-white/55 leading-[1.6] mb-5 max-w-[280px]">
            Celebrating 6+ years of training Dubai&apos;s traders. A limited-time
            enrollment offer across every program.
          </p>

          {/* Buttons */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={claimOffer}
              className="spotlight-btn inline-flex items-center gap-1.5 bg-[#d4af37] text-[#0f0e0c] text-[13px] tracking-[0.005em] px-5 py-[11px] rounded-full transition-transform hover:-translate-y-px active:scale-[0.98]"
            >
              Claim Offer
              <span className="text-[11px]">→</span>
            </button>
            <button
              onClick={viewCourses}
              className="inline-flex items-center gap-1.5 bg-white/[0.06] text-white/85 text-[13px] tracking-[0.005em] px-5 py-[11px] rounded-full border border-white/[0.12] transition-colors hover:bg-white/[0.12]"
            >
              View Courses
            </button>
          </div>
        </div>
      </CardSpotlight>
    </div>
  )
}
