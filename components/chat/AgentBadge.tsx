import type { AgentKey } from '@/lib/types'

const AGENT_LABELS: Record<AgentKey, string> = {
  marketing: '마케팅',
  research: '리서치',
  writing: '작문',
  hr: 'HR',
  finance: '재무',
  legal: '법무',
  sales: '영업',
  data: '데이터',
  product: '프로덕트',
  development: '개발',
  design: '디자인',
  productivity: '생산성',
  pr: 'PR',
  security: '보안',
  compliance: '컴플라이언스',
  business_dev: '사업개발',
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
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${AGENT_COLORS[agentKey]}`}>
      {AGENT_LABELS[agentKey]} 전문가
    </span>
  )
}
