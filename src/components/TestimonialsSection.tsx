'use client'

import Image from 'next/image'
import { useState, useEffect, useRef, useCallback } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const TESTIMONIALS = [
  {
    img: '/testimonails/1.avif',
    name: 'Thach',
    age: 37,
    quote: '"They told me I was overthinking my genetic risk of diabetes but when I tested with Superpower I found my A1c was really high."',
    sub: 'His Superpower test caught risks that two doctors missed',
  },
  {
    img: '/testimonails/2.avif',
    name: 'Carissa',
    age: 38,
    quote: '"I spent almost a year thinking something was wrong with me. Turns out a simple blood test could have told me in a week."',
    sub: 'Uncovered the hormone imbalances behind bloating and weight gain',
  },
  {
    img: '/testimonails/3.avif',
    name: 'Marcus',
    age: 44,
    quote: '"My energy levels were tanking and I had no idea why. Superpower pinpointed exactly what was off in my bloodwork."',
    sub: 'Discovered low testosterone and vitamin D deficiency affecting performance',
  },
  {
    img: '/testimonails/4.avif',
    name: 'Priya',
    age: 31,
    quote: '"I\'d been struggling with fatigue for years. One test showed the root cause — and now I finally have answers."',
    sub: 'Identified thyroid dysfunction that had gone undetected for three years',
  },
]

/* Clone first slide at the end so the loop feels seamless */
const SLIDES = [...TESTIMONIALS, TESTIMONIALS[0]]
const TOTAL  = TESTIMONIALS.length

const GAP         = 24
const INTERVAL_MS = 4500

function getCardW() {
  if (typeof window === 'undefined') return 590
  return window.innerWidth < 768 ? window.innerWidth - 48 : 590
}
function getPadL() {
  if (typeof window === 'undefined') return 60
  return window.innerWidth < 768 ? 24 : 60
}

