'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { FaWhatsapp } from 'react-icons/fa'
import gsap from 'gsap'

export const WA_LINK =
  'https://wa.me/971507528009?text=Hi%2C%20I%20just%20submitted%20my%20details%20and%20would%20like%20to%20know%20more%20about%20your%20trading%20programs.'

const REDIRECT_SECS   = 5
const CONFETTI_COLORS = ['#0f0e0c', '#d4af37', '#c8c4be', '#e8e4df', '#8a7a70', '#6b8f71']

const NAV_LINKS = [
  { label: 'Courses', href: '/#courses' },
  { label: 'Mentors', href: '/#mentors' },
  { label: 'Reviews', href: '/#reviews' },
  { label: 'FAQs',    href: '/#faq'     },
]

/* ── Particle type ── */
interface Particle {
  x: number; y: number
  vx: number; vy: number
  w: number; h: number
  rotation: number; rotSpeed: number
  color: string; opacity: number
  shape: 'rect' | 'circle' | 'ribbon'
}

/* ── Canvas confetti burst ── */
function fireBurst(canvas: HTMLCanvasElement, cx: number, cy: number) {
  const ctx = canvas.getContext('2d')!
  const particles: Particle[] = []

  for (let i = 0; i < 140; i++) {
    const angle = Math.random() * Math.PI * 2
    const speed = 2 + Math.random() * 13
    particles.push({
      x: cx, y: cy,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - 4,
      w: 5 + Math.random() * 10,
      h: 2 + Math.random() * 5,
      rotation: Math.random() * Math.PI * 2,
      rotSpeed: (Math.random() - 0.5) * 0.22,
      color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
      opacity: 1,
      shape: Math.random() < 0.45 ? 'rect' : Math.random() < 0.7 ? 'circle' : 'ribbon',
    })
  }

  let frame = 0
  let rafId: number

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    let anyAlive = false

    for (const p of particles) {
      p.vy  += 0.22
      p.vx  *= 0.99
      p.x   += p.vx
      p.y   += p.vy
      p.rotation += p.rotSpeed
      if (frame > 32) p.opacity -= 0.013
      if (p.opacity <= 0) continue
      anyAlive = true

      ctx.save()
      ctx.globalAlpha = p.opacity
      ctx.translate(p.x, p.y)
      ctx.rotate(p.rotation)
      ctx.fillStyle = p.color

      if (p.shape === 'circle') {
        ctx.beginPath()
        ctx.arc(0, 0, p.w / 2, 0, Math.PI * 2)
        ctx.fill()
      } else if (p.shape === 'ribbon') {
        ctx.fillRect(-p.w, -p.h / 2, p.w * 2, p.h)
      } else {
        ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h)
      }
      ctx.restore()
    }

    frame++
    if (anyAlive) rafId = requestAnimationFrame(draw)
  }

  rafId = requestAnimationFrame(draw)
  return () => cancelAnimationFrame(rafId)
}

