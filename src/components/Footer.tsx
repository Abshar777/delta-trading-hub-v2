'use client'

import { POPUP_EVENT } from './ContactPopup'

const PROGRAMS = [
  'Forex Trading Program',
  'Stock Market Courses',
  'Crypto Trading Course',
  'One-to-One Mentorship',
  'Live Mentorship Program',
  'Blockchain Academy',
]

const COMPANY = [
  'About Us',
  'Our Mentors',
  'KHDA Accreditation',
  'Guinness Record',
  'Reviews',
]

function InstagramIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  )
}

function YoutubeIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path d="M22.54 6.42a2.78 2.78 0 00-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 001.46 6.42 29 29 0 001 12a29 29 0 00.46 5.58 2.78 2.78 0 001.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 001.95-1.96A29 29 0 0023 12a29 29 0 00-.46-5.58z" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
      <polygon points="9.75,15.02 15.5,12 9.75,8.98 9.75,15.02" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"/>
    </svg>
  )
}

function WhatsAppIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

function LinkedInIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6z"/>
      <rect x="2" y="9" width="4" height="12"/>
      <circle cx="4" cy="4" r="2"/>
    </svg>
  )
}

export default function Footer() {
  const triggerPopup = () => window.dispatchEvent(new Event(POPUP_EVENT))

  return (
    <footer className="bg-[#0f0e0c] mx-auto w-[98%] rounded-xl font-nb px-[60px] pt-20 pb-10  max-md:px-6">
      <div className="max-w-[1240px] mx-auto">

        {/* ── Top section ── */}
        <div className="flex justify-between gap-16 pb-16 max-lg:flex-col max-lg:gap-12">

          {/* Brand side */}
          <div className="max-w-[340px]">
            <p className="text-white text-[20px] tracking-[-0.02em] mb-4 leading-tight">
              Delta Trading Academy
            </p>
            <p className="text-[13.5px] text-white/38 leading-[1.7] tracking-[0.003em] mb-8">
              Dubai&apos;s premier forex and financial trading institution. KHDA accredited. Guinness World Record holders — most nationalities in a single trading lesson.
            </p>

            {/* CTA button */}
            <button
              onClick={triggerPopup}
              className="inline-flex items-center gap-2 bg-white text-[#0f0e0c] text-[13.5px] tracking-[0.005em] px-6 py-3 rounded-full hover:bg-white/88 transition-colors"
            >
              Get in touch
              <span className="text-[11px]">→</span>
            </button>

            {/* Contact details */}
            <div className="mt-8 flex flex-col gap-2.5">
              <p className="text-[13px] text-white/35 tracking-[0.003em] leading-[1.55]">
               Metro Station, Corniche One Deira - 7th floor - <br /> Office - 710 Gold Souq - Al Corniche - Deira - Dubai
              </p>
              <a href="tel:+971507528009" className="text-[13px] text-white/35 hover:text-white/60 transition-colors tracking-[0.003em]">
                +971 50 752 8009
              </a>
              <a href="mailto:info@deltainstitutions.com" className="text-[13px] text-white/35 hover:text-white/60 transition-colors tracking-[0.003em]">
                info@deltainstitutions.com
              </a>
            </div>
          </div>

          {/* Nav columns */}
          <div className="flex gap-16 max-md:gap-8 max-md:flex-wrap">

            {/* Programs */}
            <div>
              <p className="text-[11px] text-white/28 tracking-[0.12em] uppercase mb-5">
                Programs
              </p>
              <ul className="flex flex-col gap-3">
                {PROGRAMS.map(l => (
                  <li key={l}>
                    <button
                      onClick={triggerPopup}
                      className="text-[13.5px] text-white/45 hover:text-white transition-colors tracking-[0.003em] text-left"
                    >
                      {l}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company */}
            <div>
              <p className="text-[11px] text-white/28 tracking-[0.12em] uppercase mb-5">
                Company
              </p>
              <ul className="flex flex-col gap-3">
                {COMPANY.map(l => (
                  <li key={l}>
                    <a href="#" className="text-[13.5px] text-white/45 hover:text-white transition-colors tracking-[0.003em]">
                      {l}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

          </div>
        </div>

        {/* ── Divider ── */}
        <div className="h-px bg-white/[0.07]" />

        {/* ── Bottom row ── */}
        <div className="flex flex-col gap-5 pt-8">

          {/* Top: copyright + social + legal */}
          <div className="flex items-center justify-between gap-6 max-md:flex-col max-md:items-start">

            {/* Copyright + legal */}
            <div className="flex items-center gap-4 flex-wrap">
              <p className="text-[12px] text-white/28 tracking-[0.003em]">
                © 2026 Delta Trading Hub. All rights reserved.
              </p>
              <span className="text-white/15">|</span>
              <a href="#" className="text-[12px] text-white/28 hover:text-white/55 transition-colors tracking-[0.003em]">Privacy Policy</a>
              <span className="text-white/15">|</span>
              <a href="#" className="text-[12px] text-white/28 hover:text-white/55 transition-colors tracking-[0.003em]">Terms &amp; Conditions</a>
            </div>

            {/* Social icons */}
            <div className="flex items-center gap-4">
              {[
                { icon: <InstagramIcon />, href: 'https://www.instagram.com/delta_international_institute/', label: 'Instagram' },
                { icon: <YoutubeIcon />,   href: '#', label: 'YouTube' },
                { icon: <WhatsAppIcon />,  href: '#', label: 'WhatsApp' },
                { icon: <LinkedInIcon />,  href: '#', label: 'LinkedIn' },
              ].map(({ icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/30 hover:text-white transition-colors"
                >
                  {icon}
                </a>
              ))}
            </div>

          </div>

          {/* Disclaimer */}
          <p className="text-[11.5px] text-white/20 leading-[1.65] tracking-[0.003em]">
            Trading in financial markets involves risk. Past performance is not indicative of future results. Please trade responsibly.
          </p>

        </div>

      </div>
    </footer>
  )
}
