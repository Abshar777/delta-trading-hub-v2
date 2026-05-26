'use client'

import { useState } from 'react'
import { POPUP_EVENT } from './ContactPopup'

const FAQS = [
  {
    q: 'What is the best forex trading course in Dubai?',
    a: 'Delta Trading Academy offers Dubai\'s most comprehensive forex trading course, covering everything from technical analysis and charting to risk management, trading psychology, and live trade execution. Endorsed by KHDA and backed by a Guinness World Record, we are widely regarded as the best trading institute in Dubai. Our programs cater to all levels — from complete beginners to advanced traders looking to sharpen their edge.',
  },
  {
    q: 'How long does the forex trading training in Dubai take?',
    a: 'Course duration varies by program. Our flagship Forex Trading Program typically runs 6–8 weeks with weekend-intensive and weekday-flexible options. One-to-One Mentorship is fully customisable and can be completed at your own pace. The Live Mentorship Program is an ongoing subscription with daily access. Contact us for a personalised course roadmap based on your availability and goals.',
  },
  {
    q: 'Do I need prior experience to join a trading course in Dubai?',
    a: 'No prior experience is required. Our forex trading classes in Dubai are designed for all levels. Beginners receive structured foundational modules covering market basics, how currencies and stocks work, and how to open and manage trades. Experienced traders can join advanced modules covering institutional trading strategies, ICT concepts, and portfolio management.',
  },
  {
    q: 'Are your trading classes in Dubai available online?',
    a: 'Yes. Delta Trading Academy offers both in-person classes at our Dubai campus (Al Nahda) and fully online trading courses for students across the UAE and internationally. Our online trading courses in Dubai include live video sessions, recorded modules, and real-time mentorship access — making it easy to learn from anywhere.',
  },
  {
    q: 'What is the fee for the forex trading course in Dubai?',
    a: 'Course fees vary depending on the program and format chosen. We offer flexible payment options and instalment plans. To get the most accurate and up-to-date pricing, book a free consultation session with one of our advisors — they\'ll help you find the best program for your budget and goals. Call us at +971 50 752 8009 or fill in the form above.',
  },
  {
    q: 'Is forex trading legal in Dubai, UAE?',
    a: 'Yes, forex trading is legal in the UAE and is regulated by the Securities and Commodities Authority (SCA) and the Dubai Financial Services Authority (DFSA). Retail forex trading through regulated brokers is permitted. Delta Trading Academy educates students on how to trade legally and responsibly through compliant, regulated platforms. We always encourage due diligence and trading only with regulated brokers.',
  },
]

export default function FAQSection() {
  const [open, setOpen] = useState<number | null>(null)
  const trigger = () => window.dispatchEvent(new Event(POPUP_EVENT))

  return (
    <section id="faq" className="bg-white py-24 px-[60px] font-nb max-md:px-6">
      <div className="max-w-[1240px] mx-auto">

        {/* ── Two-column layout ── */}
        <div className="grid grid-cols-[1fr_1.2fr] gap-20 max-lg:grid-cols-1 max-lg:gap-14">

          {/* ── Left: heading ── */}
          <div className="max-lg:max-w-[560px]">
            <p className="text-[13px] text-black/40 tracking-[0.12em] uppercase mb-4">
              FAQ
            </p>
            <h2 className="text-[48px] font-normal leading-[1.05] tracking-[-0.03em] text-black mb-6 max-md:text-[34px]">
              Frequently<br />asked questions
            </h2>
            <p className="text-[15px] text-black/45 leading-[1.7] tracking-[0.003em] mb-10 max-w-[380px]">
              Everything you need to know about our programs, enrollment process, and what to expect as a Delta student.
            </p>
            <button
              onClick={trigger}
              className="inline-flex items-center gap-2 text-[14px] text-black tracking-[0.005em] border-b border-black/20 pb-px hover:border-black transition-all hover:gap-3"
            >
              Still have questions? Get in touch
              <span className="text-[11px]">→</span>
            </button>
          </div>

          {/* ── Right: accordion ── */}
          <div>
            {/* Top border */}
            <div className="h-px bg-black/[0.07]" />

            {FAQS.map(({ q, a }, i) => (
              <div key={i} className="border-b border-black/[0.07]">

                {/* Question row */}
                <button
                  className="w-full flex items-start justify-between gap-6 py-5 text-left group"
                  onClick={() => setOpen(open === i ? null : i)}
                >
                  <span className={[
                    'text-[15.5px] leading-snug tracking-[-0.005em] transition-colors duration-200',
                    open === i ? 'text-black' : 'text-black/70 group-hover:text-black',
                  ].join(' ')}>
                    {q}
                  </span>
                  <span
                    className={[
                      'flex-shrink-0 mt-0.5 w-6 h-6 rounded-full border border-black/[0.15] flex items-center justify-center text-black/50 text-[16px] leading-none transition-all duration-200',
                      open === i ? 'rotate-45 border-black/30 text-black' : 'group-hover:border-black/25',
                    ].join(' ')}
                  >
                    +
                  </span>
                </button>

                {/* Answer — animated via max-height */}
                <div
                  style={{
                    maxHeight: open === i ? '400px' : '0',
                    overflow: 'hidden',
                    transition: 'max-height 0.32s cubic-bezier(0.4,0,0.2,1)',
                  }}
                >
                  <p className="text-[14px] text-black/50 leading-[1.72] tracking-[0.003em] pb-6 pr-10">
                    {a}
                  </p>
                </div>

              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  )
}
