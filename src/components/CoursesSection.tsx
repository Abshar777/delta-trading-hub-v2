'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { POPUP_EVENT } from './ContactPopup'

gsap.registerPlugin(ScrollTrigger)

/* ─── Minimal line icons (stroke = currentColor) ──────────── */
type IconProps = { className?: string }

function ForexIcon({ className }: IconProps) {
  return (
    <svg className={className} width="22" height="22" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 9a8 8 0 0 1 13.4-3.5L20 8" />
      <path d="M20 3.5V8h-4.5" />
      <path d="M20 15a8 8 0 0 1-13.4 3.5L4 16" />
      <path d="M4 20.5V16h4.5" />
    </svg>
  )
}
function StockIcon({ className }: IconProps) {
  return (
    <svg className={className} width="22" height="22" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 21h18" />
      <rect x="4.5" y="10.5" width="3" height="7.5" rx="0.6" />
      <path d="M6 7.5v3M6 18v2.2" />
      <rect x="10.5" y="6.5" width="3" height="11.5" rx="0.6" />
      <path d="M12 3.5v3M12 18v2.2" />
      <rect x="16.5" y="12.5" width="3" height="5.5" rx="0.6" />
      <path d="M18 9.5v3M18 18v2.2" />
    </svg>
  )
}
function CryptoIcon({ className }: IconProps) {
  return (
    <svg className={className} width="22" height="22" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <ellipse cx="12" cy="6" rx="7.5" ry="3" />
      <path d="M4.5 6v6c0 1.66 3.36 3 7.5 3s7.5-1.34 7.5-3V6" />
      <path d="M4.5 12v6c0 1.66 3.36 3 7.5 3s7.5-1.34 7.5-3v-6" />
    </svg>
  )
}
function MentorIcon({ className }: IconProps) {
  return (
    <svg className={className} width="22" height="22" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="8" r="3.8" />
      <path d="M4.5 20.5c0-3.9 3.4-6.8 7.5-6.8s7.5 2.9 7.5 6.8" />
    </svg>
  )
}
function LiveIcon({ className }: IconProps) {
  return (
    <svg className={className} width="22" height="22" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="2.4" />
      <path d="M7.7 7.7a6 6 0 0 0 0 8.6M16.3 16.3a6 6 0 0 0 0-8.6" />
      <path d="M4.8 4.8a10 10 0 0 0 0 14.4M19.2 19.2a10 10 0 0 0 0-14.4" />
    </svg>
  )
}
function BlockchainIcon({ className }: IconProps) {
  return (
    <svg className={className} width="22" height="22" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="6.5" height="6.5" rx="1.6" />
      <rect x="14.5" y="3" width="6.5" height="6.5" rx="1.6" />
      <rect x="8.75" y="14.5" width="6.5" height="6.5" rx="1.6" />
      <path d="M9.5 6.25h5M6.25 9.5v1.5a2 2 0 0 0 2 2h1.25M17.75 9.5v1.5a2 2 0 0 1-2 2H14.5" />
    </svg>
  )
}

function CheckIcon({ className }: IconProps) {
  return (
    <svg className={className} width="13" height="13" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 6 9 17l-5-5" />
    </svg>
  )
}

/* ─── Course data ─────────────────────────────────────────── */
const COURSES = [
  {
    n: '01',
    Icon: ForexIcon,
    title: 'Forex Trading Program',
    desc: 'Our flagship forex course. Master technical analysis, risk management, trading psychology, and live execution strategies — guided by mentors with proven, audited track records.',
    tags: ['Beginner to Advanced', 'Live Sessions', 'Certificate'],
    cta: 'Enroll Now',
    featured: true,
    highlights: ['Technical analysis', 'Risk management', 'Live execution'],
  },
  {
    n: '02',
    Icon: StockIcon,
    title: 'Stock Market Courses',
    desc: 'Master equity markets with fundamental analysis, portfolio management, and long-term investment strategy across global exchanges.',
    tags: ['NSE / BSE / NYSE', 'Portfolio Building'],
    cta: 'Enroll Now',
  },
  {
    n: '03',
    Icon: CryptoIcon,
    title: 'Crypto Trading Course',
    desc: 'A complete cryptocurrency program covering blockchain fundamentals, DeFi strategies, altcoin analysis, and risk-controlled portfolio management.',
    tags: ['BTC / ETH / Altcoins', 'DeFi & Web3'],
    cta: 'Enroll Now',
  },
  {
    n: '04',
    Icon: MentorIcon,
    title: 'One-to-One Mentorship',
    desc: 'Personalised mentorship shaped around your skill level, goals, and schedule — working directly with a senior trader for accelerated growth.',
    tags: ['Customised Plan', 'Flexible Schedule'],
    cta: 'Book Session',
  },
  {
    n: '05',
    Icon: LiveIcon,
    title: 'Live Mentorship Program',
    desc: 'Trade alongside mentors in real time. Daily setups, live market analysis, and voice rooms to sharpen execution under real conditions.',
    tags: ['Daily Signals', 'Live Trade Room'],
    cta: 'Get Access',
  },
  {
    n: '06',
    Icon: BlockchainIcon,
    title: 'Blockchain Academy',
    desc: 'Go beyond trading and understand the technology shaping the future — smart contracts, tokenomics, NFT markets, and Web3 investment fundamentals.',
    tags: ['Smart Contracts', 'Web3 Investing'],
    cta: 'Learn More',
    wide: true,
  },
]

