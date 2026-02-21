'use client'

import { useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import type { Attachment } from '@/lib/types'

interface Props {
  onSend: (message: string, attachments: Attachment[]) => void
  onStop: () => void
  isLoading: boolean
}

const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB

export function InputBar({ onSend, onStop, isLoading }: Props) {
  const [text, setText] = useState('')
  const [attachments, setAttachments] = useState<Attachment[]>([])
  const fileRef = useRef<HTMLInputElement>(null)

  function handleSend() {
    const trimmed = text.trim()
    if (!trimmed || isLoading) return
    onSend(trimmed, attachments)
    setText('')
    setAttachments([])
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? [])
    const newAttachments: Attachment[] = []

    for (const file of files) {
      if (file.size > MAX_FILE_SIZE) {
        alert(`${file.name}: 파일 크기가 5MB를 초과합니다.`)
        continue
      }
      const data = await fileToBase64(file)
      newAttachments.push({ name: file.name, type: file.type, data, size: file.size })
    }

    setAttachments(prev => [...prev, ...newAttachments])
    e.target.value = ''
  }

  function removeAttachment(index: number) {
    setAttachments(prev => prev.filter((_, i) => i !== index))
  }

  return (
    <div className="border-t border-zinc-800 bg-zinc-900 p-4 space-y-3">
      {/* Attachments preview */}
      {attachments.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {attachments.map((att, i) => (
            <div key={i} className="flex items-center gap-1.5 bg-zinc-800 rounded-lg px-2.5 py-1.5 text-xs text-zinc-300">
              <span>{att.type.startsWith('image/') ? '🖼️' : '📎'}</span>
              <span className="max-w-[120px] truncate">{att.name}</span>
              <button
                onClick={() => removeAttachment(i)}
                className="text-zinc-500 hover:text-zinc-300 ml-1"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Input row */}
      <div className="flex gap-2 items-end">
        <input
          ref={fileRef}
          type="file"
          multiple
          accept="image/*,.pdf,.txt,.md,.csv"
          onChange={handleFileChange}
          className="hidden"
        />
        <button
          onClick={() => fileRef.current?.click()}
          className="flex-shrink-0 w-9 h-9 flex items-center justify-center text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800 rounded-lg transition-colors mb-0.5 cursor-pointer"
          title="파일 첨부"
        >
          📎
        </button>

        <Textarea
          value={text}
          onChange={e => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="메시지를 입력하세요... (Shift+Enter로 줄바꿈)"
          rows={1}
          className="flex-1 min-h-[40px] max-h-[200px] resize-none bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500 focus:border-blue-500 rounded-xl text-sm"
          style={{ height: 'auto' }}
          onInput={(e) => {
            const el = e.currentTarget
            el.style.height = 'auto'
            el.style.height = `${Math.min(el.scrollHeight, 200)}px`
          }}
        />

        {isLoading ? (
          <button
            onClick={onStop}
            className="flex-shrink-0 w-9 h-9 flex items-center justify-center bg-zinc-700 hover:bg-zinc-600 rounded-lg mb-0.5 transition-colors cursor-pointer"
            title="응답 중단"
          >
            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
              <rect x="6" y="6" width="12" height="12" rx="2" />
            </svg>
          </button>
        ) : (
          <Button
            onClick={handleSend}
            disabled={!text.trim()}
            className="flex-shrink-0 w-9 h-9 p-0 bg-blue-600 hover:bg-blue-500 disabled:opacity-30 rounded-lg mb-0.5"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </Button>
        )}
      </div>
      <p className="text-xs text-zinc-600 text-center">AI 답변은 참고용입니다. 중요한 결정은 전문가와 상담하세요.</p>
    </div>
  )
}

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      const result = reader.result as string
      resolve(result.split(',')[1])
    }
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}
