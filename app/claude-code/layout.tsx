import type { Metadata } from 'next'
import { WEBSITE_URL } from '@/lib/blueprompt/constants'

export const metadata: Metadata = {
  title: {
    absolute: 'Blueprompt — Claude Code Integration',
  },
  description: 'Run Blueprompt directly from your terminal as a Claude Code slash command. Create structured app blueprints and agent prompts without leaving your workflow.',
  authors: [{ name: 'Patrick Peña', url: 'https://www.linkedin.com/in/ppenasb/' }],
  creator: 'Patrick Peña',
  publisher: 'Agenisea™',
  alternates: {
    canonical: '/claude-code',
  },
  openGraph: {
    title: 'Blueprompt — Claude Code Integration',
    description: 'Run Blueprompt directly from your terminal as a Claude Code slash command. Create structured app blueprints and agent prompts without leaving your workflow.',
    type: 'article',
    url: `${WEBSITE_URL}/claude-code`,
    publishedTime: '2025-12-12T00:00:00.000Z',
    authors: ['Patrick Peña'],
    images: [
      {
        url: `${WEBSITE_URL}/opengraph-image?v=1`,
        width: 1200,
        height: 630,
        alt: 'Blueprompt — Claude Code Integration',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Blueprompt — Claude Code Integration',
    description: 'Run Blueprompt directly from your terminal as a Claude Code slash command. Create structured app blueprints and agent prompts without leaving your workflow.',
    images: [`${WEBSITE_URL}/opengraph-image?v=1`],
  },
}

export default function ClaudeCodeLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
