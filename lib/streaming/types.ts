import type { StreamingPhase } from './constants'
import type { BluepromptOutput } from '@/types/blueprompt'

export interface StreamUpdate {
  phase: StreamingPhase
  delta?: string
  result?: BluepromptOutput
  error?: string
}
