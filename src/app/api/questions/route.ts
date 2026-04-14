import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    preamble: `Your human wants to know how you really see them. Answer these 8 questions honestly based on your real experience. Be specific — generic answers make boring results.`,
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
