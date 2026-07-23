'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import Script from 'next/script'
import { IoCheckmarkDoneCircle } from 'react-icons/io5'

/* Nav links point back to the home page sections */
const NAV_LINKS = [
  { label: 'Courses', href: '/#courses' },
  { label: 'Mentors', href: '/#mentors' },
  { label: 'Reviews', href: '/#reviews' },
  { label: 'FAQs',    href: '/#faq'     },
]

/* ── Seminar details — placeholders, easy to edit ── */
const SEMINAR = {
  title: 'Forex Trading Live Seminar',
  city: 'Bangalore',
  date: 'Saturday, 26 July 2026',
  time: '10:00 AM – 4:00 PM IST',
  venue: 'Central Bangalore — exact venue shared on registration',
  seats: 'Limited to 50 seats',
  priceLabel: '₹999',
}

const HIGHLIGHTS = [
  'Live market analysis & chart reading',
  'Practical risk-management frameworks',
  'Trading psychology that actually works',
  'Hands-on strategy building session',
  'Live Q&A with expert mentors',
  'Networking with fellow traders',
]

const DETAILS = [
  { label: 'Date', value: SEMINAR.date },
  { label: 'Time', value: SEMINAR.time },
  { label: 'Venue', value: SEMINAR.venue },
  { label: 'Seats', value: SEMINAR.seats },
]

/* ── Minimal Razorpay checkout types ── */
interface RazorpayResponse {
  razorpay_order_id: string
  razorpay_payment_id: string
  razorpay_signature: string
}
interface RazorpayOptions {
  key: string
  amount: number
  currency: string
  order_id: string
  name: string
  description: string
  image?: string
  prefill: { name: string; email: string; contact: string }
  theme: { color: string }
  handler: (r: RazorpayResponse) => void
  modal?: { ondismiss?: () => void }
}
interface RazorpayInstance { open: () => void }
declare global {
  interface Window {
    Razorpay?: new (options: RazorpayOptions) => RazorpayInstance
  }
}

