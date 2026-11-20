import type { Metadata } from 'next'
import Link from 'next/link'
import BlogShell from '@/components/BlogShell'
import { BLOG_POSTS } from '@/lib/blog'
import { SITE_NAME } from '@/lib/site'

const DESCRIPTION =
  'Guides and honest comparisons on learning forex and trading in Dubai, from Delta Trading Academy.'

export const metadata: Metadata = {
  title: `Blog · ${SITE_NAME}`,
  description: DESCRIPTION,
  alternates: { canonical: '/blog' },
  openGraph: { title: `Blog · ${SITE_NAME}`, description: DESCRIPTION, url: '/blog', siteName: SITE_NAME, type: 'website' },
  robots: { index: true, follow: true },
}

const fmt = (iso: string) =>
  new Date(iso + 'T00:00:00Z').toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' })

export default function BlogIndexPage() {
  const posts = [...BLOG_POSTS].sort((a, b) => b.published.localeCompare(a.published))
  return (
    <BlogShell>
      <section className="max-w-[760px] mx-auto px-6 md:px-8 py-12 md:py-16">
        <h1 className="text-[30px] md:text-[42px] font-normal tracking-[-0.025em] leading-[1.1] mb-3">Blog</h1>
        <p className="text-[15.5px] text-black/60 leading-[1.75] mb-10">{DESCRIPTION}</p>

        <ul className="flex flex-col">
          {posts.map((p) => (
            <li key={p.slug} className="border-t border-black/[0.08] py-7 first:border-t-0 first:pt-0">
              <p className="text-[12.5px] text-black/40 mb-2">
                <time dateTime={p.published}>{fmt(p.published)}</time>
              </p>
              <h2 className="text-[21px] md:text-[24px] font-normal tracking-[-0.015em] leading-[1.25] mb-2">
                <Link href={`/blog/${p.slug}`} className="hover:underline underline-offset-4">{p.title}</Link>
              </h2>
              <p className="text-[15px] text-black/60 leading-[1.7]">{p.description}</p>
            </li>
          ))}
        </ul>
      </section>
    </BlogShell>
  )
}
