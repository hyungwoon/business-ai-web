'use client'

import { useEffect, useState, useCallback } from 'react'
import { AppSidebar } from '@/components/sidebar/AppSidebar'
import { ChatArea } from '@/components/chat/ChatArea'
import { OnboardingModal } from '@/components/onboarding/OnboardingModal'
import {
  getApiKey,
  removeApiKey,
  getAllConversations,
  createConversation,
  addMessage,
  updateLastAssistantMessage,
  getConversation,
} from '@/lib/storage/conversations'
import type { Conversation, Attachment, AgentKey } from '@/lib/types'

export default function Home() {
  const [apiKey, setApiKey] = useState<string | null>(null)
  const [showOnboarding, setShowOnboarding] = useState(false)
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [currentConvId, setCurrentConvId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [streamingContent, setStreamingContent] = useState('')
  const [streamingAgent, setStreamingAgent] = useState<AgentKey | null>(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [showKeyConfirm, setShowKeyConfirm] = useState(false)

  useEffect(() => {
    const key = getApiKey()
    if (!key) {
      setShowOnboarding(true)
    } else {
      setApiKey(key)
      const convs = getAllConversations()
      setConversations(convs)
      if (convs.length > 0) setCurrentConvId(convs[0].id)
    }
  }, [])

  const currentConversation = conversations.find(c => c.id === currentConvId) ?? null

  function handleOnboardingComplete(key: string) {
    setApiKey(key)
    setShowOnboarding(false)
    setConversations(getAllConversations())
  }

  function handleNewChat() {
    const conv = createConversation()
    setConversations(getAllConversations())
    setCurrentConvId(conv.id)
    setSidebarOpen(false)
  }

  function handleSelectConv(id: string) {
    setCurrentConvId(id)
    setSidebarOpen(false)
  }

  function handleDeleteConv(id: string) {
    const convs = getAllConversations()
    setConversations(convs)
    if (currentConvId === id) {
      setCurrentConvId(convs.length > 0 ? convs[0].id : null)
    }
  }

  function handleChangeApiKeyRequest() {
    setShowKeyConfirm(true)
  }

  function confirmChangeApiKey() {
    removeApiKey()
    setApiKey(null)
    setShowKeyConfirm(false)
    setConversations([])
    setCurrentConvId(null)
    setShowOnboarding(true)
  }

  async function generateTitle(convId: string, userMsg: string, assistantMsg: string, key: string) {
    try {
      const res = await fetch('/api/generate-title', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-api-key': key },
        body: JSON.stringify({ userMessage: userMsg, assistantMessage: assistantMsg }),
      })
      const { title } = await res.json()
      if (title) {
        const store = getAllConversations()
        const conv = store.find(c => c.id === convId)
        if (conv && conv.title === '새 대화') {
          conv.title = title
          localStorage.setItem('biz_conversations', JSON.stringify({ conversations: store }))
          setConversations(getAllConversations())
        }
      }
    } catch {
      // 제목 생성 실패는 무시
    }
  }

  const handleSend = useCallback(async (text: string, attachments: Attachment[]) => {
    if (!apiKey || isLoading) return

    let convId = currentConvId
    if (!convId) {
      const conv = createConversation()
      convId = conv.id
      setCurrentConvId(convId)
    }

    const isFirstMessage = (getConversation(convId)?.messages.length ?? 0) === 0

    addMessage(convId, { role: 'user', content: text, attachments })
    addMessage(convId, { role: 'assistant', content: '', agentsUsed: [] })
    setConversations(getAllConversations())

    setIsLoading(true)
    setStreamingContent('')
    setStreamingAgent(null)

    const history = (currentConversation?.messages ?? []).map(m => ({
      role: m.role,
      content: m.content,
    }))

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-api-key': apiKey },
        body: JSON.stringify({ message: text, history, attachments }),
      })

      if (!res.body) throw new Error('No response body')

      const reader = res.body.getReader()
      const decoder = new TextDecoder()
      let fullContent = ''
      let selectedAgent: AgentKey | null = null
      let buffer = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        buffer += decoder.decode(value, { stream: true })
        const blocks = buffer.split('\n\n')
        buffer = blocks.pop() ?? ''

        for (const block of blocks) {
          const lines = block.split('\n')
          let event = ''
          let data = ''
          for (const line of lines) {
            if (line.startsWith('event: ')) event = line.slice(7).trim()
            else if (line.startsWith('data: ')) data = line.slice(6)
          }
          if (event === 'agent') {
            selectedAgent = data as AgentKey
            setStreamingAgent(selectedAgent)
          } else if (event === 'delta') {
            fullContent += data
            setStreamingContent(fullContent)
          } else if (event === 'error') {
            fullContent = data
            setStreamingContent(data)
          }
        }
      }

      updateLastAssistantMessage(convId, fullContent, selectedAgent ? [selectedAgent] : [])
      setConversations(getAllConversations())

      // 첫 대화 후 제목 자동 생성
      if (isFirstMessage && fullContent) {
        generateTitle(convId, text, fullContent, apiKey)
      }
    } catch (err) {
      console.error('Chat error:', err)
      updateLastAssistantMessage(convId, '오류가 발생했습니다. 다시 시도해주세요.', [])
      setConversations(getAllConversations())
    } finally {
      setIsLoading(false)
      setStreamingContent('')
      setStreamingAgent(null)
    }
  }, [apiKey, isLoading, currentConvId, currentConversation])

  return (
    <div className="flex h-screen bg-zinc-950 text-white overflow-hidden">
      {showOnboarding && <OnboardingModal onComplete={handleOnboardingComplete} />}

      {/* API 키 변경 확인 다이얼로그 */}
      {showKeyConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-sm mx-4 bg-zinc-900 border border-zinc-700 rounded-2xl p-6 space-y-4">
            <h2 className="text-lg font-bold text-white">API 키 변경</h2>
            <p className="text-zinc-400 text-sm">API 키를 변경하면 현재 세션이 초기화됩니다. 대화 기록은 유지됩니다.</p>
            <div className="flex gap-2">
              <button
                onClick={() => setShowKeyConfirm(false)}
                className="flex-1 py-2 rounded-lg border border-zinc-700 text-zinc-300 hover:bg-zinc-800 text-sm transition-colors cursor-pointer"
              >
                취소
              </button>
              <button
                onClick={confirmChangeApiKey}
                className="flex-1 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white text-sm transition-colors cursor-pointer"
              >
                변경하기
              </button>
            </div>
          </div>
        </div>
      )}

      {!showOnboarding && apiKey && (
        <>
          {/* 모바일 사이드바 오버레이 */}
          {sidebarOpen && (
            <div
              className="fixed inset-0 z-20 bg-black/50 md:hidden"
              onClick={() => setSidebarOpen(false)}
            />
          )}

          {/* 사이드바 */}
          <div className={`
            fixed md:static inset-y-0 left-0 z-30
            transform transition-transform duration-200 ease-in-out
            ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
          `}>
            <AppSidebar
              conversations={conversations}
              currentConvId={currentConvId}
              onNewChat={handleNewChat}
              onSelectConv={handleSelectConv}
              onDeleteConv={handleDeleteConv}
              onChangeApiKey={handleChangeApiKeyRequest}
              apiKey={apiKey}
            />
          </div>

          {/* 메인 채팅 영역 */}
          <main className="flex-1 flex flex-col overflow-hidden min-w-0">
            {/* 모바일 상단 헤더 */}
            <div className="flex items-center gap-3 px-4 py-3 border-b border-zinc-800 md:hidden">
              <button
                onClick={() => setSidebarOpen(true)}
                className="text-zinc-400 hover:text-white transition-colors cursor-pointer"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              <span className="text-sm font-medium text-zinc-300 truncate">
                {currentConversation?.title ?? 'Business AI Team'}
              </span>
            </div>

            <ChatArea
              messages={currentConversation?.messages ?? []}
              isLoading={isLoading}
              streamingContent={streamingContent}
              streamingAgent={streamingAgent}
              onSend={handleSend}
            />
          </main>
        </>
      )}
    </div>
  )
}
