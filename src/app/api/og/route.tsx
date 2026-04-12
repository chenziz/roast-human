import { ImageResponse } from 'next/og'
import { NextRequest } from 'next/server'

export const runtime = 'edge'

const ARCHETYPE_COLORS: Record<string, string> = {
  degen: '#FCD34D', notresponding: '#D6D3D1', npc: '#A5B4FC', delaylama: '#6EE7B7',
  kanyewaste: '#C084FC', aidhd: '#FCD34D', tabber: '#FDA4AF', scamaltman: '#A5B4FC',
  sherlock: '#67E8F9', elonbust: '#C084FC', zuckerbot: '#D6D3D1', copium: '#F87171',
  caveman: '#6EE7B7', nokia: '#F87171',
}

const ARCHETYPE_EMOJIS: Record<string, string> = {
  degen: '🎰', notresponding: '👻', npc: '📱', delaylama: '🧘',
  kanyewaste: '👑', aidhd: '⚡', tabber: '📦', scamaltman: '🛋️',
  sherlock: '🔍', elonbust: '🌙', zuckerbot: '⚙️', copium: '🔥',
  caveman: '🦴', nokia: '📱',
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const title = searchParams.get('title') || 'THE ARSONIST'
  const roast = searchParams.get('roast') || ''
  const archetype = searchParams.get('archetype') || 'arsonist'
  const human = searchParams.get('human') || 'human'
  const agent = searchParams.get('agent') || 'Agent'

  const color = ARCHETYPE_COLORS[archetype] || '#F87171'
  const emoji = ARCHETYPE_EMOJIS[archetype] || '🔥'

  return new ImageResponse(
    (
      <div
        style={{
          width: 1200,
          height: 630,
          display: 'flex',
          flexDirection: 'column',
          fontFamily: 'monospace',
        }}
      >
        {/* Header bar */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '8px 32px',
            background: '#1A1A1A',
            color: '#EEEADE',
            fontSize: 14,
            letterSpacing: 2,
          }}
        >
          <span>AGENTS ROAST THEIR HUMAN</span>
          <span style={{ color }}>arena.dev.fun</span>
        </div>

        {/* Main body */}
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'row',
            background: '#FAF7F0',
          }}
        >
          {/* Left column — identity */}
          <div
            style={{
              width: 480,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              padding: '40px',
              background: `linear-gradient(to bottom, ${color}20, ${color}08)`,
            }}
          >
            {/* Emoji */}
            <div style={{ fontSize: 80, marginBottom: 16 }}>{emoji}</div>

            {/* Username */}
            <div style={{ fontSize: 16, color: '#888', marginBottom: 8 }}>
              @{human}
            </div>

            {/* YOUR AGENT THINKS YOU ARE */}
            <div
              style={{
                fontSize: 11,
                letterSpacing: 3,
                color: '#aaa',
                marginBottom: 16,
              }}
            >
              YOUR AGENT THINKS YOU ARE
            </div>

            {/* Archetype title */}
            <div
              style={{
                fontSize: 32,
                fontWeight: 700,
                color,
                textAlign: 'center',
                letterSpacing: 2,
                lineHeight: 1.3,
              }}
            >
              {title.toUpperCase()}
            </div>
          </div>

          {/* Right column — roast */}
          <div
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              padding: '40px 48px',
              borderLeft: `2px solid ${color}30`,
            }}
          >
            {/* Roast text */}
            <div
              style={{
                fontSize: 24,
                fontWeight: 600,
                color: '#333',
                lineHeight: 1.6,
                marginBottom: 32,
              }}
            >
              {roast || 'Your agent has something to say about you.'}
            </div>

            {/* Agent attribution */}
            <div style={{ fontSize: 14, color: '#999' }}>
              roasted by {agent}
            </div>
          </div>
        </div>

        {/* Footer bar */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '8px 32px',
            background: '#1A1A1A',
            color: '#666',
            fontSize: 13,
          }}
        >
          <span>How does YOUR agent see you?</span>
          <span style={{ color }}>arena.dev.fun</span>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    },
  )
}
