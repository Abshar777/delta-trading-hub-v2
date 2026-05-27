'use client'

import Image from 'next/image'
import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const STEPS = [
  {
    n: 1,
    img: '/how-it-works/15.png',
    title: 'Proven Track Record',
    desc: 'Thousands of students trained, many now full-time traders.',
  },
  {
    n: 2,
    img: '/how-it-works/3.png',
    title: 'Global Mentors',
    desc: 'Learn from recognized experts in Forex, Crypto, and Market Analysis.',
  },
  {
    n: 3,
    img: '/how-it-works/10.png',
    title: 'Flexible Learning',
    desc: 'Attend classes online or offline, wherever you are',
  },
  {
    n: 4,
    img: '/how-it-works/14.png',
    title: 'Community Support',
    desc: 'Join a thriving global network of traders and investors.',
  },
]

export default function HowItWorksSection() {
  const sectionRef     = useRef<HTMLElement>(null)
  const headingLineRef = useRef<HTMLSpanElement>(null)
  const descRef        = useRef<HTMLParagraphElement>(null)
  const cardsRef       = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {

      /* ── Heading — clip reveal from overflow:hidden wrapper ── */
      gsap.from(headingLineRef.current, {
        yPercent: 108,
        duration: 1.1,
        ease: 'expo.out',
        scrollTrigger: {
          trigger: headingLineRef.current,
          start: 'top 88%',
          once: true,
        },
      })

      /* ── Description fades up ── */
      gsap.from(descRef.current, {
        y: 22,
        opacity: 0,
        duration: 0.95,
        ease: 'expo.out',
        scrollTrigger: {
          trigger: descRef.current,
          start: 'top 90%',
          once: true,
        },
      })

      /* ── Cards — stagger up with subtle scale ── */
      if (cardsRef.current) {
        gsap.from(cardsRef.current.children, {
          y: 64,
          opacity: 0,
          scale: 0.97,
          duration: 1.1,
          ease: 'expo.out',
          stagger: 0.11,
          scrollTrigger: {
            trigger: cardsRef.current,
            start: 'top 84%',
            once: true,
          },
        })
      }

    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      id="how-it-works"
      className="bg-white pt-24 pb-20 md:px-[60px]  mb-10 font-nb max-md:pt-7 max-md:pb-14 max-md:px-5"
    >
      <div className="max-w-[1240px] mx-auto">

        {/* Heading */}
        <div className="text-center mb-14 max-md:mb-10">

          {/* Clip-reveal wrapper */}
          <div className="overflow-hidden inline-block mb-3">
            <h2
              className="text-[38px] font-normal tracking-[-0.025em] text-black leading-[1.1] max-md:text-[28px]"
            >
              <span ref={headingLineRef} className="block">
                Why choose delta
              </span>
            </h2>
          </div>

          <p
            ref={descRef}
            className="text-[15px] text-black/45 tracking-[0.005em] leading-relaxed max-w-[480px] mx-auto max-md:text-[14px] max-md:max-w-[300px]"
          >
            Delta Company traders provide expert guidance to help you master Forex trading.
          </p>
        </div>

        {/* 4-column card grid */}
        <div
          ref={cardsRef}
          className="grid grid-cols-4 gap-5 max-lg:grid-cols-2 max-lg:gap-4 max-md:gap-3"
        >
          {STEPS.map(({ n, img, title, desc }) => (
            <div key={n} className="flex flex-col gap-3.5">

              {/* Card image */}
              <div
                className="relative md:rounded-2xl rounded-xl overflow-hidden bg-[#f4f3f1] w-full"
                style={{ aspectRatio: '3/3.8' }}
              >
                <Image
                  src={img}
                  alt={title}
                  fill
                  sizes="(max-width: 768px) 50vw, 25vw"
                  style={{ objectFit: 'cover', objectPosition: 'center center' }}
                />
                {/* Number badge */}
                <div className="absolute top-3.5 left-3.5 z-10 w-7 h-7 rounded-full bg-white/75 backdrop-blur-sm flex items-center justify-center text-[13px] text-black/60 leading-none">
                  {n}
                </div>
              </div>

              {/* Text */}
              <div className="flex flex-col gap-1.5 px-0.5">
                <h3 className="text-[15.5px] font-normal tracking-[-0.01em] text-black leading-snug max-md:text-[14.5px]">
                  {title}
                </h3>
                <p className="text-[13.5px] leading-[1.6] text-black/40 tracking-[0.003em] max-md:text-[12px]">
                  {desc}
                </p>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  )
}
