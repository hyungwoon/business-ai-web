// lib/types.ts

export type AgentKey =
  | 'marketing' | 'research' | 'writing' | 'hr'
  | 'finance' | 'legal' | 'sales' | 'data'
  | 'product' | 'development' | 'design' | 'productivity'
  | 'pr' | 'security' | 'compliance' | 'business_dev'

export interface AgentDefinition {
  key: AgentKey
  name: string
  description: string
  systemPrompt: string
}

export interface Attachment {
  name: string
  type: string   // MIME type (image/png, application/pdf 등)
  data: string   // base64
  size: number
}

export interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  attachments?: Attachment[]
  agentsUsed?: AgentKey[]
  createdAt: string
}

export interface Conversation {
  id: string
  title: string
  createdAt: string
  updatedAt: string
  messages: Message[]
}

export interface ConversationStore {
  conversations: Conversation[]
}

// API 요청/응답 타입
export interface ChatRequest {
  message: string
  history: Array<{ role: 'user' | 'assistant'; content: string }>
  attachments?: Attachment[]
}

export interface ValidateKeyRequest {
  apiKey: string
}

export interface ValidateKeyResponse {
  valid: boolean
  error?: string
}
