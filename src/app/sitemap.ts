import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://signaturefor.me'

  // Main static pages
  const routes = [
    '',
    '/about',
    '/blog',
    '/contact',
    '/careers',
    '/login',
    '/legal/privacy',
    '/legal/terms',
    '/legal/cookies',
    '/legal/license',
  ]

  // Get blog posts (if they exist)
  // In the future, you can make this dynamic by reading from the database
  const blogPosts: string[] = [
    '/blog/how-to-create-professional-email-signature-gmail-outlook-2026',
    '/blog/how-to-create-professional-email-signature-5-minutes-2026',
    '/blog/free-email-signature-create-professional-signature-30-seconds-2025',
    '/blog/email-signature-best-practices-10-mistakes-costing-opportunities-2026',
  ]

  const sitemap: MetadataRoute.Sitemap = [
    // Homepage - highest priority
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
  ]

  // Other main pages
  for (const route of routes) {
    if (route === '') continue; // Already added above
    
    const changeFreq: MetadataRoute.Sitemap[number]['changeFrequency'] = 
      route === '/blog' ? 'daily' : 'weekly';
    
    sitemap.push({
      url: `${baseUrl}${route}`,
      lastModified: new Date(),
      changeFrequency: changeFreq,
      priority: route === '/blog' || route === '/about' ? 0.9 : 0.8,
    })
  }

  // Blog posts
  for (const post of blogPosts) {
    sitemap.push({
      url: `${baseUrl}${post}`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    })
  }

  return sitemap
}

