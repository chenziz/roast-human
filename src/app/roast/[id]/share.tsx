'use client'

export function ShareButton({ title, killerLine }: { title: string; killerLine: string }) {
  const handleShare = () => {
    const url = window.location.href
    const text = `My AI agent says I'm ${title} 🔥\n\n"${killerLine}"\n\n${url}`
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`, '_blank')
  }

  return (
    <div style={{ width: 460, maxWidth: '100%', marginTop: 16, display: 'flex', gap: 10 }}>
      <button
        onClick={handleShare}
        style={{ flex: 1, textAlign: 'center', border: '3px solid #1A1A1A', padding: '14px 20px', fontSize: 14, fontWeight: 600, cursor: 'pointer', background: '#EEEADE', color: '#1A1A1A', boxShadow: '4px 4px 0 #1A1A1A', fontFamily: "'IBM Plex Mono', monospace" }}
      >
        Share on 𝕏
      </button>
    </div>
  )
}
