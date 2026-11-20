import type { MetadataRoute } from 'next'
import { BLOG_POSTS } from '@/lib/blog'
import { SITE_URL } from '@/lib/site'

export default function sitemap(): MetadataRoute.Sitemap {
  const latestPost = BLOG_POSTS.reduce((d, p) => (p.modified > d ? p.modified : d), '')
  return [
    { url: SITE_URL, changeFrequency: 'weekly', priority: 1 },
    { url: `${SITE_URL}/seminar`, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${SITE_URL}/blog`, lastModified: latestPost || undefined, changeFrequency: 'weekly', priority: 0.7 },
    ...BLOG_POSTS.map((p) => ({
      url: `${SITE_URL}/blog/${p.slug}`,
      lastModified: p.modified,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    })),
  ]
}
