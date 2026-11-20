import type { MetadataRoute } from 'next'
import { SITE_URL } from '@/lib/site'

/* Everything stays crawlable (as it was before this file existed). The AI
   search / answer-engine crawlers are listed explicitly so the intent is clear. */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: '*', allow: '/' },
      {
        userAgent: ['GPTBot', 'OAI-SearchBot', 'ChatGPT-User', 'PerplexityBot', 'ClaudeBot', 'Google-Extended'],
        allow: '/',
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  }
}
