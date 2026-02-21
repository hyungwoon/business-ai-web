import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
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
          className={`rounded-2xl px-4 py-3 leading-relaxed ${
            isUser
              ? 'bg-blue-600 text-white text-sm rounded-br-sm whitespace-pre-wrap'
              : 'bg-zinc-800 text-zinc-100 rounded-bl-sm'
          }`}
        >
          {!content && !isUser ? (
            <span className="inline-flex gap-1">
              <span className="w-1.5 h-1.5 bg-zinc-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="w-1.5 h-1.5 bg-zinc-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="w-1.5 h-1.5 bg-zinc-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </span>
          ) : isUser ? (
            content
          ) : (
            <div className="prose-assistant text-[14px] leading-7 space-y-3">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  h1: ({ children }) => <h1 className="text-xl font-bold mt-5 mb-2 first:mt-0 text-white border-b border-zinc-600 pb-1">{children}</h1>,
                  h2: ({ children }) => <h2 className="text-base font-bold mt-4 mb-2 first:mt-0 text-white">{children}</h2>,
                  h3: ({ children }) => <h3 className="text-[14px] font-semibold mt-3 mb-1 first:mt-0 text-zinc-200">{children}</h3>,
                  p: ({ children }) => <p className="mb-3 last:mb-0 text-zinc-100">{children}</p>,
                  ul: ({ children }) => <ul className="list-disc pl-5 mb-3 space-y-1.5 text-zinc-100">{children}</ul>,
                  ol: ({ children }) => <ol className="list-decimal pl-5 mb-3 space-y-1.5 text-zinc-100">{children}</ol>,
                  li: ({ children }) => <li className="leading-relaxed">{children}</li>,
                  strong: ({ children }) => <strong className="font-semibold text-white">{children}</strong>,
                  em: ({ children }) => <em className="italic text-zinc-300">{children}</em>,
                  code: ({ children, className }) => {
                    const isBlock = className?.includes('language-')
                    return isBlock ? (
                      <code className="block bg-zinc-900 rounded-lg p-3 my-2 text-xs font-mono text-zinc-200 overflow-x-auto whitespace-pre">
                        {children}
                      </code>
                    ) : (
                      <code className="bg-zinc-900 rounded px-1.5 py-0.5 text-xs font-mono text-zinc-300">{children}</code>
                    )
                  },
                  pre: ({ children }) => <pre className="my-2 overflow-x-auto">{children}</pre>,
                  blockquote: ({ children }) => (
                    <blockquote className="border-l-2 border-blue-500 pl-4 my-3 text-zinc-400 italic">{children}</blockquote>
                  ),
                  table: ({ children }) => (
                    <div className="overflow-x-auto my-3">
                      <table className="text-sm border-collapse w-full">{children}</table>
                    </div>
                  ),
                  th: ({ children }) => <th className="border border-zinc-600 px-3 py-2 bg-zinc-700 font-semibold text-left text-white">{children}</th>,
                  td: ({ children }) => <td className="border border-zinc-600 px-3 py-2 text-zinc-200">{children}</td>,
                  a: ({ href, children }) => (
                    <a href={href} target="_blank" rel="noopener noreferrer" className="text-blue-400 underline hover:text-blue-300">
                      {children}
                    </a>
                  ),
                  hr: () => <hr className="border-zinc-600 my-4" />,
                }}
              >
                {content}
              </ReactMarkdown>
            </div>
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
