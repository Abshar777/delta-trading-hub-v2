'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/* ─── Institution logo renderers ──────────────────────────── */
function UChicagoLogo() {
  return (
    <div className="flex items-center gap-1.5">
      {/* shield stand-in */}
      <svg width="22" height="28" viewBox="0 0 22 28" fill="none" className="shrink-0 opacity-70">
        <path d="M11 1L1 5v10c0 6 4.5 10.5 10 12 5.5-1.5 10-6 10-12V5L11 1z" fill="#800000" opacity="0.15" stroke="#800000" strokeWidth="1" />
        <text x="11" y="17" textAnchor="middle" fontSize="9" fill="#800000" fontWeight="bold">U</text>
      </svg>
      <div className="text-[7.5px] text-black/55 leading-[1.5] tracking-[0.07em] uppercase font-medium">
        <div>The University of</div>
        <div>Chicago</div>
        <div>Pritzker School</div>
        <div>of Medicine</div>
      </div>
    </div>
  )
}

function UCLALogo() {
  return (
    <span
      className="text-[26px] text-black/50 leading-none"
      style={{ fontFamily: 'Georgia, "Times New Roman", serif', fontStyle: 'italic' }}
    >
      UCLA
    </span>
  )
}

function StanfordLogo() {
  return (
    <div className="text-[8px] text-black/55 leading-[1.5] tracking-[0.07em] uppercase font-medium">
      <div>Stanford</div>
      <div>University</div>
      <div>School of Medicine</div>
    </div>
  )
}

function HarvardLogo() {
  return (
    <div className="text-[8px] text-black/55 leading-[1.5] tracking-[0.07em] uppercase font-medium">
      <div>Harvard</div>
      <div>Medical School</div>
    </div>
  )
}

function ClevelandLogo() {
  return (
    <div className="text-[8px] text-black/55 leading-[1.5] tracking-[0.07em] uppercase font-medium">
      <div>Cleveland Clinic</div>
      <div>Lerner College</div>
      <div>of Medicine</div>
    </div>
  )
}

/* ─── Data ────────────────────────────────────────────────── */
const DOCTORS = [
  {
    img: '/team/m14.png',
    Logo: ClevelandLogo,
    name: 'Praveen Pattroyi',
    role: 'Senior Market Analyst',
    bio: 'SEBI-registered research analyst with 11+ years of experience. Expertise in Commodities, Stocks, and Forex. Mentor at Delta Institutions.',
  },

  {
    img: '/team/m6.png',
    Logo: StanfordLogo,
    name: 'Raghen Selvaraj',
    role: 'Portfolio Management Expert',
    bio: '9 years of trading experience. Expert in discussions, portfolio management, and business development. B.Tech in Finance, Stocks and Forex.',
  },
  {
    img: '/team/m7.png',
    Logo: HarvardLogo,
    name: 'Midlaj Mohammed',
    role: 'Chief Technical Analyst',
    bio: 'World-leading researcher on aging and longevity. Author of Lifespan. Co-Director of the Paul F. Glenn Center.',
  },
  {
    img: '/team/m8.png',
    Logo: ClevelandLogo,
    name: 'Mujeeb Rahman',
    role: 'Forex & Distributed Ledger',
    bio: '6 years of experience in Forex and Distributed Ledger Technology. Chief Technology Developer at Delta. Postgraduate degree in DLT Development from IIT Kanpur.',
  },
  {
    img: '/team/m10.png',
    Logo: ClevelandLogo,
    name: 'Amjad',
    role: 'Chief Financial Mentor',
    bio: 'Chief Financial Skills Analyst with a B.Tech in Automotive Engineering. Expertise in financial markets, patterns, Elliott Waves, and HRDC. 5+ years serving Delta clients.',
  },

  {
    img: '/team/m1.png',
    Logo: UChicagoLogo,
    name: 'Arya Krishnan',
    role: 'Commodity & Gold Specialist',
    bio: 'B.Com graduate with NCFM certification and MBA in Finance. 7 years of experience in the commodity market, especially gold and related derivative segments in India.',
  },
  {
    img: '/team/m3.png',
    Logo: UCLALogo,
    name: 'Libin',
    role: 'Senior Market Mentor',
    bio: 'Senior mentor with 7+ years of trading experience including in Navi from 2019–2021. Specialises in understanding market behaviour and structural analysis.',
  },
]


