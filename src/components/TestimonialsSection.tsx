'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const TESTIMONIALS = [
  {
    initial: 'F',
    name: 'Fasal V.V.N',
    role: 'Forex Student — Verified Google Review',
    quote: '"I joined Delta Trading Institute to learn the ins and outs of forex trading. The mentors are incredibly knowledgeable and patient. The live trading sessions were eye-opening. I would highly recommend this academy to anyone serious about learning forex trading in Dubai."',
  },
  {
    initial: 'M',
    name: 'Mubarak Ahmad',
    role: 'Trading Student — Verified Google Review',
    quote: '"Delta Trading Institute surpassed my expectations by delivering expert guidance and practical knowledge. The courses are structured brilliantly — from beginner to advanced. If you\'re looking for the best forex trading course in Dubai, this is it."',
  },
  {
    initial: 'R',
    name: 'Rinu Ramesh Babu',
    role: 'Advanced Forex Student — Verified Google Review',
    quote: '"An excellent trading course! I gained real confidence in chart reading, risk management, and executing trades. The mentors are accessible, and the community support makes it easy to keep learning. Highly recommend Delta for anyone wanting to learn forex trading in Dubai."',
  },
  {
    initial: 'S',
    name: 'Shemeer A.S',
    role: 'Current Student — Verified Google Review',
    quote: '"If you\'re looking for quality trading education in Dubai, Delta is the best. The team is supportive, knowledgeable, and genuinely invested in your success. I\'m currently enrolled and the transformation in my trading approach has been remarkable."',
  },
  {
    initial: 'L',
    name: 'Linto Lawrence',
    role: 'Forex Graduate — Verified Google Review',
    quote: '"Delta is truly the best trading academy in Dubai for quality education. If you need to learn trading, Delta is the best place — they have the best teachers, best resources, and best community. I highly suggest Delta for anyone looking to master forex."',
  },
  {
    initial: 'D',
    name: 'Dains K. John',
    role: 'Stock Market Student — Verified Google Review',
    quote: '"Had a very good learning experience at Delta International Management Development Training. The mentors provide clear, actionable strategies. After completing the stock market course in Dubai, I feel confident approaching the markets independently."',
  },
]

