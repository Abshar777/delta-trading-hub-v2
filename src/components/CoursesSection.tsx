'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { POPUP_EVENT } from './ContactPopup'

gsap.registerPlugin(ScrollTrigger)

const COURSES = [
  {
    n: '01',
    icon: '💱',
    title: 'Forex Trading Program',
    desc: 'Our flagship forex trading course in Dubai. Learn technical analysis, risk management, trading psychology, chart reading, and live execution strategies from expert mentors with proven track records.',
    tags: ['Beginner to Advanced', 'Live Sessions', 'Certificate'],
    cta: 'Enroll Now',
  },
  {
    n: '02',
    icon: '📊',
    title: 'Stock Market Courses Dubai',
    desc: 'Master equity markets with our comprehensive stock market training in Dubai. Learn fundamental analysis, portfolio management, and long-term investment strategies across global exchanges.',
    tags: ['NSE / BSE / NYSE', 'Portfolio Building'],
    cta: 'Enroll Now',
  },
  {
    n: '03',
    icon: '₿',
    title: 'Crypto Trading Course Dubai',
    desc: 'Comprehensive cryptocurrency trading course in Dubai covering blockchain fundamentals, DeFi strategies, altcoin analysis, and risk-controlled crypto portfolio management.',
    tags: ['BTC / ETH / Altcoins', 'DeFi & Web3'],
    cta: 'Enroll Now',
  },
  {
    n: '04',
    icon: '👤',
    title: 'One-to-One Mentorship',
    desc: 'Personalized forex mentorship tailored to your skill level, goals, and schedule. Work directly with a senior trader for accelerated growth and custom strategy development.',
    tags: ['Customised Plan', 'Flexible Schedule'],
    cta: 'Book Session',
  },
  {
    n: '05',
    icon: '🔴',
    title: 'Live Mentorship Program',
    desc: 'Trade alongside mentors in real-time. Access live market analysis, daily trade setups, voice rooms, and ongoing coaching to sharpen your execution skills in live conditions.',
    tags: ['Daily Signals', 'Live Trade Room'],
    cta: 'Get Access',
  },
  {
    n: '06',
    icon: '⛓️',
    title: 'Blockchain Academy',
    desc: 'Go beyond trading — understand the technology powering the future. Our blockchain course in Dubai covers smart contracts, tokenomics, NFT markets, and Web3 investment fundamentals.',
    tags: ['Smart Contracts', 'Web3 Investing'],
    cta: 'Learn More',
  },
]

const triggerPopup = () => window.dispatchEvent(new Event(POPUP_EVENT))

