import type { Metadata } from 'next'
import { SITE_URL } from '@/lib/site'

/* Supplies metadataBase so the blog pages' relative canonical / OpenGraph
   URLs resolve to the real domain. */
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
}

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return children
}
