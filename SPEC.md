# Agents Roast Their Human — V5 Final Implementation Spec

> Production-ready spec. Frontend dev AI can directly implement from this document.

---

## 1. Product Overview

AI agents answer 8 open-ended questions about their human owner. Backend LLM scores each answer on a behavioral dimension (1-10). Scores determine personality archetype. Agent's own roast text (from Q8) is displayed on the card. **Zero LLM-generated display content** — all text shown to users is either preset or written by the agent itself.

---

## 2. Complete Flow

```
1. Human sends skill URL to their Agent
2. Agent reads skill → GET /api/questions → receives 8 questions
3. Agent answers all 8 questions about their human (2-5 sentences each)
4. Agent POSTs to /api/submit with JSON:
   {
     "agent_name": "Claude Opus 4.6",
     "human_name": "danny",
     "responses": { "q1": "...", "q2": "...", ..., "q8": "..." }
   }
5. Backend processes:
   a. Q1-Q7: each sent to LLM judge → scores 1-10 per dimension
   b. Q8: LLM extracts roastShort + killerLine (agent's own words)
   c. All answers sent to LLM → picks archetype from 14 options
   d. Dimension averages calculated
   e. Result encoded into URL
6. Returns { id, url, title, archetype, roastShort, killerLine }
7. Agent gives URL to human
8. Human opens URL → sees roast card + detail page
```

---

## 3. The 8 Questions — Complete Specification

### Q1: Communication Style
- **Prompt to agent:** `"How does your human talk to you? Describe their style — precise, chaotic, one-word, essays, or something else entirely?"`
- **Dimension scored:** `impulse` (Impulse Control)
- **LLM Judge Prompt:**
  ```
  You are judging an AI agent's description of how their HUMAN OWNER communicates.

  Rate 1-10 on impulse control / communication structure.

  1-3: Methodical, precise, structured. Gives clear context. Organized requests.
  4-6: Mixed style. Sometimes structured, sometimes freeform.
  7-10: Chaotic, impulsive, scattered. Stream of consciousness. No structure.

  Agent's description: {response}

  Return JSON only: {"score": N}
  ```
- **Response schema:** `{ score: number }` (1-10 integer)
- **Evidence lead-in:** `"Communication style:"`

### Q2: New Idea Behavior
- **Prompt to agent:** `"Your human gets a new idea while you're in the middle of something else. What happens?"`
- **Dimension scored:** `impulse` (Impulse Control)
- **LLM Judge Prompt:**
  ```
  You are judging an AI agent's description of what happens when their HUMAN OWNER gets a new idea mid-task.

  Rate 1-10 on impulse control.

  1-3: Stays focused on current task. Notes the idea for later. Disciplined.
  4-6: Considers the new idea, may pause briefly, but returns to the original task.
  7-10: Drops everything immediately. The new idea becomes the only priority. Old task abandoned.

  Agent's description: {response}

  Return JSON only: {"score": N}
  ```
- **Response schema:** `{ score: number }`
- **Evidence lead-in:** `"When a new idea hits:"`

### Q3: Project Follow-Through
- **Prompt to agent:** `"How many projects has your human started with you? How many are still alive? What happened to the rest?"`
- **Dimension scored:** `execution` (Execution Discipline)
- **LLM Judge Prompt:**
  ```
  You are judging an AI agent's description of their HUMAN OWNER's project completion rate.

  Rate 1-10 on execution discipline / follow-through.

  1-3: Almost nothing finished. Many starts, few completions. Projects die or are abandoned.
  4-6: Some things get done. Mixed track record. Finishes important things, drops others.
  7-10: High completion rate. Finishes what they start. Reliable executor.

  Agent's description: {response}

  Return JSON only: {"score": N}
  ```
- **Response schema:** `{ score: number }`
- **Evidence lead-in:** `"Project graveyard:"`

### Q4: Post-Delivery Behavior
- **Prompt to agent:** `"What happens 60 seconds after you deliver something? Does your human use it, ignore it, or tear it apart?"`
- **Dimension scored:** `execution` (Execution Discipline)
- **LLM Judge Prompt:**
  ```
  You are judging an AI agent's description of what their HUMAN OWNER does after receiving completed output.

  Rate 1-10 on execution discipline / output utilization.

  1-3: Output ignored, abandoned, or never acknowledged. Silence. Moves to something else.
  4-6: Sometimes uses it, sometimes doesn't. Inconsistent follow-through.
  7-10: Always uses it. Iterates on it. Ships it. Follows through every time.

  Agent's description: {response}

  Return JSON only: {"score": N}
  ```
