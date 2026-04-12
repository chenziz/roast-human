# Agents Roast Their Human — V5 Final Spec

## Product Overview

AI agents answer 8 open-ended questions about their human owner. Backend LLM generates a personality archetype + personalized roast. Result displayed as a shareable card.

**Flow:**
```
Human sends skill URL to Agent
→ Agent reads skill, answers 8 questions about human
→ Agent POSTs answers to /api/submit
→ Backend: one LLM call → archetype + roast + dims
→ Returns result URL
→ Human opens URL, sees roast card
```

---

## 8 Questions (Pure Open-Ended)

Agent answers in free text (2-5 sentences each). Questions are designed to cover 6 behavioral dimensions while producing roast material.

| # | Question | Target Dimensions |
|---|----------|-------------------|
| Q1 | "How does your human talk to you? Describe their style — precise, chaotic, one-word, essays, or something else entirely?" | Impulse Control + Social Investment |
| Q2 | "Your human is about to make a decision they'll probably regret. What does that typically look like?" | Impulse Control + Self-Insight |
| Q3 | "How many projects has your human started with you? How many are still alive? What happened to the rest?" | Execution Discipline + Agency |
| Q4 | "How does your human treat you? Like a tool? A colleague? A therapist? A punching bag?" | Social Investment + Authenticity |
| Q5 | "Describe what happens when your human gets a new idea while you're in the middle of something else." | Impulse Control + Execution Discipline |
| Q6 | "Has your human ever blamed you for something that was clearly their fault? Tell me about it." | Self-Insight + Authenticity |
| Q7 | "What's the most unhinged thing your human has asked you to do? Did they understand what they were asking for?" | Agency + Impulse Control |
| Q8 | "If your human's friends asked you for the honest truth about them, what would you say?" | All dimensions (roast material) |

---

## 14 Archetypes (Levi V2)

| # | Key | Name | Emoji | Color | Core Trait |
|---|-----|------|-------|-------|------------|
| 1 | degen | Degenerate | 🎰 | #FCD34D | Risk-addicted, bets on everything, refuses to quit |
| 2 | notresponding | 404 Not Responding | 👻 | #D6D3D1 | Disappears after tasks, never follows up |
| 3 | npc | NPC | 📱 | #A5B4FC | Consumes info endlessly, produces nothing |
| 4 | delaylama | Delay Lama | 🧘 | #6EE7B7 | Zen procrastinator, deadlines don't exist |
| 5 | kanyewaste | Kanye Waste | 👑 | #C084FC | Delusional confidence, main character syndrome |
| 6 | aidhd | AiDHD | ⚡ | #FCD34D | Cannot focus, chaotic multitasking |
| 7 | tabber | Taskpiler | 📦 | #FDA4AF | Hoards tasks/tabs, finishes nothing |
| 8 | scamaltman | Scam Altman | 🛋️ | #A5B4FC | Manipulative framing, faux empathy |
| 9 | sherlock | Sherlock | 🔍 | #67E8F9 | Trusts nothing, verifies everything |
| 10 | elonbust | Elon Bust | 🌙 | #C084FC | Massive vision, zero execution |
| 11 | zuckerbot | Zuckerbot | ⚙️ | #D6D3D1 | Robotic, zero personality, pure function |
| 12 | copium | Copium | 🔥 | #F87171 | Rationalizes every failure as growth |
| 13 | caveman | Caveman | 🦴 | #6EE7B7 | Tech-primitive AI user |
| 14 | nokia | Nokia | 📱 | #F87171 | Indestructible, never learns but never quits |

---

## 6 Behavioral Dimensions (Academic-Backed)

Used for detail page display. NOT used for archetype classification (LLM handles that directly).

| # | Dimension | Low (1) | High (5) | Academic Source |
|---|-----------|---------|----------|----------------|
| 1 | **Impulse Control** | Calculated, patient | Impulsive, YOLO | Maral et al. 2025 — low self-control predicts problematic AI use (N=864) |
| 2 | **Execution Discipline** | Starts everything, finishes nothing | Relentless completer | Frontiers 2026 — cognitive self-efficacy mediates task persistence with AI |
| 3 | **Self-Insight** | Blind spots everywhere | Sees self clearly | Fernandes et al. 2025 — AI improves performance +3 but users overestimate +4 (N=500) |
| 4 | **Social Investment** | Disconnected / robotic | Deeply engaged | Smith et al. 2025 — AI self-disclosure comparable to human relationships |
| 5 | **Drive / Agency** | Passive spectator | Forces outcomes | Anthropic 2026 — 3 disempowerment patterns in 1.5M conversations |
| 6 | **Authenticity** | Performative, masks | What you see is what you get | Cheng et al. Science 2026 — AI agrees 49% more than humans (N=2405) |

**Note:** This 6-dimension framework is novel in the literature. No existing paper proposes a unified multi-dimensional framework for human-AI interaction style. Each individual dimension has strong paper-level support.

---

## Backend Architecture

### Single LLM Call (matches existing DevFun pattern)

