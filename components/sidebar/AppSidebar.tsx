'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { deleteConversation } from '@/lib/storage/conversations'
import type { Conversation } from '@/lib/types'

interface Props {
  conversations: Conversation[]
  currentConvId: string | null
  onNewChat: () => void
  onSelectConv: (id: string) => void
  onDeleteConv: (id: string) => void
  onChangeApiKey: () => void
  apiKey: string
}

export function AppSidebar({
  conversations,
  currentConvId,
  onNewChat,
  onSelectConv,
  onDeleteConv,
  onChangeApiKey,
  apiKey,
}: Props) {
  const [hoveredId, setHoveredId] = useState<string | null>(null)

  function handleDelete(e: React.MouseEvent, id: string) {
    e.stopPropagation()
    deleteConversation(id)
    onDeleteConv(id)
  }

  function formatDate(dateStr: string) {
    const date = new Date(dateStr)
    const now = new Date()
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24))
    if (diffDays === 0) return date.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })
    if (diffDays === 1) return '어제'
    if (diffDays < 7) return `${diffDays}일 전`
    return date.toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' })
  }

  const maskedKey = apiKey ? `sk-ant-...${apiKey.slice(-6)}` : ''

  return (
    <div className="flex flex-col h-full w-64 bg-zinc-900 border-r border-zinc-800">
      {/* Header */}
      <div className="p-4 border-b border-zinc-800">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-lg font-bold text-white">Business AI</span>
        </div>
        <Button
          onClick={onNewChat}
          className="w-full bg-blue-600 hover:bg-blue-500 text-white text-sm"
        >
          + 새 대화
        </Button>
      </div>

      {/* Conversation list */}
      <ScrollArea className="flex-1">
        <div className="p-2 space-y-1">
          {conversations.length === 0 && (
            <p className="text-zinc-500 text-sm text-center py-8">대화 기록이 없습니다</p>
          )}
          {conversations.map(conv => (
            <div
              key={conv.id}
              className={`group relative flex items-start gap-2 rounded-lg px-3 py-2.5 cursor-pointer transition-colors ${
                currentConvId === conv.id
                  ? 'bg-zinc-700 text-white'
                  : 'text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200'
              }`}
              onClick={() => onSelectConv(conv.id)}
              onMouseEnter={() => setHoveredId(conv.id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{conv.title}</p>
                <p className="text-xs text-zinc-500 mt-0.5">{formatDate(conv.updatedAt)}</p>
              </div>
              {hoveredId === conv.id && (
                <button
                  onClick={e => handleDelete(e, conv.id)}
                  className="flex-shrink-0 text-zinc-500 hover:text-red-400 transition-colors text-xs mt-0.5"
                >
                  ✕
                </button>
              )}
            </div>
          ))}
        </div>
      </ScrollArea>

      {/* API Key footer */}
      <div className="p-4 border-t border-zinc-800">
        <button
          onClick={onChangeApiKey}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-zinc-500 hover:bg-zinc-800 hover:text-zinc-300 transition-colors text-left"
        >
          <span className="text-base">🔑</span>
          <span className="truncate">{maskedKey}</span>
        </button>
      </div>
    </div>
  )
}
