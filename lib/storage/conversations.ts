// lib/storage/conversations.ts
import { v4 as uuidv4 } from 'uuid'
import type { Conversation, Message, ConversationStore, AgentKey } from '@/lib/types'

const STORAGE_KEY = 'biz_conversations'
const API_KEY_STORAGE = 'biz_api_key'

// API 키 관련
export function getApiKey(): string | null {
  if (typeof window === 'undefined') return null
  return localStorage.getItem(API_KEY_STORAGE)
}

export function setApiKey(key: string): void {
  localStorage.setItem(API_KEY_STORAGE, key)
}

export function removeApiKey(): void {
  localStorage.removeItem(API_KEY_STORAGE)
}

// 대화 목록 관련
function loadStore(): ConversationStore {
  if (typeof window === 'undefined') return { conversations: [] }
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : { conversations: [] }
  } catch {
    return { conversations: [] }
  }
}

function saveStore(store: ConversationStore): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(store))
}

export function getAllConversations(): Conversation[] {
  return loadStore().conversations.sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  )
}

export function getConversation(id: string): Conversation | null {
  return loadStore().conversations.find(c => c.id === id) ?? null
}

export function createConversation(): Conversation {
  const now = new Date().toISOString()
  const conversation: Conversation = {
    id: uuidv4(),
    title: '새 대화',
    createdAt: now,
    updatedAt: now,
    messages: [],
  }
  const store = loadStore()
  store.conversations.unshift(conversation)
  saveStore(store)
  return conversation
}

export function addMessage(conversationId: string, message: Omit<Message, 'id' | 'createdAt'>): Message {
  const store = loadStore()
  const idx = store.conversations.findIndex(c => c.id === conversationId)
  if (idx === -1) throw new Error('Conversation not found')

  const newMessage: Message = {
    ...message,
    id: uuidv4(),
    createdAt: new Date().toISOString(),
  }

  store.conversations[idx].messages.push(newMessage)
  store.conversations[idx].updatedAt = newMessage.createdAt

  // 첫 사용자 메시지로 제목 자동 생성
  if (message.role === 'user' && store.conversations[idx].title === '새 대화') {
    store.conversations[idx].title = message.content.slice(0, 30)
  }

  saveStore(store)
  return newMessage
}

export function updateLastAssistantMessage(
  conversationId: string,
  content: string,
  agentsUsed: string[]
): void {
  const store = loadStore()
  const conv = store.conversations.find(c => c.id === conversationId)
  if (!conv) return

  const lastMsg = [...conv.messages].reverse().find(m => m.role === 'assistant')
  if (lastMsg) {
    lastMsg.content = content
    lastMsg.agentsUsed = agentsUsed as AgentKey[]
  }
  saveStore(store)
}

export function deleteConversation(id: string): void {
  const store = loadStore()
  store.conversations = store.conversations.filter(c => c.id !== id)
  saveStore(store)
}

export function clearAllConversations(): void {
  saveStore({ conversations: [] })
}