/* ════════════════════════════════════════════════════════ */
export default function ThankYouPage() {
  const [countdown, setCountdown] = useState(REDIRECT_SECS)

  const canvasRef       = useRef<HTMLCanvasElement>(null)
  const navRef          = useRef<HTMLElement>(null)
  const checkWrapRef    = useRef<HTMLDivElement>(null)
  const headingRef      = useRef<HTMLHeadingElement>(null)
  const subtextRef      = useRef<HTMLParagraphElement>(null)
  const btnRef          = useRef<HTMLAnchorElement>(null)
  const countRef        = useRef<HTMLParagraphElement>(null)
  const progressWrapRef = useRef<HTMLDivElement>(null)
  const progressBarRef  = useRef<HTMLDivElement>(null)

  useEffect(() => {
    /* ── Canvas sizing ── */
    const canvas = canvasRef.current!
    const resize = () => {
      canvas.width  = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    /* ── Initial GSAP states ── */
    gsap.set(navRef.current,          { opacity: 0, y: -16 })
    gsap.set(checkWrapRef.current,    { opacity: 0, scale: 0.4 })
    gsap.set(headingRef.current,      { yPercent: 110 })
    gsap.set(subtextRef.current,      { opacity: 0, y: 20 })
    gsap.set(btnRef.current,          { opacity: 0, y: 20 })
    gsap.set(countRef.current,        { opacity: 0 })
    gsap.set(progressWrapRef.current, { opacity: 0 })

    /* ── Master timeline ── */
    const tl = gsap.timeline({ defaults: { ease: 'expo.out' } })
    tl
      .to(navRef.current,          { opacity: 1, y: 0, duration: 0.85 },                          0.1)
      .to(checkWrapRef.current,    { opacity: 1, scale: 1, duration: 1.0, ease: 'back.out(1.6)' }, 0.45)
      .to(headingRef.current,      { yPercent: 0, duration: 1.05 },                               0.82)
      .to(subtextRef.current,      { opacity: 1, y: 0, duration: 0.9 },                           1.02)
      .to(btnRef.current,          { opacity: 1, y: 0, duration: 0.85 },                          1.18)
      .to(countRef.current,        { opacity: 1, duration: 0.7 },                                 1.38)
      .to(progressWrapRef.current, { opacity: 1, duration: 0.7 },                                 1.42)

    /* ── Confetti fires when checkmark pops ── */
    let cancelBurst: (() => void) | undefined
    const confettiTimer = setTimeout(() => {
      const cx = window.innerWidth / 2
      const cy = window.innerHeight * 0.38
      cancelBurst = fireBurst(canvas, cx, cy)
    }, 650)

    /* ── Progress bar drain ── */
    const progressEl = progressBarRef.current
    gsap.to(progressEl, {
      scaleX: 0,
      transformOrigin: 'left center',
      duration: REDIRECT_SECS,
      ease: 'none',
      delay: 1.5,
    })

    /* ── Countdown + auto-redirect ── */
    let c = REDIRECT_SECS
    const countInterval = setInterval(() => {
      c--
      setCountdown(c)
      if (c <= 0) {
        clearInterval(countInterval)
        window.location.href = WA_LINK
      }
    }, 1000)

    return () => {
      window.removeEventListener('resize', resize)
      clearTimeout(confettiTimer)
      clearInterval(countInterval)
      cancelBurst?.()
      tl.kill()
      gsap.killTweensOf(progressEl)
    }
  }, [])

  return (
    <main className="min-h-[100svh] bg-white font-nb flex flex-col items-center justify-center relative overflow-hidden px-6">

      {/* Confetti canvas */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 w-full h-full pointer-events-none z-0"
        aria-hidden="true"
      />

      {/* ── Nav — always in scrolled/pill state ── */}
      <nav
        ref={navRef}
        className="fixed z-50 top-3 left-3 right-3 md:left-[14%] md:right-[14%] h-[54px] px-5 md:px-8 bg-[#141212]/92 backdrop-blur-xl rounded-full flex items-center justify-between md:grid md:grid-cols-[1fr_auto_1fr]"
      >
        {/* Desktop nav links */}
        <div className="hidden md:flex items-center gap-7">
          {NAV_LINKS.map(({ label, href }) => (
            <a
              key={label}
              href={href}
              className="text-[13.5px] text-white/70 tracking-[0.005em] transition-colors hover:text-white"
            >
              {label}
            </a>
          ))}
        </div>

        {/* Logo */}
        <Link href="/" className="flex justify-center items-center select-none">
          <Image
            src="/logo.png"
            alt="Delta Trading Academy"
            width={120}
            height={36}
            className="h-7 md:h-8 w-auto object-contain grayscale"
            priority
          />
        </Link>

        {/* Right actions */}
        <div className="flex items-center gap-2.5 md:gap-3.5 justify-end">
          <a
            href={WA_LINK}
            target="_blank"
            rel="noreferrer"
            className="bg-white text-[#0a0808] text-[13px] md:text-[13.5px] tracking-[0.005em] py-2 px-4 md:px-5 rounded-full transition-all hover:bg-white/90 hover:-translate-y-px whitespace-nowrap"
          >
            Enroll Now
          </a>
          <a
            href={WA_LINK}
            target="_blank"
            rel="noreferrer"
            aria-label="WhatsApp"
            className="hidden md:flex w-9 h-9 items-center justify-center bg-white/[.05] border border-white/[.12] rounded-full text-white/70 transition-all hover:border-white/30 hover:text-white"
          >
            <FaWhatsapp />
          </a>
        </div>
      </nav>

      {/* ── Main content ── */}
      <div className="relative z-10 flex flex-col items-center text-center max-w-[460px]">

        {/* Checkmark circle */}
        <div
          ref={checkWrapRef}
          className="w-[78px] h-[78px] rounded-full border border-black/[0.08] bg-[#f8f7f5] flex items-center justify-center mb-9"
        >
          <svg width="30" height="30" viewBox="0 0 30 30" fill="none">
            <path
              d="M7 15.5l5.5 5.5 10.5-11"
              stroke="#0f0e0c"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        {/* Heading — clip reveal */}
        <div className="overflow-hidden mb-4">
          <h1
            ref={headingRef}
            className="text-[54px] max-md:text-[40px] font-normal leading-[1.0] tracking-[-0.04em] text-black"
          >
            Thank you!
          </h1>
        </div>

        {/* Subtext */}
        <p
          ref={subtextRef}
          className="text-[15px] max-md:text-[14px] text-black/45 leading-[1.72] tracking-[0.003em] mb-9 max-w-[360px]"
        >
          We&apos;ve received your message and will reach out shortly.
          We&apos;re connecting you to WhatsApp now.
        </p>

        {/* WhatsApp CTA */}
        <a
          ref={btnRef}
          href={WA_LINK}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2.5 bg-[#0f0e0c] text-white text-[14px] tracking-[0.005em] px-8 py-[15px] rounded-full hover:bg-[#2a2825] transition-all hover:-translate-y-px active:scale-[0.98]"
        >
          <FaWhatsapp className="text-[17px]" />
          Open WhatsApp
        </a>

        {/* Countdown */}
        <p
          ref={countRef}
          className="text-[12px] text-black/28 tracking-[0.005em] mt-7 tabular-nums"
        >
          Redirecting in {countdown}s…
        </p>

        {/* Progress bar */}
        <div
          ref={progressWrapRef}
          className="w-[160px] h-[2px] bg-black/[0.06] rounded-full mt-3 overflow-hidden"
        >
          <div
            ref={progressBarRef}
            className="h-full w-full bg-black/[0.18] rounded-full"
          />
        </div>

      </div>
    </main>
  )
}
