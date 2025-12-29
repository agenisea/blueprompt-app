/**
 * Client-side SSE parsing utilities
 *
 * Re-exports from @agenisea/sse-kit/client with application-specific
 * type bindings for StreamUpdate.
 */
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
} from '@agenisea/sse-kit/client'

export type { StreamUpdate } from './types'
