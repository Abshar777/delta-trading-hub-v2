'use client'

import { useEffect, useState } from 'react'
import {
  OPEN_COOKIE_PREFERENCES_EVENT,
  getCookieConsent,
  saveCookieConsent,
} from '@/lib/cookieConsent'

type Prefs = { functional: boolean; analytics: boolean; marketing: boolean }

const DEFAULT_PREFS: Prefs = { functional: false, analytics: false, marketing: false }
const ALL_ON: Prefs = { functional: true, analytics: true, marketing: true }

export default function CookieConsentBanner() {
  const [visible, setVisible] = useState(false)
  const [managing, setManaging] = useState(false)
  const [prefs, setPrefs] = useState<Prefs>(DEFAULT_PREFS)

  /* Reads localStorage on mount to decide whether to show the banner —
     legitimate client-only sync, not derived state. */
  useEffect(() => {
    const existing = getCookieConsent()
    if (!existing) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setVisible(true)
    } else {
      setPrefs({
        functional: existing.functional,
        analytics: existing.analytics,
        marketing: existing.marketing,
      })
    }

    const openPreferences = () => {
      setPrefs(getCookieConsent() ?? DEFAULT_PREFS)
      setManaging(true)
      setVisible(true)
    }
    window.addEventListener(OPEN_COOKIE_PREFERENCES_EVENT, openPreferences)
    return () => window.removeEventListener(OPEN_COOKIE_PREFERENCES_EVENT, openPreferences)
  }, [])

  const decide = (next: Prefs) => {
    saveCookieConsent(next)
    setPrefs(next)
    setManaging(false)
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div
      role="dialog"
      aria-label="Cookie consent"
      className="fixed z-[9999] bottom-5 right-5"
      style={{ width: 'min(360px, calc(100vw - 40px))' }}
    >
      <div className="rounded-2xl overflow-hidden bg-[#0b0a08] border border-[#d4af37]/20 shadow-[0_20px_45px_rgba(0,0,0,0.5)]">
        <div className="px-5 pt-5 pb-4">
          <div className="flex items-center gap-2 mb-2.5">
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-[#d4af37]/[0.12] text-[15px]" aria-hidden>
              🍪
            </span>
            <p className="text-[13.5px] font-semibold tracking-wide text-white">We value your privacy</p>
          </div>

          <p className="text-[12.5px] leading-[1.6] text-white/70">
            We use cookies to operate our site properly and understand visitor usage. Accept all,
            reject non-essential, or manage your preferences. See our{' '}
            <a href="/privacy" className="text-[#e6c14e] underline underline-offset-2">
              Privacy Policy
            </a>{' '}
            for details.
          </p>

          {managing && (
            <div className="mt-3.5 flex flex-col gap-3 rounded-xl p-3.5 bg-white/[0.04] max-h-[220px] overflow-y-auto">
              <PrefToggle label="Strictly Necessary" description="Always active — required for the site to function." checked disabled />
              <PrefToggle
                label="Functional"
                description="Remembers your preferences and settings."
                checked={prefs.functional}
                onChange={(v) => setPrefs((p) => ({ ...p, functional: v }))}
              />
              <PrefToggle
                label="Analytics & Performance"
                description="Helps us understand site usage to improve it."
                checked={prefs.analytics}
                onChange={(v) => setPrefs((p) => ({ ...p, analytics: v }))}
              />
              <PrefToggle
                label="Marketing & Advertising"
                description="Used to make communications more relevant."
                checked={prefs.marketing}
                onChange={(v) => setPrefs((p) => ({ ...p, marketing: v }))}
              />
            </div>
          )}

          <div className="mt-4 flex flex-col gap-2">
            {managing ? (
              <button
                type="button"
                onClick={() => decide(prefs)}
                className="w-full py-2.5 rounded-lg text-[13px] font-semibold bg-[#d4af37] text-[#0f0e0c] hover:bg-[#e6c14e] transition-colors"
              >
                Save Preferences
              </button>
            ) : (
              <button
                type="button"
                onClick={() => decide(ALL_ON)}
                className="w-full py-2.5 rounded-lg text-[13px] font-semibold bg-[#d4af37] text-[#0f0e0c] hover:bg-[#e6c14e] transition-colors"
              >
                Accept All
              </button>
            )}

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => decide(DEFAULT_PREFS)}
                className="flex-1 py-2 rounded-lg text-[12.5px] font-medium border border-white/15 text-white hover:bg-white/[0.06] transition-colors"
              >
                Reject Non-Essential
              </button>
              {!managing && (
                <button
                  type="button"
                  onClick={() => setManaging(true)}
                  className="flex-1 py-2 rounded-lg text-[12.5px] font-medium border border-white/15 text-white hover:bg-white/[0.06] transition-colors"
                >
                  Manage
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function PrefToggle({
  label,
  description,
  checked,
  disabled,
  onChange,
}: {
  label: string
  description: string
  checked: boolean
  disabled?: boolean
  onChange?: (v: boolean) => void
}) {
  return (
    <label className={`flex items-start justify-between gap-3 ${disabled ? 'opacity-60' : 'cursor-pointer'}`}>
      <span>
        <span className="block text-[12px] font-semibold leading-tight text-white">{label}</span>
        <span className="block text-[11px] mt-0.5 leading-tight text-white/60">{description}</span>
      </span>
      <input
        type="checkbox"
        checked={checked}
        disabled={disabled}
        onChange={(e) => onChange?.(e.target.checked)}
        className="mt-0.5 h-4 w-4 shrink-0 accent-[#d4af37]"
      />
    </label>
  )
}
