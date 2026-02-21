import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'

export async function POST(req: NextRequest) {
  const apiKey = req.headers.get('x-api-key')
  if (!apiKey) return NextResponse.json({ title: null }, { status: 401 })

  const { userMessage, assistantMessage } = await req.json()

  try {
    const client = new Anthropic({ apiKey })
    const response = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 30,
      messages: [
        {
          role: 'user',
          content: `다음 대화의 핵심 주제를 한국어로 15자 이내로 요약해줘. 제목만 출력하고 다른 말은 하지 마.

사용자: ${userMessage.slice(0, 200)}
AI: ${assistantMessage.slice(0, 200)}`,
        },
      ],
    })

    const title = response.content[0].type === 'text'
      ? response.content[0].text.trim().slice(0, 30)
      : null

    return NextResponse.json({ title })
  } catch {
    return NextResponse.json({ title: null })
  }
}
