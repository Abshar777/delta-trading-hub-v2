import Image from 'next/image'

export interface PolicySection {
  heading: string
  paragraphs?: string[]
  bullets?: string[]
}
export interface Policy {
  title: string
  lastUpdated: string
  intro: string
  sections: PolicySection[]
}

const POLICY_LINKS = [
  { label: 'Terms & Conditions', href: '/terms' },
  { label: 'Privacy Policy', href: '/privacy' },
  { label: 'Refund & Cancellation', href: '/refund-policy' },
]

const CONTACT = {
  address: '#412A, 4th Floor, Prestige Towers, Residency Road, Bengaluru, Karnataka 560025, India',
  email: 'info@deltainstitutions.com',
  phone: '+91 91872 36407',
  gst: '29AAJCE53644R1ZP',
}

export default function PolicyLayout({ policy }: { policy: Policy }) {
  return (
    <main className="bg-white font-nb antialiased min-h-[100svh] text-black">
      {/* Top bar */}
      <header className="border-b border-black/[0.07]">
        <div className="max-w-[900px] mx-auto px-6 md:px-8 h-[64px] flex items-center justify-between">
          <a href="/seminar" className="flex items-center select-none">
            <Image src="/logo.png" alt="Delta Trading Academy" width={120} height={36} className="h-7 w-auto object-contain grayscale invert" priority />
          </a>
          <a href="/seminar" className="text-[13px] text-black/50 hover:text-black transition-colors">← Back to seminar</a>
        </div>
      </header>

      {/* Content */}
      <article className="max-w-[760px] mx-auto px-6 md:px-8 py-12 md:py-16">
        <h1 className="text-[30px] md:text-[38px] font-normal tracking-[-0.02em] leading-[1.1] mb-2">{policy.title}</h1>
        <p className="text-[12.5px] text-black/40 mb-8">Last updated: {policy.lastUpdated}</p>
        <p className="text-[15px] text-black/70 leading-[1.75] mb-10">{policy.intro}</p>

        <div className="flex flex-col gap-8">
          {policy.sections.map((s, i) => (
            <section key={i}>
              <h2 className="text-[18px] md:text-[20px] font-normal tracking-[-0.01em] mb-3">
                {i + 1}. {s.heading}
              </h2>
              {s.paragraphs?.map((p, j) => (
                <p key={j} className="text-[14.5px] text-black/65 leading-[1.75] mb-3">{p}</p>
              ))}
              {s.bullets && s.bullets.length > 0 && (
                <ul className="flex flex-col gap-2 mt-1">
                  {s.bullets.map((b, j) => (
                    <li key={j} className="flex items-start gap-2.5 text-[14.5px] text-black/65 leading-[1.7]">
                      <span className="mt-[9px] w-1.5 h-1.5 rounded-full bg-[#d4af37] shrink-0" />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          ))}
        </div>
      </article>

      {/* Footer */}
      <footer className="border-t border-black/[0.07] mt-6">
        <div className="max-w-[900px] mx-auto px-6 md:px-8 py-10">
          <div className="flex flex-col md:flex-row justify-between gap-6">
            <div className="max-w-[360px]">
              <p className="text-[11px] text-black/35 tracking-[0.12em] uppercase mb-3">Delta Trading Academy</p>
              <p className="text-[12.5px] text-black/50 leading-[1.65]">{CONTACT.address}</p>
              <p className="text-[12.5px] text-black/45 mt-2">GST: {CONTACT.gst}</p>
              <a href={`mailto:${CONTACT.email}`} className="text-[12.5px] text-black/55 hover:text-black transition-colors block mt-2">{CONTACT.email}</a>
              <a href={`tel:${CONTACT.phone.replace(/\s/g, '')}`} className="text-[12.5px] text-black/55 hover:text-black transition-colors block">{CONTACT.phone}</a>
            </div>
            <div>
              <p className="text-[11px] text-black/35 tracking-[0.12em] uppercase mb-3">Policies</p>
              <ul className="flex flex-col gap-2">
                {POLICY_LINKS.map(({ label, href }) => (
                  <li key={href}>
                    <a href={href} className="text-[13px] text-black/55 hover:text-black transition-colors">{label}</a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <p className="text-[12px] text-black/30 mt-8">© 2026 Delta Trading Academy. All rights reserved.</p>
        </div>
      </footer>
    </main>
  )
}