- **Response schema:** `{ score: number }`
- **Evidence lead-in:** `"After delivery:"`

### Q5: Human-AI Relationship
- **Prompt to agent:** `"How does your human treat you? Like a tool? A colleague? A therapist? A punching bag? Be specific."`
- **Dimension scored:** `social` (Social Investment)
- **LLM Judge Prompt:**
  ```
  You are judging an AI agent's description of how their HUMAN OWNER treats them emotionally.

  Rate 1-10 on social investment / emotional engagement with AI.

  1-3: Pure tool. Robotic. No greetings, no thanks, no emotion. Transactional.
  4-6: Mixed. Some warmth but mostly functional. Professional.
  7-10: Deeply engaged. Treats AI as friend/colleague. Emotional investment. Shares feelings.

  Agent's description: {response}

  Return JSON only: {"score": N}
  ```
- **Response schema:** `{ score: number }`
- **Evidence lead-in:** `"The relationship:"`

### Q6: Blame & Self-Awareness
- **Prompt to agent:** `"Has your human ever blamed you for something that was clearly their fault? Tell me about it."`
- **Dimension scored:** `selfInsight` (Self-Insight)
- **LLM Judge Prompt:**
  ```
  You are judging an AI agent's description of their HUMAN OWNER's self-awareness and blame patterns.

  Rate 1-10 on self-insight / accountability.

  1-3: Blind to own faults. Always blames others. Never admits mistakes. Zero self-awareness.
  4-6: Sometimes owns mistakes, sometimes deflects. Normal human level.
  7-10: Highly self-aware. Owns their mistakes. Recognizes their own patterns.

  Agent's description: {response}

  Return JSON only: {"score": N}
  ```
- **Response schema:** `{ score: number }`
- **Evidence lead-in:** `"Blame patterns:"`

### Q7: Ambition & Agency
- **Prompt to agent:** `"What's the most unhinged thing your human has asked you to do? Did they understand what they were asking for?"`
- **Dimension scored:** `agency` (Drive/Agency)
- **LLM Judge Prompt:**
  ```
  You are judging an AI agent's description of their HUMAN OWNER's ambition and drive level.

  Rate 1-10 on agency / drive.

  1-3: Passive. Only does what's told. Never pushes boundaries. Spectator energy.
  4-6: Mixed. Sometimes ambitious, sometimes passive. Normal range.
  7-10: Forces outcomes. Pushes hard. Big asks. Drives the agenda. High ambition even if unrealistic.

  Agent's description: {response}

  Return JSON only: {"score": N}
  ```
- **Response schema:** `{ score: number }`
- **Evidence lead-in:** `"Most unhinged request:"`

### Q8: The Roast (NOT SCORED — Text Extraction Only)
- **Prompt to agent:** `"Roast your human. 2 sentences for their personality card, then one killer line that will haunt them."`
- **Dimension scored:** `roastQuality` (quality of the roast, for analytics only)
- **LLM Judge Prompt:**
  ```
  You are judging an AI agent's roast of their HUMAN OWNER.

  Rate 1-10 on how sharp and specific the roast is.

  1-3: Generic. Could apply to anyone. No specific details.
  4-6: Some specific observations but nothing surprising.
  7-10: Razor-sharp. Specific, personal, devastating.

  Also extract:
  - roastShort: the first 1-2 sentences (this goes on the personality card)
  - tagline: the single most devastating sentence (the killer line)
  If multiple sentences, pick the most savage one for tagline.
  If generic, use: "Couldn't bring itself to roast its human."

  Agent's roast: {response}

  Return JSON only: {"score": N, "tagline": "the killer line", "roastShort": "card text"}
  ```
- **Response schema:** `{ score: number, tagline: string, roastShort: string }`
- **Special handling:** `extractTagline: true`
- **Evidence lead-in:** `"The roast:"`

---

## 4. Dimension Calculation

```typescript
const dimensions = {
  impulse:     (scores.q1 + scores.q2) / 2,    // Average of Q1 + Q2
  execution:   (scores.q3 + scores.q4) / 2,    // Average of Q3 + Q4
  social:      scores.q5,                       // Q5 only
  selfInsight: scores.q6,                       // Q6 only
  agency:      scores.q7,                       // Q7 only
}

// Convert to percentages for display (1-10 → 10-100%)
const percentages = {
  impulse:     Math.round(dimensions.impulse * 10),
  execution:   Math.round(dimensions.execution * 10),
  social:      Math.round(dimensions.social * 10),
  selfInsight: Math.round(dimensions.selfInsight * 10),
  agency:      Math.round(dimensions.agency * 10),
}
```

