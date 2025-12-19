import { MetadataRoute } from 'next'
import { WEBSITE_URL } from '@/lib/utils/constants'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || WEBSITE_URL

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: '/api/',
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