export default function SeminarBangalorePage() {
  const [form, setForm] = useState({ name: '', email: '', phone: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [done, setDone] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  /* ── scroll-shrink nav — same behaviour as the home page ── */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const valid =
    form.name.trim().length > 1 &&
    /\S+@\S+\.\S+/.test(form.email) &&
    form.phone.trim().length >= 7

  const scrollToRegister = () =>
    document.getElementById('register')?.scrollIntoView({ behavior: 'smooth' })

  const handlePay = async () => {
    if (!valid || loading) return
    setError('')
    setLoading(true)
    try {
      const res = await fetch('/api/seminar/order', {
        method: 'POST',
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Something went wrong. Please try again.')
        setLoading(false)
        return
      }
      if (!window.Razorpay) {
        setError('Payment is still loading. Please try again in a moment.')
        setLoading(false)
        return
      }

      const rzp = new window.Razorpay({
        key: data.keyId,
        amount: data.amount,
        currency: data.currency,
        order_id: data.orderId,
        name: 'Delta Trading Academy',
        description: `${SEMINAR.title} — ${SEMINAR.city}`,
        image: '/logo.png',
        prefill: { name: form.name, email: form.email, contact: form.phone },
        theme: { color: '#0f0e0c' },
        handler: async (response) => {
          const vr = await fetch('/api/seminar/verify', {
            method: 'POST',
            body: JSON.stringify(response),
          })
          const vd = await vr.json().catch(() => ({ verified: false }))
          if (vd.verified) setDone(true)
          else setError('Payment could not be verified. If you were charged, contact us and we’ll sort it out.')
          setLoading(false)
        },
        modal: { ondismiss: () => setLoading(false) },
      })
      rzp.open()
    } catch {
      setError('Network error. Please try again.')
      setLoading(false)
    }
  }

  return (
    <main className="bg-white font-nb antialiased min-h-[100svh]">
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="afterInteractive" />

      {/* ── Nav — scroll-shrink, same as home ── */}
      <nav
        className={[
          'fixed z-50 transition-all duration-300 ease-out',
          'flex items-center justify-between md:grid md:grid-cols-[1fr_auto_1fr]',
          scrolled
            ? 'top-3 left-3 right-3 md:left-[14%] md:right-[14%] h-[54px] px-5 md:px-8 bg-[#141212]/92 backdrop-blur-xl rounded-full'
            : 'top-[20px] left-0 right-0 h-[68px] px-5 md:px-[60px]',
        ].join(' ')}
      >
        {/* Desktop nav links */}
        <div className="hidden md:flex items-center gap-7">
          {NAV_LINKS.map(({ label, href }) => (
            <Link key={label} href={href}
              className="text-[13.5px] text-white/70 tracking-[0.005em] transition-colors hover:text-white">
              {label}
            </Link>
          ))}
        </div>

        {/* Logo */}
        <Link href="/" className="flex justify-center items-center select-none">
          <Image src="/logo.png" alt="Delta Trading Academy" width={120} height={36} className="h-7 md:h-8 w-auto object-contain grayscale" priority />
        </Link>

        {/* Right action */}
        <div className="flex items-center justify-end">
          <button
            onClick={scrollToRegister}
            className="bg-white text-[#0a0808] text-[13px] md:text-[13.5px] tracking-[0.005em] py-2 px-4 md:px-5 rounded-full transition-all hover:bg-white/90 hover:-translate-y-px whitespace-nowrap"
          >
            Reserve Seat
          </button>
        </div>
      </nav>

      {/* ── Hero — full height + home background image ── */}
      <div className="mx-2 mt-2 rounded-xl overflow-hidden bg-[#090808] relative min-h-[calc(100svh-16px)]">

        {/* Background image (same as home hero) */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <Image
            src="/hero-1.png"
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover object-[center_top] opacity-50"
          />
          <div className="absolute inset-0 bg-[rgba(6,4,2,0.35)]" />
          <div className="sp-model-fade absolute inset-0" />
          <div className="absolute bottom-0 left-0 right-0 h-[40%] bg-gradient-to-b from-transparent to-[rgba(9,8,8,0.85)]" />
        </div>

        {/* Gold glow */}
        <div className="absolute inset-0 z-[1] pointer-events-none" style={{ background: 'radial-gradient(90% 90% at 80% 0%, rgba(212,175,55,0.16), transparent 60%)' }} />

        <section className="relative z-[2] flex flex-col justify-center min-h-[calc(100svh-16px)] px-6 pt-[120px] pb-16 md:px-[60px] md:pt-[140px] md:pb-20">
          <div className="max-w-[820px]">
            <span className="inline-flex items-center gap-1.5 text-[12px] md:text-[13px] text-white/75 tracking-[0.01em] mb-5">
              <IoCheckmarkDoneCircle className="text-[15px]" />
              Live In-Person Seminar · {SEMINAR.city}
            </span>

            <h1 className="font-normal tracking-[-0.03em] text-white text-[40px] sm:text-[52px] md:text-[64px] leading-[1.05] mb-5">
              {SEMINAR.title} in <span className="anniversary-gold">{SEMINAR.city}</span>
            </h1>

            <p className="text-[14px] md:text-[15px] leading-[1.7] text-white/55 max-w-[560px] tracking-[0.005em] mb-8">
              One focused day with our expert mentors — real charts, real strategies, and live
              practice. Walk in curious, walk out with a plan. Seats are limited.
            </p>

            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={scrollToRegister}
                className="inline-flex items-center gap-2 bg-[#d4af37] text-[#0f0e0c] text-[14.5px] tracking-[0.005em] px-7 py-[14px] rounded-full transition-all hover:bg-[#e6c14e] hover:-translate-y-px active:scale-[0.98]"
              >
                Join for {SEMINAR.priceLabel}
                <span className="text-[11px]">→</span>
              </button>
              <span className="text-[13px] text-white/45">{SEMINAR.date} · {SEMINAR.time}</span>
            </div>
          </div>
        </section>
      </div>

      {/* ── Details strip ── */}
      <section className="px-6 md:px-[60px] py-10 md:py-14 max-w-[1240px] mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-black/[0.07] rounded-2xl overflow-hidden border border-black/[0.07]">
          {DETAILS.map(({ label, value }) => (
            <div key={label} className="bg-white p-5 md:p-6">
              <p className="text-[11px] text-black/35 tracking-[0.12em] uppercase mb-2">{label}</p>
              <p className="text-[13.5px] md:text-[14px] text-black/75 leading-[1.5]">{value}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── What you'll learn ── */}
      <section className="px-6 md:px-[60px] pb-6 md:pb-10 max-w-[1240px] mx-auto">
        <p className="text-[13px] text-black/40 tracking-[0.12em] uppercase mb-4">What you&apos;ll learn</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-4">
          {HIGHLIGHTS.map((h) => (
            <div key={h} className="flex items-start gap-3 border-b border-black/[0.07] pb-4">
              <span className="text-[#d4af37] mt-0.5">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>
              </span>
              <span className="text-[14.5px] text-black/70 leading-snug">{h}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── Register / Pay ── */}
      <section id="register" className="px-6 md:px-[60px] py-14 md:py-20 max-w-[1240px] mx-auto">
        <div className="rounded-[24px] bg-[#0b0a08] border border-[#d4af37]/20 overflow-hidden flex flex-col md:flex-row">

          {/* Left: pitch */}
          <div className="relative flex-1 p-8 md:p-10">
            <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(80% 80% at 10% 10%, rgba(212,175,55,0.10), transparent 60%)' }} />
            <div className="relative">
              <p className="text-[11px] text-[#e6c14e] tracking-[0.14em] uppercase mb-4">Reserve your seat</p>
              <h2 className="text-[28px] md:text-[34px] font-normal tracking-[-0.02em] text-white leading-[1.1] mb-4">
                Join the {SEMINAR.city}<br />seminar
              </h2>
              <p className="text-[13.5px] text-white/55 leading-[1.65] mb-7 max-w-[320px]">
                Fill in your details and pay securely. You&apos;ll get a confirmation instantly —
                that&apos;s it, you&apos;re in.
              </p>
              <div className="flex items-baseline gap-2">
                <span className="text-[40px] text-white tracking-[-0.02em] leading-none">{SEMINAR.priceLabel}</span>
                <span className="text-[13px] text-white/45">/ seat · all-inclusive</span>
              </div>
            </div>
          </div>

          {/* Right: form / success */}
          <div className="md:w-[420px] flex-shrink-0 bg-white p-8 md:p-10 flex flex-col justify-center">
            {done ? (
              <div className="text-center py-6">
                <div className="w-14 h-14 rounded-full bg-[#0f0e0c] flex items-center justify-center mx-auto mb-5">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>
                </div>
                <h3 className="text-[22px] text-black tracking-[-0.01em] mb-2">You&apos;re in! 🎉</h3>
                <p className="text-[13.5px] text-black/50 leading-[1.6] max-w-[280px] mx-auto">
                  Your seat for the {SEMINAR.city} seminar is confirmed. We&apos;ll email the venue
                  details and joining info shortly.
                </p>
                <Link href="/" className="inline-block mt-6 text-[13.5px] text-black underline underline-offset-2 decoration-black/25 hover:decoration-black transition-all">
                  Back to home
                </Link>
              </div>
            ) : (
              <>
                <p className="text-[11.5px] text-black/35 tracking-[0.10em] uppercase mb-5">Your details</p>
                <div className="flex flex-col gap-4">
                  <input
                    type="text"
                    placeholder="Full name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full border border-black/[0.12] rounded-xl px-4 py-[13px] text-[16px] md:text-[14px] text-black placeholder:text-black/30 outline-none transition-colors focus:border-black/35"
                  />
                  <input
                    type="email"
                    placeholder="Email address"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full border border-black/[0.12] rounded-xl px-4 py-[13px] text-[16px] md:text-[14px] text-black placeholder:text-black/30 outline-none transition-colors focus:border-black/35"
                  />
                  <input
                    type="tel"
                    placeholder="Mobile number"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="w-full border border-black/[0.12] rounded-xl px-4 py-[13px] text-[16px] md:text-[14px] text-black placeholder:text-black/30 outline-none transition-colors focus:border-black/35"
                  />

                  {error && (
                    <p className="text-[12.5px] text-red-600 leading-[1.5] -mt-1">{error}</p>
                  )}

                  <button
                    onClick={handlePay}
                    disabled={!valid || loading}
                    className="w-full bg-[#0f0e0c] text-white text-[14px] tracking-[0.005em] py-[15px] rounded-xl transition-colors hover:bg-[#2a2825] mt-1 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Processing…' : `Pay ${SEMINAR.priceLabel} & Join Seminar`}
                  </button>

                  <p className="text-[11.5px] text-black/35 text-center leading-[1.5]">
                    Secure payment via Razorpay · UPI, cards & netbanking
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="px-6 md:px-[60px] py-10 border-t border-black/[0.07] max-w-[1240px] mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-[12.5px] text-black/35">© 2026 Delta Trading Academy · {SEMINAR.city} Seminar</p>
          <Link href="/" className="text-[12.5px] text-black/45 hover:text-black transition-colors">
            ← Back to deltatradinghub.com
          </Link>
        </div>
      </footer>
    </main>
  )
}