/* ─── Component ───────────────────────────────────────────── */
export default function DoctorsSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const headingDivRef = useRef<HTMLDivElement>(null)
  const hLineRef = useRef<HTMLSpanElement>(null)
  const subRef = useRef<HTMLParagraphElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {

      // 1. h2 clip reveal — yPercent 108 → 0
      if (hLineRef.current && headingDivRef.current) {
        gsap.fromTo(
          hLineRef.current,
          { yPercent: 108 },
          {
            yPercent: 0,
            duration: 1.1,
            ease: 'expo.out',
            scrollTrigger: {
              trigger: headingDivRef.current,
              start: 'top 86%',
              once: true,
            },
          }
        )
      }

      // 2. Subtext fade + slide up
      if (subRef.current) {
        gsap.fromTo(
          subRef.current,
          { y: 20, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.9,
            ease: 'expo.out',
            scrollTrigger: {
              trigger: subRef.current,
              start: 'top 88%',
              once: true,
            },
          }
        )
      }

      // 3. Scroll track slide in from right + fade
      if (trackRef.current) {
        gsap.fromTo(
          trackRef.current,
          { x: 60, opacity: 0 },
          {
            x: 0,
            opacity: 1,
            duration: 1.1,
            ease: 'expo.out',
            scrollTrigger: {
              trigger: trackRef.current,
              start: 'top 85%',
              once: true,
            },
          }
        )
      }

    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} id="mentors" className="bg-white pt-[100px] pb-16 font-nb overflow-hidden max-md:pt-16">

      {/* Heading */}
      <div ref={headingDivRef} className="px-[60px] max-md:px-6 mb-12 max-md:mb-8">
        <h2 className="text-5xl font-normal mb-2 leading-[1.05] tracking-[-0.03em] text-black max-w-[730px] max-md:text-[34px]">
          <span className="block overflow-hidden">
            <span ref={hLineRef} className="block">Our Mentors</span>
          </span>
        </h2>
        <p ref={subRef} className="text-sm text-black/70 tracking-[0.005em]">
          Our mentoring program connects you with industry professionals
        </p>
      </div>

      {/* Horizontal scroll track */}
      <div ref={trackRef} className="overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <div className="flex gap-5 px-[60px] max-md:px-6 w-fit pb-2">
          {DOCTORS.map(({ img, name, role, bio }) => (
            <div
              key={name}
              className="flex bg-[#f4f3f1] flex-shrink-0 rounded-2xl overflow-hidden
                w-[560px] h-[272px]
                max-md:w-[72vw] max-md:h-auto max-md:flex-col"
            >
              {/* Photo */}
              <div className="relative overflow-hidden rounded-xl flex-shrink-0 bg-[#e8e4df]
                w-[220px]
                max-md:w-full max-md:h-[190px]">
                <Image
                  src={img}
                  alt={name}
                  fill
                  sizes="(max-width: 768px) 72vw, 220px"
                  style={{ objectFit: 'cover', objectPosition: 'center top' }}
                />
              </div>

              {/* Content */}
              <div className="flex-1 flex flex-col justify-center gap-3 p-5 min-w-0 max-md:p-4">

                {/* Name + role */}
                <div>
                  <p className="text-[15px] text-black leading-snug">
                    {name}
                  </p>
                  <p className="text-[12.5px] text-black/45 tracking-[0.003em] leading-snug mt-0.5">
                    {role}
                  </p>
                </div>

                {/* Bio + learn more */}
                <div className="flex flex-col gap-3">
                  <p className="text-[12.5px] text-black/55 leading-[1.6] tracking-[0.003em] max-md:text-[12px]">
                    {bio}
                  </p>
                  <Link
                    href="#"
                    className="text-[13px] text-black underline underline-offset-2 decoration-black/25 hover:decoration-black transition-all w-fit"
                  >
                    Learn more
                  </Link>
                </div>

              </div>
            </div>
          ))}
        </div>
      </div>

    </section>
  )
}