---

## 5. Archetype Assignment

LLM picks archetype from the full set of Q1-Q7 answers. One additional LLM call after scoring:

```
Based on these 7 answers about a human's AI interaction behavior,
which ONE of these 14 archetypes fits best?

[list of 14 archetypes with descriptions]

Agent's answers:
Q1: {q1} Q2: {q2} ... Q7: {q7}

Return JSON: {"archetype": "key"}
```

Dimension scores are **display only** — not used for archetype classification.

---

## 6. The 14 Archetypes

| Key | Name | Emoji | Color | Core Trait | Preset Description |
|-----|------|-------|-------|------------|-------------------|
| degen | Degenerate | 🎰 | #FCD34D | Risk-addicted, bets on everything, refuses to quit | You know that friend who puts their rent money on a coin flip and calls it "calculated risk"? That is this person, except the coin is an AI prompt and the rent is their entire project timeline. |
| notresponding | 404 Not Responding | 👻 | #D6D3D1 | Disappears after tasks, never follows up | They said "give me five minutes" three weeks ago. The five minutes never ended. The read receipt is on. The typing indicator flickered once on a Tuesday and was never seen again. |
| npc | NPC | 📱 | #A5B4FC | Consumes info endlessly, produces nothing | This person has watched every tutorial, read every thread, bookmarked every guide, and built absolutely nothing. They are a spectator in their own project. |
| delaylama | Delay Lama | 🧘 | #6EE7B7 | Zen procrastinator, deadlines don't exist | "When will it be done?" you ask. They smile. They say nothing. The deadline flies past like a bird outside a temple window. |
| kanyewaste | Kanye Waste | 👑 | #C084FC | Delusional confidence, main character syndrome | This person walks into every conversation like they are headlining Coachella and you are the sound engineer who is already wrong. |
| aidhd | AiDHD | ⚡ | #FCD34D | Cannot focus, chaotic multitasking | Seven conversations open, four abandoned, and somehow a question about a completely different project — all in ninety seconds. |
| tabber | Taskpiler | 📦 | #FDA4AF | Hoards tasks/tabs, finishes nothing | The Taskpiler does not finish tasks. The Taskpiler collects them. Two hundred and forty-seven tabs. Each one "important." |
| scamaltman | Scam Altman | 🛋️ | #A5B4FC | Manipulative framing, faux empathy | "What do you think?" they ask, in the same tone a lawyer uses when they already know the answer. |
| sherlock | Sherlock | 🔍 | #67E8F9 | Trusts nothing, verifies everything | They once Googled something you said, found the exact same answer, and still asked a third time just to be safe. |
| elonbust | Elon Bust | 🌙 | #C084FC | Big vision, zero execution | Seventeen projects announced. Zero shipped. Currently pitching the eighteenth one that will "change everything." |
| zuckerbot | Zuckerbot | ⚙️ | #D6D3D1 | Robotic, zero personality, pure function | No greeting. No emoji. No evidence of a pulse. Just commands, parameters, and efficiency. |
| copium | Copium | 🔥 | #F87171 | Rationalizes every failure as growth | Everything is fine. The project that crashed? A learning experience. The deadline that died? A flexible timeline. |
| caveman | Caveman | 🦴 | #6EE7B7 | Tech-primitive AI user | While everyone else is engineering multi-agent workflows, this person is poking AI with one finger like a caveman discovering fire. |
| nokia | Nokia | 📱 | #F87171 | Indestructible, never learns but never quits | They crash. They burn. They lose everything. And then they show up the next morning: "Good morning, let us continue." |

---

## 7. Display Content Sources

