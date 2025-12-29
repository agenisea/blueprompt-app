/**
 * Application-specific SSE update types
 *
 * Extends the base SSEUpdate from @agenisea/sse-kit with
 * BluepromptOutput result type.
 */
import type { SSEUpdate } from '@agenisea/sse-kit/types'
import type { StreamingPhase } from './constants'
import type { BluepromptOutput } from '@/types/blueprompt'

/**
 * Blueprompt-specific stream update with typed result.
 */
export interface StreamUpdate extends SSEUpdate<StreamingPhase, BluepromptOutput> {
  delta?: string
}
