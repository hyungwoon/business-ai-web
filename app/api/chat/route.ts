import { NextRequest } from 'next/server'
import { selectAgent, streamAgentResponse } from '@/lib/agents/orchestrator'

export const maxDuration = 60

export async function POST(req: NextRequest) {
  const apiKey = req.headers.get('x-api-key')
  if (!apiKey) {
    return new Response('API 키가 필요합니다.', { status: 401 })
  }

  const { message, history, attachments } = await req.json()

  const encoder = new TextEncoder()
  const stream = new ReadableStream({
    async start(controller) {
      const send = (event: string, data: string) => {
        // SSE 스펙: 줄바꿈이 포함된 데이터는 여러 data: 라인으로 분리해야 함
        const dataLines = data.split('\n').map(line => `data: ${line}`).join('\n')
        controller.enqueue(encoder.encode(`event: ${event}\n${dataLines}\n\n`))
      }

      try {
        // 1단계: 에이전트 선택
        const agentKey = await selectAgent(apiKey, message, history)
        send('agent', agentKey)

        // 2단계: 선택된 에이전트로 스트리밍 응답
        for await (const chunk of streamAgentResponse(apiKey, agentKey, message, history, attachments)) {
          send('delta', chunk)
        }

        send('done', '[DONE]')
      } catch (err: unknown) {
        const error = err as { status?: number }
        const errMsg = error?.status === 401
          ? 'API 키가 유효하지 않습니다.'
          : error?.status === 429
          ? '요청 한도를 초과했습니다.'
          : '오류가 발생했습니다. 다시 시도해주세요.'
        send('error', errMsg)
      } finally {
        controller.close()
      }
    },
  })

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    },
  })
}
