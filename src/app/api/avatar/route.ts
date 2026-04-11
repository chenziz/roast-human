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
    gambler: 'a deranged gambler with wild eyes, throwing flaming dice in the air, manic grin, sweat drops flying, extreme expression',
    ghost: 'a glitching ghost screaming silently, half-transparent body dissolving into pixels, hollow eyes, dramatic horror pose',
    surgeon: 'an unhinged surgeon with bloodshot eyes behind cracked glasses, scalpel raised dramatically, manic precision, sweat beads',
    doomscroller: 'a zombie-eyed creature melting into a phone screen, bags under eyes the size of luggage, soul leaving body, dramatic exhaustion',
    arsonist: 'a cackling maniac surrounded by towering flames, eyes reflecting fire, wild hair standing up, holding a match with insane glee',
    monk: 'a monk achieving violent enlightenment, third eye blasting open with light beams, serene face but everything around exploding',
    diva: 'a dramatic royalty mid-tantrum, crown flying off, cape billowing, pointing accusingly, tears of rage and sparkles everywhere',
    speedrunner: 'a blur of pure speed with afterimages, shoes on fire, eyes bulging from g-force, sonic boom rings around them',
    hoarder: 'a creature buried alive in an avalanche of boxes and papers, one hand reaching out desperately, overwhelmed but grinning',
    therapist: 'a therapist whose own soul is leaving their body while taking notes, dead inside but smiling warmly, visible stress cracks',
    detective: 'a paranoid detective with five magnifying glasses, conspiracy strings everywhere, bloodshot suspicious eyes, extreme distrust face',
    dreamer: 'a figure floating in space with galaxies in their eyes, completely disconnected from reality, peaceful but absurdly detached',
    machine: 'a half-robot with glowing circuit eyes, steam shooting from ears, processing overload, sparks flying, emotionless efficiency',
    cheerleader: 'an absurdly enthusiastic character with eyes made of literal stars, screaming with joy, confetti explosion, maximum hype energy',
    rewriter: 'a frantic writer drowning in crumpled papers, ink-stained face, wild eyes, surrounded by a tornado of drafts, pure chaos',
    phoenix: 'a figure dramatically exploding into flames and being reborn simultaneously, screaming triumphantly, feathers of fire everywhere',
    skeptic: 'a character with the most extreme side-eye ever, one eyebrow in orbit, arms crossed so hard they might snap, pure doubt',
    conductor: 'a wild conductor mid-crescendo, baton crackling with lightning, hair standing on end, orchestrating pure chaos into order',
    tourist: 'a completely lost tourist with maps flying everywhere, camera tangled around neck, spinning in circles, joyful confusion',
    perfectionist: 'a character having a breakdown over a microscopic flaw, magnifying glass cracking from intensity, one pixel out of place, dramatic anguish',
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
        prompt: `pixel art portrait, extreme exaggerated expression, parabolic emotion, ${archetypePrompt}`,
        prompt_style: 'rd_fast__portrait',
        width: 128,
        height: 128,
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
          'Cache-Control': 'public, max-age=31536000, immutable',
        },
      })
    }

    return NextResponse.json({ error: 'No image generated', balance: data.remaining_balance, raw: JSON.stringify(data).slice(0, 200) }, { status: 500 })
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 })
  }
}
