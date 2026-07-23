'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import Script from 'next/script'
import { IoCheckmarkDoneCircle } from 'react-icons/io5'
import CallButton from '@/components/CallButton'
import SeminarRegisterModal from '@/components/SeminarRegisterModal'

/* Nav links point back to the home page sections */
const NAV_LINKS = [
  { label: 'Courses', href: '/#courses' },
  { label: 'Mentors', href: '/#mentors' },
  { label: 'Reviews', href: '/#reviews' },
  { label: 'FAQs',    href: '/#faq'     },
]

/* ── Seminar details — placeholders, easy to edit ── */
const SEMINAR = {
  title: 'Live Trade Challenge',
  city: 'Bangalore',
  date: 'Saturday, 26 July 2026',
  time: '10:00 AM – 4:00 PM IST',
  venue: 'The Oberoi, Bengaluru',
  address: '37-39, Mahatma Gandhi Road, Bengaluru, Karnataka 560001',
  seats: 'Limited to 50 seats',
  priceLabel: '₹299',
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

/* ── Venue, experience & food gallery ── */
const GALLERY = [
  { src: '/oberoi-ballroom.webp', label: 'The Oberoi ballroom' },
  { src: '/g2.jpg',     label: 'Live Trade Challenge' },
  { src: '/g3.jpg',     label: 'The experience' },
  { src: '/g4.jpg',     label: 'Networking' },
  { src: '/1.jpg',      label: 'On-stage sessions' },
  { src: '/2.jpg',      label: 'Fine dining & lunch' },
]

/* ── What's included (covers food) ── */
const INCLUDED = [
  'Full-day seminar access',
  'Gourmet lunch at The Oberoi',
  'Tea, coffee & hi-tea refreshments',
  'Course workbook & resources',
  'Certificate of participation',
  'Networking session with mentors',
]

/* Keyless Google Maps embed for The Oberoi, Bengaluru */
const MAP_SRC =
  'https://maps.google.com/maps?q=The%20Oberoi%20Bengaluru&t=&z=15&ie=UTF8&iwloc=&output=embed'

export default function SeminarBangalorePage() {
  const [scrolled, setScrolled] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)

  /* ── scroll-shrink nav — same behaviour as the home page ── */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const openModal = () => setModalOpen(true)

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
        <div className="hidden md:flex items-center gap-7">
          {NAV_LINKS.map(({ label, href }) => (
            <Link key={label} href={href}
              className="text-[13.5px] text-white/70 tracking-[0.005em] transition-colors hover:text-white">
              {label}
            </Link>
          ))}
        </div>

        <Link href="/" className="flex justify-center items-center select-none">
          <Image src="/logo.png" alt="Delta Trading Academy" width={120} height={36} className="h-7 md:h-8 w-auto object-contain grayscale" priority />
        </Link>

        <div className="flex items-center justify-end">
          <button
            onClick={openModal}
            className="bg-white spotlight-btn-dark text-[#0a0808] text-[13px] md:text-[13.5px] tracking-[0.005em] py-2 px-4 md:px-5 rounded-full transition-all hover:bg-white/90 hover:-translate-y-px whitespace-nowrap"
          >
            Reserve Seat
          </button>
        </div>
      </nav>

      {/* ── Hero — full height + home background image ── */}
      <div className="mx-2 mt-2 rounded-xl overflow-hidden bg-[#090808] relative min-h-[calc(100svh-16px)]">
        <div className="absolute inset-0 z-0 pointer-events-none">
          <Image src="/hero-1.png" alt="" fill priority sizes="100vw" className="object-cover object-[center_top] opacity-50" />
          <div className="absolute inset-0 bg-[rgba(6,4,2,0.35)]" />
          <div className="sp-model-fade absolute inset-0" />
          <div className="absolute bottom-0 left-0 right-0 h-[40%] bg-gradient-to-b from-transparent to-[rgba(9,8,8,0.85)]" />
        </div>
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
                onClick={openModal}
                className="inline-flex spotlight-btn items-center gap-2 bg-[#d4af37] text-[#0f0e0c] text-[14.5px] tracking-[0.005em] px-7 py-[14px] rounded-full transition-all hover:bg-[#e6c14e] hover:-translate-y-px active:scale-[0.98]"
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

      {/* ── Gallery — venue & experience ── */}
      <section className="px-6 md:px-[60px] py-12 md:py-16 max-w-[1240px] mx-auto">
        <p className="text-[13px] text-black/40 tracking-[0.12em] uppercase mb-2">Venue, experience &amp; food</p>
        <h2 className="text-[28px] md:text-[36px] font-normal tracking-[-0.02em] text-black leading-[1.1] mb-8 max-w-[560px]">
          A premium day at <span className="anniversary-gold">{SEMINAR.venue}</span>
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {GALLERY.map((g, i) => (
            <div
              key={i}
              className="relative overflow-hidden rounded-2xl bg-[#f4f3f1] group aspect-[4/3]"
            >
              <Image
                src={g.src}
                alt={g.label}
                fill
                sizes="(max-width: 768px) 50vw, 33vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
              <span className="absolute bottom-3 left-3.5 text-[12px] text-white/90 tracking-[0.01em]">{g.label}</span>
            </div>
          ))}
        </div>

        {/* What's included (incl. food) */}
        <div className="mt-10 rounded-2xl bg-[#f6f5f3] border border-black/[0.05] p-7 md:p-9">
          <p className="text-[13px] text-black/40 tracking-[0.12em] uppercase mb-5">What&apos;s included</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-3.5">
            {INCLUDED.map((item) => (
              <div key={item} className="flex items-start gap-2.5">
                <span className="text-[#d4af37] mt-0.5">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>
                </span>
                <span className="text-[14px] text-black/70 leading-snug">{item}</span>
              </div>
            ))}
          </div>
          <p className="text-[12.5px] text-black/40 mt-6 leading-[1.6]">
            Lunch and refreshments are served at {SEMINAR.venue} — a full fine-dining spread included with every seat.
          </p>
        </div>
      </section>

      {/* ── Location / map ── */}
      <section className="px-6 md:px-[60px] pb-14 md:pb-20 max-w-[1240px] mx-auto">
        <div className="rounded-[24px] overflow-hidden border border-black/[0.08] flex flex-col md:flex-row">
          <div className="md:w-[360px] flex-shrink-0 p-8 md:p-10 bg-[#0b0a08] relative">
            <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(80% 80% at 10% 10%, rgba(212,175,55,0.10), transparent 60%)' }} />
            <div className="relative">
              <p className="text-[11px] text-[#e6c14e] tracking-[0.14em] uppercase mb-4">The location</p>
              <h3 className="text-[24px] md:text-[28px] font-normal tracking-[-0.02em] text-white leading-[1.15] mb-3">
                {SEMINAR.venue}
              </h3>
              <p className="text-[13.5px] text-white/55 leading-[1.65] mb-6">{SEMINAR.address}</p>
              <a
                href="https://www.google.com/maps/search/?api=1&query=The+Oberoi+Bengaluru"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 text-[13.5px] text-white bg-white/[0.08] border border-white/15 px-4 py-2.5 rounded-full hover:bg-white/[0.14] transition-colors"
              >
                Open in Google Maps
                <span className="text-[11px]">↗</span>
              </a>
            </div>
          </div>
          <div className="flex-1 min-h-[280px] md:min-h-[360px] bg-[#e8e4df]">
            <iframe
              src={MAP_SRC}
              title={`Map — ${SEMINAR.venue}`}
              className="w-full h-full min-h-[280px] md:min-h-[360px]"
              style={{ border: 0 }}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </section>

      {/* ── Reserve CTA band ── */}
      <section className="px-6 md:px-[60px] pb-16 md:pb-24 max-w-[1240px] mx-auto">
        <div className="relative rounded-[24px] bg-[#0b0a08] border border-[#d4af37]/20 overflow-hidden p-8 md:p-12 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(70% 120% at 85% 0%, rgba(212,175,55,0.14), transparent 60%)' }} />
          <div className="relative">
            <h2 className="text-[26px] md:text-[32px] font-normal tracking-[-0.02em] text-white leading-[1.1] mb-2">
              Reserve your seat — <span className="anniversary-gold">{SEMINAR.priceLabel}</span>
            </h2>
            <p className="text-[13.5px] text-white/55 leading-[1.6] max-w-[420px]">
              Fill in your details and pay securely. Instant confirmation, limited seats.
            </p>
          </div>
          <button
            onClick={openModal}
            className="relative spotlight-btn inline-flex items-center justify-center gap-2 bg-[#d4af37] text-[#0f0e0c] text-[15px] tracking-[0.005em] px-8 py-[16px] rounded-full transition-all hover:bg-[#e6c14e] hover:-translate-y-px active:scale-[0.98] whitespace-nowrap"
          >
            Join for {SEMINAR.priceLabel}
            <span className="text-[11px]">→</span>
          </button>
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

      {/* Floating call button + registration modal */}
      <CallButton />
      <SeminarRegisterModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        priceLabel={SEMINAR.priceLabel}
        seminarTitle={SEMINAR.title}
        city={SEMINAR.city}
      />
    </main>
  )
}
