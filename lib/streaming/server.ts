import { STREAMING_PHASE } from './constants'
import type { StreamUpdate } from './types'
import type { BluepromptOutput } from '@/types/blueprompt'

export type StreamController = ReadableStreamDefaultController<Uint8Array>

export class StreamOrchestrator {
  private encoder = new TextEncoder()
  private controller: StreamController
  private isClosed = false
  private heartbeatInterval: NodeJS.Timeout | null = null
  private readonly HEARTBEAT_INTERVAL_MS = 5000

  constructor(controller: StreamController) {
    this.controller = controller
  }

  async sendUpdate(update: StreamUpdate): Promise<void> {
    if (this.isClosed) {
      return
    }

    try {
      const data = `data: ${JSON.stringify(update)}\n\n`
      this.controller.enqueue(this.encoder.encode(data))
    } catch (error) {
      this.isClosed = true

      if (error instanceof Error && !error.message?.includes('Controller is already closed')) {
        console.log('[stream] Unexpected stream error:', error)
      }
    }
  }

  async sendDelta(text: string): Promise<void> {
    await this.sendUpdate({
      phase: STREAMING_PHASE.CREATING,
      delta: text,
    })
  }

  async sendResult(result: BluepromptOutput): Promise<void> {
    await this.sendUpdate({
      phase: STREAMING_PHASE.COMPLETE,
      result,
    })
  }

  async sendError(error: string): Promise<void> {
    await this.sendUpdate({
      phase: STREAMING_PHASE.ERROR,
      error,
    })
  }

  startHeartbeat(): void {
    if (this.heartbeatInterval) {
      return
    }

    this.heartbeatInterval = setInterval(() => {
      if (this.isClosed) {
        this.stopHeartbeat()
        return
      }

      try {
        const heartbeat = ': heartbeat\n\n'
        this.controller.enqueue(this.encoder.encode(heartbeat))
      } catch {
        this.isClosed = true
        this.stopHeartbeat()
      }
    }, this.HEARTBEAT_INTERVAL_MS)
  }

  stopHeartbeat(): void {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval)
      this.heartbeatInterval = null
    }
  }

  async close(): Promise<void> {
    if (!this.isClosed) {
      this.stopHeartbeat()
      try {
        this.controller.close()
        this.isClosed = true
      } catch (error) {
        console.log('[stream] Error closing stream:', error)
      }
    }
  }

  get closed(): boolean {
    return this.isClosed
  }
}

export function createStreamingResponse(): {
  stream: ReadableStream
  orchestrator: StreamOrchestrator
} {
  let orchestrator!: StreamOrchestrator

  const stream = new ReadableStream({
    start(controller) {
      orchestrator = new StreamOrchestrator(controller)
    },
  })

  return {
    stream,
    orchestrator,
  }
}

export function createSSEResponse(
  stream: ReadableStream,
  additionalHeaders?: Record<string, string>
): Response {
  const headers: Record<string, string> = {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
    'X-Accel-Buffering': 'no',
    ...additionalHeaders,
  }

  return new Response(stream, { headers })
}
