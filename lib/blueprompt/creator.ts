import { streamText, generateText } from 'ai'
import { anthropic, DEFAULT_MODEL } from '@/lib/ai/anthropic-client'
import { SYSTEM_PROMPT } from '@/lib/blueprompt/constants'
import { retryWithJitter } from '@/lib/resilience/retry'
import { evaluateOutput } from '@/lib/blueprompt/output-eval'
import type { BluepromptInput, BluepromptOutput, TokenUsage } from '@/types/blueprompt'

export function buildUserMessage(input: BluepromptInput): string {
  const { appIdea, primaryUsers, goal, constraints, targetBuilder } = input

  return [
    `appIdea: ${appIdea}`,
    `primaryUsers: ${primaryUsers}`,
    `goal: ${goal}`,
    `constraints: ${constraints || 'none specified'}`,
    `targetBuilder: ${targetBuilder}`,
  ].join('\n')
}

export function extractSection(text: string, heading: string): string | null {
  const start = text.indexOf(heading)
  if (start === -1) return null

  const rest = text.slice(start + heading.length)
  const nextHeadingIdx = rest.search(/\n## [A-Z]/)

  if (nextHeadingIdx === -1) {
    return (heading + rest).trim()
  }

  return (heading + rest.slice(0, nextHeadingIdx)).trim()
}

export function buildBluepromptOutput(content: string, usage?: TokenUsage): BluepromptOutput {
  const evalResult = evaluateOutput(content)

  if (!evalResult.valid) {
    console.error(
      '[output-eval] Invalid output - missing headings:',
      evalResult.missingHeadings
    )
  }

  if (evalResult.warnings.length > 0) {
    console.warn('[output-eval] Warnings:', evalResult.warnings)
  }

  const appOnly = extractSection(content, '## App-Only Prompt')
  const agentOnly = extractSection(content, '## Agent-Only Prompt')

  return {
    fullPrompt: content,
    appOnlyPrompt: appOnly,
    agentOnlyPrompt: agentOnly,
    usage,
    eval: evalResult,
  }
}

export interface StreamingOptions {
  onDelta: (text: string) => void
}

export interface StreamingResult {
  output: BluepromptOutput
  usage: TokenUsage
}

export async function createBluepromptStreaming(
  input: BluepromptInput,
  options: StreamingOptions
): Promise<StreamingResult> {
  const userMessage = buildUserMessage(input)

  let fullContent = ''
  let tokenUsage: TokenUsage = {
    promptTokens: 0,
    completionTokens: 0,
    totalTokens: 0,
  }

  const result = await retryWithJitter(
    async () =>
      streamText({
        model: anthropic(DEFAULT_MODEL),
        maxOutputTokens: 8000,
        temperature: 0.4,
        system: SYSTEM_PROMPT,
        messages: [
          {
            role: 'user',
            content: userMessage,
          },
        ],
        onFinish: ({ usage }) => {
          tokenUsage = {
            promptTokens: usage.inputTokens ?? 0,
            completionTokens: usage.outputTokens ?? 0,
            totalTokens: usage.totalTokens ?? 0,
          }
        },
      }),
    { maxAttempts: 3, baseDelayMs: 1000 }
  )

  for await (const chunk of result.textStream) {
    fullContent += chunk
    options.onDelta(chunk)
  }

  // Wait for the stream to fully complete to ensure usage is captured
  await result.finishReason

  return {
    output: buildBluepromptOutput(fullContent.trim(), tokenUsage),
    usage: tokenUsage,
  }
}

export async function createBlueprompt(
  input: BluepromptInput
): Promise<BluepromptOutput> {
  const userMessage = buildUserMessage(input)

  const { text, usage } = await retryWithJitter(
    async () =>
      generateText({
        model: anthropic(DEFAULT_MODEL),
        maxOutputTokens: 8000,
        temperature: 0.4,
        system: SYSTEM_PROMPT,
        messages: [
          {
            role: 'user',
            content: userMessage,
          },
        ],
      }),
    { maxAttempts: 3, baseDelayMs: 1000 }
  )

  const tokenUsage: TokenUsage = {
    promptTokens: usage.inputTokens ?? 0,
    completionTokens: usage.outputTokens ?? 0,
    totalTokens: usage.totalTokens ?? 0,
  }

  return buildBluepromptOutput(text.trim(), tokenUsage)
}
