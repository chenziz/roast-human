import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs'
import { join } from 'path'
import type { RoastResult } from './types'

// Simple file-based store for MVP. Each roast is a JSON file in /tmp/roasts/
const STORE_DIR = process.env.VERCEL ? '/tmp/roasts' : join(process.cwd(), '.data/roasts')

function ensureDir() {
  if (!existsSync(STORE_DIR)) {
    mkdirSync(STORE_DIR, { recursive: true })
  }
}

export function saveRoast(result: RoastResult): void {
  ensureDir()
  writeFileSync(join(STORE_DIR, `${result.id}.json`), JSON.stringify(result, null, 2))
}

export function getRoast(id: string): RoastResult | null {
  ensureDir()
  const path = join(STORE_DIR, `${id}.json`)
  if (!existsSync(path)) return null
  return JSON.parse(readFileSync(path, 'utf-8'))
}

export function generateId(): string {
  return Math.random().toString(36).slice(2, 14)
}
