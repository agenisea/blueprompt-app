import type { Metadata, Viewport } from 'next'
import { Inter, DM_Sans } from 'next/font/google'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import { WEBSITE_URL } from '@/lib/blueprompt/constants'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-dm-sans',
})

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || WEBSITE_URL),
  title: {
    default: 'Blueprompt',
    template: '%s | Blueprompt',
  },
  description: 'Turn a single idea into a no-code app blueprint and agentic prompt.',
  alternates: {
    canonical: '/',
  },
  icons: {
    icon: [
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
    ],
    shortcut: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
  openGraph: {
    title: 'Blueprompt',
    description: 'Turn a single idea into a no-code app blueprint and agentic prompt.',
    type: 'website',
    url: WEBSITE_URL,
    siteName: 'Blueprompt',
    locale: 'en_US',
    images: [
      {
        url: `${WEBSITE_URL}/opengraph-image?v=1`,
        width: 1200,
        height: 630,
        alt: 'Blueprompt — No-Code App & Agent Prompt Creator',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Blueprompt',
    description: 'Turn a single idea into a no-code app blueprint and agentic prompt.',
    images: [`${WEBSITE_URL}/opengraph-image?v=1`],
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${inter.variable} ${dmSans.variable} ${GeistSans.variable} ${GeistMono.variable}`}
    >
      <body className="font-sans antialiased">{children}</body>
    </html>
  )
}
