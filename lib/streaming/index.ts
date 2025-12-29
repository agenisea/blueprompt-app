/**
 * SSE Streaming Module
 *
 * Re-exports from @agenisea/sse-kit with application-specific types.
 * Use this module for all SSE streaming needs in the application.
 *
 * @example Server-side (API routes):
 * ```typescript
 * import { createStreamingResponse, createSSEResponse, STREAMING_PHASE } from '@/lib/streaming'
 *
 * const { stream, orchestrator } = createStreamingResponse<StreamUpdate>({
 *   completePhase: STREAMING_PHASE.COMPLETE,
 *   errorPhase: STREAMING_PHASE.ERROR,
 * })
 * orchestrator.startHeartbeat()
 * await orchestrator.sendUpdate({ phase: STREAMING_PHASE.CREATING, delta: 'text' })
 * await orchestrator.sendResult(result)
 * return createSSEResponse(stream)
 * ```
 *
 * @example Client-side (React components):
 * ```typescript
 * import { useSSEStream, STREAMING_PHASE } from '@/lib/streaming'
 *
 * const { state, start, cancel, reset } = useSSEStream({
 *   endpoint: '/api/stream',
 *   initialPhase: STREAMING_PHASE.CREATING,
 *   completePhase: STREAMING_PHASE.COMPLETE,
 *   errorPhase: STREAMING_PHASE.ERROR,
 *   onUpdate: (update) => { ... }
 * })
 * ```
 */

// Server-side exports
export {
  StreamOrchestrator,
  createStreamingResponse,
  createSSEResponse,
  type StreamController,
  type StreamOrchestratorConfig,
  type StreamObserver,
} from './server'

// Client-side exports
export {
  createSSEParser,
  parseSSEStream,
  useSSEStream,
  createReconnectionManager,
  withRetry,
  createCircuitBreaker,
  getSharedCircuitBreaker,
  isNetworkError,
  isCancellationError,
  isTimeoutError,
  fetchWithTimeout,
  type SSEParserOptions,
  type SSEEventHandlers,
  type UseSSEStreamOptions,
  type SSEStreamState,
  type CircuitBreaker,
  type ReconnectionInfo,
  SSEStreamError,
  StreamCancelledError,
  TimeoutError,
  CircuitOpenError,
} from './client'

// Application-specific types
export { STREAMING_PHASE, type StreamingPhase } from './constants'
export type { StreamUpdate } from './types'
