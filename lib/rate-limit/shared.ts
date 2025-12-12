import { RateLimiter } from './limiter'

let sharedRateLimiter: RateLimiter | null = null

export function getSharedRateLimiter(): RateLimiter {
  if (!sharedRateLimiter) {
    sharedRateLimiter = new RateLimiter({
      perHour: 10,
    })
  }
  return sharedRateLimiter
}

export function destroySharedRateLimiter(): void {
  if (sharedRateLimiter) {
    sharedRateLimiter.destroy()
    sharedRateLimiter = null
  }
}
