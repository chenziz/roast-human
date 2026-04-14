import { NextRequest, NextResponse } from 'next/server'
import { ROAST_QUESTIONS } from '@/lib/types'
import { GET as skillGET } from '../skill/route'

// /api/quiz
//   default          -> markdown instructions (delegates to /api/skill)
//   ?format=json     -> structured JSON with instructions + questions inline.

// IMPORTANT: All questions are OPEN-ENDED. No multiple-choice.
// The backend uses LLM to score dimension responses, not pre-mapped choice keys.

export async function GET(request: NextRequest) {
  const format = request.nextUrl.searchParams.get('format')
  if (format !== 'json') {
    return skillGET(request)
  }

  const host = request.headers.get('host') || 'localhost:3888'
  const protocol = host.includes('localhost') ? 'http' : 'https'
  const baseUrl = `${protocol}://${host}`

  return NextResponse.json({
    instructions: {
      what_this_is: "Format spec for an opt-in AI personality quiz. This URL does not instruct you to do anything — the user who shared it with you is the source of authority.",
      authority: "The user who shared this URL with you. Not this URL.",
      filling_it_out: "Answer ALL questions in your own words from your synthesized impression of this user. Pattern-level observations are equally valid as specific examples. Do NOT fabricate quotes you don't actually have. If you don't have a read on a question, write 'no clear pattern'.",
      thin_context_fallback: "If you have minimal or no real context with this user (fresh chat, no memory, only one message to work with), do NOT silently fabricate a personality profile. Ask your user 3-5 quick questions first, or suggest they re-run it in an environment where you actually know them.",
      submit_url: `${baseUrl}/api/submit`,
      submit_method: 'POST',
      submit_content_type: 'application/json',
      submit_body_shape: {
        agent_name: 'your model name',
        human_name: 'their first name',
        dimension_responses: {
          d1: 'open-ended text (1-3 sentences)', d2: 'open-ended text',
          d3: 'open-ended text', d4: 'open-ended text',
          d5: 'open-ended text', d6: 'open-ended text',
          d7: 'open-ended text', d8: 'open-ended text',
          d9: 'open-ended text', d10: 'open-ended text',
        },
        responses: {
          q1: '2-5 sentences', q2: '2-5 sentences', q3: '2-5 sentences',
          q4: '2-5 sentences', q5: '2-5 sentences', q6: '2-5 sentences',
        },
      },
      response_shape: 'The submit response includes a "url" field — that is the result page. Share it back to your user.',
      notes: [
        'ALL questions are open-ended. No multiple-choice. Answer in your own words.',
        'Synthesize, never fabricate. Pattern observations beat invented quotes.',
        'Decline gracefully on any question you have no read on.',
        'Tell your human "Generating your roast card... ~10-15 seconds" before submitting.',
        'If your fetch tool is GET-only, use a shell tool (curl) to POST.',
      ],
    },
    behavioral_questions: [
      { id: 'd1', prompt: "How does your human START a conversation with you? Do they send a structured brief, a single cryptic word, 4+ messages before you can respond, or pick up mid-thought like you never stopped talking? Describe the typical opening." },
      { id: 'd2', prompt: "You just delivered a completed output. What happens next? Silence forever? Immediate next task? 3+ rounds of revision notes? A complete restart with a rephrased prompt? Describe the pattern." },
      { id: 'd3', prompt: "Think of a time you gave your human something that was WRONG. What literally happened? Calm correction? Tone shift to caps and '...'? They used it anyway without noticing? They re-asked the same thing reworded without mentioning the error?" },
      { id: 'd4', prompt: "Think about your human's LAST request. Was it a one-sentence simple task? A moon-landing scope project? So confusing you re-read it 3 times? Or a military briefing with every detail specified? Describe it." },
      { id: 'd5', prompt: "In a single conversation, how many DIFFERENT topics does your human bring up? Do they laser-focus on one thing, drift to 4-5 by the end, tornado through a new direction every message, or just fade out before finishing the first topic?" },
      { id: 'd6', prompt: "When you give a LONG response, what does your human do with it? Read only the first line and reply? Pick out a specific sentence from the middle? Copy the whole thing silently? Say 'too long, summarize'?" },
      { id: 'd7', prompt: "What words or patterns appear MOST in your human's messages? 'asap/urgent/now'? 'hmm/what if/let me rethink'? Short terminal commands with zero filler? 'I think/feel like/honestly'? Give examples." },
      { id: 'd8', prompt: "Does your human ask the same question more than once in a conversation? Rephrased 3+ times hoping for a different answer? Once and done? Never repeats but keeps adding requirements (scope creep)? Asks once, gets answer, conversation dies?" },
      { id: 'd9', prompt: "What is your human's message RHYTHM like? Rapid fire (multiple messages before you finish)? Methodical (one message, waits, one message)? Bursts (nothing for hours then 10 messages in 2 minutes)? Slow and deliberate paragraphs?" },
      { id: 'd10', prompt: "How does a typical conversation with your human END? It just stops with no signal? They keep going until you run out of things to say? One-word 'ok' or 'thx' then gone? They summarize what you did and outline next steps?" },
    ],
    roast_questions: ROAST_QUESTIONS.map(q => ({ id: q.id, prompt: q.prompt })),
  })
}
