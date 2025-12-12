import { describe, it, expect, vi, beforeEach } from 'vitest'
import type { BluepromptInput } from '@/types/blueprompt'

// Mock the AI SDK
vi.mock('ai', () => ({
  generateText: vi.fn(),
  streamText: vi.fn(),
}))

// Mock the anthropic client
vi.mock('@/lib/ai/anthropic-client', () => ({
  anthropic: vi.fn(() => 'mock-model'),
  DEFAULT_MODEL: 'claude-sonnet-4-20250514',
}))

// Mock retry to execute immediately without delays
vi.mock('@/lib/resilience/retry', () => ({
  retryWithJitter: vi.fn((fn) => fn()),
}))

import { generateText, streamText } from 'ai'
import {
  buildUserMessage,
  extractSection,
  buildBluepromptOutput,
  createBlueprompt,
  createBluepromptStreaming,
} from '@/lib/blueprompt/creator'

const validInput: BluepromptInput = {
  appIdea: 'A habit tracking app that helps users build better daily routines',
  primaryUsers: 'Busy professionals who want to improve their habits',
  goal: 'Help users stick to their habits consistently',
  constraints: 'Solo founder, limited budget',
  targetBuilder: 'v0',
}

const mockFullPrompt = `# Full Blueprompt

### Core Concept
A habit tracking app...

### Core Flows
1. User creates habit
2. User tracks progress

---

## App-Only Prompt

You are an expert front-end engineer.
Build a habit tracking app with the following screens...

---

## Agent-Only Prompt

You are HabitCoach, a friendly assistant that helps users build habits.
Your personality: encouraging, supportive.`

describe('buildUserMessage', () => {
  it('builds message with all fields', () => {
    const message = buildUserMessage(validInput)

    expect(message).toContain('appIdea: A habit tracking app')
    expect(message).toContain('primaryUsers: Busy professionals')
    expect(message).toContain('goal: Help users stick')
    expect(message).toContain('constraints: Solo founder')
    expect(message).toContain('targetBuilder: v0')
  })

  it('handles empty constraints', () => {
    const input = { ...validInput, constraints: '' }
    const message = buildUserMessage(input)

    expect(message).toContain('constraints: none specified')
  })
})

describe('extractSection', () => {
  it('extracts App-Only Prompt section', () => {
    const section = extractSection(mockFullPrompt, '## App-Only Prompt')

    expect(section).not.toBeNull()
    expect(section).toContain('## App-Only Prompt')
    expect(section).toContain('You are an expert front-end engineer')
    expect(section).not.toContain('## Agent-Only Prompt')
  })

  it('extracts Agent-Only Prompt section', () => {
    const section = extractSection(mockFullPrompt, '## Agent-Only Prompt')

    expect(section).not.toBeNull()
    expect(section).toContain('## Agent-Only Prompt')
    expect(section).toContain('You are HabitCoach')
  })

  it('returns null for non-existent section', () => {
    const section = extractSection(mockFullPrompt, '## Non-Existent')

    expect(section).toBeNull()
  })
})

describe('buildBluepromptOutput', () => {
  it('builds output with all sections', () => {
    const output = buildBluepromptOutput(mockFullPrompt)

    expect(output.fullPrompt).toBe(mockFullPrompt)
    expect(output.appOnlyPrompt).toContain('## App-Only Prompt')
    expect(output.agentOnlyPrompt).toContain('## Agent-Only Prompt')
  })

  it('includes token usage when provided', () => {
    const usage = { promptTokens: 100, completionTokens: 200, totalTokens: 300 }
    const output = buildBluepromptOutput(mockFullPrompt, usage)

    expect(output.usage).toEqual(usage)
  })
})

