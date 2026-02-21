import type { AgentKey } from '@/lib/types'

const AGENT_PERSONAS: Record<AgentKey, { name: string; role: string }> = {
  marketing:    { name: 'Aria',    role: '마케팅 전문가' },
  research:     { name: 'Dana',    role: '리서치 전문가' },
  writing:      { name: 'Mia',     role: '작문 전문가' },
  hr:           { name: 'Grace',   role: 'HR 전문가' },
  finance:      { name: 'Victor',  role: '재무 전문가' },
  legal:        { name: 'Lucas',   role: '법무 전문가' },
  sales:        { name: 'Ryan',    role: '영업 전문가' },
  data:         { name: 'Sofia',   role: '데이터 분석가' },
  product:      { name: 'Kai',     role: '프로덕트 매니저' },
  development:  { name: 'Noah',    role: '개발 전문가' },
  design:       { name: 'Luna',    role: '디자인 전문가' },
  productivity: { name: 'Max',     role: '생산성 전문가' },
  pr:           { name: 'Ivy',     role: 'PR 전문가' },
  security:     { name: 'Rex',     role: '보안 전문가' },
  compliance:   { name: 'Claire',  role: '컴플라이언스 전문가' },
  business_dev: { name: 'Ethan',   role: '사업개발 전문가' },
}

const AGENT_COLORS: Record<AgentKey, string> = {
  marketing: 'bg-pink-900/50 text-pink-300',
  research: 'bg-purple-900/50 text-purple-300',
  writing: 'bg-blue-900/50 text-blue-300',
  hr: 'bg-orange-900/50 text-orange-300',
  finance: 'bg-green-900/50 text-green-300',
  legal: 'bg-yellow-900/50 text-yellow-300',
  sales: 'bg-red-900/50 text-red-300',
  data: 'bg-cyan-900/50 text-cyan-300',
  product: 'bg-indigo-900/50 text-indigo-300',
  development: 'bg-slate-700/50 text-slate-300',
  design: 'bg-fuchsia-900/50 text-fuchsia-300',
  productivity: 'bg-teal-900/50 text-teal-300',
  pr: 'bg-rose-900/50 text-rose-300',
  security: 'bg-red-900/50 text-red-300',
  compliance: 'bg-amber-900/50 text-amber-300',
  business_dev: 'bg-violet-900/50 text-violet-300',
}

interface Props {
  agentKey: AgentKey
}

export function AgentBadge({ agentKey }: Props) {
  const { name, role } = AGENT_PERSONAS[agentKey]
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${AGENT_COLORS[agentKey]}`}>
      <span className="font-semibold">{name}</span>
      <span className="opacity-60">·</span>
      <span>{role}</span>
    </span>
  )
}
