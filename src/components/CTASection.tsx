'use client'

import Image from 'next/image'
import { useState } from 'react'
import { POPUP_EVENT } from './ContactPopup'

const PROGRAMS = [
  { label: 'Forex Trading Program',  href: '#courses' },
  { label: 'Stock Market Courses',   href: '#courses' },
  { label: 'Crypto Trading Course',  href: '#courses' },
  { label: 'One-to-One Mentorship',  href: '#courses' },
  { label: 'Live Mentorship Program',href: '#courses' },
  { label: 'Blockchain Academy',     href: '#courses' },
]

const COMPANY = [
  { label: 'About Us',            href: '#about'      },
  { label: 'Our Mentors',         href: '#mentors'    },
  { label: 'KHDA Accreditation',  href: '#about'      },
  { label: 'Guinness Record',     href: '#about'      },
  { label: 'Reviews',             href: '#reviews'    },
]

function InstagramIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  )
}
function YoutubeIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
      <path d="M22.54 6.42a2.78 2.78 0 00-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 001.46 6.42 29 29 0 001 12a29 29 0 00.46 5.58 2.78 2.78 0 001.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 001.95-1.96A29 29 0 0023 12a29 29 0 00-.46-5.58z" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
      <polygon points="9.75,15.02 15.5,12 9.75,8.98 9.75,15.02" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"/>
    </svg>
  )
}
function WhatsAppIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
      <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}
function LinkedInIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6z"/>
      <rect x="2" y="9" width="4" height="12"/>
      <circle cx="4" cy="4" r="2"/>
    </svg>
  )
}

const SOCIALS = [
  { icon: <InstagramIcon />, href: 'https://www.instagram.com/delta_international_institute/', label: 'Instagram' },
  { icon: <YoutubeIcon />,   href: '#', label: 'YouTube' },
  { icon: <WhatsAppIcon />,  href: '#', label: 'WhatsApp' },
  { icon: <LinkedInIcon />,  href: '#', label: 'LinkedIn' },
]