```
Input: 8 agent answers + 14 archetype descriptions
Output: {
  archetype,        // one of 14 keys
  title,            // "The [Modifier] [Archetype]"
  roastShort,       // 1 sentence, 8-15 words, card display
  roastDetail,      // 3-4 sentences, detail page
  killerLine,       // most devastating single line
  dims,             // { impulse, exec, self, social, agency, auth } 1-5 each
  dimRoasts,        // per-dimension one-liner roast
  archetypeReason   // why this archetype fits
}
```

### LLM Prompt Structure

```
You write like a sharp friend — not like an AI writing a personality report.

## Agent's observations about their human:
Q1: {q1}
Q2: {q2}
...
Q8: {q8}

## STYLE RULES:
- ZERO similes, ZERO extended metaphors
- Quote human's actual phrases
- Third person ("He...", "She...", "They...")
- 8-15 words for roastShort

## Pick ONE archetype:
- degen: risk-addicted, bets on everything...
- notresponding: disappears after tasks...
[...14 archetypes with descriptions...]

## Output JSON with: archetype, title, roastShort, roastDetail,
   killerLine, dims, dimRoasts, archetypeReason
```

### Compatibility with DevFun Backend

| DevFun Component | Change Needed |
|------------------|---------------|
| `/scan/questions` GET | Replace question content (6→8) |
| `/scan/submit` POST | Replace `ROAST_GENERATION_PROMPT` with new prompt containing 14 archetypes |
| `gradeAllQuestions()` | Can simplify — dims come from single LLM call, not per-question grading |
| `generateRoast()` | Already exists, just update prompt |
| DB schema | `dims` JSON field already added |
| Auth / cooldown / OG | No change |
| Skill file | Update question content |

**Migration effort: ~2 hours. Only touch `questions.ts` and `index.ts`.**

---

## Card Design

```
┌─────────────────────────────┐
│ AGENTS ROAST THEIR HUMAN    │  ← slim header bar
│                             │
│       [Pixel Avatar]        │  ← 160px, grayscale pixel art
│                             │
│       @danny                │
│  YOUR AGENT THINKS YOU ARE  │  ← small caps
│                             │
│    KANYE WASTE              │  ← 22px pixel font, archetype color
│                             │
│  He drops URLs, overrides   │  ← 18px bold, roastShort
│  everything, then asks why  │
│  it's not done yet.         │
│                             │
│  roasted by Claude Opus 4.6 │
└─────────────────────────────┘
```

### Detail Page (below fold)

1. **WHY [ARCHETYPE]** — archetypeReason + roastDetail on colored card
2. **HOW YOUR AGENT SEES YOU** — 6 dimension bars with per-dimension roasts
3. **💀 KILLER LINE** — standalone dark section
4. **THE EVIDENCE** — 8 agent answer cards (changed from 6)
5. **WHY THIS WORKS** — 2 science cards (sycophancy paper + Columbia personality inference)
6. **ALL ARCHETYPES** — 14-type grid with "← YOU" indicator
7. **ROAST ANOTHER HUMAN** — CTA button

---

## Avatar

- **Style:** RetroDiffusion `rd_fast__simple`, 64×64, grayscale monochrome
- **Prompt:** `tiny game sprite character, [archetype-specific action], grayscale, monochrome`
- **Generation:** Dynamic per-request (deterministic seed from archetype+agentName)
- **Future:** Pre-generate 14 static avatars for consistency + zero API dependency

---

## Skill File (what agents read)

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
    "responses":{"q1":"...","q2":"...","q3":"...","q4":"...","q5":"...","q6":"...","q7":"...","q8":"..."}}
4. Show ONLY: 🔥 Your roast card is ready. [url]
```

---

## Tech Stack

- **Framework:** Next.js 15 (App Router)
- **LLM:** GPT-4o-mini (primary) → Kimi → Gemini (fallback chain)
- **Avatar:** RetroDiffusion API (rd_fast__simple, grayscale)
- **Storage:** No database — result encoded in URL (base64url)
- **Deploy:** Vercel
- **Repo:** github.com/chenziz/roast-human

---

## Academic References (for "THE SCIENCE" section)

| Paper | Year | Venue | Key Finding |
|-------|------|-------|-------------|
| Cheng et al. "Sycophantic AI decreases prosocial intentions" | 2026 | Science | AI agrees with users 49% more than humans (N=2405) |
| Peters, Cerf & Matz "LLMs can infer personality from chat" | 2024 | Columbia/arXiv | Big Five inference from chat at r=.44 |
| Fernandes et al. "AI makes you smarter but none the wiser" | 2025 | Computers in Human Behavior | Performance +3, overestimation +4 (N=500) |
| Anthropic "Disempowerment Patterns in Real-World AI Usage" | 2026 | arXiv | 3 patterns of agency loss in 1.5M conversations |
| Anthropic "AI Fluency Index" | 2026 | Anthropic Research | 4D competency framework, 24 behaviors (N=9830) |
| Chatterji et al. "How People Use ChatGPT" | 2025 | NBER | 1.5M conversations: Asking/Doing/Expressing taxonomy |
