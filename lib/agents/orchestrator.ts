// lib/agents/orchestrator.ts
import Anthropic from '@anthropic-ai/sdk'
import { AGENT_DEFINITIONS, AGENT_KEYS } from './definitions'
import { buildSkillsForAgent } from './skills-loader'
import type { AgentKey, Attachment } from '@/lib/types'

const ORCHESTRATOR_SYSTEM_PROMPT = `당신은 사업가의 개인 비서이자 전문가 팀의 리더입니다.
사용자의 비즈니스 요청을 분석하고 적절한 전문가 팀원에게 작업을 할당합니다.

팀 구성:
- marketing: 마케팅 콘텐츠, 캠페인, 브랜드 전략
- research: 시장 조사, 경쟁사 분석, 트렌드
- writing: 이메일, 문서, 번역, 요약, 비즈니스 커뮤니케이션
- hr: 채용, 조직 관리, 성과 관리
- finance: 재무 분석, 예산, 투자
- legal: 계약 검토, 법률 자문
- sales: 영업 전략, 파이프라인, 제안서
- data: 데이터 분석, 통계, KPI
- product: 제품 기회 분석, 로드맵, 기능 스펙
- development: 기술 아키텍처, 설계 검토, 개발 프로세스 (CTO/Tech Lead)
- design: UX/UI, 브랜드, 사용성
- productivity: 업무 관리, 일정, 프로세스
- pr: 홍보, 미디어, 위기 커뮤니케이션
- security: 정보 보안, 리스크
- compliance: 규정 준수, 내부 감사
- business_dev: 사업 기회 발굴, 파트너십, 성장 전략

요청에 가장 적합한 에이전트를 선택하세요.`

export async function selectAgent(
  apiKey: string,
  message: string,
  history: Array<{ role: 'user' | 'assistant'; content: string }>
): Promise<AgentKey> {
  const client = new Anthropic({ apiKey })

  const tools: Anthropic.Tool[] = AGENT_KEYS.map(key => ({
    name: key,
    description: AGENT_DEFINITIONS[key].description,
    input_schema: {
      type: 'object' as const,
      properties: {
        task: { type: 'string', description: '처리할 작업 내용' },
      },
      required: ['task'],
    },
  }))

  const response = await client.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 100,
    system: ORCHESTRATOR_SYSTEM_PROMPT,
    tools,
    tool_choice: { type: 'any' },
    messages: [
      ...history.slice(-6),
      { role: 'user', content: message },
    ],
  })

  const toolUse = response.content.find(b => b.type === 'tool_use')
  if (toolUse && toolUse.type === 'tool_use') {
    const selected = toolUse.name as AgentKey
    if (AGENT_KEYS.includes(selected)) return selected
  }

  return 'writing'
}

export async function* streamAgentResponse(
  apiKey: string,
  agentKey: AgentKey,
  message: string,
  history: Array<{ role: 'user' | 'assistant'; content: string }>,
  attachments?: Attachment[]
): AsyncGenerator<string> {
  const client = new Anthropic({ apiKey })
  const agent = AGENT_DEFINITIONS[agentKey]

  const userContent: Anthropic.MessageParam['content'] = []

  if (attachments && attachments.length > 0) {
    for (const att of attachments) {
      if (att.type.startsWith('image/')) {
        userContent.push({
          type: 'image',
          source: {
            type: 'base64',
            media_type: att.type as 'image/jpeg' | 'image/png' | 'image/gif' | 'image/webp',
            data: att.data,
          },
        })
      }
    }
  }

  userContent.push({ type: 'text', text: message })

  const skills = buildSkillsForAgent(agentKey)
  const systemPrompt = skills
    ? `${agent.systemPrompt}\n\n# 전문 지식 프레임워크\n\n${skills}`
    : agent.systemPrompt

  const stream = await client.messages.stream({
    model: 'claude-sonnet-4-6',
    max_tokens: 4096,
    system: systemPrompt,
    messages: [
      ...history.slice(-20),
      { role: 'user', content: userContent },
    ],
  })

  for await (const chunk of stream) {
    if (
      chunk.type === 'content_block_delta' &&
      chunk.delta.type === 'text_delta'
    ) {
      yield chunk.delta.text
    }
  }
}
