'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Script from 'next/script'
import { IoCheckmarkDoneCircle } from 'react-icons/io5'
import CallButton from '@/components/CallButton'
import SeminarRegisterModal from '@/components/SeminarRegisterModal'

/* This page is also reverse-proxied at deltainstitutions.com/seminar, so all
   internal links are absolute to the hub domain (else they'd resolve to the
   wrong host). */
const HUB = 'https://deltatradinghub.com'

/* Nav links point back to the home page sections */
const NAV_LINKS = [
  { label: 'Courses', href: `${HUB}/#courses` },
  { label: 'Mentors', href: `${HUB}/#mentors` },
  { label: 'Reviews', href: `${HUB}/#reviews` },
  { label: 'FAQs',    href: `${HUB}/#faq`     },
]

/* ── Seminar details — placeholders, easy to edit ── */
const SEMINAR = {
  title: 'Forex Trading Bootcamp',
  city: 'Bangalore',
  date: 'Sunday, 9 August 2026',
  time: '11:00 AM – 4:00 PM',
  venue: 'The Oberoi, Bengaluru',
  address: '37-39, Mahatma Gandhi Rd, Yellappa Chetty Layout, Sivanchetti Gardens, Bengaluru, Karnataka 560001',
  seats: 'Limited to 60 guests',
  priceLabel: '₹299',
}

/* ── Contact — Bangalore branch ── */
const CONTACT = {
  address: '4th Floor, Prestige Towers (Bangalore Branch & ATM), 99/100, Residency Rd, Shanthala Nagar, Ashok Nagar, Bengaluru, Karnataka 560025',
  gst: '29AAJCE53644R1ZP',
  email: 'deltainternational.blr@gmail.com',
  phone: '+919187236408',
  phoneLabel: '+91 9187236408',
}

/* ── Seminar team contacts ── */
const TEAM = [
  { name: 'Ambili B', role: 'Regional Operations', tel: '+919187236408', label: '+91 91872 36408' },
  { name: 'Ajvad',    role: 'Sales TL',            tel: '+919187236412', label: '+91 91872 36412' },
]

/* ── Seat availability — total + buffer must match /api/seminar/seats.
   The live "left"/"booked" values come from that endpoint (real paid count
   + a head-start buffer); these are just the pre-fetch fallback. ── */
