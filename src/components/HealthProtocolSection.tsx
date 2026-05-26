'use client'

import Image from 'next/image'
import { useState, useRef, useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const STEPS = [
  { n: '01', label: 'Our Awwards' },
  { n: '02', label: 'Why choose delta' },
  { n: '03', label: 'Who We Are  ', active: true },
  { n: '04', label: 'What Sets Delta Apart' },
]

const FAQS = [
  {
    q: 'KHDA Accredited Programs',
    a: 'Fully accredited forex trading courses in Dubai meeting international education standards.',
  },
  {
    q: "Live Market Trading Sessions",
    a: 'Practice in real market conditions with live data, real-time analysis, and guided trade execution.',
  },
  {
    q:"Global Trading Community",
    a:"Join a diverse community of traders from 50+ nationalities across Dubai, India, Malaysia, UK, and Bahrain."
  }
]

export default function HealthProtocolSection() {
  const [open, setOpen] = useState<number | null>(null)

  const line1Ref = useRef<HTMLSpanElement>(null)
  const line2Ref = useRef<HTMLSpanElement>(null)
  const descRef = useRef<HTMLParagraphElement>(null)
  const stepNavRef = useRef<HTMLDivElement>(null)
  const faqsRef = useRef<HTMLDivElement>(null)
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // 1. Heading line 1 — clip reveal: yPercent 108 → 0
      if (line1Ref.current) {
        gsap.from(line1Ref.current, {
          yPercent: 108,
          duration: 1.1,
          ease: 'expo.out',
          scrollTrigger: {
            trigger: line1Ref.current,
            start: 'top 85%',
            once: true,
          },
        })
      }

      // 2. Heading line 2 — same clip reveal, stagger 0.12s after line 1
      if (line2Ref.current) {
        gsap.from(line2Ref.current, {
          yPercent: 108,
          duration: 1.1,
          ease: 'expo.out',
          delay: 0.12,
          scrollTrigger: {
            trigger: line2Ref.current,
            start: 'top 85%',
            once: true,
          },
        })
      }

      // 3. Description paragraph — y: 24, opacity: 0 → in
      if (descRef.current) {
        gsap.from(descRef.current, {
          y: 24,
          opacity: 0,
          duration: 1.1,
          ease: 'expo.out',
          scrollTrigger: {
            trigger: descRef.current,
            start: 'top 88%',
            once: true,
          },
        })
      }

      // 4. Step nav container — stagger each child from x: 24, opacity: 0
      if (stepNavRef.current) {
        gsap.from(stepNavRef.current.children, {
          x: 24,
          opacity: 0,
          duration: 1.0,
          ease: 'expo.out',
          stagger: 0.1,
          scrollTrigger: {
            trigger: stepNavRef.current,
            start: 'top 85%',
            once: true,
          },
        })
      }

      // 5. FAQ items container — stagger each child from y: 28, opacity: 0
      if (faqsRef.current) {
        gsap.from(faqsRef.current.children, {
          y: 28,
          opacity: 0,
          duration: 1.0,
          ease: 'expo.out',
          stagger: 0.1,
          scrollTrigger: {
            trigger: faqsRef.current,
            start: 'top 88%',
            once: true,
          },
        })
      }
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} id="about" className="relative mx-2 mb-10 rounded-xl min-h-[98vh] bg-black font-nb overflow-hidden">

      {/* Background photo */}
      <div className="absolute w-full max-md:blur-[2px] max-md:opacity-50 h-full bg-red-900">
        <Image
        src="/4thsection.png"
        alt=""
        width={500}
        height={500}
        className='h-full w-full'
        priority

        style={{ objectFit: 'cover', objectPosition: 'center top' }}
      />
      </div>

      {/* Left-side overlay to darken text area */}
      <div
        className="absolute inset-0 z-[1]"
        style={{
          background: 'linear-gradient(to right, rgba(10,8,6,0.72) 0%, rgba(10,8,6,0.48) 38%, rgba(10,8,6,0.10) 62%, transparent 80%)',
        }}
      />
      {/* Bottom overlay */}
      <div className="absolute inset-0 z-[1] bg-gradient-to-t from-black/40 via-transparent to-transparent" />

      {/* Main content */}
      <div className="relative z-[2] min-h-[98vh] flex flex-col px-[60px] pt-[130px] pb-[80px] max-md:px-6 max-md:pt-[100px] max-md:pb-[60px]">

        {/* Top row: left heading + right step nav */}
        <div className="flex flex-1 justify-between">

          {/* Left: heading + subtext */}
          <div className="flex flex-col max-w-[480px] max-md:max-w-full">
            <h2 className="text-[52px] font-normal leading-[1.05] tracking-[-0.03em] text-white mb-5 max-md:text-[38px]">
              <span className="block overflow-hidden">
                <span ref={line1Ref} className="block">Learn. Analyze.</span>
              </span>
              <span className="block overflow-hidden">
                <span ref={line2Ref} className="block">Trade like a pro</span>
              </span>
            </h2>
            <p ref={descRef} className="text-[15.5px] leading-[1.65] text-white/55 max-w-[390px] tracking-[0.005em]">
             Delta Trading Academy is Dubai's premier forex and financial trading institution, proudly holding the Guinness World Record for the most nationalities in a single trading lesson.
            </p>
          </div>

          {/* Right: numbered step nav */}
          <div ref={stepNavRef} className="flex flex-col gap-[18px] justify-start pt-2 max-md:hidden">
            {STEPS.map(({ n, label, active }) => (
              <div
                key={n}
                className={[
                  'flex items-center gap-4',
                  active ? 'text-white' : 'text-white/30',
                ].join(' ')}
              >
                {active
                  ? <span className="w-px h-5 bg-white/50 shrink-0" />
                  : <span className="w-px h-5 shrink-0" />}
                <span className="text-[14px] tracking-[0.005em] leading-none">{label}</span>
                <span className="text-[13px] tabular-nums ml-1">{n}</span>
              </div>
            ))}
          </div>

        </div>

        {/* Bottom: FAQ accordions */}
        <div ref={faqsRef} className="flex flex-col gap-3 max-w-[530px] mt-auto pt-12">
          {FAQS.map(({ q, a }, i) => (
            <div
              key={i}
              className="rounded-[14px] bg-white/[0.07] backdrop-blur-md border border-white/[0.10] overflow-hidden"
            >
              <button
                className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left"
                onClick={() => setOpen(open === i ? null : i)}
              >
                <span className="text-[14.5px] text-white/80 tracking-[0.005em] leading-snug">{q}</span>
                <span
                  className={[
                    'shrink-0 w-7 h-7 rounded-full border border-white/[0.18] flex items-center justify-center text-white/60 text-[18px] leading-none transition-transform duration-200',
                    open === i ? 'rotate-45' : '',
                  ].join(' ')}
                >
                  +
                </span>
              </button>
              {open === i && (
                <div className="px-5 pb-5 text-[14px] text-white/45 leading-[1.65] tracking-[0.003em]">
                  {a}
                </div>
              )}
            </div>
          ))}
        </div>

      </div>

      {/* Bottom-right floating CTAs */}


    </section>
  )
}