export default function CTASection() {
  const [email, setEmail] = useState('')
  const trigger = () => window.dispatchEvent(new Event(POPUP_EVENT))

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    trigger()
  }

  return (
    <section className="mx-2 mb-4  max-md:bg-black  overflow-hidden rounded-t-2xl font-nb overflow-hidden relative">

      {/* ── Background image ── */}
      <Image
        src="/hero.png"
        alt="Delta Trading Academy"
        fill
        priority
        sizes="100vw"
        className='max-md:hidden'
        style={{ objectFit: 'cover', objectPosition: 'center top' }}
      />

      {/* Dark overlay — lighter in middle, darker top & bottom */}
      <div
        className="absolute max-md:hidden inset-0 z-[1]"
        style={{
          background: 'linear-gradient(to bottom, rgba(10,8,6,0.82) 0%, rgba(10,8,6,0.60) 45%, rgba(10,8,6,0.82) 75%, rgba(10,8,6,0.96) 100%)',
        }}
      />

      {/* ════════════════════════════════════════ */}
      {/* ── Dark CTA block ──                    */}
      {/* ════════════════════════════════════════ */}
      <div className="relative z-[2] flex flex-col items-center text-center px-[60px] pt-28 pb-24 max-md:px-6 max-md:pt-20 max-md:pb-20">

        <p className="text-[11.5px] text-white/45 tracking-[0.12em] uppercase mb-7">
          Delta Trading Academy · Dubai
        </p>

        <h2 className="text-[70px] font-normal leading-[1.0] tracking-[-0.04em] text-white max-w-[680px] mb-7 max-md:text-[42px]">
          Start trading<br />with confidence.
        </h2>

        <p className="text-[15.5px] text-white/50 leading-[1.7] max-w-[420px] tracking-[0.003em] mb-11">
          Join thousands of traders who have transformed their skills with Dubai's most accredited trading institution.
        </p>

        <button
          onClick={trigger}
          className="inline-flex items-center gap-2.5 bg-white text-[#0f0e0c] text-[15px] tracking-[0.005em] px-9 py-[17px] rounded-full hover:bg-white/90 transition-all hover:-translate-y-px active:scale-[0.98]"
        >
          Enroll Now
          <span className="text-[12px]">→</span>
        </button>

        <p className="text-[12.5px] text-white/28 tracking-[0.005em] mt-8">
          KHDA Accredited &nbsp;·&nbsp; Guinness World Record &nbsp;·&nbsp; 518+ Google Reviews
        </p>

      </div>

      {/* ════════════════════════════════════════ */}
      {/* ── White footer card ──                 */}
      {/* ════════════════════════════════════════ */}
      <div className="relative z-[2] w-[98%] mx-auto mb-2 bg-white rounded-lg">
        <div className="max-w-[1240px] mx-auto px-[60px] pt-14 pb-10 max-md:px-6">

          {/* ── Top row: brand + nav ── */}
          <div className="flex justify-between gap-16 pb-12 max-lg:flex-col max-lg:gap-12">

            {/* Brand + email CTA */}
            <div className="max-w-[340px]">
              <p className="text-[19px] text-black tracking-[-0.02em] mb-3 leading-tight">
                Delta Trading Hub
              </p>
              <p className="text-[13.5px] text-black/40 leading-[1.7] tracking-[0.003em] mb-6">
                Not sure where to start? Get in touch with our team and we'll help you find the right course for your goals.
              </p>

              {/* Email input row */}
              <form onSubmit={handleEmailSubmit} className="flex gap-2">
                <input
                  type="email"
                  placeholder="Your email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="flex-1 min-w-0 border border-black/[0.12] rounded-full px-4 py-2.5 text-[13.5px] text-black placeholder:text-black/30 outline-none focus:border-black/30 transition-colors bg-white"
                />
                <button
                  type="submit"
                  className="flex-shrink-0 bg-[#0f0e0c] text-white text-[13px] tracking-[0.005em] px-5 py-2.5 rounded-full hover:bg-[#2a2825] transition-colors"
                >
                  Get started
                </button>
              </form>

              {/* Contact details */}
              <div className="mt-8 flex flex-col gap-2">
                <p className="text-[12.5px] text-black/35 leading-[1.6]">
                  One Delta Shopping Mall, 2nd Floor,<br />Al Nahda, Dubai, UAE
                </p>
                <a href="tel:+971507528009" className="text-[12.5px] text-black/35 hover:text-black/60 transition-colors">
                  +971 50 752 8009
                </a>
                <a href="mailto:info@deltainstitutions.com" className="text-[12.5px] text-black/35 hover:text-black/60 transition-colors">
                  info@deltainstitutions.com
                </a>
              </div>
            </div>

            {/* Nav columns */}
            <div className="flex gap-16 max-md:gap-8 max-md:flex-wrap">

              <div>
                <p className="text-[11px] text-black/28 tracking-[0.12em] uppercase mb-5">Programs</p>
                <ul className="flex flex-col gap-3">
                  {PROGRAMS.map(({ label, href }) => (
                    <li key={label}>
                      <a
                        href={href}
                        className="text-[13.5px] text-black/50 hover:text-black transition-colors tracking-[0.003em]"
                      >
                        {label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <p className="text-[11px] text-black/28 tracking-[0.12em] uppercase mb-5">Company</p>
                <ul className="flex flex-col gap-3">
                  {COMPANY.map(({ label, href }) => (
                    <li key={label}>
                      <a
                        href={href}
                        className="text-[13.5px] text-black/50 hover:text-black transition-colors tracking-[0.003em]"
                      >
                        {label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

            </div>
          </div>

          {/* ── Divider ── */}
          <div className="h-px bg-black/[0.07]" />

          {/* ── Bottom row ── */}
          <div className="flex flex-col gap-4 pt-7">

            <div className="flex items-center justify-between gap-6 max-md:flex-col max-md:items-start">

              {/* Copyright + legal */}
              <div className="flex items-center gap-4 flex-wrap">
                <p className="text-[12px] text-black/28 tracking-[0.003em]">
                  © 2026 Delta Trading Hub. All rights reserved.
                </p>
                <span className="text-black/15">|</span>
                <a href="#" className="text-[12px] text-black/28 hover:text-black/55 transition-colors">Privacy Policy</a>
                <span className="text-black/15">|</span>
                <a href="#" className="text-[12px] text-black/28 hover:text-black/55 transition-colors">Terms &amp; Conditions</a>
              </div>

              {/* Social icons */}
              <div className="flex items-center gap-4">
                {SOCIALS.map(({ icon, href, label }) => (
                  <a
                    key={label}
                    href={href}
                    aria-label={label}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-black/30 hover:text-black transition-colors"
                  >
                    {icon}
                  </a>
                ))}
              </div>

            </div>

            {/* Disclaimer */}
            <p className="text-[11.5px] text-black/22 leading-[1.65] tracking-[0.003em]">
              Trading in financial markets involves risk. Past performance is not indicative of future results. Please trade responsibly.
            </p>

          </div>

        </div>
      </div>

    </section>
  )
}
