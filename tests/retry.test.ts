import { describe, it, expect, vi, beforeEach } from 'vitest'
import { retryWithJitter } from '@/lib/resilience/retry'

describe('retryWithJitter', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns result on first successful attempt', async () => {
    const fn = vi.fn().mockResolvedValue('success')

    const result = await retryWithJitter(fn)

    expect(result).toBe('success')
    expect(fn).toHaveBeenCalledTimes(1)
  })

  it('retries on retryable error and succeeds', async () => {
    const error = new Error('rate limit')
    const fn = vi
      .fn()
      .mockRejectedValueOnce(error)
      .mockResolvedValueOnce('success after retry')

    const result = await retryWithJitter(fn, { maxAttempts: 3, baseDelayMs: 1 })

    expect(result).toBe('success after retry')
    expect(fn).toHaveBeenCalledTimes(2)
  })

  it('throws after max attempts exhausted', async () => {
    const error = new Error('rate limit')
    const fn = vi.fn().mockRejectedValue(error)

    await expect(
      retryWithJitter(fn, { maxAttempts: 2, baseDelayMs: 1 })
    ).rejects.toThrow('rate limit')

    expect(fn).toHaveBeenCalledTimes(2)
  })

  it('does not retry non-retryable errors', async () => {
    const error = new Error('invalid input')
    const fn = vi.fn().mockRejectedValue(error)

    await expect(
      retryWithJitter(fn, {
        maxAttempts: 3,
        isRetryable: () => false,
      })
    ).rejects.toThrow('invalid input')

    expect(fn).toHaveBeenCalledTimes(1)
  })

  it('retries on 429 status code', async () => {
    const error = Object.assign(new Error('Too many requests'), { status: 429 })
    const fn = vi
      .fn()
      .mockRejectedValueOnce(error)
      .mockResolvedValueOnce('success')

    const result = await retryWithJitter(fn, { maxAttempts: 3, baseDelayMs: 1 })

    expect(result).toBe('success')
    expect(fn).toHaveBeenCalledTimes(2)
  })

  it('retries on 500 status code', async () => {
    const error = Object.assign(new Error('Server error'), { status: 500 })
    const fn = vi
      .fn()
      .mockRejectedValueOnce(error)
      .mockResolvedValueOnce('success')

    const result = await retryWithJitter(fn, { maxAttempts: 3, baseDelayMs: 1 })

    expect(result).toBe('success')
    expect(fn).toHaveBeenCalledTimes(2)
  })

  it('retries on timeout error message', async () => {
    const error = new Error('Request timeout')
    const fn = vi
      .fn()
      .mockRejectedValueOnce(error)
      .mockResolvedValueOnce('success')

    const result = await retryWithJitter(fn, { maxAttempts: 3, baseDelayMs: 1 })

    expect(result).toBe('success')
    expect(fn).toHaveBeenCalledTimes(2)
  })

  it('retries on overloaded error message', async () => {
    const error = new Error('Service overloaded')
    const fn = vi
      .fn()
      .mockRejectedValueOnce(error)
      .mockResolvedValueOnce('success')

    const result = await retryWithJitter(fn, { maxAttempts: 3, baseDelayMs: 1 })

    expect(result).toBe('success')
    expect(fn).toHaveBeenCalledTimes(2)
  })

  it('uses custom isRetryable function', async () => {
    const error = new Error('custom error')
    const fn = vi
      .fn()
      .mockRejectedValueOnce(error)
      .mockResolvedValueOnce('success')

    const result = await retryWithJitter(fn, {
      maxAttempts: 3,
      baseDelayMs: 1,
      isRetryable: (err) => (err as Error).message === 'custom error',
    })

    expect(result).toBe('success')
    expect(fn).toHaveBeenCalledTimes(2)
  })
})