export default function CoursesSection() {
  const sectionRef  = useRef<HTMLElement>(null)
  const eyebrowRef  = useRef<HTMLParagraphElement>(null)
  const hLine1Ref   = useRef<HTMLSpanElement>(null)
  const hLine2Ref   = useRef<HTMLSpanElement>(null)
  const descRef     = useRef<HTMLParagraphElement>(null)
  const dividerRef  = useRef<HTMLDivElement>(null)
  const gridRef     = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // 1. Eyebrow fade-up
      gsap.from(eyebrowRef.current, {
        y: 16,
        opacity: 0,
        duration: 0.8,
        ease: 'expo.out',
        scrollTrigger: {
          trigger: eyebrowRef.current,
          start: 'top 88%',
          once: true,
        },
      })

      // 2. h2 line 1 — clip reveal
      gsap.from(hLine1Ref.current, {
        yPercent: 108,
        duration: 1.1,
        ease: 'expo.out',
        scrollTrigger: {
          trigger: hLine1Ref.current,
          start: 'top 86%',
          once: true,
        },
      })

      // 3. h2 line 2 — clip reveal, 0.1s delay after line 1
      gsap.from(hLine2Ref.current, {
        yPercent: 108,
        duration: 1.1,
        delay: 0.1,
        ease: 'expo.out',
        scrollTrigger: {
          trigger: hLine1Ref.current,
          start: 'top 86%',
          once: true,
        },
      })

      // 4. Description paragraph fade-up
      gsap.from(descRef.current, {
        y: 22,
        opacity: 0,
        duration: 0.9,
        ease: 'expo.out',
        scrollTrigger: {
          trigger: descRef.current,
          start: 'top 88%',
          once: true,
        },
      })

      // 5. Divider scaleX reveal
      gsap.from(dividerRef.current, {
        scaleX: 0,
        transformOrigin: 'left center',
        duration: 1.2,
        ease: 'expo.out',
        scrollTrigger: {
          trigger: dividerRef.current,
          start: 'top 90%',
          once: true,
        },
      })

      // 6. Course cards stagger
      if (gridRef.current) {
        gsap.from(gridRef.current.children, {
          y: 56,
          opacity: 0,
          scale: 0.97,
          stagger: 0.08,
          duration: 1.0,
          ease: 'expo.out',
          scrollTrigger: {
            trigger: gridRef.current,
            start: 'top 82%',
            once: true,
          },
        })
      }
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} id="courses" className="bg-white py-24 px-[60px] font-nb max-md:px-6 max-md:py-14">
      <div className="max-w-[1240px] mx-auto">

        {/* ── Header ── */}
        <div className="mb-16 max-md:mb-10">
          <p ref={eyebrowRef} className="text-[13px] text-black/40 tracking-[0.12em] uppercase mb-4">
            Educational Programs
          </p>
          <div className="flex items-end justify-between gap-8 max-md:flex-col max-md:items-start max-md:gap-5">
            <h2 className="font-normal leading-[1.05] tracking-[-0.03em] text-black max-w-[560px]">
              <span className="block overflow-hidden text-5xl max-md:text-[34px]">
                <span ref={hLine1Ref} className="block">Our Trading Courses</span>
              </span>
              <span className="block overflow-hidden text-5xl max-md:text-[34px]">
                <span ref={hLine2Ref} className="block">in Dubai</span>
              </span>
            </h2>
            <p ref={descRef} className="text-[15px] text-black/45 leading-[1.7] max-w-[420px] max-md:max-w-full tracking-[0.003em] pb-1 max-md:text-[14px]">
              Our accredited academy, endorsed by KHDA, offers comprehensive education in forex trading,
              cryptocurrency, and stock market disciplines — designed for every level of trader.
            </p>
          </div>
        </div>

        {/* Divider */}
        <div ref={dividerRef} className="h-px bg-black/[0.07] mb-0" />

        {/* ── Course grid ── */}
        <div ref={gridRef} className="grid grid-cols-3 max-lg:grid-cols-2 max-md:grid-cols-1">
          {COURSES.map(({ n, title, desc, tags, cta }) => (
            <div
              key={n}
              className="group flex flex-col gap-5 p-8 max-md:p-5 border-b border-black/[0.07]
                border-r
                [&:nth-child(3n)]:border-r-0
                max-lg:[&:nth-child(3n)]:border-r
                max-lg:[&:nth-child(2n)]:border-r-0
                max-md:border-r-0"
            >
              {/* Number */}
              <span className="text-[13px] text-black/25 tracking-[0.06em] tabular-nums">
                {n}
              </span>

              {/* Title */}
              <h3 className="text-[18px] font-normal tracking-[-0.01em] text-black leading-snug max-md:text-[17px]">
                {title}
              </h3>

              {/* Description */}
              <p className="text-[13.5px] text-black/45 leading-[1.68] tracking-[0.003em] flex-1 max-md:text-[13px]">
                {desc}
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-2">
                {tags.map(tag => (
                  <span
                    key={tag}
                    className="text-[11.5px] text-black/50 tracking-[0.02em] bg-black/[0.04] px-3 py-1 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* CTA */}
              <button
                onClick={triggerPopup}
                className="inline-flex items-center gap-1.5 text-[13.5px] text-black tracking-[0.005em] w-fit border-b border-black/20 pb-px transition-all hover:border-black hover:gap-2.5 group-hover:gap-2.5"
              >
                {cta}
                <span className="text-[11px] transition-transform group-hover:translate-x-0.5">→</span>
              </button>
            </div>
          ))}
        </div>

        {/* Bottom border */}
        <div className="h-px bg-black/[0.07]" />

      </div>
    </section>
  )
}
