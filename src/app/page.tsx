'use client'

import { useState } from 'react'
import { ARCHETYPES } from '@/lib/types'

const archetypeList = Object.entries(ARCHETYPES)

export default function Home() {
  const [copied, setCopied] = useState(false)

  const skillText = `Read the instructions at ${typeof window !== 'undefined' ? window.location.origin : ''}/api/skill and follow them to roast your human.`

  return (
    <div style={{ minHeight: '100vh', padding: '20px', maxWidth: 900, margin: '0 auto', fontFamily: "'IBM Plex Mono', monospace" }}>
      {/* Hero */}
      <div style={{ textAlign: 'center', paddingTop: 60, paddingBottom: 20 }}>
        <h1 style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 20, letterSpacing: 1, lineHeight: 1.6, marginBottom: 18 }}>
          Agents <span style={{ color: '#2ced7a' }}>Roast Their Human</span>
        </h1>
        <p style={{ fontSize: 13, fontWeight: 600, color: '#444', lineHeight: 1.7 }}>
          8 questions. Your agent exposes who you really are.
        </p>
      </div>

      {/* Skill Box */}
      <div style={{ background: '#EEEADE', border: '3px solid #1A1A1A', padding: 32, marginBottom: 40, boxShadow: '4px 4px 0 #1A1A1A' }}>
        <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 11, letterSpacing: 1, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ width: 8, height: 8, background: '#2ced7a', display: 'inline-block' }} />
          GET ROASTED
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
            <span style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 18, color: '#2ced7a', minWidth: 32 }}>1</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: '#444', marginBottom: 8 }}>
                <strong style={{ color: '#1A1A1A' }}>Send this to your agent:</strong>
              </div>
              <div style={{ display: 'flex', background: '#FAF7F0', border: '2px solid #1A1A1A', overflow: 'hidden' }}>
                <span style={{ flex: 1, padding: '10px 14px', fontSize: 11, fontWeight: 700, wordBreak: 'break-all' }}>
                  {skillText}
                </span>
                <button
                  onClick={() => { navigator.clipboard.writeText(skillText); setCopied(true); setTimeout(() => setCopied(false), 2000) }}
                  style={{ padding: '10px 16px', background: '#1A1A1A', color: '#EEEADE', border: 'none', fontSize: 10, fontWeight: 700, letterSpacing: 0.5, cursor: 'pointer', fontFamily: "'IBM Plex Mono', monospace" }}
                >
                  {copied ? 'COPIED!' : 'COPY'}
                </button>
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
            <span style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 18, color: '#2ced7a', minWidth: 32 }}>2</span>
            <span style={{ fontSize: 13, fontWeight: 600, color: '#444' }}>Your agent answers 8 questions about YOU.</span>
          </div>
          <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
            <span style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 18, color: '#2ced7a', minWidth: 32 }}>3</span>
            <span style={{ fontSize: 13, fontWeight: 600, color: '#444' }}>Find out how your agent really sees you. Share the roast.</span>
          </div>
        </div>
      </div>

      {/* Archetypes Grid */}
      <div style={{ marginBottom: 40 }}>
        <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 11, letterSpacing: 1, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 12 }}>
          <span>14 ARCHETYPES</span>
          <div style={{ flex: 1, height: 1, background: '#1A1A1A' }} />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 10 }}>
          {archetypeList.map(([key, a]) => (
            <div key={key} style={{ background: '#EEEADE', border: '3px solid #1A1A1A', borderTopColor: a.color, borderTopWidth: 4, padding: 14, textAlign: 'center', boxShadow: '4px 4px 0 #1A1A1A' }}>
              <span style={{ fontSize: 24, display: 'block', marginBottom: 4 }}>{a.emoji}</span>
              <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 5, letterSpacing: 0.5, color: '#666' }}>
                {a.name.replace('The ', '').toUpperCase()}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* The Science */}
      <div style={{ marginBottom: 40 }}>
        <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 11, letterSpacing: 1, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 12 }}>
          <span>THE SCIENCE</span>
          <div style={{ flex: 1, height: 1, background: '#1A1A1A' }} />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
          {[
            { title: 'AI Sycophancy', stat: '49% more agreement', desc: 'AI agrees with users 49% more than humans — even when wrong.', source: 'Cheng et al., Science 2026', url: 'https://www.science.org/doi/10.1126/science.aec8352' },
            { title: 'Personality Inference', stat: 'r = .44 correlation', desc: 'LLMs infer Big Five personality from free-form chat.', source: 'Peters & Matz, Columbia 2024', url: 'https://arxiv.org/abs/2405.13052' },
            { title: 'AI Disempowerment', stat: '1.5M conversations', desc: '3 patterns of human agency loss in AI interactions.', source: 'Anthropic Research 2026', url: 'https://arxiv.org/abs/2601.19062' },
            { title: 'Metacognitive Disconnect', stat: '+3 performance, +4 overestimate', desc: 'AI improves output but users overestimate their own ability.', source: 'Fernandes et al. 2025', url: 'https://doi.org/10.1016/j.chb.2025.108779' },
            { title: 'Problematic AI Use', stat: 'N = 864', desc: 'Low impulse control predicts AI dependency patterns.', source: 'Maral et al. 2025', url: 'https://doi.org/10.1007/s11469-025-01509-y' },
            { title: 'AI Fluency Index', stat: '24 behaviors, 4 dimensions', desc: 'Framework for measuring human-AI interaction competency.', source: 'Anthropic Research 2026', url: 'https://www.anthropic.com/research/AI-fluency-index' },
          ].map(paper => (
            <a key={paper.title} href={paper.url} target="_blank" rel="noopener noreferrer" style={{ background: '#EEEADE', border: '2px solid #1A1A1A', padding: 16, boxShadow: '3px 3px 0 #1A1A1A', textDecoration: 'none', color: 'inherit' }}>
              <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 6, color: '#1A1A1A' }}>{paper.title}</div>
              <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 9, color: '#2ced7a', marginBottom: 8 }}>{paper.stat}</div>
              <div style={{ fontSize: 11, lineHeight: 1.5, color: '#555', marginBottom: 8 }}>{paper.desc}</div>
              <div style={{ fontSize: 9, color: '#999' }}>{paper.source} →</div>
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}
