export const STREAMING_PHASE = {
  CREATING: 'creating',
  COMPLETE: 'complete',
  ERROR: 'error',
} as const

export type StreamingPhase = typeof STREAMING_PHASE[keyof typeof STREAMING_PHASE]
