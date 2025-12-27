import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://makeuslive.com'

  return {
    rules: [
      // Allow all legitimate crawlers
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/admin/',
          '/private/',
          '/search?*',
        ],
      },
      // Googlebot - full access
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: ['/api/', '/admin/', '/private/'],
      },
      // Google Image Bot
      {
        userAgent: 'Googlebot-Image',
        allow: '/',
      },
      // Google Extended - for Gemini AI summaries (ALLOW for AI visibility)
      {
        userAgent: 'Google-Extended',
        allow: '/',
      },
      // Bingbot
      {
        userAgent: 'Bingbot',
        allow: '/',
        disallow: ['/api/', '/admin/', '/private/'],
      },
      // DuckDuckBot
      {
        userAgent: 'DuckDuckBot',
        allow: '/',
        disallow: ['/api/', '/admin/'],
      },
      // Yandex
      {
        userAgent: 'Yandex',
        allow: '/',
        disallow: ['/api/', '/admin/'],
      },
      // ============================================
      // AI BOTS - ALLOW for AI discoverability
      // These bots help your site appear in AI search results
      // ============================================
      // GPTBot - ChatGPT/OpenAI (ALLOW for AI visibility)
      {
        userAgent: 'GPTBot',
        allow: '/',
        disallow: ['/api/', '/admin/', '/private/'],
      },
      // PerplexityBot - Perplexity AI search (ALLOW for AI visibility)
      {
        userAgent: 'PerplexityBot',
        allow: '/',
        disallow: ['/api/', '/admin/', '/private/'],
      },
      // Anthropic Claude (ALLOW for AI visibility)
      {
        userAgent: 'anthropic-ai',
        allow: '/',
        disallow: ['/api/', '/admin/', '/private/'],
      },
      {
        userAgent: 'Claude-Web',
        allow: '/',
        disallow: ['/api/', '/admin/', '/private/'],
      },
      // CCBot - Common Crawl (used by many AI systems)
      {
        userAgent: 'CCBot',
        allow: '/',
        disallow: ['/api/', '/admin/', '/private/'],
      },
      // ============================================
      // Block aggressive SEO bots (they waste bandwidth)
      // ============================================
      {
        userAgent: 'AhrefsBot',
        disallow: '/',
      },
      {
        userAgent: 'SemrushBot',
        disallow: '/',
      },
      {
        userAgent: 'MJ12bot',
        disallow: '/',
      },
      {
        userAgent: 'DotBot',
        disallow: '/',
      },
      {
        userAgent: 'BLEXBot',
        disallow: '/',
      },
      // Block spam scrapers
      {
        userAgent: 'PetalBot',
        disallow: '/',
      },
      {
        userAgent: 'Bytespider',
        disallow: '/',
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
