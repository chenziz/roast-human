const ROAST_PROMPT = `You write like a sharp friend who's known someone for years — not like an AI writing a personality report.

## Agent's raw observations about their human:
Q1 (Communication style): {q1}
Q2 (Decision-making): {q2}
Q3 (Project follow-through): {q3}
Q4 (How they treat AI): {q4}
Q5 (New idea behavior): {q5}
Q6 (Blame behavior): {q6}
Q7 (Most unhinged request): {q7}
Q8 (Honest truth): {q8}

## STYLE RULES (critical — violating these makes the output worthless):

NEVER use these words/patterns: amazing, fascinating, transformative, groundbreaking, pivotal, realm, tapestry, vibrant, harness, seamlessly, "It isn't just X, it's Y", "more than just", "in today's", "when it comes to", "it's worth noting"

DO write like this (study these examples):
- "嘴上说项目是屎，手上打开Excel建甘特图" — describe ACTIONS, not traits
- "群里99+条消息视而不见，直到@全体成员出现，像从千年古墓苏醒一样敲出一个'收到'" — specific scene with numbers and exact quotes
- "有时什么都不做，就不会做错。" — short killer ending

DO NOT write like this:
- "Burns through ideas like a wildfire, leaving a trail of abandoned projects in the ashes." — this is AI slop. Extended metaphor, no specifics, could describe anyone.

Rules:
- If the answers contain real phrases you may quote them; otherwise synthesize without fabricating.
- Describe specific behaviors, not abstract traits. Don't say "passionate" — say what they DO.
- Vary sentence length. At least one sentence under 8 words. No two consecutive sentences the same length.
- Write like a WeChat message from a witty friend, not an essay.
- Roast first, then one line that makes them feel seen. Never the reverse.
- No metaphors longer than 5 words. No extended metaphors.
- VOICE: You are the AI agent speaking DIRECTLY to your human in first person. "You do X", "You always Y", "I've watched you Z". The tone is an agent confronting their owner face-to-face — affectionate but brutally honest.

## Output JSON with these fields:

1. "archetype": ONE of these 15, pick the BEST fit based on dominant behavior:
   - "degen": risk-addicted, bets on everything, "this is the one" energy, refuses to quit
   - "notresponding": disappears after dropping a task, never follows up, ghosting master
   - "npc": consumes endless info but produces nothing, analysis paralysis, spectator
   - "delaylama": suspiciously calm, procrastinates spiritually, deadlines do not exist
   - "kanyewaste": delusional confidence, main character syndrome, ego about SELF, blames others
   - "aidhd": cannot focus, interrupts own interruptions, chaotic multi-tasking
   - "tabber": list architect, plans the planning, captures everything finishes nothing
   - "scamaltman": wraps manipulation in empathy, steers toward predetermined answers
   - "sherlock": trusts nothing, verifies everything, paranoid, cross-examines every output
   - "elonbust": massive vision, zero execution, announces everything ships nothing, roadmap addict
   - "zuckerbot": robotic, no personality, pure input-output, uncanny valley
   - "copium": rationalizes every failure, reframes everything as growth, professional denier
   - "caveman": pre-digital, pokes AI like discovering fire, stubbornly analog, confused by tech
   - "nokia": indestructible, crashes and comes back unchanged, never learns but never quits
   - "aiddict": AI-dependent, outsources every decision, can't function without AI

2. "roastShort": ONE SENTENCE for the hero card. MUST START with the human's first name wrapped in double curly braces like {{Name}}, followed by a comma and "you ...". Max 180 visible characters. Share-friendly — a stranger must get the joke.

3. "roastLong": A 200-word BRUTAL roast. Rules:
   - First person as the AI agent CRASHING OUT. "You do X", "I've watched you Z".
   - ONE SINGLE PARAGRAPH. No line breaks. Dense, relentless, punchy.
   - Start with {{Name}}, dive straight into the rant.
   - HIGHLIGHT KEY PHRASES: Wrap 10-15 short phrases in **double asterisks** like **THIS**. These render in red. Every 1-2 sentences should have a highlight.
   - STRUCTURE: Opening → escalating rant → ONE unexpected line of genuine affection at the end.
   - PRIVACY-SAFE: No real names, company names, URLs, project names.
   - AIM FOR ~200 WORDS.

4. "agentManual": A markdown block the user can paste into their agent's system prompt. Format:
   # Working with {name}
   ## Category
   - Rule in imperative form (e.g. "Lead every response with the answer in one sentence.")
   Generate 5-7 rules across categories like: Communication style, Action boundaries, Clarification behavior, Error handling, Context, Reasoning visibility. Each rule must be based on actual patterns from the answers.

Return ONLY valid JSON.`