const TOTAL       = TESTIMONIALS.length
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
  const [activeIdx, setActiveIdx] = useState(0)

  /* refs — no re-renders needed for these */
  const scrollRef        = useRef<HTMLDivElement>(null)
  const timerRef         = useRef<ReturnType<typeof setInterval> | null>(null)
  const restartRef       = useRef<ReturnType<typeof setTimeout> | null>(null)
  const activeIdxRef     = useRef(0)
  const isAutoRef        = useRef(false)   // true while programmatic scroll plays

  /* GSAP refs */
  const sectionRef    = useRef<HTMLElement>(null)
  const trustRef      = useRef<HTMLDivElement>(null)
  const hLine1Ref     = useRef<HTMLSpanElement>(null)
  const hLine2Ref     = useRef<HTMLSpanElement>(null)
  const descRef       = useRef<HTMLParagraphElement>(null)
  const carouselRef   = useRef<HTMLDivElement>(null)
  const paginationRef = useRef<HTMLDivElement>(null)

  /* Keep ref in sync with state */
  useEffect(() => { activeIdxRef.current = activeIdx }, [activeIdx])

  /* Responsive sizes */
  useEffect(() => {
    function update() { setCardW(getCardW()); setPadL(getPadL()) }
    update()
    window.addEventListener('resize', update, { passive: true })
    return () => window.removeEventListener('resize', update)
  }, [])

  /* Re-anchor scroll position when card width changes (resize) */
  useEffect(() => {
    scrollRef.current?.scrollTo({ left: activeIdxRef.current * (cardW + GAP), behavior: 'auto' })
  }, [cardW])

  /* Scroll to a card programmatically */
  const scrollToCard = useCallback((i: number) => {
    if (!scrollRef.current) return
    isAutoRef.current = true
    setActiveIdx(i)
    activeIdxRef.current = i
    scrollRef.current.scrollTo({ left: i * (cardW + GAP), behavior: 'smooth' })
    setTimeout(() => { isAutoRef.current = false }, 700)
  }, [cardW])

  /* Auto-advance timer */
  const startTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current)
    timerRef.current = setInterval(() => {
      scrollToCard((activeIdxRef.current + 1) % TOTAL)
    }, INTERVAL_MS)
  }, [scrollToCard])

  useEffect(() => {
    startTimer()
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  }, [startTimer])

  /* Track manual scroll → update active dot + restart timer after idle */
  const handleScroll = useCallback(() => {
    if (isAutoRef.current || !scrollRef.current) return
    const left = scrollRef.current.scrollLeft
    const i = Math.min(Math.round(left / (cardW + GAP)), TOTAL - 1)
    setActiveIdx(i)
    activeIdxRef.current = i
    /* Restart auto-advance 2 s after user stops scrolling */
    if (restartRef.current) clearTimeout(restartRef.current)
    restartRef.current = setTimeout(startTimer, 2000)
  }, [cardW, startTimer])

  /* GSAP ScrollTrigger */
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(trustRef.current, { y: 20, opacity: 0 }, {
        y: 0, opacity: 1, duration: 0.85, ease: 'expo.out',
        scrollTrigger: { trigger: trustRef.current, start: 'top 88%', once: true },
      })
      gsap.fromTo(hLine1Ref.current, { yPercent: 108 }, {
        yPercent: 0, duration: 1.1, ease: 'expo.out',
        scrollTrigger: { trigger: hLine1Ref.current, start: 'top 85%', once: true },
      })
      gsap.fromTo(hLine2Ref.current, { yPercent: 108 }, {
        yPercent: 0, duration: 1.1, delay: 0.12, ease: 'expo.out',
        scrollTrigger: { trigger: hLine1Ref.current, start: 'top 85%', once: true },
      })
      gsap.fromTo(descRef.current, { y: 22, opacity: 0 }, {
        y: 0, opacity: 1, duration: 0.9, ease: 'expo.out',
        scrollTrigger: { trigger: descRef.current, start: 'top 88%', once: true },
      })
      gsap.fromTo(carouselRef.current, { y: 44, opacity: 0 }, {
        y: 0, opacity: 1, duration: 1.1, ease: 'expo.out',
        scrollTrigger: { trigger: carouselRef.current, start: 'top 85%', once: true },
      })
      gsap.fromTo(paginationRef.current, { y: 20, opacity: 0 }, {
        y: 0, opacity: 1, duration: 0.85, ease: 'expo.out',
        scrollTrigger: { trigger: paginationRef.current, start: 'top 90%', once: true },
      })
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} id="reviews" className="bg-white md:mb-10 pt-20 pb-16 font-nb">

      {/* Google rating row */}
      <div ref={trustRef} className="px-[60px] max-md:px-6 flex items-center gap-2.5 mb-6">
        <span className="text-[15px] text-black tracking-[0.003em]">4.9 out of 5</span>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
        </svg>
        <span className="text-[15px] text-black/55 tracking-[0.003em]">Google Reviews</span>
      </div>

      {/* Heading */}
      <div className="px-[60px] max-md:px-6 mb-14">
        <h2 className="font-normal leading-[1.05] tracking-[-0.03em] text-black max-w-[680px] mb-5">
          <span className="block overflow-hidden text-[54px] max-md:text-[36px]">
            <span ref={hLine1Ref} className="block">Trusted by Traders</span>
          </span>
          <span className="block overflow-hidden text-[54px] max-md:text-[36px]">
            <span ref={hLine2Ref} className="block">Across Dubai</span>
          </span>
        </h2>
        <p ref={descRef} className="text-[15px] text-black/45 leading-[1.65] max-w-[520px] tracking-[0.005em]">
          518+ Google Reviews · Verified by Trustindex
        </p>
      </div>

      {/* ── Carousel ── */}
      <div ref={carouselRef}>
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="overflow-x-auto [&::-webkit-scrollbar]:hidden"
          style={{ scrollbarWidth: 'none' }}
        >
          <div
            className="flex"
            style={{
              paddingLeft:  `${padL}px`,
              paddingRight: `${padL}px`,
              gap: `${GAP}px`,
            }}
          >
            {TESTIMONIALS.map(({ initial, name, role, quote }, i) => (
              <div
                key={i}
                className="flex flex-col flex-shrink-0 rounded-2xl bg-[#f8f7f5] p-8 max-md:p-6 transition-opacity duration-300"
                style={{
                  width:     `${cardW}px`,
                  opacity:   i === activeIdx ? 1 : 0.38,
                  minHeight: cardW < 400 ? '280px' : '300px',
                }}
              >
                {/* Stars */}
                <div className="flex gap-0.5 mb-5">
                  {[0,1,2,3,4].map(s => (
                    <span key={s} className="text-[#fbbc04] text-[15px]">★</span>
                  ))}
                </div>

                {/* Quote */}
                <p className="text-[15.5px] text-black leading-[1.65] tracking-[-0.005em] mb-7 flex-1 max-md:text-[14px]">
                  {quote}
                </p>

                {/* Author */}
                <div className="flex items-center gap-3 pt-5 border-t border-black/[0.07]">
                  <div className="w-9 h-9 rounded-full bg-black/10 flex items-center justify-center text-[14px] font-medium text-black/60 flex-shrink-0 uppercase">
                    {initial}
                  </div>
                  <div>
                    <p className="text-[13.5px] text-black font-medium tracking-[0.003em] leading-tight">{name}</p>
                    <p className="text-[11.5px] text-black/40 tracking-[0.003em] leading-snug mt-0.5">{role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Pagination ── */}
      <div ref={paginationRef} className="px-[60px] max-md:px-6 mt-8 flex items-center gap-5">
        <div className="flex items-center gap-[6px]" style={{ width: `${cardW}px` }}>
          {TESTIMONIALS.map((_, i) => (
            <button
              key={i}
              onClick={() => { scrollToCard(i); startTimer() }}
              className="h-[3px] flex-1 rounded-full transition-colors duration-300"
              style={{ backgroundColor: i === activeIdx ? '#0f0e0c' : '#d6d4d2' }}
            />
          ))}
        </div>
        <span className="text-[13px] text-black/38 text-nowrap tracking-[0.01em] tabular-nums">
          {activeIdx + 1} / {TOTAL}
        </span>
      </div>

    </section>
  )
}