const SEATS_TOTAL = 60
const SEATS_BUFFER = 0 // must match BUFFER in /api/seminar/seats (0 = show actual count)


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
  { src: '/g2.jpg',     label: 'Forex Trading Bootcamp' },
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

  /* Live seat availability — real paid count + buffer, from /api/seminar/seats.
     Fallback assumes 0 paid (booked = buffer) until the live count loads. */
  const [seats, setSeats] = useState(() => {
    const booked = SEATS_BUFFER
    return { total: SEATS_TOTAL, left: SEATS_TOTAL - booked, pct: Math.round((booked / SEATS_TOTAL) * 100), soldOut: false }
  })

  /* ── scroll-shrink nav — same behaviour as the home page ── */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  /* ── fetch the live seat count ── */
  useEffect(() => {
    let alive = true
    fetch('/api/seminar/seats')
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (alive && d && typeof d.left === 'number') {
          setSeats({ total: d.total, left: d.left, pct: d.pct, soldOut: !!d.soldOut })
        }
      })
      .catch(() => {})
    return () => { alive = false }
  }, [])

  const soldOut = seats.soldOut
  const openModal = () => { if (!soldOut) setModalOpen(true) }

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
            <a key={label} href={href}
              className="text-[13.5px] text-white/70 tracking-[0.005em] transition-colors hover:text-white">
              {label}
            </a>
          ))}
        </div>

        <a href={HUB} className="flex justify-center items-center select-none">
          <Image src="/logo.png" alt="Delta Trading Academy" width={120} height={36} className="h-7 md:h-8 w-auto object-contain grayscale" priority />
        </a>

        <div className="flex items-center justify-end">
          <button
            onClick={openModal}
            disabled={soldOut}
            className={
              soldOut
                ? 'bg-white/25 text-white/60 text-[13px] md:text-[13.5px] tracking-[0.005em] py-2 px-4 md:px-5 rounded-full whitespace-nowrap cursor-not-allowed'
                : 'bg-white spotlight-btn-dark text-[#0a0808] text-[13px] md:text-[13.5px] tracking-[0.005em] py-2 px-4 md:px-5 rounded-full transition-all hover:bg-white/90 hover:-translate-y-px whitespace-nowrap'
            }
          >
            {soldOut ? 'Sold out' : 'Book Now'}
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
                disabled={soldOut}
                className={
                  soldOut
                    ? 'inline-flex items-center gap-2 bg-white/12 text-white/55 text-[14.5px] tracking-[0.005em] px-7 py-[14px] rounded-full cursor-not-allowed'
                    : 'inline-flex spotlight-btn items-center gap-2 bg-[#d4af37] text-[#0f0e0c] text-[14.5px] tracking-[0.005em] px-7 py-[14px] rounded-full transition-all hover:bg-[#e6c14e] hover:-translate-y-px active:scale-[0.98]'
                }
              >
                {soldOut ? 'Seats filled' : <>Book Now · {SEMINAR.priceLabel}<span className="text-[11px]">→</span></>}
              </button>
              <span className="text-[13px] text-white/45">{SEMINAR.date} · {SEMINAR.time}</span>
            </div>
            {soldOut ? (
              <div className="mt-4 inline-flex items-center gap-2 text-[12.5px] text-[#f87171]">
                <span className="inline-flex h-2 w-2 rounded-full bg-[#f87171]" />
                All {seats.total} seats are filled — registration is closed
              </div>
            ) : (
              <div className="mt-4 inline-flex items-center gap-2 text-[12.5px] text-[#e6c14e]">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full rounded-full bg-[#e6c14e] opacity-75 animate-ping" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-[#e6c14e]" />
                </span>
                Only {seats.left} of {seats.total} seats left — {seats.pct}% booked
              </div>
            )}
          </div>
        </section>
      </div>

      {/* ── Highlights: premium buffet + limited seats ── */}
      <section className="px-6 md:px-[60px] pt-10 md:pt-14 max-w-[1240px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">

          {/* Premium buffet */}
          <div className="spotlight-btn spotlight-btn-gold relative overflow-hidden rounded-2xl bg-[#0b0a08] border border-[#d4af37]/25 p-6 md:p-7 flex items-center gap-4">
            <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(90% 120% at 100% 0%, rgba(212,175,55,0.16), transparent 60%)' }} />
            <div className="relative w-12 h-12 rounded-full bg-[#d4af37]/[0.12] border border-[#d4af37]/30 flex items-center justify-center text-[#e6c14e] shrink-0">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 18h18" /><path d="M4 18a8 8 0 0 1 16 0" /><path d="M12 6.5V8" /><circle cx="12" cy="5" r="1.2" />
              </svg>
            </div>
            <div className="relative">
              <p className="text-[10.5px] text-[#e6c14e] tracking-[0.14em] uppercase mb-1.5">Included · no extra cost</p>
              <h3 className="text-[16px] md:text-[18px] text-white tracking-[-0.01em] leading-snug mb-1">Premium buffet lunch at The Oberoi</h3>
              <p className="text-[12.5px] text-white/50 leading-[1.5]">A full fine-dining spread — appetizers, live counters, mains &amp; desserts.</p>
            </div>
          </div>

          {/* Limited seats — live availability */}
          <div className="spotlight-btn relative overflow-hidden rounded-2xl bg-[#d4af37] p-6 md:p-7 flex items-center gap-4">
            <div className="relative w-12 h-12 rounded-full bg-[#0f0e0c]/[0.10] flex items-center justify-center text-[#0f0e0c] shrink-0">
              <span className="absolute inline-flex h-full w-full rounded-full bg-[#0f0e0c]/20 animate-ping" />
              <svg className="relative" width="22" height="22" viewBox="0 0 24 24" fill="currentColor" stroke="none">
                <path d="M13 2 4 14h6l-1 8 9-12h-6l1-8z" />
              </svg>
            </div>
            <div className="flex-1">
              <p className="text-[10.5px] text-[#0f0e0c]/60 tracking-[0.14em] uppercase mb-1.5">{soldOut ? 'Sold out' : 'Filling fast'}</p>
              <h3 className="text-[16px] md:text-[18px] text-[#0f0e0c] tracking-[-0.01em] leading-snug mb-2">
                {soldOut
                  ? <>All {seats.total} seats are filled</>
                  : <>Only <span className="tabular-nums">{seats.left}</span> of {seats.total} seats left</>}
              </h3>
              <div className="h-1.5 w-full rounded-full bg-[#0f0e0c]/15 overflow-hidden">
                <div className="h-full rounded-full bg-[#0f0e0c]/70" style={{ width: `${soldOut ? 100 : seats.pct}%` }} />
              </div>
              <p className="text-[11.5px] text-[#0f0e0c]/70 leading-[1.5] mt-2">
                {soldOut ? 'This event is fully booked.' : <>{seats.pct}% booked · once they&apos;re gone, they&apos;re gone.</>}
              </p>
            </div>
          </div>

        </div>
      </section>

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
      {/* ── What's included ── */}
      <section className="px-6 md:px-[60px] py-6 md:py-10 max-w-[1240px] mx-auto">
        <p className="text-[13px] text-black/40 tracking-[0.12em] uppercase mb-4">What&apos;s included</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-4">
          {INCLUDED.map((item) => (
            <div key={item} className="flex items-start gap-3 border-b border-black/[0.07] pb-4">
              <span className="text-[#d4af37] mt-0.5">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>
              </span>
              <span className="text-[14.5px] text-black/70 leading-snug">{item}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── What you'll learn ── */}
      <section className="px-6 md:px-[60px] py-6 md:py-10 max-w-[1240px] mx-auto">
        <div className="relative rounded-[24px] bg-[#0b0a08] border border-[#d4af37]/20 overflow-hidden p-8 md:p-12">
          <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(80% 80% at 10% 10%, rgba(212,175,55,0.10), transparent 60%)' }} />
          <div className="relative">
            <p className="text-[11px] text-[#e6c14e] tracking-[0.14em] uppercase mb-4">What you&apos;ll learn</p>
            <h2 className="text-[26px] md:text-[32px] font-normal tracking-[-0.02em] text-white leading-[1.12] mb-8 max-w-[560px]">
              A full day of <span className="anniversary-gold">real trading</span>
            </h2>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-4">
              {HIGHLIGHTS.map((h) => (
                <li key={h} className="flex items-start gap-2.5 text-[14px] text-white/75 leading-snug border-b border-white/[0.06] pb-4">
                  <span className="text-[#d4af37] mt-0.5"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg></span>
                  {h}
                </li>
              ))}
            </ul>
          </div>
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
              {soldOut
                ? <>Seats are <span className="anniversary-gold">filled</span></>
                : <>Reserve your seat — <span className="anniversary-gold">{SEMINAR.priceLabel}</span></>}
            </h2>
            <p className="text-[13.5px] text-white/55 leading-[1.6] max-w-[420px]">
              {soldOut
                ? 'This event is fully booked. Registration is now closed — reach out to our team to join the waitlist.'
                : 'Fill in your details and pay securely. Instant confirmation, limited seats.'}
            </p>
          </div>
          <button
            onClick={openModal}
            disabled={soldOut}
            className={
              soldOut
                ? 'relative inline-flex items-center justify-center gap-2 bg-white/12 text-white/55 text-[15px] tracking-[0.005em] px-8 py-[16px] rounded-full whitespace-nowrap cursor-not-allowed'
                : 'relative spotlight-btn inline-flex items-center justify-center gap-2 bg-[#d4af37] text-[#0f0e0c] text-[15px] tracking-[0.005em] px-8 py-[16px] rounded-full transition-all hover:bg-[#e6c14e] hover:-translate-y-px active:scale-[0.98] whitespace-nowrap'
            }
          >
            {soldOut ? 'Sold out' : <>Book Now · {SEMINAR.priceLabel}<span className="text-[11px]">→</span></>}
          </button>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-black/[0.07] mt-4">
        <div className="px-6 md:px-[60px] py-12 md:py-16 max-w-[1240px] mx-auto">
          <div className="flex flex-col md:flex-row justify-between gap-10 md:gap-16">

            {/* Contact */}
            <div className="max-w-[420px]">
              <Image src="/logo.png" alt="Delta Trading Academy" width={120} height={36} className="h-7 invert w-auto object-contain grayscale mb-5" />
              <p className="text-[11px] text-black/35 tracking-[0.12em] uppercase mb-4">Contact</p>
              <address className="not-italic flex flex-col gap-2.5">
                <span className="text-[13px] text-black/55 leading-[1.6]">{CONTACT.address}</span>
                <span className="text-[13px] text-black/45">GST No: {CONTACT.gst}</span>
                <a href={`mailto:${CONTACT.email}`} className="text-[13px] text-black/55 hover:text-black transition-colors">{CONTACT.email}</a>
                <a href={`tel:${CONTACT.phone}`} className="text-[13px] text-black/55 hover:text-black transition-colors">{CONTACT.phoneLabel}</a>
              </address>
            </div>

            {/* Team contacts */}
            <div>
              <p className="text-[11px] text-black/35 tracking-[0.12em] uppercase mb-4">Talk to our team</p>
              <div className="flex flex-col gap-4">
                {TEAM.map((t) => (
                  <div key={t.name}>
                    <a href={`tel:${t.tel}`} className="text-[14px] text-black/80 hover:text-black transition-colors">{t.label}</a>
                    <p className="text-[12px] text-black/40 mt-0.5">{t.name} · {t.role}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Legal */}
            <div>
              <p className="text-[11px] text-black/35 tracking-[0.12em] uppercase mb-4">Legal</p>
              <ul className="flex flex-col gap-2.5">
                <li><a href="/terms" className="text-[13px] text-black/55 hover:text-black transition-colors">Terms &amp; Conditions</a></li>
                <li><a href="/privacy" className="text-[13px] text-black/55 hover:text-black transition-colors">Privacy Policy</a></li>
                <li><a href="/refund-policy" className="text-[13px] text-black/55 hover:text-black transition-colors">Refund &amp; Cancellation</a></li>
              </ul>
            </div>

          </div>

          <div className="h-px bg-black/[0.07] my-8" />

          <div className="flex flex-col md:flex-row items-center justify-between gap-3">
            <p className="text-[12.5px] text-black/35">© 2026 Delta Trading Academy · {SEMINAR.city} Seminar</p>
            <a href={HUB} className="text-[12.5px] text-black/45 hover:text-black transition-colors">
              ← Back to deltatradinghub.com
            </a>
          </div>
        </div>
      </footer>

      {/* ── Floating seats badge — right side, above the call button ── */}
      {soldOut ? (
        <div
          aria-label={`All ${seats.total} seats are filled`}
          className="fixed bottom-[92px] right-4 md:bottom-[100px] md:right-5 z-40 flex items-center gap-3 rounded-2xl bg-[#1c1b1a] border border-white/10 pl-3.5 pr-4 py-2.5 shadow-[0_12px_40px_rgba(0,0,0,0.4)]"
        >
          <span className="inline-flex h-2.5 w-2.5 shrink-0 rounded-full bg-white/50" />
          <div className="text-left">
            <p className="text-[11px] text-white tracking-[0.06em] uppercase leading-none mb-1.5">Seats filled · {seats.total}/{seats.total}</p>
            <div className="h-1 w-[104px] sm:w-[128px] rounded-full bg-white/15 overflow-hidden">
              <div className="h-full w-full rounded-full bg-white/60" />
            </div>
          </div>
          <span className="hidden sm:inline ml-0.5 text-[12px] text-white/70 border border-white/20 rounded-full px-3 py-1.5 whitespace-nowrap">Closed</span>
        </div>
      ) : (
        <button
          onClick={openModal}
          aria-label={`Only ${seats.left} of ${seats.total} seats left — Book Now`}
          className="animate-seat-glow group fixed bottom-[92px] right-4 md:bottom-[100px] md:right-5 z-40 flex items-center gap-3 rounded-2xl bg-gradient-to-r from-[#f43f5e] to-[#e11d48] pl-3.5 pr-3 py-2.5 transition-transform hover:-translate-y-0.5"
        >
          {/* pulsing intensity dot */}
          <span className="relative flex h-2.5 w-2.5 shrink-0">
            <span className="absolute inline-flex h-full w-full rounded-full bg-white opacity-80 animate-ping" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-white" />
          </span>
          <div className="text-left">
            <p className="text-[11px] text-white tracking-[0.06em] uppercase leading-none mb-1.5">
              Seats left: <span className="tabular-nums font-semibold">{seats.left}</span>/{seats.total}
            </p>
            <div className="h-1 w-[104px] sm:w-[128px] rounded-full bg-white/25 overflow-hidden">
              <div className="h-full rounded-full bg-white" style={{ width: `${seats.pct}%` }} />
            </div>
          </div>
          <span className="hidden sm:inline ml-0.5 text-[12px] text-[#e11d48] font-medium bg-white group-hover:bg-white/90 rounded-full px-3 py-1.5 transition-colors whitespace-nowrap">Book Now</span>
        </button>
      )}

      {/* Floating call button + registration modal */}
      <CallButton phone={TEAM[0].tel} />
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
