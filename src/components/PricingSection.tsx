import Image from 'next/image'
import Link from 'next/link'

function CheckIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="8" r="7.5" fill="#0f0e0c" stroke="#0f0e0c" />
      <path d="M4.5 8L6.5 10L11.5 5.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function SmallCheck() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path d="M2.5 7L5.5 10L11.5 4" stroke="#0f0e0c" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function CalendarIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <rect x="1.5" y="2.5" width="13" height="12" rx="2" stroke="#0f0e0c" strokeWidth="1.2" />
      <path d="M1.5 6h13" stroke="#0f0e0c" strokeWidth="1.2" />
      <path d="M5 1.5v2M11 1.5v2" stroke="#0f0e0c" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  )
}

const FEATURES = [
  "Comprehensive Forex Trading Course in Dubai",
"Learn Technical Analysis & Market Structure",
"Master Risk Management Strategies",
"Improve Trading Psychology & Discipline",
"Advanced Chart Reading Techniques",
"Live Trade Execution Training",
"Guidance from Expert Trading Mentors",
"Proven Real-World Trading Strategies",
"Beginner to Advanced Level Training",
"Interactive Live Sessions",
"Industry-Recognized Certificate Program",
 
]

const TRUST = [
  { icon: <CheckIcon />,    label: 'HSA/ FSA eligible' },
  { icon: <SmallCheck />,   label: 'Cancel anytime' },
  { icon: <CalendarIcon />, label: 'Results in a week' },
]

export default function PricingSection() {
  return (
    <section className="bg-white py-20 px-[60px] font-nb max-md:px-6">
      <div className="max-w-[1240px] mx-auto grid md:grid-cols-2  gap-20 max-md:flex-col max-md:gap-10">

        {/* ── Left: phone image ── */}
        <div className="relative w-full flex-shrink-0 max-md:w-full h-full  " >
          <Image
            src="/pricing.avif"
            alt="Superpower app"
            fill
            priority
            
            className="rounded-[20px] h-full object-cover object-top"
          />
        </div>

        {/* ── Right: content ── */}
        <div className="flex-1 flex flex-col min-w-0">

  <p className="text-[16px] text-black/55 tracking-[0.003em] mb-2">
           Our Trading  Courses in Dubai
          </p>
          {/* Heading */}
          <h2 className="text-[52px] font-normal leading-[1.05] tracking-[-0.03em] text-black mb-4 max-md:text-[36px]">
        Forex Trading Program
<br />
          </h2>

          {/* Subtitle */}
        

          {/* Feature list */}
          <ul className="flex flex-col gap-[10px] mb-8">
            {FEATURES.map((f) => (
              <li key={f} className="flex items-center gap-2.5 text-[15px] text-black tracking-[0.003em]">
                <span className="text-black/40 text-[18px] leading-none">·</span>
                {f}
              </li>
            ))}
          </ul>

          {/* Price */}
        

          {/* CTA button */}
          <Link
            href="#"
            className="w-full flex items-center justify-center bg-[#0f0e0c] text-white text-[15.5px] tracking-[0.005em] py-[17px] rounded-xl mb-5 transition-all hover:bg-[#2a2825]"
          >
            Get started
          </Link>

          {/* Trust badges */}
          <div className="flex items-center justify-center gap-6 mb-4 flex-wrap">
            {TRUST.map(({ icon, label }) => (
              <div key={label} className="flex items-center gap-1.5">
                {icon}
                <span className="text-[13px] text-black/65 tracking-[0.003em]">{label}</span>
              </div>
            ))}
          </div>

          {/* Fine print */}
          <p className="text-[12px] text-black/35 text-center tracking-[0.003em]">
            * Pricing may vary for members in New York and New Jersey
          </p>

        </div>
      </div>
    </section>
  )
}
