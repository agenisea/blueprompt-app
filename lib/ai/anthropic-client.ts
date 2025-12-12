import { createAnthropic } from '@ai-sdk/anthropic'

export const anthropic = createAnthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

export const DEFAULT_MODEL = 'claude-opus-4-5-20251101'
