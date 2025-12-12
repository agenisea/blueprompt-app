import type { Metadata } from 'next'
import { BluepromptPage } from '@/components/blueprompt/blueprompt-page'

export const metadata: Metadata = {
  title: 'Blueprompt — No-Code App & Agent Prompt Creator',
  description:
    'Create structured prompts for no-code apps and agentic AI systems. Paste into v0, Lovable, or Replit to kick-start your build.',
  openGraph: {
    title: 'Blueprompt — No-Code App & Agent Prompt Creator',
    description:
      'Create structured prompts for no-code apps and agentic AI systems. Paste into v0, Lovable, or Replit to kick-start your build.',
    type: 'website',
  },
}

export default function Home() {
  return <BluepromptPage />
}