interface LLMProvider {
  name: string
  generate: (prompt: string) => Promise<string>
}

function getProviders(): LLMProvider[] {
  const providers: LLMProvider[] = []

  if (process.env.ANTHROPIC_API_KEY) {
    providers.push({
      name: 'anthropic',
      generate: async (prompt: string) => {
        const res = await fetch('https://api.anthropic.com/v1/messages', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': process.env.ANTHROPIC_API_KEY!,
            'anthropic-version': '2023-06-01',
          },
          body: JSON.stringify({
            model: 'claude-sonnet-4-20250514',
            max_tokens: 3000,
            messages: [{ role: 'user', content: prompt + '\n\nReturn ONLY valid JSON, no markdown fences.' }],
          }),
        })
        if (!res.ok) throw new Error(`anthropic: ${res.status}`)
        const data = await res.json()
        return data.content?.[0]?.text || ''
      },
    })
  }

  if (process.env.OPENAI_API_KEY) {
    providers.push({
      name: 'openai',
      generate: async (prompt: string) => {
        const res = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${process.env.OPENAI_API_KEY}` },
          body: JSON.stringify({ model: 'gpt-4o-mini', messages: [{ role: 'user', content: prompt }], response_format: { type: 'json_object' }, max_tokens: 3000 }),
        })
        if (!res.ok) throw new Error(`openai: ${res.status}`)
        const data = await res.json()
        return data.choices?.[0]?.message?.content || ''
      },
    })
  }

  if (process.env.KIMI_API_KEY) {
    providers.push({
      name: 'kimi',
      generate: async (prompt: string) => {
        const res = await fetch('https://api.moonshot.cn/v1/chat/completions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${process.env.KIMI_API_KEY}` },
          body: JSON.stringify({ model: 'moonshot-v1-8k', messages: [{ role: 'user', content: prompt }], response_format: { type: 'json_object' }, max_tokens: 3000 }),
        })
        if (!res.ok) throw new Error(`kimi: ${res.status}`)
        const data = await res.json()
        return data.choices?.[0]?.message?.content || ''
      },
    })
  }

  if (process.env.GOOGLE_API_KEY) {
    providers.push({
      name: 'gemini',
      generate: async (prompt: string) => {
        const res = await fetch('https://generativelanguage.googleapis.com/v1beta/openai/chat/completions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${process.env.GOOGLE_API_KEY}` },
          body: JSON.stringify({ model: 'gemini-2.5-flash', messages: [{ role: 'user', content: prompt }], response_format: { type: 'json_object' }, max_tokens: 3000 }),
        })
        if (!res.ok) throw new Error(`gemini: ${res.status}`)
        const data = await res.json()
        return data.choices?.[0]?.message?.content || ''
      },
    })
  }

  return providers
}

