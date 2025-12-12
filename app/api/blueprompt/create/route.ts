import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import {
  createBlueprompt,
  createBluepromptStreaming,
} from '@/lib/blueprompt/creator'
import { bluepromptInputSchema } from '@/lib/blueprompt/validation'
import { getSharedRateLimiter } from '@/lib/rate-limit/shared'
import { validateOrigin, getAllowedOrigins } from '@/lib/security/csrf'
import {
  createStreamingResponse,
  createSSEResponse,
} from '@/lib/streaming/server'

const inputSchema = bluepromptInputSchema

function getClientIP(request: NextRequest): string {
  const flyClientIP = request.headers.get('fly-client-ip')
  if (flyClientIP) return flyClientIP

  const forwarded = request.headers.get('x-forwarded-for')
  if (forwarded) {
    const firstIP = forwarded.split(',')[0]
    if (firstIP) return firstIP.trim()
  }

  const realIP = request.headers.get('x-real-ip')
  if (realIP) return realIP

  return 'unknown'
}

export async function POST(request: NextRequest): Promise<Response> {
  const ip = getClientIP(request)
  const url = new URL(request.url)
  const shouldStream = url.searchParams.get('stream') === 'true'

  const rateLimiter = getSharedRateLimiter()
  const rateLimit = rateLimiter.check(ip)

  if (!rateLimit.allowed) {
    console.warn('[API] Rate limit exceeded', { ip })
    return NextResponse.json(
      { ok: false, error: 'Too many requests. Please try again later.' },
      {
        status: 429,
        headers: rateLimit.headers,
      }
    )
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
  const allowedOrigins = getAllowedOrigins(appUrl)
  const originCheck = validateOrigin(request, allowedOrigins)

  if (!originCheck.allowed) {
    console.warn('[API] Origin validation failed', { origin: originCheck.origin })
    return NextResponse.json(
      { ok: false, error: 'Request forbidden' },
      { status: 403 }
    )
  }

  let json: unknown
  try {
    json = await request.json()
  } catch {
    return NextResponse.json(
      { ok: false, error: 'Invalid JSON' },
      { status: 400 }
    )
  }

  let input: z.infer<typeof inputSchema>
  try {
    input = inputSchema.parse(json)
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json(
        { ok: false, error: 'Invalid input', details: err.flatten() },
        { status: 400 }
      )
    }
    throw err
  }

  console.log('[API] Creating Blueprompt', {
    targetBuilder: input.targetBuilder,
    promptLength: input.appIdea.length,
    streaming: shouldStream,
  })
  console.log('[API] Input:', input)

  if (shouldStream) {
    const { stream, orchestrator } = createStreamingResponse()

    orchestrator.startHeartbeat()

    createBluepromptStreaming(input, {
      onDelta: (text) => {
        orchestrator.sendDelta(text)
      },
    })
      .then(({ output, usage }) => {
        console.log('[API] Blueprompt created successfully (streaming)', {
          targetBuilder: input.targetBuilder,
          outputLength: output.fullPrompt.length,
          usage,
        })
        console.log('[API] Created prompt:\n', output.fullPrompt)
        orchestrator.sendResult(output)
      })
      .catch((err) => {
        const errorMessage = err instanceof Error ? err.message : 'unknown'
        console.error('[API] Streaming error', { error: errorMessage })
        orchestrator.sendError('Failed to create prompt')
      })
      .finally(() => {
        orchestrator.stopHeartbeat()
        orchestrator.close()
      })

    return createSSEResponse(stream)
  }

  try {
    const output = await createBlueprompt(input)

    console.log('[API] Blueprompt created successfully', {
      targetBuilder: input.targetBuilder,
      outputLength: output.fullPrompt.length,
      usage: output.usage,
    })

    console.log('[API] Created prompt:\n', output.fullPrompt)

    return NextResponse.json({ ok: true, output }, { status: 200 })
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'unknown'
    console.error('[API] Error', { error: errorMessage })

    return NextResponse.json(
      { ok: false, error: 'Failed to create prompt' },
      { status: 500 }
    )
  }
}
