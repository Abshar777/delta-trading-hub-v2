/* Registry of blog posts — drives the /blog index and the sitemap. */
export interface BlogPost {
  slug: string
  title: string
  description: string
  /** ISO date (YYYY-MM-DD) */
  published: string
  modified: string
}

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: 'best-forex-trading-courses-dubai',
    title: 'Best Forex Trading Courses in Dubai (2026): An Honest Comparison',
    description:
      'Compare forex trading courses in Dubai for 2026: format, course length and who each suits, plus red flags to avoid before you pay.',
    published: '2026-11-20',
    modified: '2026-11-20',
  },
]
