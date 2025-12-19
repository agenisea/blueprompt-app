import { MetadataRoute } from 'next'
import { WEBSITE_URL } from '@/lib/utils/constants'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || WEBSITE_URL

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/claude-code`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
  ]
}
