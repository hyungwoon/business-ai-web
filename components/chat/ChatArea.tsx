'use client'

import { useEffect, useRef } from 'react'
import { ScrollArea } from '@/components/ui/scroll-area'
import { MessageItem } from './MessageItem'
import { InputBar } from './InputBar'
import type { Message, Attachment, AgentKey } from '@/lib/types'

interface Props {
  messages: Message[]
  isLoading: boolean
  streamingContent: string
  streamingAgent: AgentKey | null
  onSend: (message: string, attachments: Attachment[]) => void
}

export function ChatArea({ messages, isLoading, streamingContent, streamingAgent, onSend }: Props) {
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, streamingContent])

  const isEmpty = messages.length === 0 && !isLoading

  return (
    <div className="flex flex-col h-full bg-zinc-950">
      {/* Messages */}
      <ScrollArea className="flex-1">
        <div className="max-w-3xl mx-auto px-6 py-8 space-y-6">
          {isEmpty && (
            <div className="text-center py-24 space-y-4">
              <p className="text-4xl">💼</p>
              <h2 className="text-xl font-semibold text-zinc-300">무엇을 도와드릴까요?</h2>
              <p className="text-zinc-500 text-sm">마케팅, 재무, 법무, HR, 개발 등 다양한 비즈니스 업무를 도와드립니다.</p>
              <div className="grid grid-cols-2 gap-2 max-w-md mx-auto mt-6">
                {EXAMPLES.map((ex, i) => (
                  <button
                    key={i}
                    onClick={() => onSend(ex, [])}
                    className="text-left px-4 py-3 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 text-sm hover:border-zinc-600 hover:text-zinc-200 transition-colors cursor-pointer"
                  >
                    {ex}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map(msg => (
            <MessageItem key={msg.id} message={msg} />
          ))}

          {/* Streaming message */}
          {isLoading && (
            <MessageItem
              message={{
                id: 'streaming',
                role: 'assistant',
                content: streamingContent,
                agentsUsed: streamingAgent ? [streamingAgent] : [],
                createdAt: new Date().toISOString(),
              }}
              streamingContent={streamingContent}
            />
          )}

          <div ref={bottomRef} />
        </div>
      </ScrollArea>

      {/* Input */}
      <InputBar onSend={onSend} isLoading={isLoading} />
    </div>
  )
}

const EXAMPLES = [
  'Q3 마케팅 캠페인 기획해줘',
  '직원 성과평가 프레임워크 설계',
  '투자자 제안서 초안 작성',
  '개인정보처리방침 검토해줘',
]
