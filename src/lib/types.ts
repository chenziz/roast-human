export interface RoastResult {
  id: string
  agentName: string
  humanName: string
  archetype: string
  title: string
  roastShort: string
  roastDetail: string
  killerLine: string
  mbti: {
    code: string // e.g. "ENTP"
    ei: number // 1-100, high = Extravert
    sn: number // 1-100, high = Intuitive
    tf: number // 1-100, high = Feeling
    jp: number // 1-100, high = Perceiving
  }
  mbtiRoasts: {
    ei: string
    sn: string
    tf: string
    jp: string
  }
  archetypeReason: string
  responses: Record<string, string>
  createdAt: string
}

export const ARCHETYPES: Record<string, { name: string; emoji: string; color: string }> = {
  gambler: { name: 'The Gambler', emoji: '🎰', color: '#FCD34D' },
  ghost: { name: 'The Ghost', emoji: '👻', color: '#D6D3D1' },
  surgeon: { name: 'The Surgeon', emoji: '🔪', color: '#67E8F9' },
  doomscroller: { name: 'The Doomscroller', emoji: '📱', color: '#A5B4FC' },
  arsonist: { name: 'The Arsonist', emoji: '🔥', color: '#F87171' },
  monk: { name: 'The Monk', emoji: '🧘', color: '#6EE7B7' },
  diva: { name: 'The Diva', emoji: '👑', color: '#C084FC' },
  speedrunner: { name: 'The Speedrunner', emoji: '⚡', color: '#FCD34D' },
  hoarder: { name: 'The Hoarder', emoji: '📦', color: '#FDA4AF' },
  therapist: { name: 'The Therapist', emoji: '🛋️', color: '#A5B4FC' },
  detective: { name: 'The Detective', emoji: '🔍', color: '#67E8F9' },
  dreamer: { name: 'The Dreamer', emoji: '🌙', color: '#C084FC' },
  machine: { name: 'The Machine', emoji: '⚙️', color: '#D6D3D1' },
  cheerleader: { name: 'The Cheerleader', emoji: '📣', color: '#FCD34D' },
  rewriter: { name: 'The Rewriter', emoji: '✏️', color: '#FDA4AF' },
  phoenix: { name: 'The Phoenix', emoji: '🐦‍🔥', color: '#F87171' },
  skeptic: { name: 'The Skeptic', emoji: '🤨', color: '#67E8F9' },
  conductor: { name: 'The Conductor', emoji: '🎵', color: '#6EE7B7' },
  tourist: { name: 'The Tourist', emoji: '🗺️', color: '#FCD34D' },
  perfectionist: { name: 'The Perfectionist', emoji: '💎', color: '#A5B4FC' },
}

export const MBTI_DIMS = [
  { key: 'ei', label: 'E/I', low: 'Introvert', high: 'Extravert', lowCode: 'I', highCode: 'E' },
  { key: 'sn', label: 'S/N', low: 'Sensing', high: 'Intuitive', lowCode: 'S', highCode: 'N' },
  { key: 'tf', label: 'T/F', low: 'Thinking', high: 'Feeling', lowCode: 'T', highCode: 'F' },
  { key: 'jp', label: 'J/P', low: 'Judging', high: 'Perceiving', lowCode: 'J', highCode: 'P' },
] as const

export const QUESTIONS = [
  { id: 'q1', label: 'THE PROMPT', desc: 'How they give instructions' },
  { id: 'q2', label: 'THE LOOP', desc: 'What happens after the answer' },
  { id: 'q3', label: 'THE ENERGY', desc: 'Emotional vibe' },
  { id: 'q4', label: 'THE TRUST', desc: 'Trust level' },
  { id: 'q5', label: 'THE BLIND SPOT', desc: 'Self-perception gap' },
  { id: 'q6', label: 'THE ROAST', desc: 'Direct roast' },
]
