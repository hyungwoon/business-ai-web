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

  // Init: load API key and conversations
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
    const convs = getAllConversations()
    setConversations(convs)
  }

  function handleNewChat() {
    const conv = createConversation()
    setConversations(getAllConversations())
    setCurrentConvId(conv.id)
  }

  function handleSelectConv(id: string) {
    setCurrentConvId(id)
  }

  function handleDeleteConv(id: string) {
    const convs = getAllConversations()
    setConversations(convs)
    if (currentConvId === id) {
      setCurrentConvId(convs.length > 0 ? convs[0].id : null)
    }
  }

  function handleChangeApiKey() {
    removeApiKey()
    setApiKey(null)
    setShowOnboarding(true)
  }

  const handleSend = useCallback(async (text: string, attachments: Attachment[]) => {
    if (!apiKey || isLoading) return

    // Ensure a conversation exists
    let convId = currentConvId
    if (!convId) {
      const conv = createConversation()
      convId = conv.id
      setCurrentConvId(convId)
    }

    // Add user message
    addMessage(convId, { role: 'user', content: text, attachments })
    // Add placeholder assistant message
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
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
        },
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
        const lines = buffer.split('\n')
        buffer = lines.pop() ?? ''

        for (const line of lines) {
          if (line.startsWith('event: ')) {
            // handled by next data line together
          } else if (line.startsWith('data: ')) {
            // Find previous event line in block
          }
        }

        // Re-parse as SSE blocks
        const rawText = decoder.decode(value, { stream: true })
        parseSSEChunk(rawText, {
          onAgent: (agent) => {
            selectedAgent = agent as AgentKey
            setStreamingAgent(agent as AgentKey)
          },
          onDelta: (delta) => {
            fullContent += delta
            setStreamingContent(fullContent)
          },
          onError: (err) => {
            fullContent = err
            setStreamingContent(err)
          },
        })
      }

      // Save final content
      updateLastAssistantMessage(convId, fullContent, selectedAgent ? [selectedAgent] : [])
      setConversations(getAllConversations())
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

      {!showOnboarding && apiKey && (
        <>
          <AppSidebar
            conversations={conversations}
            currentConvId={currentConvId}
            onNewChat={handleNewChat}
            onSelectConv={handleSelectConv}
            onDeleteConv={handleDeleteConv}
            onChangeApiKey={handleChangeApiKey}
            apiKey={apiKey}
          />
          <main className="flex-1 overflow-hidden">
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

interface SSEHandlers {
  onAgent: (agent: string) => void
  onDelta: (delta: string) => void
  onError: (err: string) => void
}

function parseSSEChunk(chunk: string, handlers: SSEHandlers) {
  const lines = chunk.split('\n')
  let currentEvent = ''
  for (const line of lines) {
    if (line.startsWith('event: ')) {
      currentEvent = line.slice(7).trim()
    } else if (line.startsWith('data: ')) {
      const data = line.slice(6).trim()
      if (currentEvent === 'agent') handlers.onAgent(data)
      else if (currentEvent === 'delta') handlers.onDelta(data)
      else if (currentEvent === 'error') handlers.onError(data)
      currentEvent = ''
    }
  }
}
