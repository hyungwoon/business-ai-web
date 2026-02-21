import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'

export async function POST(req: NextRequest) {
  const { apiKey } = await req.json()

  if (!apiKey || typeof apiKey !== 'string') {
    return NextResponse.json({ valid: false, error: 'API 키를 입력해주세요.' }, { status: 400 })
  }

  if (!apiKey.startsWith('sk-ant-')) {
    return NextResponse.json(
      { valid: false, error: 'API 키 형식이 올바르지 않습니다. sk-ant-로 시작해야 합니다.' },
      { status: 400 }
    )
  }

  try {
    const client = new Anthropic({ apiKey })
    await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 10,
      messages: [{ role: 'user', content: 'hi' }],
    })
    return NextResponse.json({ valid: true })
  } catch (err: unknown) {
    const error = err as { status?: number }
    if (error?.status === 401) {
      return NextResponse.json({ valid: false, error: '유효하지 않은 API 키입니다.' })
    }
    if (error?.status === 429) {
      return NextResponse.json({ valid: false, error: '요청 한도를 초과했습니다. 잠시 후 다시 시도해주세요.' })
    }
    return NextResponse.json({ valid: false, error: 'API 키 확인 중 오류가 발생했습니다.' })
  }
}
