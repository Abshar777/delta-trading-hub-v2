'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'

const DELAY_MS = 15_000   // auto-open after 15 s
export const POPUP_EVENT = 'delta:open-popup'

export default function ContactPopup() {
  const [open,    setOpen]    = useState(false)
  const [visible, setVisible] = useState(false)
  const [form,    setForm]    = useState({ name: '', mobile: '', message: '' })
  const [sent,    setSent]    = useState(false)

  /* ── Open helper ── */
  const openPopup = useCallback(() => {
    setSent(false)
    setForm({ name: '', mobile: '', message: '' })
    setOpen(true)
    requestAnimationFrame(() => requestAnimationFrame(() => setVisible(true)))
  }, [])

  /* ── Close helper ── */
  const close = useCallback(() => {
    setVisible(false)
    sessionStorage.setItem('popup-dismissed', '1')
    setTimeout(() => setOpen(false), 320)
  }, [])

  /* ── Auto-open after 15 s ── */
  useEffect(() => {
    if (sessionStorage.getItem('popup-dismissed')) return
    const t = setTimeout(openPopup, DELAY_MS)
    return () => clearTimeout(t)
  }, [openPopup])

  /* ── Manual open — any button anywhere can fire this event ── */
  useEffect(() => {
    const handler = () => {
      // Always open when triggered manually, even if auto-dismissed
      setSent(false)
      setForm({ name: '', mobile: '', message: '' })
      setOpen(true)
      requestAnimationFrame(() => requestAnimationFrame(() => setVisible(true)))
    }
    window.addEventListener(POPUP_EVENT, handler)
    return () => window.removeEventListener(POPUP_EVENT, handler)
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSent(true)
    setTimeout(close, 2800)
  }

  if (!open) return null

  return (
    /* Backdrop */
    <div
      role="dialog"
      aria-modal="true"
      onClick={(e) => { if (e.target === e.currentTarget) close() }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 font-nb"
      style={{
        background: 'rgba(10,8,6,0.52)',
        backdropFilter: 'blur(6px)',
        transition: 'opacity 320ms ease',
        opacity: visible ? 1 : 0,
      }}
    >
      {/* Modal card */}
      <div
        className="relative bg-white rounded-[24px] overflow-hidden w-full max-w-[860px] flex shadow-2xl"
        style={{
          maxHeight: '92vh',
          transition: 'transform 340ms cubic-bezier(.22,.68,0,1.2), opacity 320ms ease',
          transform: visible ? 'translateY(0) scale(1)' : 'translateY(28px) scale(0.97)',
          opacity: visible ? 1 : 0,
        }}
      >
        {/* ── Left: image panel ── */}
        <div className="relative w-[380px] flex-shrink-0 hidden md:flex flex-col">
          <Image
            src="/4thsection.png"
            alt="Delta Trading Academy"
       
            width={500}
            height={500}
            priority
            className='h-full w-full'
            style={{ objectFit: 'cover', objectPosition: 'center top' }}
          />
          {/* gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          {/* bottom text */}
          <div className="absolute bottom-8 left-8 right-8">
            <p className="text-white/50 text-[11px] tracking-[0.10em] uppercase mb-2">
              Delta Trading Academy
            </p>
            <p className="text-white text-[22px] font-normal leading-[1.25] tracking-[-0.02em]">
              Start your trading<br />journey today
            </p>
          </div>
        </div>

        {/* ── Right: form panel ── */}
        <div className="flex-1 flex flex-col p-9 overflow-y-auto">

          {/* Close button */}
          <button
            onClick={close}
            aria-label="Close"
            className="absolute top-5 right-5 w-9 h-9 rounded-xl bg-[#0f0e0c] flex items-center justify-center hover:bg-[#2a2825] transition-colors"
          >
            <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
              <path d="M1 1l9 9M10 1L1 10" stroke="white" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
          </button>

          {/* Heading */}
          <div className="mb-7 pr-8">
            <p className="text-[11.5px] text-black/35 tracking-[0.10em] uppercase mb-3">
              Get in Touch
            </p>
            <h3 className="text-[30px] font-normal leading-[1.1] tracking-[-0.025em] text-black mb-2.5">
              Have a question?
            </h3>
            <p className="text-[14px] text-black/50 leading-[1.65]">
              Our team is here to help you find the right course for your goals.
            </p>
          </div>

          {sent ? (
            /* ── Success state ── */
            <div className="flex-1 flex flex-col items-center justify-center gap-3 py-8">
              <div className="w-12 h-12 rounded-full bg-black/[0.05] flex items-center justify-center mb-1">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M4 10l4.5 4.5L16 6" stroke="#0f0e0c" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <p className="text-[18px] text-black tracking-[-0.01em]">Message sent!</p>
              <p className="text-[13.5px] text-black/45 text-center leading-[1.6] max-w-[240px]">
                We'll reach out to you shortly to get you started.
              </p>
            </div>
          ) : (
            /* ── Form ── */
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">

              {/* Name */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[11.5px] text-black/40 tracking-[0.08em] uppercase">
                  Full Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Ahmed Al Mansoori"
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  required
                  className="w-full border border-black/[0.12] rounded-xl px-4 py-[13px] text-[16px] md:text-[14px] text-black placeholder:text-black/25 outline-none transition-colors focus:border-black/35 bg-white"
                />
              </div>

              {/* Mobile */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[11.5px] text-black/40 tracking-[0.08em] uppercase">
                  Mobile Number
                </label>
                <input
                  type="tel"
                  placeholder="+971 50 000 0000"
                  value={form.mobile}
                  onChange={e => setForm({ ...form, mobile: e.target.value })}
                  required
                  className="w-full border border-black/[0.12] rounded-xl px-4 py-[13px] text-[16px] md:text-[14px] text-black placeholder:text-black/25 outline-none transition-colors focus:border-black/35 bg-white"
                />
              </div>

              {/* Message */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[11.5px] text-black/40 tracking-[0.08em] uppercase">
                  Your Message
                </label>
                <textarea
                  rows={4}
                  placeholder="Tell us about your trading goals or any questions you have..."
                  value={form.message}
                  onChange={e => setForm({ ...form, message: e.target.value })}
                  required
                  className="w-full border border-black/[0.12] rounded-xl px-4 py-[13px] text-[16px] md:text-[14px] text-black placeholder:text-black/25 outline-none transition-colors focus:border-black/35 bg-white resize-none leading-[1.6]"
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="w-full bg-[#0f0e0c] text-white text-[14px] tracking-[0.005em] py-[15px] rounded-xl hover:bg-[#2a2825] transition-colors mt-1"
              >
                Send Message
              </button>

              <p className="text-[11.5px] text-black/30 text-center tracking-[0.003em]">
                We typically respond within a few hours.
              </p>

            </form>
          )}
        </div>
      </div>
    </div>
  )
}
