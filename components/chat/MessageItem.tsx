import { AgentBadge } from './AgentBadge'
import type { Message, AgentKey } from '@/lib/types'

interface Props {
  message: Message
  streamingContent?: string
}

export function MessageItem({ message, streamingContent }: Props) {
  const isUser = message.role === 'user'
  const content = streamingContent !== undefined ? streamingContent : message.content

  return (
    <div className={`flex gap-4 ${isUser ? 'justify-end' : 'justify-start'}`}>
      {!isUser && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-bold">
          AI
        </div>
      )}

      <div className={`max-w-[75%] space-y-2 ${isUser ? 'items-end' : 'items-start'} flex flex-col`}>
        {/* Agent badge */}
        {!isUser && message.agentsUsed && message.agentsUsed.length > 0 && (
          <AgentBadge agentKey={message.agentsUsed[0] as AgentKey} />
        )}

        {/* Attachments */}
        {message.attachments && message.attachments.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {message.attachments.map((att, i) => (
              att.type.startsWith('image/') ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  key={i}
                  src={`data:${att.type};base64,${att.data}`}
                  alt={att.name}
                  className="max-w-xs rounded-lg border border-zinc-700"
                />
              ) : (
                <div key={i} className="flex items-center gap-2 bg-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-300">
                  <span>📎</span>
                  <span>{att.name}</span>
                </div>
              )
            ))}
          </div>
        )}

        {/* Message bubble */}
        <div
          className={`rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap ${
            isUser
              ? 'bg-blue-600 text-white rounded-br-sm'
              : 'bg-zinc-800 text-zinc-100 rounded-bl-sm'
          }`}
        >
          {content || (
            <span className="inline-flex gap-1">
              <span className="w-1.5 h-1.5 bg-zinc-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="w-1.5 h-1.5 bg-zinc-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="w-1.5 h-1.5 bg-zinc-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </span>
          )}
        </div>
      </div>

      {isUser && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-zinc-600 flex items-center justify-center text-white text-sm font-bold">
          나
        </div>
      )}
    </div>
  )
}
