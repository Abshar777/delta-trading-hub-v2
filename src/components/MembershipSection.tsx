'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { POPUP_EVENT } from './ContactPopup'

gsap.registerPlugin(ScrollTrigger)

const FEATURES = [
  { label: 'Guinness World Record',       desc: 'Officially' },
  { label: 'KHDA Accreditation',         desc: "Officially" },
  // { label: 'Broker Independent',             desc: 'Our own broker' },
  { label: 'SEBI Registered Mentor',      desc: '' },
  { label: 'Proprietary Strategies',        desc: 'Exclusive' },
  { label: 'Exclusive Signal Groups',           desc: 'Daily' },
  { label: 'Lifetime Community Access',   desc: 'Lifetime' },
  { label: 'Gann Astro Program',        desc: 'Exclusive' },
  { label: 'Loss Recovery Support',            desc: 'Available' },
  { label: 'Multilingual Mentors',    desc: '5+ languages' },
  { label: '16-hour Daily Class Window',       desc: '' },
]

export default function MembershipSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const subtitleRef = useRef<HTMLParagraphElement>(null)
  const headingRef = useRef<HTMLSpanElement>(null)
  const featuresRef = useRef<HTMLDivElement>(null)
  const ctaRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // 1. Subtitle — fade + slide up
      gsap.from(subtitleRef.current, {
        y: 16,
        opacity: 0,
        duration: 0.8,
        ease: 'expo.out',
        scrollTrigger: {
          trigger: subtitleRef.current,
          start: 'top 88%',
          once: true,
        },
      })

      // 2. Heading — clip reveal (yPercent)
      gsap.from(headingRef.current, {
        yPercent: 108,
        duration: 1.1,
        ease: 'expo.out',
        scrollTrigger: {
          trigger: headingRef.current,
          start: 'top 86%',
          once: true,
        },
      })

      // 3. Feature rows — stagger children
      if (featuresRef.current) {
        const rows = featuresRef.current.children
        gsap.from(rows, {
          y: 20,
          opacity: 0,
          duration: 0.7,
          ease: 'expo.out',
          stagger: 0.045,
          scrollTrigger: {
            trigger: featuresRef.current,
            start: 'top 85%',
            once: true,
          },
        })
      }

      // 4. CTA button — fade + slide + scale
      gsap.from(ctaRef.current, {
        y: 20,
        opacity: 0,
        scale: 0.96,
        duration: 0.9,
        ease: 'expo.out',
        scrollTrigger: {
          trigger: ctaRef.current,
          start: 'top 92%',
          once: true,
        },
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} id="membership" className="bg-white py-20 px-6 font-nb">
      <div className="max-w-[600px] mx-auto flex flex-col items-center">

        {/* Subtitle */}
        

        {/* Heading */}
        <h2 className="text-5xl font-normal tracking-[-0.03em] text-black text-center mb-5 max-md:text-4xl overflow-hidden">
          <span ref={headingRef} className="block leading-[1.04]">What Sets Delta&nbsp;Apart</span>
        </h2>
        <p ref={subtitleRef} className="text-sm text-black/70 tracking-[0.005em] mb-12">
          Your membership includes so much more.
        </p>

        {/* Feature rows */}
        <div ref={featuresRef} className="w-full flex flex-col gap-[3px]">
          {FEATURES.map(({ label, desc },i) => (
            <div
              key={label}
              className={["flex items-center justify-between gap-6  rounded-xl px-5 py-3",
               (!!(i%2))?(" bg-[#f5f4f2]/0"):("bg-[#f5f4f2]")
              ].join(" ")}
            >
              <span className="text-[15px] text-black tracking-[0.003em] leading-snug shrink-0">
                {label}
              </span>
              {desc && (
                <span className="text-[14px] text-black/40 tracking-[0.003em] leading-snug text-right">
                  {desc}
                </span>
              )}
            </div>
          ))}
        </div>

        {/* CTA */}
        <button
          ref={ctaRef}
          onClick={() => window.dispatchEvent(new Event(POPUP_EVENT))}
          className="mt-12 bg-[#0f0e0c] text-white text-[15px] tracking-[0.005em] px-9 py-[15px] rounded-full transition-all hover:bg-[#2a2825] hover:-translate-y-px"
        >
          Become a member
        </button>

      </div>
    </section>
  )
}
