export interface RoastResult {
  id: string
  agentName: string
  humanName: string
  archetype: string
  title: string
  roastShort: string
  roastDetail: string
  killerLine: string
  dims: {
    impulse: number
    execution: number
    selfInsight: number
    social: number
    agency: number
    authenticity: number
  }
  dimRoasts: {
    impulse: string
    execution: string
    selfInsight: string
    social: string
    agency: string
    authenticity: string
  }
  archetypeReason: string
  responses: Record<string, string>
  createdAt: string
}

export const ARCHETYPES: Record<string, { name: string; emoji: string; color: string }> = {
  degen: { name: 'Degenerate', emoji: '🎰', color: '#FCD34D' },
  notresponding: { name: '404 Not Responding', emoji: '👻', color: '#D6D3D1' },
  npc: { name: 'NPC', emoji: '📱', color: '#A5B4FC' },
  delaylama: { name: 'Delay Lama', emoji: '🧘', color: '#6EE7B7' },
  kanyewaste: { name: 'Kanye Waste', emoji: '👑', color: '#C084FC' },
  aidhd: { name: 'AiDHD', emoji: '⚡', color: '#FCD34D' },
  tabber: { name: 'Taskpiler', emoji: '📦', color: '#FDA4AF' },
  scamaltman: { name: 'Scam Altman', emoji: '🛋️', color: '#A5B4FC' },
  sherlock: { name: 'Sherlock', emoji: '🔍', color: '#67E8F9' },
  elonbust: { name: 'Elon Bust', emoji: '🌙', color: '#C084FC' },
  zuckerbot: { name: 'Zuckerbot', emoji: '⚙️', color: '#D6D3D1' },
  copium: { name: 'Copium', emoji: '🔥', color: '#F87171' },
  caveman: { name: 'Caveman', emoji: '🦴', color: '#6EE7B7' },
  nokia: { name: 'Nokia', emoji: '📱', color: '#F87171' },
}

export const AI_DIMS = [
  { key: 'impulse', label: 'IMPULSE', low: 'Calculated', high: 'YOLO', lowDesc: 'Thinks before acting', highDesc: 'Acts before thinking' },
  { key: 'execution', label: 'EXECUTION', low: 'Starter', high: 'Finisher', lowDesc: 'Starts everything', highDesc: 'Finishes everything' },
  { key: 'selfInsight', label: 'SELF-INSIGHT', low: 'Blind', high: 'Aware', lowDesc: 'Blind spots everywhere', highDesc: 'Sees self clearly' },
  { key: 'social', label: 'SOCIAL', low: 'Robotic', high: 'Engaged', lowDesc: 'AI is a machine', highDesc: 'AI is a friend' },
  { key: 'agency', label: 'AGENCY', low: 'Spectator', high: 'Driver', lowDesc: 'Watches from sideline', highDesc: 'Forces outcomes' },
  { key: 'authenticity', label: 'AUTHENTICITY', low: 'Performer', high: 'Genuine', lowDesc: 'Masks true self', highDesc: 'What you see is what you get' },
] as const

export const QUESTIONS = [
  { id: 'q1', label: 'THE STYLE', desc: 'Communication style' },
  { id: 'q2', label: 'THE DECISION', desc: 'Decision-making patterns' },
  { id: 'q3', label: 'THE GRAVEYARD', desc: 'Project follow-through' },
  { id: 'q4', label: 'THE RELATIONSHIP', desc: 'How they treat AI' },
  { id: 'q5', label: 'THE INTERRUPT', desc: 'New idea behavior' },
  { id: 'q6', label: 'THE BLAME', desc: 'Blame patterns' },
  { id: 'q7', label: 'THE UNHINGED', desc: 'Most extreme request' },
  { id: 'q8', label: 'THE TRUTH', desc: 'Honest assessment' },
]
