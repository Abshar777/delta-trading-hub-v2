'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import { IoCheckmarkDoneCircle } from 'react-icons/io5'
import { FaWhatsapp } from 'react-icons/fa'
import { POPUP_EVENT } from './ContactPopup'
import gsap from 'gsap'

const NAV_LINKS = [
  { label: 'Courses',  href: '#courses'  },
  { label: 'Mentors',  href: '#mentors'  },
  { label: 'Reviews',  href: '#reviews'  },
  { label: 'FAQs',     href: '#faq'      },
]

const STATS = [
  { title: 'Expert-Led Learning',      sub: '8+ years of market experience' },
  { title: 'Global Trading Community', sub: '7K+ active & successful members' },
  { title: 'Professional Mentorship',  sub: '30+ skilled trading coaches' },
]

function GridIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
      <circle cx="3"  cy="3"  r="1.5" fill="currentColor" />
      <circle cx="8"  cy="3"  r="1.5" fill="currentColor" />
      <circle cx="13" cy="3"  r="1.5" fill="currentColor" />
      <circle cx="3"  cy="8"  r="1.5" fill="currentColor" />
      <circle cx="8"  cy="8"  r="1.5" fill="currentColor" />
      <circle cx="13" cy="8"  r="1.5" fill="currentColor" />
      <circle cx="3"  cy="13" r="1.5" fill="currentColor" />
      <circle cx="8"  cy="13" r="1.5" fill="currentColor" />
      <circle cx="13" cy="13" r="1.5" fill="currentColor" />
    </svg>
  )
}

function AnnIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
      <path d="M6.5 1v11M1 6.5h11M2.5 2.5l8 8M10.5 2.5l-8 8"
        stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
    </svg>
  )
}

const trigger = () => window.dispatchEvent(new Event(POPUP_EVENT))

