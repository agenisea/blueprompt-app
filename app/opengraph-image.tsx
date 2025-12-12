import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'Blueprompt — No-Code App & Agent Prompt Creator'
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = 'image/png'

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#0f1c2e',
          backgroundImage:
            'radial-gradient(circle at 25% 25%, rgba(59, 130, 246, 0.2) 0%, transparent 50%), radial-gradient(circle at 75% 75%, rgba(37, 99, 235, 0.15) 0%, transparent 50%)',
          fontFamily: 'sans-serif',
        }}
      >
        {/* Brand Name */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 16,
            marginBottom: 24,
          }}
        >
          <div
            style={{
              fontSize: 105,
              fontWeight: 700,
              color: '#ffffff',
              letterSpacing: '-0.02em',
            }}
          >
            Blueprompt
          </div>
          <div
            style={{
              fontSize: 24,
              fontWeight: 500,
              color: '#ffffff',
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              padding: '8px 16px',
              borderRadius: 8,
              border: '1px solid rgba(255, 255, 255, 0.2)',
            }}
          >
            BETA
          </div>
        </div>

        {/* Tagline */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            fontSize: 40,
            fontWeight: 400,
            color: '#ffffff',
            letterSpacing: '-0.01em',
            textAlign: 'center',
            maxWidth: 900,
            lineHeight: 1.4,
          }}
        >
          <span>Turn a single idea into a no-code app blueprint</span>
          <span>and agentic prompt</span>
        </div>

        {/* Supported Tools */}
        <div
          style={{
            display: 'flex',
            gap: 24,
            marginTop: 48,
            fontSize: 30,
            color: '#ffffff',
          }}
        >
          <span>v0</span>
          <span style={{ color: '#ffffff' }}>•</span>
          <span>Lovable</span>
          <span style={{ color: '#ffffff' }}>•</span>
          <span>Replit</span>
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}
