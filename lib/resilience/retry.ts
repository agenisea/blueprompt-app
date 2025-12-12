export interface RetryOptions {
  maxAttempts?: number
  baseDelayMs?: number
  backoffFactor?: number
  jitter?: number
  isRetryable?: (error: unknown) => boolean
}

const DEFAULT_MAX_ATTEMPTS = 3
const DEFAULT_BASE_DELAY_MS = 1000
const DEFAULT_BACKOFF_FACTOR = 2
const DEFAULT_JITTER = 0.25

const RETRYABLE_STATUS_CODES = new Set([408, 429, 500, 502, 503, 504])

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function isRetryableError(error: unknown): boolean {
  if (error instanceof Error) {
    const status = (error as { status?: number }).status
    if (status && RETRYABLE_STATUS_CODES.has(status)) {
      return true
    }

    const message = error.message.toLowerCase()
    if (
      message.includes('rate limit') ||
      message.includes('timeout') ||
      message.includes('overloaded') ||
      message.includes('503') ||
      message.includes('529')
    ) {
      return true
    }
  }
  return false
}

export async function retryWithJitter<T>(
  fn: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> {
  const maxAttempts = options.maxAttempts ?? DEFAULT_MAX_ATTEMPTS
  const baseDelayMs = options.baseDelayMs ?? DEFAULT_BASE_DELAY_MS
  const backoffFactor = options.backoffFactor ?? DEFAULT_BACKOFF_FACTOR
  const jitter = options.jitter ?? DEFAULT_JITTER
  const isRetryable = options.isRetryable ?? isRetryableError

  let attempt = 0

  while (true) {
    try {
      return await fn()
    } catch (error) {
      attempt++

      if (attempt >= maxAttempts || !isRetryable(error)) {
        throw error
      }

      const exponentialDelay = baseDelayMs * Math.pow(backoffFactor, attempt - 1)
      const jitterAmount = (Math.random() - 0.5) * 2 * jitter * exponentialDelay
      const totalDelay = Math.max(0, exponentialDelay + jitterAmount)

      console.warn(
        `[retry] Attempt ${attempt}/${maxAttempts} failed → retrying in ${totalDelay.toFixed(0)}ms`,
        error instanceof Error ? error.message : error
      )

      await sleep(totalDelay)
    }
  }
}
