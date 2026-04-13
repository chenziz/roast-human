import { Redis } from '@upstash/redis'
import type { RoastResult } from './types'

// Lazy-init Redis client. Vercel Marketplace Upstash integration injects
// KV_REST_API_URL / KV_REST_API_TOKEN automatically.
let _redis: Redis | null = null
function redis(): Redis | null {
  if (_redis) return _redis
  const url = process.env.KV_REST_API_URL
  const token = process.env.KV_REST_API_TOKEN
  if (!url || !token) return null
  _redis = new Redis({ url, token })
  return _redis
}

const KEY_PREFIX = 'roast:'
const TTL_SECONDS = 60 * 60 * 24 * 365 // 1 year

export async function saveRoast(result: RoastResult): Promise<void> {
  const r = redis()
  if (!r) throw new Error('Redis not configured (KV_REST_API_URL / KV_REST_API_TOKEN missing)')
  await r.set(KEY_PREFIX + result.id, JSON.stringify(result), { ex: TTL_SECONDS })
}

export async function loadRoast(idOrBlob: string): Promise<RoastResult | null> {
  if (idOrBlob.length <= 32 && /^[a-z0-9]+$/i.test(idOrBlob)) {
    const r = redis()
    if (!r) return null
    try {
      const raw = await r.get<string | RoastResult>(KEY_PREFIX + idOrBlob)
      if (!raw) return null
      return typeof raw === 'string' ? JSON.parse(raw) : raw
    } catch {
      return null
    }
  }
  return decodeRoast(idOrBlob)
}

export function encodeRoast(result: RoastResult): string {
  const json = JSON.stringify(result)
  const b64 = Buffer.from(json).toString('base64url')
  return b64
}

export function decodeRoast(encoded: string): RoastResult | null {
  try {
    const json = Buffer.from(encoded, 'base64url').toString('utf-8')
    return JSON.parse(json)
  } catch {
    return null
  }
}

export function generateId(): string {
  return Math.random().toString(36).slice(2, 14)
}

export function stripNamePlaceholder(text: string): string {
  return text.replace(/\{\{([^}]+)\}\}/g, '$1')
}

export function pickTrait(traits: string[], seed: string): string {
  if (!traits.length) return ''
  let hash = 0
  for (let i = 0; i < seed.length; i++) {
    hash = ((hash << 5) - hash + seed.charCodeAt(i)) | 0
  }
  return traits[Math.abs(hash) % traits.length]
}

export function renderRoastShort(roastShort: string, humanName: string): string {
  if (!roastShort) return ''
  if (!humanName) return roastShort
  if (roastShort.startsWith('{{')) return roastShort
  const wrapped = `\{\{${humanName}\}\}`
  if (roastShort.startsWith(humanName)) {
    return wrapped + roastShort.slice(humanName.length)
  }
  return `${wrapped}, ${roastShort.charAt(0).toLowerCase()}${roastShort.slice(1)}`
}
