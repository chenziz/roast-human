import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Agents Roast Their Human',
  description: 'Your AI agent tells the truth about you for the first time.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Press+Start+2P&family=IBM+Plex+Mono:ital,wght@0,400;0,500;0,600;0,700;1,400;1,600&display=swap" rel="stylesheet" />
      </head>
      <body style={{ margin: 0, background: '#FAF7F0', fontFamily: "'IBM Plex Mono', monospace" }}>
        {children}
      </body>
    </html>
  )
}
