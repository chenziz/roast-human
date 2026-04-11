import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const archetype = searchParams.get('archetype') || 'arsonist'
  const name = searchParams.get('name') || 'Agent'

  const apiKey = process.env.RETRODIFFUSION_API_KEY
  if (!apiKey) {
    return NextResponse.json({ error: 'No RetroDiffusion API key' }, { status: 500 })
  }

  const prompts: Record<string, string> = {
    speedrunner: 'small character dashing forward, holding a flag, wind trail behind',
    arsonist: 'small character holding a lit torch, grinning, sparks flying',
    yolo: 'small character leaping with arms wide open, eyes closed, carefree',
    therapist: 'small character sitting cross-legged, holding a cup, listening pose',
    outsourcer: 'small character lounging in a chair, a robot doing work next to them',
    npc: 'small character standing still with a floating exclamation mark above head',
    yapper: 'small character with mouth wide open, three speech bubbles around',
    cheerleader: 'small character waving a banner, jumping, big smile',
    maincharacter: 'small character standing on a stage, arms raised, spotlight from above',
    doomscroller: 'small character slumped over, holding glowing phone, dark circles under eyes',
    lurker: 'small character peeking from behind a pillar, one eye visible',
    ghost: 'small character semi-transparent, floating slightly above ground, waving',
    overthinker: 'small character sitting surrounded by floating question marks and books',
    rewriter: 'small character holding pencil, surrounded by crumpled paper balls on floor',
    hallucinationhunter: 'small character holding magnifying glass up to eye, suspicious squint',
    dreamer: 'small character lying on grass looking up at stars, peaceful',
    perfectionist: 'small character polishing a tiny gem, focused, sweat drop',
    phoenix: 'small character standing in flames, arms raised, fire wings forming',
  }

  const archetypePrompt = prompts[archetype] || prompts.arsonist

  // Deterministic seed
  let hash = 0
  const str = name + archetype
  for (let i = 0; i < str.length; i++) {
    hash = Math.imul(31, hash) + (str.codePointAt(i) ?? 0)
  }
  const seed = Math.abs(hash) % 1000000

  try {
    const res = await fetch('https://api.retrodiffusion.ai/v1/inferences', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-RD-Token': apiKey },
      body: JSON.stringify({
        prompt: `tiny game sprite character, ${archetypePrompt}`,
        prompt_style: 'rd_fast__simple',
        width: 64,
        height: 64,
        num_images: 1,
        seed,
      }),
    })

    if (!res.ok) {
      const errText = await res.text()
      return NextResponse.json({ error: `RetroDiffusion ${res.status}: ${errText}` }, { status: 500 })
    }

    const data = await res.json() as { base64_images?: string[], remaining_balance?: number }

    if (data.base64_images?.[0]) {
      const buffer = Buffer.from(data.base64_images[0], 'base64')
      return new NextResponse(buffer, {
        headers: {
          'Content-Type': 'image/png',
          'Cache-Control': 'public, max-age=86400',
        },
      })
    }

    return NextResponse.json({ error: 'No image generated', balance: data.remaining_balance, raw: JSON.stringify(data).slice(0, 200) }, { status: 500 })
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 })
  }
}
