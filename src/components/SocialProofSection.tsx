'use client'

import { useRef } from 'react'

/* ── Play button overlay ───────────────────────────────────── */
function PlayBtn() {
  return (
    <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
      <div className="w-12 h-12 rounded-full bg-white/25 backdrop-blur-[2px] flex items-center justify-center border border-white/30">
        <svg width="16" height="18" viewBox="0 0 16 18" fill="white">
          <path d="M1 1.5v15L15 9 1 1.5z" />
        </svg>
      </div>
    </div>
  )
}

/* ── Verified badge ────────────────────────────────────────── */
function Verified() {
  return (
    <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-[#3897f0] shrink-0">
      <svg width="8" height="7" viewBox="0 0 8 7" fill="white">
        <path d="M1 3.5L3 5.5L7 1.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
      </svg>
    </span>
  )
}

/* ── Bottom gradient overlay for dark cards ────────────────── */
function DarkGrad() {
  return (
    <div
      className="absolute inset-0 z-[1]"
      style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.18) 45%, transparent 70%)' }}
    />
  )
}

/* ── Card data ─────────────────────────────────────────────── */
const CARDS = [
  {
    type: 'social-static',
    bg: '#b85c38',
    w: 205,
    // woman smiling, no play
  },
  {
    type: 'social-static',
    bg: '#8b3d22',
    w: 200,
    // phone post
  },
  {
    type: 'social-video',
    bg: '#2c2420',
    w: 215,
    handle: '@avnibarman_',
    followers: '406k',
    hasPlay: true,
  },
  {
    type: 'press-quote',
    bg: '#edecea',
    w: 270,
    personBg: '#c8c4bf',
    quote: '"Everyone deserves to understand what\'s happening in their body without a medical degree"',
    publication: 'Forbes',
  },
  {
    type: 'press-article',
    bg: '#5c2c14',
    w: 235,
    title: 'SoulCycle Teams With Superpower To Integrate Biomarker Testing',
    publication: 'Athletech',
  },
  {
    type: 'social-video',
    bg: '#1a1818',
    w: 235,
    handle: '@stefarmstead',
    followers: '104k',
    hasPlay: true,
  },
  {
    type: 'press-article',
    bg: '#c8b09a',
    w: 235,
    title: 'I felt "fine"—but my bloodwork told a different story & inflammation played a huge role',
    publication: 'yahoo!',
  },
]

const CARD_H = 362

export default function SocialProofSection() {
  const trackRef = useRef<HTMLDivElement>(null)

  return (
    <section className="bg-white pt-20 pb-16 font-nb">

      {/* Heading */}
      <div className="px-[60px] max-md:px-6 mb-14">
        <h2 className="text-[52px] font-normal leading-[1.05] tracking-[-0.03em] text-black max-w-[680px] max-md:text-[36px]">
          Used by athletes, doctors, and members just like you
        </h2>
      </div>

      {/* ── Card track — flush to viewport edges ── */}
      <div
        ref={trackRef}
        className="overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        <div className="flex gap-3 w-fit">
          {CARDS.map((card, i) => {

            /* ── Social video card ───────────────── */
            if (card.type === 'social-video') return (
              <div
                key={i}
                className="relative flex-shrink-0 rounded-2xl overflow-hidden cursor-pointer"
                style={{ width: card.w, height: CARD_H, background: card.bg }}
              >
                {card.hasPlay && <PlayBtn />}
                <DarkGrad />
                {/* Bottom info */}
                <div className="absolute bottom-4 left-4 right-4 z-[2] flex flex-col gap-1">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[13px] text-white font-medium tracking-[0.003em]">{card.handle}</span>
                    <Verified />
                  </div>
                  <span className="text-[12px] text-white/65 tracking-[0.003em]">{card.followers} followers</span>
                </div>
              </div>
            )

            /* ── Static social image card ─────────── */
            if (card.type === 'social-static') return (
              <div
                key={i}
                className="relative flex-shrink-0 rounded-2xl overflow-hidden cursor-pointer"
                style={{ width: card.w, height: CARD_H, background: card.bg }}
              >
                <DarkGrad />
              </div>
            )

            /* ── Press quote card (Forbes) ────────── */
            if (card.type === 'press-quote') return (
              <div
                key={i}
                className="relative flex-shrink-0 rounded-2xl overflow-hidden flex flex-col"
                style={{ width: card.w, height: CARD_H, background: card.bg }}
              >
                {/* Top: person photo placeholder */}
                <div
                  className="flex-1 w-full"
                  style={{ background: card.personBg }}
                />
                {/* Bottom: quote + logo */}
                <div className="flex flex-col justify-between px-5 pt-4 pb-5 bg-[#edecea]" style={{ minHeight: '155px' }}>
                  <p className="text-[13.5px] text-black/75 leading-[1.55] tracking-[0.003em]">
                    {card.quote}
                  </p>
                  <span
                    className="text-[20px] text-black/80 mt-3 block"
                    style={{ fontFamily: 'Georgia, serif', fontWeight: 700 }}
                  >
                    Forbes
                  </span>
                </div>
              </div>
            )

            /* ── Press article card (Athletech, Yahoo) ── */
            if (card.type === 'press-article') return (
              <div
                key={i}
                className="relative flex-shrink-0 rounded-2xl overflow-hidden cursor-pointer"
                style={{ width: card.w, height: CARD_H, background: card.bg }}
              >
                <DarkGrad />
                {/* Bottom content */}
                <div className="absolute bottom-4 left-4 right-4 z-[2] flex flex-col gap-2.5">
                  <p className="text-[13.5px] text-white leading-[1.5] tracking-[0.003em]">
                    {card.title}
                  </p>
                  {/* Publication logo */}
                  {card.publication === 'Athletech' && (
                    <div className="flex items-center gap-[3px]">
                      <span className="text-[14px] text-white font-bold tracking-[-0.01em]" style={{ fontFamily: 'Georgia, serif' }}>
                        A<span className="text-white/60 text-[10px] align-super">th</span>|etch
                      </span>
                      <span className="text-[8px] text-white/55 uppercase tracking-[0.08em] ml-0.5 leading-none">NEWS</span>
                    </div>
                  )}
                  {card.publication === 'yahoo!' && (
                    <span className="text-[17px] text-white font-bold" style={{ fontFamily: 'Georgia, serif' }}>
                      yahoo<span className="text-[#7B68EE]">!</span>
                    </span>
                  )}
                </div>
              </div>
            )

            return null
          })}
        </div>
      </div>

      {/* Scroll progress bar */}
      <div className="px-[60px] max-md:px-6 mt-6">
        <div className="h-[2px] bg-black/10 rounded-full max-w-[480px]">
          <div className="h-full w-1/3 bg-black/40 rounded-full" />
        </div>
      </div>

    </section>
  )
}
