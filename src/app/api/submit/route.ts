import { NextRequest, NextResponse } from 'next/server'
import { generateRoast } from '@/lib/generate'
import { generateId, saveRoast, encodeRoast } from '@/lib/store'
import type { RoastResult } from '@/lib/types'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    // Accept common field name variations agents might use
    const responses = body.responses || body.answers
    const agentName = body.agent_name || body.agentName || body.agent || 'Anonymous Agent'
    const humanName = body.human_name || body.humanName || body.human || 'Human'

    if (!responses || !responses.q1) {
      return NextResponse.json({ error: 'Missing "responses" object with keys q1-q8. Example: {"responses":{"q1":"...","q2":"...",...,"q8":"..."}}' }, { status: 400 })
    }

    // Single LLM call: 8 open-ended answers → archetype + roast + dims + manual
    const roast = await generateRoast(responses, humanName)

    const id = generateId()
    const trimStr = (s: string, max: number) => s && s.length > max ? s.slice(0, max) + '...' : s

    // Persist the open-ended answers so the Evidence section can render them
    const trimmedResponses: Record<string, string> = {}
    for (const key of ['q1', 'q2', 'q3', 'q4', 'q5', 'q6', 'q7', 'q8']) {
      const v = responses[key]
      if (typeof v === 'string' && v.trim()) {
        trimmedResponses[key] = trimStr(v.trim(), 400)
      }
    }

    const result: RoastResult = {
      id,
      agentName,
      humanName,
      archetype: roast.archetype as string,
      roastShort: trimStr(roast.roastShort as string, 220),
      roastLong: trimStr((roast.roastLong as string) || '', 1500),
      dimensionAnswers: {},
      responses: trimmedResponses,
      agentManual: trimStr(
        Array.isArray(roast.agentManual) ? roast.agentManual.join('\n') : String(roast.agentManual || ''),
        1800,
      ),
    }

    // Try Redis first, fall back to base64 URL if Redis not configured
    let roastSlug = id
    try {
      await saveRoast(result)
    } catch (e) {
      console.warn('Redis save failed, falling back to base64 URL:', e instanceof Error ? e.message : e)
      roastSlug = encodeRoast(result)
    }

    const host = request.headers.get('host') || 'localhost:3888'
    const protocol = host.includes('localhost') ? 'http' : 'https'
    const url = `${protocol}://${host}/roast/${roastSlug}`

    return NextResponse.json({
      id,
      url,
      archetype: roast.archetype,
      roastShort: roast.roastShort,
    })
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error)
    console.error('Submit error:', msg, error)
    return NextResponse.json(
      { error: `Failed to generate roast: ${msg}` },
      { status: 500 },
    )
  }
}
