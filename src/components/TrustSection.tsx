'use client'

import Image from 'next/image'
import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const logos = [
  { file: 'money conclave file.png', alt: 'Money Conclave', width: 130, height: 28 },
  { file: 'guinness.png',            alt: 'Guiness',        width: 130, height: 28 },
  { file: '698d2df3c7923087d292811f_Vector 2.svg', alt: 'UCSF', width: 96, height: 24 },
]

export default function TrustSection() {
  const sectionRef  = useRef<HTMLElement>(null)
  const avatarRef   = useRef<HTMLDivElement>(null)
  const logosRef    = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {

      /* ── Avatar + label row ── */
      gsap.from(avatarRef.current, {
        y: 30,
        opacity: 0,
        duration: 1.0,
        ease: 'expo.out',
        scrollTrigger: {
          trigger: avatarRef.current,
          start: 'top 88%',
          once: true,
        },
      })

      /* ── Logo items — stagger each child in ── */
      if (logosRef.current) {
        gsap.from(logosRef.current.children, {
          y: 28,
          opacity: 0,
          duration: 0.9,
          ease: 'expo.out',
          stagger: 0.09,
          scrollTrigger: {
            trigger: logosRef.current,
            start: 'top 90%',
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
      className="bg-white px-10 py-16 flex flex-col items-center gap-8 font-nb max-md:px-6 max-md:py-10 max-md:gap-6"
    >

      {/* Avatars + label */}
      <div ref={avatarRef} className="flex items-center gap-3 flex-wrap justify-center">
        <div className="flex -space-x-2.5">
          {[
            { bg: '#c8b8a2', initials: 'DR' },
            { bg: '#a89080', initials: 'MD' },
            { bg: '#d4c4b0', initials: 'SC' },
          ].map(({ bg, initials }) => (
            <div
              key={initials}
              className="w-8 h-8 rounded-full border-2 border-white flex items-center justify-center text-[10px] font-medium text-white/80 shrink-0"
              style={{ backgroundColor: bg }}
            >
              {initials}
            </div>
          ))}
        </div>
        <p className="text-[14px] text-black/55 tracking-[0.005em] max-md:text-[13px] max-md:text-center">
          Created by professional Forex &amp; Crypto experts
        </p>
      </div>

      {/* Institution logos */}
      <div
        ref={logosRef}
        className="flex items-center justify-center flex-wrap gap-x-10 gap-y-5 max-md:gap-x-7 max-md:gap-y-4"
      >
        {logos.map(({ file, alt, width, height }) => (
          <Image
            key={alt}
            src={`/logos/${file}`}
            alt={alt}
            width={500}
            height={500}
            className="opacity-70 grayscale  max-md:w-[5rem]"
            style={{ objectFit: 'contain' }}
          />
        ))}
        {/* Oxford — text mark */}
        <div className="opacity-25 flex flex-col items-center leading-none">
          <span className="text-[9px] tracking-[0.18em] text-black/80 uppercase">University of</span>
          <span className="text-[15px] tracking-[0.04em] text-black font-medium" style={{ fontFamily: 'Georgia, serif' }}>Oxford</span>
        </div>
      </div>

    </section>
  )
}
