'use client'

import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'

const REDIRECT_SECS = 6
const CONFETTI_COLORS = ['#0f0e0c', '#d4af37', '#e6c14e', '#e8e4df', '#8a7a70', '#6b8f71']

interface Particle {
  x: number; y: number; vx: number; vy: number; w: number; h: number
  rotation: number; rotSpeed: number; color: string; opacity: number
  shape: 'rect' | 'circle' | 'ribbon'
}

function fireBurst(canvas: HTMLCanvasElement, cx: number, cy: number) {
  const ctx = canvas.getContext('2d')!
  const particles: Particle[] = []
  for (let i = 0; i < 150; i++) {
    const angle = Math.random() * Math.PI * 2
    const speed = 2 + Math.random() * 13
    particles.push({
      x: cx, y: cy, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed - 4,
      w: 5 + Math.random() * 10, h: 2 + Math.random() * 5,
      rotation: Math.random() * Math.PI * 2, rotSpeed: (Math.random() - 0.5) * 0.22,
      color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
      opacity: 1, shape: Math.random() < 0.45 ? 'rect' : Math.random() < 0.7 ? 'circle' : 'ribbon',
    })
  }
  let frame = 0
  let rafId: number
  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    let alive = false
    for (const p of particles) {
      p.vy += 0.22; p.vx *= 0.99; p.x += p.vx; p.y += p.vy; p.rotation += p.rotSpeed
      if (frame > 32) p.opacity -= 0.013
      if (p.opacity <= 0) continue
      alive = true
      ctx.save(); ctx.globalAlpha = p.opacity; ctx.translate(p.x, p.y); ctx.rotate(p.rotation); ctx.fillStyle = p.color
      if (p.shape === 'circle') { ctx.beginPath(); ctx.arc(0, 0, p.w / 2, 0, Math.PI * 2); ctx.fill() }
      else if (p.shape === 'ribbon') ctx.fillRect(-p.w, -p.h / 2, p.w * 2, p.h)
      else ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h)
      ctx.restore()
    }
    frame++
    if (alive) rafId = requestAnimationFrame(draw)
  }
  rafId = requestAnimationFrame(draw)
  return () => cancelAnimationFrame(rafId)
}

export default function SeminarThankYouPage() {
  const [order, setOrder] = useState<string | null>(null)
  const [countdown, setCountdown] = useState(REDIRECT_SECS)

  const canvasRef = useRef<HTMLCanvasElement>(null)
  const checkWrapRef = useRef<HTMLDivElement>(null)
  const headingRef = useRef<HTMLHeadingElement>(null)
  const subtextRef = useRef<HTMLParagraphElement>(null)
  const btnRef = useRef<HTMLAnchorElement>(null)
  const countRef = useRef<HTMLParagraphElement>(null)

  useEffect(() => {
    const o = new URLSearchParams(window.location.search).get('order')
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setOrder(o)
    const pdfUrl = o ? `/api/seminar/invitation?orderId=${encodeURIComponent(o)}` : null

    const canvas = canvasRef.current!
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight }
    resize()
    window.addEventListener('resize', resize)

    gsap.set(checkWrapRef.current, { opacity: 0, scale: 0.4 })
    gsap.set(headingRef.current, { yPercent: 110 })
    gsap.set(subtextRef.current, { opacity: 0, y: 20 })
    gsap.set(btnRef.current, { opacity: 0, y: 20 })
    gsap.set(countRef.current, { opacity: 0 })

    const tl = gsap.timeline({ defaults: { ease: 'expo.out' } })
    tl.to(checkWrapRef.current, { opacity: 1, scale: 1, duration: 1.0, ease: 'back.out(1.6)' }, 0.2)
      .to(headingRef.current, { yPercent: 0, duration: 1.05 }, 0.55)
      .to(subtextRef.current, { opacity: 1, y: 0, duration: 0.9 }, 0.75)
      .to(btnRef.current, { opacity: 1, y: 0, duration: 0.85 }, 0.9)
      .to(countRef.current, { opacity: 1, duration: 0.7 }, 1.1)

    let cancelBurst: (() => void) | undefined
    const confettiTimer = setTimeout(() => {
      cancelBurst = fireBurst(canvas, window.innerWidth / 2, window.innerHeight * 0.36)
    }, 350)

    let c = REDIRECT_SECS
    let countInterval: ReturnType<typeof setInterval> | undefined
    if (pdfUrl) {
      countInterval = setInterval(() => {
        c -= 1
        setCountdown(c)
        if (c <= 0) {
          if (countInterval) clearInterval(countInterval)
          window.location.href = pdfUrl
        }
      }, 1000)
    }

    return () => {
      window.removeEventListener('resize', resize)
      clearTimeout(confettiTimer)
      if (countInterval) clearInterval(countInterval)
      cancelBurst?.()
      tl.kill()
    }
  }, [])

  const pdfUrl = order ? `/api/seminar/invitation?orderId=${encodeURIComponent(order)}` : null

  return (
    <main className="min-h-[100svh] bg-white font-nb flex flex-col items-center justify-center relative overflow-hidden px-6">
      <canvas ref={canvasRef} className="fixed inset-0 w-full h-full pointer-events-none z-0" aria-hidden="true" />

      <div className="relative z-10 flex flex-col items-center text-center max-w-[460px]">
        <div
          ref={checkWrapRef}
          className="w-[78px] h-[78px] rounded-full border border-[#d4af37]/30 bg-[#faf7ef] flex items-center justify-center mb-9"
        >
          <svg width="30" height="30" viewBox="0 0 30 30" fill="none">
            <path d="M7 15.5l5.5 5.5 10.5-11" stroke="#b8901f" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>

        <div className="overflow-hidden mb-4">
          <h1 ref={headingRef} className="text-[54px] max-md:text-[40px] font-normal leading-[1.0] tracking-[-0.04em] text-black">
            You&apos;re confirmed!
          </h1>
        </div>

        <p ref={subtextRef} className="text-[15px] max-md:text-[14px] text-black/50 leading-[1.72] tracking-[0.003em] mb-9 max-w-[380px]">
          Your seat for the <span className="text-black/80">Forex Trading Bootcamp</span> in Bengaluru is booked. A confirmation
          email with your invitation letter is on its way{pdfUrl ? ' — and we’re opening it for you now.' : '.'}
        </p>

        <a
          ref={btnRef}
          href={pdfUrl ?? '/seminar'}
          className="spotlight-btn spotlight-btn-gold inline-flex items-center gap-2.5 bg-[#0f0e0c] text-white text-[14px] tracking-[0.005em] px-8 py-[15px] rounded-full hover:bg-[#2a2825] transition-all hover:-translate-y-px active:scale-[0.98]"
        >
          {pdfUrl ? 'View your invitation letter' : 'Back to seminar'}
          <span className="text-[12px]">→</span>
        </a>

        {pdfUrl && (
          <p ref={countRef} className="text-[12px] text-black/28 tracking-[0.005em] mt-7 tabular-nums">
            Opening your invitation in {countdown}s…
          </p>
        )}
      </div>
    </main>
  )
}
