import Image from 'next/image'
import Link from 'next/link'

const FOOTER_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'Blog', href: '/blog' },
  { label: 'Terms & Conditions', href: '/terms' },
  { label: 'Privacy Policy', href: '/privacy' },
  { label: 'Refund & Cancellation', href: '/refund-policy' },
]

/* Shared header + footer for blog pages (server component). */
export default function BlogShell({ children }: { children: React.ReactNode }) {
  return (
    <main className="bg-white font-nb antialiased min-h-[100svh] text-black">
      <header className="border-b border-black/[0.07]">
        <div className="max-w-[900px] mx-auto px-6 md:px-8 h-[64px] flex items-center justify-between">
          <Link href="/" className="flex items-center select-none" aria-label="Delta Trading Academy — home">
            <Image src="/logo.png" alt="Delta Trading Academy" width={120} height={36} className="h-7 w-auto object-contain grayscale invert" priority />
          </Link>
          <nav className="flex items-center gap-6 text-[13px] text-black/50">
            <Link href="/blog" className="hover:text-black transition-colors">Blog</Link>
            <Link href="/" className="hover:text-black transition-colors">← Back to home</Link>
          </nav>
        </div>
      </header>

      {children}

      <footer className="border-t border-black/[0.07] mt-6">
        <div className="max-w-[900px] mx-auto px-6 md:px-8 py-10">
          <p className="text-[11px] text-black/35 tracking-[0.12em] uppercase mb-3">Delta Trading Academy</p>
          <ul className="flex flex-wrap gap-x-6 gap-y-2">
            {FOOTER_LINKS.map(({ label, href }) => (
              <li key={href}>
                <Link href={href} className="text-[13px] text-black/55 hover:text-black transition-colors">{label}</Link>
              </li>
            ))}
          </ul>
          <p className="text-[12px] text-black/40 leading-[1.65] mt-8">
            Delta Trading Academy is an educational institution and does not provide financial advice or brokerage services.
          </p>
          <p className="text-[12px] text-black/30 mt-3">© 2026 Delta Trading Academy. All rights reserved.</p>
        </div>
      </footer>
    </main>
  )
}