export default function HeroSection() {
  const [scrolled, setScrolled] = useState(false)

  /* ── animation refs ── */
  const overlayRef = useRef<HTMLDivElement>(null)
  const annBarRef  = useRef<HTMLDivElement>(null)
  const navRef     = useRef<HTMLElement>(null)
  const imgWrapRef = useRef<HTMLDivElement>(null)
  const badgeRef   = useRef<HTMLDivElement>(null)
  const line1Ref   = useRef<HTMLSpanElement>(null)
  const line2Ref   = useRef<HTMLSpanElement>(null)
  const bodyRef    = useRef<HTMLParagraphElement>(null)
  const ctasRef    = useRef<HTMLDivElement>(null)
  const statsRef   = useRef<HTMLDivElement>(null)

  /* ── scroll-shrink nav ── */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  /* ── intro animation ── */
  useEffect(() => {
    const ctx = gsap.context(() => {

      /* --- before state ----------------------------------------- */
      gsap.set(annBarRef.current,  { y: -20, opacity: 0 })
      gsap.set(navRef.current,     { y: -20, opacity: 0 })
      gsap.set(imgWrapRef.current, { scale: 1.07, opacity: 0 })
      gsap.set(badgeRef.current,   { y: 20, opacity: 0 })
      gsap.set(line1Ref.current,   { yPercent: 108 })
      gsap.set(line2Ref.current,   { yPercent: 108 })
      gsap.set(bodyRef.current,    { y: 24, opacity: 0 })
      gsap.set(ctasRef.current,    { y: 24, opacity: 0 })
      gsap.set(statsRef.current,   { y: 16, opacity: 0 })

      /* --- master timeline -------------------------------------- */
      const tl = gsap.timeline({ defaults: { ease: 'expo.out' } })

      tl
        /* Dark curtain slides up off-screen */
        .to(overlayRef.current, {
          yPercent: -100,
          duration: 1.05,
          ease: 'expo.inOut',
        }, 0)

        /* Hero image breathes in from slightly zoomed */
        .to(imgWrapRef.current, {
          scale: 1,
          opacity: 1,
          duration: 1.9,
        }, 0.18)

        /* Announcement bar then nav slide down */
        .to([annBarRef.current, navRef.current], {
          y: 0,
          opacity: 1,
          duration: 1.0,
          stagger: 0.09,
        }, 0.52)

        /* Badge fades up */
        .to(badgeRef.current, {
          y: 0,
          opacity: 1,
          duration: 0.9,
        }, 0.70)

        /* Headline line 1 — clips up from overflow:hidden container */
        .to(line1Ref.current, {
          yPercent: 0,
          duration: 1.05,
        }, 0.80)

        /* Headline line 2 — staggered */
        .to(line2Ref.current, {
          yPercent: 0,
          duration: 1.05,
        }, 0.92)

        /* Body copy */
        .to(bodyRef.current, {
          y: 0,
          opacity: 1,
          duration: 0.85,
        }, 1.08)

        /* CTA buttons */
        .to(ctasRef.current, {
          y: 0,
          opacity: 1,
          duration: 0.85,
        }, 1.18)

        /* Stats strip */
        .to(statsRef.current, {
          y: 0,
          opacity: 1,
          duration: 0.85,
        }, 1.33)
    })

    return () => ctx.revert()
  }, [])

  return (
    <div className="bg-white flex flex-col font-nb antialiased">

      {/* ── Intro curtain — covers page until animation fires ── */}
      <div
        ref={overlayRef}
        className="fixed inset-0 z-[999] bg-[#090808]"
        style={{ willChange: 'transform' }}
      />

      {/* ══════════════════════════════════════════════════════ */}
      {/* ANNOUNCEMENT BAR                                      */}
      {/* ══════════════════════════════════════════════════════ */}
      <div
        ref={annBarRef}
        className="h-11 flex items-center justify-center gap-3 px-5 text-[13px] tracking-[0.01em]"
      >
        <span className="text-black/35 flex items-center shrink-0 animate-spin-slow">
          <AnnIcon />
        </span>
        <span className="text-black/55 hidden md:block">
          Learn from Guinness World Record holders with 8+ years of trading expertise
        </span>
        <span className="text-black/55 md:hidden text-[12px]">
          Guinness World Record Holders
        </span>
        <span className="text-black/15 shrink-0 hidden md:block">|</span>
        <button
          onClick={trigger}
          className="text-black/70 inline-flex items-center gap-1 transition-colors hover:text-black shrink-0 text-[12.5px] md:text-[13px]"
        >
          Claim Free Session <span className="text-[10px]">→</span>
        </button>
      </div>

      {/* ══════════════════════════════════════════════════════ */}
      {/* NAV                                                    */}
      {/* ══════════════════════════════════════════════════════ */}
      <nav
        ref={navRef}
        className={[
          'fixed z-50 transition-all duration-300 ease-out',
          'flex items-center justify-between md:grid md:grid-cols-[1fr_auto_1fr]',
          scrolled
            ? 'top-3 left-3 right-3 md:left-[14%] md:right-[14%] h-[54px] px-5 md:px-8 bg-[#141212]/92 backdrop-blur-xl rounded-full'
            : 'top-[44px] left-0 right-0 h-[68px] px-5 md:px-[60px]',
        ].join(' ')}
      >
        {/* Desktop nav links */}
        <div className="hidden md:flex items-center gap-7">
          {NAV_LINKS.map(({ label, href }) => (
            <a key={label} href={href}
              className="text-[13.5px] text-white/70 tracking-[0.005em] transition-colors hover:text-white">
              {label}
            </a>
          ))}
        </div>

        {/* Logo */}
        <a href="#"
          className="font-nb text-[22px] md:text-[24px] tracking-[-0.03em] text-white no-underline select-none md:text-center">
          DELTA
        </a>

        {/* Right actions */}
        <div className="flex items-center gap-2.5 md:gap-3.5 justify-end">
          <button
            onClick={trigger}
            className="bg-white text-[#0a0808] text-[13px] md:text-[13.5px] tracking-[0.005em] py-2 px-4 md:px-5 rounded-full transition-all hover:bg-white/90 hover:-translate-y-px whitespace-nowrap"
          >
            Enrol Now
          </button>
          <button aria-label="WhatsApp"
            className="hidden md:flex w-9 h-9 items-center justify-center bg-white/[.05] border border-white/[.12] rounded-full text-white/70 transition-all hover:border-white/30 hover:text-white">
            <FaWhatsapp />
          </button>
        </div>
      </nav>

      {/* ══════════════════════════════════════════════════════ */}
      {/* DARK HERO CARD                                        */}
      {/* ══════════════════════════════════════════════════════ */}
      <div className="mx-2 rounded-xl overflow-hidden bg-[#090808] relative min-h-[calc(100svh-44px)]">

        <section className="relative flex flex-col min-h-[calc(100svh-44px)]">

          {/* Background image — scale-zooms in on load */}
          <div
            ref={imgWrapRef}
            className="absolute inset-0 z-[2] pointer-events-none"
            style={{ willChange: 'transform, opacity' }}
          >
            <Image
              src="/hero-1.png"
              alt=""
              fill
              priority
              className="opacity-55 md:opacity-50"
              style={{ objectFit: 'cover', objectPosition: 'center top' }}
            />
            <div className="absolute inset-0 z-[3] bg-[rgba(6,4,2,0.30)]" />
            <div className="sp-model-fade absolute inset-0 z-[5]" />
            <div className="absolute bottom-0 left-0 right-0 h-[35%] z-[6]
              bg-gradient-to-b from-transparent to-[rgba(9,8,8,0.80)]" />
          </div>

          {/* ── Hero content ── */}
          <div className="flex-1 relative z-[5] flex items-center
            px-6 pt-[90px] pb-8
            md:px-[60px] md:pt-[100px] md:pb-10">

            <div className="flex flex-col gap-5 md:gap-6 w-full max-w-[640px]">

              {/* Badge */}
              <div
                ref={badgeRef}
                className="inline-flex items-center gap-1.5 text-[12.5px] md:text-[13.5px] text-white/75 tracking-[0.01em]"
              >
                <IoCheckmarkDoneCircle className="text-[15px]" />
                <span>#1 Rated Trading Academy in Dubai</span>
              </div>

              {/* Heading — each line wrapped in overflow:hidden for clip-reveal */}
              <h1 className="font-nb font-normal tracking-[-0.03em] text-white
                text-[40px] sm:text-[52px] md:text-hero">
                <span className="block overflow-hidden leading-[1.05]">
                  <span ref={line1Ref} className="block">Best Forex Trading</span>
                </span>
                <span className="block overflow-hidden leading-[1.05]">
                  <span ref={line2Ref} className="block">Course in Dubai</span>
                </span>
              </h1>

              {/* Body */}
              <p
                ref={bodyRef}
                className="text-[14px] md:text-[15px] leading-[1.65] text-white/55 max-w-[520px] tracking-[0.005em]"
              >
                Master forex, stocks, and crypto with Dubai's most trusted trading academy.
                7k+ students trained, 20+ expert mentors.
              </p>

              {/* CTAs */}
              <div ref={ctasRef} className="flex flex-col sm:flex-row gap-2.5 pt-1">
                <button
                  onClick={trigger}
                  className="inline-flex justify-center items-center bg-white text-[#0a0808]
                    font-nb text-[14px] md:text-[14.5px] tracking-[0.005em]
                    py-[13px] px-[26px] rounded-full transition-all
                    hover:bg-[#ededeb] hover:-translate-y-px whitespace-nowrap"
                >
                  Claim Free Session
                </button>
                <a
                  href="#courses"
                  className="inline-flex justify-center items-center
                    bg-white/[0.06] text-white/85
                    font-nb text-[14px] md:text-[14.5px] tracking-[0.005em]
                    py-[13px] px-[26px] rounded-full border border-white/[0.10]
                    no-underline backdrop-blur-[8px] transition-all
                    hover:bg-white/[0.12] whitespace-nowrap"
                >
                  Explore Courses
                </a>
              </div>

            </div>
          </div>

          {/* ── Stats bar ── */}
          <div
            ref={statsRef}
            className="relative z-[5] px-6 md:px-[60px] py-5 md:py-[22px]"
          >
            {/* Desktop: horizontal row */}
            <div className="hidden md:flex items-center">
              {STATS.map((s, i) => (
                <div key={i} className="flex items-center">
                  {i > 0 && <div className="w-px h-[34px] bg-white/[0.10] mx-10 shrink-0" />}
                  <div className="flex flex-col gap-[3px]">
                    <span className="text-sm text-white/85 tracking-[0.01em]">{s.title}</span>
                    <span className="text-[12.5px] text-white/38 tracking-[0.005em]">{s.sub}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Mobile: 3-col grid */}
            <div className="md:hidden grid grid-cols-3 gap-2 border-t border-white/[0.08] pt-5">
              {STATS.map((s, i) => (
                <div key={i} className={[
                  'flex flex-col gap-1',
                  i > 0 ? 'pl-3 border-l border-white/[0.08]' : '',
                ].join(' ')}>
                  <span className="text-[11px] text-white/80 leading-snug tracking-[0.005em]">{s.title}</span>
                  <span className="text-[10px] text-white/38 leading-snug">{s.sub}</span>
                </div>
              ))}
            </div>
          </div>

        </section>
      </div>

    </div>
  )
}
