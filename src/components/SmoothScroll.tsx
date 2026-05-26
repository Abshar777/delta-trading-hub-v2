'use client'

import Lenis from 'lenis'
import { useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function SmoothScroll() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.5,
    })

    /* ── Sync Lenis scroll position → GSAP ScrollTrigger ── */
    lenis.on('scroll', () => ScrollTrigger.update())

    /* Wire hash-link anchors so they scroll through Lenis */
    function handleAnchor(e: MouseEvent) {
      const target = (e.target as HTMLElement).closest('a[href^="#"]') as HTMLAnchorElement | null
      if (!target) return
      const id = target.getAttribute('href')?.slice(1)
      if (!id) return
      const el = document.getElementById(id)
      if (!el) return
      e.preventDefault()
      lenis.scrollTo(el, { offset: -80, duration: 1.4 })
    }

    document.addEventListener('click', handleAnchor)

    /* ── RAF loop — drives both Lenis and GSAP ticker ── */
    function raf(time: number) {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }

    const rafId = requestAnimationFrame(raf)

    return () => {
      cancelAnimationFrame(rafId)
      document.removeEventListener('click', handleAnchor)
      lenis.destroy()
    }
  }, [])

  return null
}
