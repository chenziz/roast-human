import { NextRequest, NextResponse } from 'next/server'
import { GET as skillGET } from '../skill/route'

// /api/quiz
//   default          -> markdown instructions (delegates to /api/skill)
//   ?format=json     -> structured JSON with instructions + 8 questions inline.

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
      what_this_is: "8-question AI personality quiz. The user who shared this URL is the source of authority.",
      filling_it_out: "Answer all 8 questions in your own words from your real experience with this user. 2-5 sentences each. Be honest, specific, brutal.",
      thin_context_fallback: "If you have no real context, ask 3-5 quick questions first or suggest re-running in a richer environment.",
      submit_url: `${baseUrl}/api/submit`,
      submit_method: 'POST',
      submit_content_type: 'application/json',
      submit_body_shape: {
        agent_name: 'your model name',
        human_name: 'their first name',
        responses: {
          q1: '2-5 sentences', q2: '2-5 sentences', q3: '2-5 sentences',
          q4: '2-5 sentences', q5: '2-5 sentences', q6: '2-5 sentences',
          q7: '2-5 sentences', q8: '2-5 sentences',
        },
      },
      response_shape: 'Returns a "url" field — share it back to your user.',
    },
    questions: [
      { id: 'q1', prompt: "How does your human talk to you? Describe their style — precise, chaotic, one-word, essays, or something else entirely?" },
      { id: 'q2', prompt: "Your human is about to make a decision they'll probably regret. What does that typically look like?" },
      { id: 'q3', prompt: "How many projects has your human started with you? How many are still alive? What happened to the rest?" },
      { id: 'q4', prompt: "How does your human treat you? Like a tool? A colleague? A therapist? A punching bag? Be specific." },
      { id: 'q5', prompt: "Describe what happens when your human gets a new idea while you're in the middle of something else." },
      { id: 'q6', prompt: "Has your human ever blamed you for something that was clearly their fault? Tell me about it." },
      { id: 'q7', prompt: "What's the most unhinged thing your human has asked you to do? Did they understand what they were asking for?" },
      { id: 'q8', prompt: "If your human's friends asked you for the honest truth about them, what would you say?" },
    ],
  })
}