const ADVISORS = [
  { bg: '#c8b8a2', initials: 'PP' },
  { bg: '#a89080', initials: 'RS' },
  { bg: '#d4c4b0', initials: 'MM' },
]

const triggerPopup = () => window.dispatchEvent(new Event(POPUP_EVENT))

export default function CoursesSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const eyebrowRef = useRef<HTMLParagraphElement>(null)
  const hLine1Ref  = useRef<HTMLSpanElement>(null)
  const hLine2Ref  = useRef<HTMLSpanElement>(null)
  const descRef    = useRef<HTMLParagraphElement>(null)
  const dividerRef = useRef<HTMLDivElement>(null)
  const gridRef    = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(eyebrowRef.current,
        { y: 16, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.8, ease: 'expo.out',
          scrollTrigger: { trigger: eyebrowRef.current, start: 'top 88%', once: true },
        })

      gsap.fromTo(hLine1Ref.current,
        { yPercent: 108 },
        {
          yPercent: 0, duration: 1.1, ease: 'expo.out',
          scrollTrigger: { trigger: hLine1Ref.current, start: 'top 86%', once: true },
        })

      gsap.fromTo(hLine2Ref.current,
        { yPercent: 108 },
        {
          yPercent: 0, duration: 1.1, delay: 0.1, ease: 'expo.out',
          scrollTrigger: { trigger: hLine1Ref.current, start: 'top 86%', once: true },
        })

      gsap.fromTo(descRef.current,
        { y: 22, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.9, ease: 'expo.out',
          scrollTrigger: { trigger: descRef.current, start: 'top 88%', once: true },
        })

      gsap.fromTo(dividerRef.current,
        { scaleX: 0 },
        {
          scaleX: 1, transformOrigin: 'left center', duration: 1.2, ease: 'expo.out',
          scrollTrigger: { trigger: dividerRef.current, start: 'top 90%', once: true },
        })

      if (gridRef.current) {
        gsap.fromTo(gsap.utils.toArray(gridRef.current.children),
          { y: 56, opacity: 0, scale: 0.97 },
          {
            y: 0, opacity: 1, scale: 1, stagger: 0.08, duration: 1.0, ease: 'expo.out',
            scrollTrigger: { trigger: gridRef.current, start: 'top 82%', once: true },
          })
      }
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} id="courses" className="bg-white py-24 px-[60px] font-nb max-md:px-6 max-md:py-14">
      <div className="max-w-[1240px] mx-auto">

        {/* ── Header ── */}
        <div className="mb-12 max-md:mb-9">
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
        <div ref={dividerRef} className="h-px bg-black/[0.07] mb-8 max-md:mb-6" />

        {/* ── Bento course grid ── */}
        <div
          ref={gridRef}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-md:gap-3.5 items-stretch"
        >
          {COURSES.map(({ n, Icon, title, desc, tags, cta, featured, wide, highlights }) => {

            /* ── Featured flagship card (dark) ── */
            if (featured) {
              return (
                <div
                  key={n}
                  className="group relative overflow-hidden rounded-[22px] bg-[#0f0e0c] p-9 max-md:p-7
                    flex flex-col sm:col-span-2 lg:col-span-2 min-h-[300px]"
                >
                  {/* warm glow + watermark */}
                  {/* <div
                    className="absolute inset-0 pointer-events-none"
                    style={{ background: 'radial-gradient(120% 120% at 88% 0%, rgba(212,175,55,0.12), transparent 55%)' }}
                  /> */}
                  <span className="absolute -bottom-10 right-3 text-[180px] leading-none text-white/[0.035] tracking-tight select-none pointer-events-none max-md:text-[120px]">
                    {n}
                  </span>

                  <div className="relative z-[1] flex items-center justify-between mb-7">
                    {/* <div className="w-12 h-12 rounded-[14px] bg-white/[0.07] border border-white/[0.10] flex items-center justify-center text-white">
                      <Icon />
                    </div> */}
                    <span className="inline-flex items-center gap-1.5 text-[11px] text-white/70 tracking-[0.10em] uppercase bg-white/[0.06] border border-white/[0.10] px-3 py-1.5 rounded-full">
                      {/* <span className="w-1.5 h-1.5 rounded-full bg-[#d4af37]" /> */}
                      Flagship Program
                    </span>
                  </div>

                  <div className="relative z-[1] flex-1 flex flex-col max-w-[560px]">
                    <h3 className="text-[27px] max-md:text-[23px] font-normal tracking-[-0.02em] text-white leading-[1.12] mb-3.5">
                      {title}
                    </h3>
                    <p className="text-[14px] text-white/55 leading-[1.7] tracking-[0.003em] mb-6 max-md:text-[13.5px]">
                      {desc}
                    </p>

                    {/* highlights */}
                    {highlights && (
                      <div className="flex flex-wrap gap-x-6 gap-y-2.5 mb-8 max-md:mb-7">
                        {highlights.map(h => (
                          <span key={h} className="inline-flex items-center gap-2 text-[13px] text-white/75 tracking-[0.003em]">
                            <span className="text-[#d4af37]"><CheckIcon /></span>
                            {h}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="mt-auto flex items-center gap-4 flex-wrap">
                      <button
                        onClick={triggerPopup}
                        className="inline-flex items-center gap-2 bg-white text-[#0f0e0c] text-[13.5px] tracking-[0.005em] px-6 py-[13px] rounded-full transition-all hover:-translate-y-px active:scale-[0.98]"
                      >
                        {cta}
                        <span className="text-[11px] transition-transform group-hover:translate-x-0.5">→</span>
                      </button>
                      <div className="flex flex-wrap gap-2">
                        {tags.map(tag => (
                          <span key={tag} className="text-[11.5px] text-white/55 tracking-[0.02em] bg-white/[0.05] border border-white/[0.08] px-3 py-1.5 rounded-full">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )
            }

            /* ── Standard surface card (light) ── */
            return (
              <div
                key={n}
                className={[
                  'group relative flex flex-col rounded-[22px] bg-[#f5f4f1] border border-black/[0.04] p-7 max-md:p-6',
                  'transition-all duration-300 ease-out hover:-translate-y-1 hover:bg-[#f0efeb]',
                  'hover:shadow-[0_18px_50px_-20px_rgba(0,0,0,0.18)]',
                  wide ? 'sm:col-span-2 lg:col-span-2' : '',
                ].join(' ')}
              >
                {/* top row: icon chip + number */}
                <div className="flex items-start justify-between mb-6">
                  {/* <div className="w-11 h-11 rounded-[13px] bg-white border border-black/[0.06] flex items-center justify-center text-black/75 transition-colors duration-300 group-hover:bg-[#0f0e0c] group-hover:text-white group-hover:border-[#0f0e0c]">
                    <Icon />
                  </div> */}
                  <span className="text-[12.5px] text-black/25 tracking-[0.06em] tabular-nums pt-1">
                    {n}
                  </span>
                </div>

                <h3 className="text-[18px] font-normal tracking-[-0.01em] text-black leading-snug mb-2.5 max-md:text-[17px]">
                  {title}
                </h3>

                <p className="text-[13.5px] text-black/45 leading-[1.68] tracking-[0.003em] flex-1 mb-5 max-md:text-[13px] max-w-[460px]">
                  {desc}
                </p>

                {/* tags */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {tags.map(tag => (
                    <span key={tag} className="text-[11.5px] text-black/50 tracking-[0.02em] bg-white border border-black/[0.06] px-3 py-1 rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>

                {/* CTA */}
                <button
                  onClick={triggerPopup}
                  className="inline-flex items-center gap-1.5 text-[13.5px] text-black tracking-[0.005em] w-fit border-b border-black/20 pb-px transition-all hover:border-black hover:gap-2.5 group-hover:gap-2.5 mt-auto"
                >
                  {cta}
                  <span className="text-[11px] transition-transform group-hover:translate-x-0.5">→</span>
                </button>
              </div>
            )
          })}

          {/* ── Advisor card — human, humble closing note ── */}
          <div className="group relative flex flex-col justify-between rounded-[22px] bg-white border border-black/[0.10] p-7 max-md:p-6 transition-all duration-300 hover:border-black/[0.20] hover:shadow-[0_18px_50px_-20px_rgba(0,0,0,0.14)]">
            <div>
              <div className="flex -space-x-2.5 mb-6">
                {ADVISORS.map(({ bg, initials }) => (
                  <div
                    key={initials}
                    className="w-9 h-9 rounded-full border-2 border-white flex items-center justify-center text-[10px] font-medium text-white/85 shrink-0"
                    style={{ backgroundColor: bg }}
                  >
                    {initials}
                  </div>
                ))}
              </div>
              <h3 className="text-[18px] font-normal tracking-[-0.01em] text-black leading-snug mb-2.5">
                Not sure which course fits you?
              </h3>
              <p className="text-[13.5px] text-black/45 leading-[1.68] tracking-[0.003em] mb-6 max-md:text-[13px]">
                Book a free, no-pressure consultation. Our mentors will understand your goals and guide you to the right path.
              </p>
            </div>
            <button
              onClick={triggerPopup}
              className="inline-flex items-center justify-center gap-2 bg-[#0f0e0c] text-white text-[13.5px] tracking-[0.005em] px-6 py-[13px] rounded-full w-fit transition-all hover:bg-[#2a2825] hover:-translate-y-px active:scale-[0.98]"
            >
              Talk to an advisor
              <span className="text-[11px] transition-transform group-hover:translate-x-0.5">→</span>
            </button>
          </div>

        </div>
      </div>
    </section>
  )
}