export default function TestimonialsSection() {
  const [cardW, setCardW]       = useState(590)
  const [padL, setPadL]         = useState(60)
  const [idx, setIdx]           = useState(0)
  const [animated, setAnimated] = useState(true)
  const timerRef                = useRef<ReturnType<typeof setInterval> | null>(null)

  // GSAP animation refs
  const sectionRef    = useRef<HTMLElement>(null)
  const trustRef      = useRef<HTMLDivElement>(null)
  const hLine1Ref     = useRef<HTMLSpanElement>(null)
  const hLine2Ref     = useRef<HTMLSpanElement>(null)
  const descRef       = useRef<HTMLParagraphElement>(null)
  const carouselRef   = useRef<HTMLDivElement>(null)
  const paginationRef = useRef<HTMLDivElement>(null)

  const realIdx = idx % TOTAL

  /* Responsive card width */
  useEffect(() => {
    function update() {
      setCardW(getCardW())
      setPadL(getPadL())
    }
    update()
    window.addEventListener('resize', update, { passive: true })
    return () => window.removeEventListener('resize', update)
  }, [])

  /* Start / restart the auto-advance timer */
  const startTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current)
    timerRef.current = setInterval(() => {
      setIdx(prev => prev + 1)
    }, INTERVAL_MS)
  }, [])

  /* Boot timer once */
  useEffect(() => {
    startTimer()
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  }, [startTimer])

  /* When we land on the clone (idx === TOTAL), wait for transition
     then instant-jump to idx 0 and re-enable animation */
  useEffect(() => {
    if (idx === TOTAL) {
      const t = setTimeout(() => {
        setAnimated(false)
        setIdx(0)
      }, 520)
      return () => clearTimeout(t)
    }
  }, [idx])

  /* Re-enable animation one frame after the instant jump */
  useEffect(() => {
    if (!animated) {
      const raf = requestAnimationFrame(() =>
        requestAnimationFrame(() => setAnimated(true))
      )
      return () => cancelAnimationFrame(raf)
    }
  }, [animated])

  /* Manual nav (pagination bars) */
  const goTo = (i: number) => {
    setAnimated(true)
    setIdx(i)
    startTimer()
  }

  /* GSAP ScrollTrigger animations — header area only */
  useEffect(() => {
    const ctx = gsap.context(() => {
      // 1. Trustpilot row — fade + slide up
      gsap.fromTo(
        trustRef.current,
        { y: 20, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.85,
          ease: 'expo.out',
          scrollTrigger: {
            trigger: trustRef.current,
            start: 'top 88%',
            once: true,
          },
        }
      )

      // 2. Heading line 1 — clip reveal
      gsap.fromTo(
        hLine1Ref.current,
        { yPercent: 108 },
        {
          yPercent: 0,
          duration: 1.1,
          ease: 'expo.out',
          scrollTrigger: {
            trigger: hLine1Ref.current,
            start: 'top 85%',
            once: true,
          },
        }
      )

      // 3. Heading line 2 — clip reveal, 0.12s delay after line 1
      gsap.fromTo(
        hLine2Ref.current,
        { yPercent: 108 },
        {
          yPercent: 0,
          duration: 1.1,
          delay: 0.12,
          ease: 'expo.out',
          scrollTrigger: {
            trigger: hLine1Ref.current,
            start: 'top 85%',
            once: true,
          },
        }
      )

      // 4. Description paragraph — fade + slide up
      gsap.fromTo(
        descRef.current,
        { y: 22, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.9,
          ease: 'expo.out',
          scrollTrigger: {
            trigger: descRef.current,
            start: 'top 88%',
            once: true,
          },
        }
      )

      // 5. Carousel container — fade + slide up
      gsap.fromTo(
        carouselRef.current,
        { y: 44, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1.1,
          ease: 'expo.out',
          scrollTrigger: {
            trigger: carouselRef.current,
            start: 'top 85%',
            once: true,
          },
        }
      )

      // 6. Pagination row — fade + slide up
      gsap.fromTo(
        paginationRef.current,
        { y: 20, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.85,
          ease: 'expo.out',
          scrollTrigger: {
            trigger: paginationRef.current,
            start: 'top 90%',
            once: true,
          },
        }
      )
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  const trackOffset = -(idx * (cardW + GAP))
  const photoH      = cardW < 400 ? '220px' : '362px'

  return (
    <section ref={sectionRef} id="reviews" className="bg-white md:mb-10 pt-20 pb-16 font-nb">

      {/* Trustpilot row */}
      <div ref={trustRef} className="px-[60px] max-md:px-6 flex items-center gap-2.5 mb-6">
        <span className="text-[15px] text-black tracking-[0.003em]">4.9 out of 5</span>
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
          <rect width="18" height="18" rx="2" fill="#00b67a"/>
          <path d="M9 2.5l1.545 4.755H15.09l-3.927 2.852 1.545 4.755L9 12.01l-3.708 2.852 1.545-4.755L2.91 7.255h4.545L9 2.5z" fill="white"/>
        </svg>
        <span className="text-[15px] text-black/55 tracking-[0.003em]">Trustpilot</span>
      </div>

      {/* Heading block */}
      <div className="px-[60px] max-md:px-6 mb-14">
        <h2 className="text-[54px] font-normal leading-[1.05] tracking-[-0.03em] text-black max-w-[680px] mb-5 max-md:text-[36px]">
          <span className="block overflow-hidden">
            <span ref={hLine1Ref} className="block">Trusted by Traders</span>
          </span>
          <span className="block overflow-hidden">
            <span ref={hLine2Ref} className="block">Across Dubai</span>
          </span>
        </h2>
        <p ref={descRef} className="text-[15px] text-black/45 leading-[1.65] max-w-[520px] tracking-[0.005em]">
         518+ Google Reviews  ·  Verified by Trustindex
        </p>
      </div>

      {/* ── Carousel ── */}
      <div ref={carouselRef} className="overflow-hidden">
        <div
          className={animated ? 'flex transition-transform duration-500 ease-out' : 'flex'}
          style={{
            paddingLeft: `${padL}px`,
            gap: `${GAP}px`,
            transform: `translateX(${trackOffset}px)`,
          }}
        >
          {SLIDES.map(({ img, name, age, quote, sub }, i) => (
            <div
              key={i}
              onClick={() => goTo(i % TOTAL)}
              className="flex flex-col flex-shrink-0 rounded-2xl overflow-hidden cursor-pointer transition-opacity duration-500"
              style={{
                width:   `${cardW}px`,
                opacity: (i % TOTAL) === realIdx ? 1 : 0.38,
              }}
            >
              {/* Photo */}
              <div
                className="relative rounded-xl overflow-hidden w-full bg-[#e8e4df]"
                style={{ height: photoH }}
              >
                <Image
                  src={img}
                  alt={`${name} testimonial`}
                  fill
                  sizes="(max-width: 768px) calc(100vw - 48px), 590px"
                  style={{ objectFit: 'cover', objectPosition: 'center top' }}
                />
              </div>

              {/* Text */}
              <div className="pt-5 pb-3 pr-6">
                <p className="text-[14px] text-black/45 tracking-[0.003em] mb-3">
                  {name}, {age}
                </p>
                <p className="text-[17px] text-black leading-[1.58] tracking-[-0.01em] mb-3">
                  {quote}
                </p>
                <p className="text-[13.5px] text-black/38 tracking-[0.003em] leading-snug">
                  {sub}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Pagination ── */}
      <div ref={paginationRef} className="px-[60px] max-md:px-6 mt-8 flex items-center gap-5">

        {/* Bar indicators — only TOTAL bars (not the clone) */}
        <div className="flex items-center gap-[6px]" style={{ width: `${cardW}px` }}>
          {TESTIMONIALS.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              className="h-[3px] flex-1 rounded-full transition-colors duration-300"
              style={{ backgroundColor: i === realIdx ? '#0f0e0c' : '#d6d4d2' }}
            />
          ))}
        </div>

        {/* Counter */}
        <span className="text-[13px] text-black/38 tracking-[0.01em] tabular-nums">
          {realIdx + 1} / {TOTAL}
        </span>

      </div>

    </section>
  )
}
