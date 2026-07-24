'use client'

import { useEffect, useState } from 'react'
import { FaPhoneAlt } from 'react-icons/fa'

const DEFAULT_PHONE = '+971507528009'

export default function CallButton({ phone = DEFAULT_PHONE }: { phone?: string }) {
  /* label pokes out periodically to nudge the visitor to call */
  const [poke, setPoke] = useState(false)

  useEffect(() => {
    const show = () => {
      setPoke(true)
      window.setTimeout(() => setPoke(false), 2800)
    }
    const first = window.setTimeout(show, 3000)      // first nudge shortly after load
    const loop  = window.setInterval(show, 9000)     // then every ~9s
    return () => { window.clearTimeout(first); window.clearInterval(loop) }
  }, [])

  return (
    <a
      href={`tel:${phone}`}
      aria-label="Call our expert now"
      className="group fixed z-[90] right-4 bottom-4 md:right-5 md:bottom-5 flex flex-row-reverse items-center gap-3 font-nb"
    >
      {/* Button */}
      <span className="relative w-[54px] h-[54px] md:w-[58px] md:h-[58px] shrink-0">
        {/* pulsing halo */}
        <span className="absolute inset-0 rounded-full bg-[#0f0e0c] opacity-20 animate-ping" />

        <span className="relative w-full h-full rounded-full bg-[#0f0e0c] text-white flex items-center justify-center
          shadow-[0_12px_34px_-8px_rgba(0,0,0,0.55)] transition-transform duration-300
          group-hover:scale-105 group-active:scale-95 animate-call-shake group-hover:animate-none">
          <FaPhoneAlt className="text-[18px] md:text-[19px]" />

          {/* online / available dot */}
          <span className="absolute top-1 right-1 w-3 h-3 rounded-full bg-[#22c55e] border-2 border-[#0f0e0c]">
            <span className="absolute -inset-[2px] rounded-full bg-[#22c55e]/60 animate-ping" />
          </span>
        </span>
      </span>

      {/* Label — appears on hover and on the periodic nudge */}
      <span
        className={[
          'pointer-events-none whitespace-nowrap rounded-2xl bg-[#0f0e0c] text-white px-4 py-2.5',
          'shadow-[0_12px_34px_-10px_rgba(0,0,0,0.5)] flex flex-col leading-tight origin-right text-right items-end',
          'transition-all duration-300 ease-out',
          poke ? 'opacity-100 translate-x-0 scale-100' : 'opacity-0 translate-x-2 scale-95',
          'group-hover:opacity-100 group-hover:translate-x-0 group-hover:scale-100',
        ].join(' ')}
      >
        <span className="text-[9px] tracking-[0.14em] uppercase text-[#4ade80] flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-[#4ade80]" /> Available now
        </span>
        <span className="text-[13px] tracking-[0.005em] mt-0.5">Talk to our expert</span>
      </span>
    </a>
  )
}
