interface RateLimitEntry {
  count: number
  resetAt: number
}

export interface RateLimitResult {
  allowed: boolean
  remaining: number
  resetAt: number
  headers: Record<string, string>
}

export interface RateLimitConfig {
  perHour: number
}

export class RateLimiter {
  private store: Map<string, RateLimitEntry> = new Map()
  private cleanupInterval: NodeJS.Timeout

  constructor(private config: RateLimitConfig) {
    this.cleanupInterval = setInterval(() => this.cleanup(), 60000)
  }

  check(ip: string): RateLimitResult {
    const { perHour } = this.config
    const now = Date.now()
    const windowMs = 3600 * 1000

    const entry = this.store.get(ip)

    if (!entry || entry.resetAt < now) {
      const newEntry: RateLimitEntry = {
        count: 1,
        resetAt: now + windowMs,
      }
      this.store.set(ip, newEntry)

      return {
        allowed: true,
        remaining: perHour - 1,
        resetAt: newEntry.resetAt,
        headers: this.createHeaders(perHour, perHour - 1, newEntry.resetAt),
      }
    }

    if (entry.count >= perHour) {
      return {
        allowed: false,
        remaining: 0,
        resetAt: entry.resetAt,
        headers: this.createHeaders(perHour, 0, entry.resetAt),
      }
    }

    entry.count++
    this.store.set(ip, entry)

    return {
      allowed: true,
      remaining: perHour - entry.count,
      resetAt: entry.resetAt,
      headers: this.createHeaders(perHour, perHour - entry.count, entry.resetAt),
    }
  }

  private createHeaders(
    limit: number,
    remaining: number,
    resetAt: number
  ): Record<string, string> {
    return {
      'X-RateLimit-Limit': String(limit),
      'X-RateLimit-Remaining': String(remaining),
      'X-RateLimit-Reset': String(Math.floor(resetAt / 1000)),
    }
  }

  private cleanup(): void {
    const now = Date.now()
    for (const [key, entry] of this.store.entries()) {
      if (entry.resetAt < now) {
        this.store.delete(key)
      }
    }
  }

  destroy(): void {
    clearInterval(this.cleanupInterval)
    this.store.clear()
  }
}
