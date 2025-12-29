/**
 * Server-side SSE streaming utilities
 *
 * Re-exports from @agenisea/sse-kit/server with application-specific
 * type bindings for BluepromptOutput.
 */
export {
  StreamOrchestrator,
  createStreamingResponse,
  createSSEResponse,
  type StreamController,
  type StreamOrchestratorConfig,
  type StreamObserver,
} from '@agenisea/sse-kit/server'

export { STREAMING_PHASE, type StreamingPhase } from './constants'
export type { StreamUpdate } from './types'