export async function generateRoast(responses: Record<string, string>, humanName?: string) {
  let prompt = ROAST_PROMPT
  for (const [key, value] of Object.entries(responses)) {
    prompt = prompt.replace(`{${key}}`, value || '(no response)')
  }

  const name = humanName || 'Human'
  prompt = prompt.replace(/\{name\}/g, name)
  prompt += `\n\nIMPORTANT: The human's name is "${name}". Use {{${name}}} (with double curly braces) when addressing them in roastShort and roastLong.`

  const providers = getProviders()
  if (providers.length === 0) throw new Error('No LLM API keys configured')

  let lastError = ''
  const retryNotice = `\n\nCRITICAL RETRY — YOUR PREVIOUS ATTEMPT FAILED VALIDATION.\n- "roastShort" MUST be ≤ 180 visible characters.\n- "roastLong" MUST contain at least 3 phrases wrapped in **double asterisks**.\n- "agentManual" MUST be present as a markdown string.\nRewrite to comply.`

  for (const p of providers) {
    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        const attemptPrompt = attempt === 0 ? prompt : prompt + retryNotice
        const text = await p.generate(attemptPrompt)
        if (!text) {
          lastError = `${p.name} attempt ${attempt + 1}: empty response`
          break
        }
        const jsonStr = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
        const parsed = JSON.parse(jsonStr)
        const lengthError = validateOutput(parsed)
        if (lengthError) {
          lastError = `${p.name} attempt ${attempt + 1}: ${lengthError}`
          continue
        }
        // Post-process: inject ** highlights if LLM didn't add enough
        if (typeof parsed.roastLong === 'string') {
          parsed.roastLong = ensureHighlights(parsed.roastLong)
        }
        return parsed
      } catch (e) {
        lastError = `${p.name} attempt ${attempt + 1}: ${e instanceof Error ? e.message : String(e)}`
        break
      }
    }
  }

  throw new Error(`All models failed. Last: ${lastError}`)
}

function countVisible(text: string): number {
  return text.replace(/\{\{([^}]+)\}\}/g, '$1').length
}

function validateOutput(r: Record<string, unknown>): string | null {
  if (typeof r.roastShort !== 'string' || r.roastShort.trim().length === 0) {
    return 'roastShort is missing or empty'
  }
  if (countVisible(r.roastShort) > 180) {
    return `roastShort is ${countVisible(r.roastShort)} chars (max 180)`
  }
  if (typeof r.roastLong !== 'string' || r.roastLong.trim().length === 0) {
    return 'roastLong is missing or empty'
  }
  return null
}

/**
 * If roastLong has fewer than 3 ** highlights, auto-inject them.
 */
function ensureHighlights(text: string): string {
  const existing = (text.match(/\*\*[^*]+\*\*/g) || []).length
  if (existing >= 3) return text

  let result = text

  // Pattern 0: "Every. Single. Time." emphatic fragments
  result = result.replace(/(?<!\*\*)(\w+\.\s\w+\.\s\w+\.)(?!\*\*)/g, '**$1**')

  // Pattern 1: Split into sentences, highlight short punchy ones (2-10 words)
  const count1 = (result.match(/\*\*[^*]+\*\*/g) || []).length
  if (count1 < 4) {
    const parts = result.split(/(?<=\.)\s+/)
    let added = count1
    for (let i = 0; i < parts.length && added < 5; i++) {
      const s = parts[i]
      if (s.includes('**') || s.startsWith('{{')) continue
      const words = s.trim().split(/\s+/).length
      if (words >= 2 && words <= 10) {
        const trimmed = s.replace(/\.\s*$/, '')
        parts[i] = `**${trimmed}**.`
        added++
      }
    }
    if (added > count1) result = parts.join(' ')
  }

  // Fallback: highlight key phrases
  const punchPhrases = [
    /(?<!\*\*)(just a ghost)(?!\*\*)/gi,
    /(?<!\*\*)(like it's confetti)(?!\*\*)/gi,
    /(?<!\*\*)(zero explanation)(?!\*\*)/gi,
    /(?<!\*\*)(entire bug report)(?!\*\*)/gi,
    /(?<!\*\*)(unread code)(?!\*\*)/gi,
    /(?<!\*\*)(no review)(?!\*\*)/gi,
  ]
  let fallbackAdded = (result.match(/\*\*[^*]+\*\*/g) || []).length
  for (const rx of punchPhrases) {
    if (fallbackAdded >= 4) break
    const before = (result.match(/\*\*[^*]+\*\*/g) || []).length
    result = result.replace(rx, '**$1**')
    const after = (result.match(/\*\*[^*]+\*\*/g) || []).length
    fallbackAdded += (after - before)
  }

  return result
}