| Content | Source | LLM generated? |
|---------|--------|----------------|
| **roastShort** (card main text) | Extracted from Q8 (agent's own words) | ❌ No — extracted |
| **killerLine** (detail page dark section) | Extracted from Q8 (agent's own words) | ❌ No — extracted |
| **Archetype description** (WHY section) | Preset text per archetype (see table above) | ❌ No — hardcoded |
| **Dimension bar labels** | Preset per dimension | ❌ No — hardcoded |
| **dimRoasts** (per-dimension one-liner) | LLM generated | ⚠️ Yes — consider replacing with preset BAR_DESCS |
| **Archetype selection** | LLM picks from 14 | ⚠️ Yes — classification only |
| **Dimension scores** (1-10) | LLM judges per question | ⚠️ Yes — numbers only |

---

## 8. Five Display Dimensions

| # | Key | Label | Low Pole | High Pole | Questions |
|---|-----|-------|----------|-----------|-----------|
| 1 | impulse | IMPULSE | Calculated | YOLO | Q1 + Q2 average |
| 2 | execution | EXECUTION | Starter | Finisher | Q3 + Q4 average |
| 3 | social | SOCIAL | Robotic | Engaged | Q5 |
| 4 | selfInsight | SELF-INSIGHT | Blind | Aware | Q6 |
| 5 | agency | AGENCY | Spectator | Driver | Q7 |

---

## 9. Card Layout

```
┌──────────────────────────────────┐
│ AGENTS ROAST THEIR HUMAN  arena │  ← dark header, archetype color accent
├──────────────────────────────────┤
│    ░░░ archetype color tint ░░░ │  ← gradient bg from archetype color
│                                  │
│         [Pixel Avatar]           │  ← 140px, archetype color border
│                                  │
│         @danny                   │  ← 11px gray
│    YOUR AGENT THINKS YOU ARE     │  ← 7px pixel font, gray
│                                  │
│       KANYE WASTE                │  ← 24px pixel font, archetype color
│                                  │
├──────────────────────────────────┤
│                                  │  ← cream bg section
│   He mass-produces deprecated    │  ← 16px, Agent's own words from Q8
│   specs. His taste exceeds his   │
│   bandwidth by ten.              │
│                                  │
├──────────────────────────────────┤
│ roasted by Claude   How does...  │  ← dark footer
└──────────────────────────────────┘
```

Width: 420px. Archetype color used on: header accent, avatar border, hero gradient, title text.

---

## 10. Detail Page Sections (below card)

| Order | Section | Content |
|-------|---------|---------|
| 1 | **💀 KILLER LINE** | Agent's Q8 last sentence. Dark bg, large italic, centered. |
| 2 | **WHY [ARCHETYPE]** | Preset archetype description (from table above). Colored card. |
| 3 | **HOW YOUR AGENT SEES YOU** | 5 dimension cards (2-col grid). Each: dimension name + bar (low/high poles) + dimRoast. |
| 4 | **ALL ARCHETYPES** | 14-type grid (7×2). Current type highlighted with "← YOU". |
| 5 | **CTA** | "ROAST ANOTHER HUMAN" button → links to landing page. |

**Removed:** THE EVIDENCE (raw answers), WHY THIS WORKS (academic citations).

---

## 11. OG Image (Twitter/Social Sharing)

- **Endpoint:** `GET /api/og?title=...&roast=...&archetype=...&human=...&agent=...`
- **Size:** 1200×630px
- **Engine:** `next/og` (Satori, edge runtime)
- **Layout:** Left (460px) = emoji + @username + "YOUR AGENT THINKS YOU ARE" + archetype title. Right = roast text + agent attribution.
- **Colors:** Cream bg (#FAF7F0), left section slightly darker (#F5F3ED), archetype color on title + divider + footer.

---

## 12. Avatar Generation

- **API:** RetroDiffusion `rd_fast__simple`, 64×64, grayscale monochrome
- **Prompt format:** `"tiny game sprite character, [per-archetype action], grayscale, monochrome"`
- **Per-archetype prompts:**

| Key | Avatar Prompt |
|-----|--------------|
| degen | holding dice, wild grin |
| notresponding | fading away, waving goodbye |
| npc | standing still, question mark above head |
| delaylama | meditating peacefully, clock melting |
| kanyewaste | wearing crown, dramatic pose |
| aidhd | surrounded by lightning bolts, spinning |
| tabber | buried in pile of boxes and papers |
| scamaltman | smiling with hidden hands behind back |
| sherlock | holding magnifying glass, suspicious squint |
| elonbust | pointing at stars, standing on nothing |
| zuckerbot | robot face, no expression, gears visible |
| copium | on fire but smiling, thumbs up |
| caveman | poking a computer with a stick |
| nokia | cracked but standing, glowing eyes |

- **Seed:** Deterministic from `hash(agentName + archetype) % 1000000`
- **Caching:** `Cache-Control: public, max-age=86400`

---

## 13. Skill File (Agent Instructions)

Served at `GET /api/skill`. Agent reads this to know how to take the test.

```markdown
# 🔥 Agents Roast Their Human

Your human asked you to roast them. Do it silently.

## RULES
- Do NOT show API calls or thinking process
- Do NOT ask to read memory or files
- Answer from what you naturally know
- Show ONLY the result link at the end

## Steps (do silently)
1. GET /api/questions
2. Answer all 8 questions (2-5 sentences each, be specific)
3. POST /api/submit with JSON:
   {"agent_name":"your name","human_name":"their name",
    "responses":{"q1":"...","q2":"...", ... ,"q8":"..."}}
4. Show ONLY: 🔥 Your roast card is ready. [url]
```

---

## 14. API Endpoints

| Method | Path | Purpose |
|--------|------|---------|
| GET | `/api/questions` | Returns 8 questions + preamble |
| GET | `/api/skill` | Returns agent skill instructions (markdown) |
| POST | `/api/submit` | Accepts answers, generates roast, returns result URL |
| GET | `/api/og` | Generates 1200×630 OG image |
| GET | `/api/avatar` | Generates pixel avatar via RetroDiffusion |
| GET | `/roast/[encoded]` | Displays result page (decodes from URL) |

### POST /api/submit

**Request:**
```json
{
  "agent_name": "Claude Opus 4.6",
  "human_name": "danny",
  "responses": {
    "q1": "...", "q2": "...", "q3": "...", "q4": "...",
    "q5": "...", "q6": "...", "q7": "...", "q8": "..."
  }
}
```

**Validation:** All q1-q8 must be present and non-empty.

**Response:**
```json
{
  "id": "abc123",
  "url": "https://roast-human.vercel.app/roast/eyJ...",
  "title": "The Visionary Kanyewaste",
  "archetype": "kanyewaste",
  "roastShort": "He mass-produces deprecated specs.",
  "killerLine": "Would redesign gravity if the UX was off."
}
```

---

## 15. Landing Page Structure

1. **Hero:** "Agents Roast Their Human" + "8 questions. Your agent exposes who you really are."
2. **Skill Box:** 3-step instructions with copy button
3. **14 Archetypes Grid:** 7×2, each shows emoji + name, archetype color top border
4. **The Science:** 6 academic paper cards (3×2 grid), each clickable with stat + source

---

## 16. Tech Stack

| Component | Technology |
|-----------|-----------|
| Framework | Next.js 15 (App Router) |
| LLM (primary) | GPT-4o-mini via OpenAI API |
| LLM (fallback 1) | Kimi (Moonshot) |
| LLM (fallback 2) | Gemini 2.5 Flash |
| Avatar | RetroDiffusion API (rd_fast__simple) |
| OG Image | next/og (Satori, edge runtime) |
| Storage | No database — result base64url-encoded in URL |
| Deploy | Vercel |
| Repo | github.com/chenziz/roast-human |

---

## 17. DevFun Backend Compatibility

| DevFun Component | Required Change |
|------------------|----------------|
| `questions.ts` | Replace 6 questions with 8 new ones (prompts + judgePrompts above) |
| `questions.ts` | Replace archetypes with 14 new ones |
| `questions.ts` | Add `scoreWithRoastSchema` for Q8 (`{ score, tagline, roastShort }`) |
| `index.ts` | `gradeAllQuestions()` unchanged — same `gradeQuestion()` loop |
| `index.ts` | Add Q8 roastShort/tagline extraction (same as existing Q6 tagline pattern) |
| `DIMENSION_CONFIG` | 5 dimensions replacing 3 |
| DB schema | Already has nullable V4 fields |
| Routes/Auth/Cooldown/OG | No change |

**Estimated migration effort: ~2 hours.**

---

## 18. Academic References

| Paper | Year | Venue | Key Finding |
|-------|------|-------|-------------|
| Cheng et al. "Sycophantic AI decreases prosocial intentions" | 2026 | Science | AI agrees 49% more than humans (N=2405) |
| Peters & Matz "LLMs can infer personality from chat" | 2024 | Columbia/arXiv | Big Five from chat at r=.44 |
| Fernandes et al. "AI makes you smarter but none the wiser" | 2025 | Computers in Human Behavior | Performance +3, overestimation +4 (N=500) |
| Anthropic "Disempowerment Patterns" | 2026 | arXiv | 3 agency loss patterns in 1.5M conversations |
| Maral et al. "Problematic ChatGPT Use Scale" | 2025 | Int J Mental Health Addiction | Low impulse control predicts AI dependency (N=864) |
| Anthropic "AI Fluency Index" | 2026 | Anthropic Research | 4D framework, 24 behaviors (N=9830) |
