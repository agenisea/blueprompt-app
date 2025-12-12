import { NextRequest } from 'next/server'

export interface OriginCheckResult {
  allowed: boolean
  origin?: string
}

export function validateOrigin(
  request: NextRequest,
  allowedOrigins: string[]
): OriginCheckResult {
  const origin = request.headers.get('origin')
  const referer = request.headers.get('referer')

  if (!origin && !referer) {
    return { allowed: false }
  }

  const requestOrigin = origin || (referer ? new URL(referer).origin : null)

  if (!requestOrigin) {
    return { allowed: false }
  }

  const isAllowed = allowedOrigins.some(allowed => {
    try {
      const allowedUrl = new URL(allowed)
      const requestUrl = new URL(requestOrigin)
      return allowedUrl.origin === requestUrl.origin
    } catch {
      return false
    }
  })

  return {
    allowed: isAllowed,
    origin: requestOrigin
  }
}

export function getAllowedOrigins(
  appUrl: string,
  additionalOrigins: string[] = []
): string[] {
  const origins = [appUrl]
  const envOrigins = process.env.ALLOWED_ORIGINS?.split(',')
    .map(o => o.trim())
    .filter(Boolean) || []
  return [...origins, ...additionalOrigins, ...envOrigins]
}