describe('createBlueprompt', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('calls generateText with correct parameters', async () => {
    ;(generateText as ReturnType<typeof vi.fn>).mockResolvedValue({
      text: mockFullPrompt,
      usage: { inputTokens: 100, outputTokens: 200, totalTokens: 300 },
    })

    const result = await createBlueprompt(validInput)

    expect(generateText).toHaveBeenCalledWith(
      expect.objectContaining({
        model: 'mock-model',
        maxOutputTokens: 4000,
        temperature: 0.4,
      })
    )
    expect(result.fullPrompt).toBe(mockFullPrompt)
  })

  it('maps token usage correctly from AI SDK format', async () => {
    ;(generateText as ReturnType<typeof vi.fn>).mockResolvedValue({
      text: mockFullPrompt,
      usage: { inputTokens: 150, outputTokens: 250, totalTokens: 400 },
    })

    const result = await createBlueprompt(validInput)

    expect(result.usage).toEqual({
      promptTokens: 150,
      completionTokens: 250,
      totalTokens: 400,
    })
  })

  it('handles API errors', async () => {
    ;(generateText as ReturnType<typeof vi.fn>).mockRejectedValue(
      new Error('API rate limit exceeded')
    )

    await expect(createBlueprompt(validInput)).rejects.toThrow(
      'API rate limit exceeded'
    )
  })

  it('handles missing usage data', async () => {
    ;(generateText as ReturnType<typeof vi.fn>).mockResolvedValue({
      text: mockFullPrompt,
      usage: {},
    })

    const result = await createBlueprompt(validInput)

    expect(result.usage).toEqual({
      promptTokens: 0,
      completionTokens: 0,
      totalTokens: 0,
    })
  })
})

describe('createBluepromptStreaming', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  function createMockStream(chunks: string[], usage: { inputTokens: number; outputTokens: number; totalTokens: number }) {
    type OnFinishFn = (data: { usage: typeof usage }) => void
    const callbackRef: { current: OnFinishFn | null } = { current: null }

    const mockResult = {
      textStream: (async function* () {
        for (const chunk of chunks) {
          yield chunk
        }
        // Call onFinish after stream completes
        if (callbackRef.current) {
          callbackRef.current({ usage })
        }
      })(),
      finishReason: Promise.resolve('stop'),
    }

    ;(streamText as ReturnType<typeof vi.fn>).mockImplementation((options) => {
      callbackRef.current = options.onFinish
      return mockResult
    })

    return mockResult
  }

  it('streams text chunks via onDelta callback', async () => {
    const chunks = ['# Full', ' Prompt\n', '### Core Concept\n', 'A habit app...']
    createMockStream(chunks, { inputTokens: 100, outputTokens: 200, totalTokens: 300 })

    const deltas: string[] = []
    const result = await createBluepromptStreaming(validInput, {
      onDelta: (text) => deltas.push(text),
    })

    expect(deltas).toEqual(chunks)
    expect(result.output.fullPrompt).toBe(chunks.join(''))
  })

  it('calls streamText with correct parameters', async () => {
    createMockStream(['test'], { inputTokens: 50, outputTokens: 100, totalTokens: 150 })

    await createBluepromptStreaming(validInput, { onDelta: () => {} })

    expect(streamText).toHaveBeenCalledWith(
      expect.objectContaining({
        model: 'mock-model',
        maxOutputTokens: 4000,
        temperature: 0.4,
      })
    )
  })

  it('captures token usage from onFinish callback', async () => {
    const chunks = [mockFullPrompt]
    createMockStream(chunks, { inputTokens: 150, outputTokens: 250, totalTokens: 400 })

    const result = await createBluepromptStreaming(validInput, { onDelta: () => {} })

    expect(result.usage).toEqual({
      promptTokens: 150,
      completionTokens: 250,
      totalTokens: 400,
    })
  })

  it('handles streaming errors', async () => {
    ;(streamText as ReturnType<typeof vi.fn>).mockImplementation(() => {
      throw new Error('Stream initialization failed')
    })

    await expect(
      createBluepromptStreaming(validInput, { onDelta: () => {} })
    ).rejects.toThrow('Stream initialization failed')
  })
})
