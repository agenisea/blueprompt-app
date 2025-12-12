import type { StreamUpdate } from './types'

export interface SSEParserOptions {
  onMessage: (data: StreamUpdate) => void
  onError?: (error: Error, rawLine: string) => void
}

export function createSSEParser(options: SSEParserOptions) {
  const { onMessage, onError } = options
  let buffer = ''

  return function parse(chunk: string): void {
    buffer += chunk
    const messages = buffer.split('\n\n')
    buffer = messages.pop() || ''

    for (const message of messages) {
      const trimmed = message.trim()
      if (!trimmed) continue

      for (const line of trimmed.split('\n')) {
        if (line.startsWith(':')) continue

        if (line.startsWith('data: ')) {
          const payload = line.slice(6)
          try {
            const data = JSON.parse(payload) as StreamUpdate
            onMessage(data)
          } catch (err) {
            onError?.(
              err instanceof Error ? err : new Error('JSON parse error'),
              payload.slice(0, 120)
            )
          }
        }
      }
    }
  }
}
