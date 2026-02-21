# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Development
npm run dev       # Start Next.js dev server (http://localhost:3000)

# Production
npm run build     # Build for production
npm run start     # Start production server

# Code quality
npm run lint      # Run ESLint
```

No test suite is currently configured.

## Architecture

This is a **Next.js 15 (App Router) + TypeScript** business AI assistant. The user provides their own Anthropic API key, stored in `localStorage`. All conversations are also persisted in `localStorage` (no backend database).

### Request Flow

1. User sends a message in the UI
2. `page.tsx` calls `POST /api/chat` with the message, history, and `x-api-key` header
3. The route calls `selectAgent()` (orchestrator) — uses **claude-haiku-4-5-20251001** via tool-use to classify the request into one of 16 agent types
4. The selected agent key is streamed back as an SSE `agent` event
5. `streamAgentResponse()` streams the answer using **claude-sonnet-4-6** with the agent's persona system prompt, optionally augmented by plugin skills
6. Chunks arrive as SSE `delta` events; client reassembles them into the final message

### SSE Protocol

The `/api/chat` route emits three event types over a `ReadableStream`:
- `event: agent` — the selected agent key (e.g., `marketing`)
- `event: delta` — text chunk; multi-line data is split into multiple `data:` lines per SSE spec
- `event: done` / `event: error` — terminal events

The client (`page.tsx`) reconstructs multi-line deltas by joining `data:` lines with `\n`.

### Agent System (`lib/agents/`)

- **`definitions.ts`** — 16 `AgentDefinition` records, each with a Korean persona name, description, and system prompt
- **`orchestrator.ts`** — `selectAgent()` (Haiku, tool-use routing) and `streamAgentResponse()` (Sonnet, streaming). History window: last 6 messages for routing, last 20 for response generation
- **`skills-loader.ts`** — Server-side only. Reads `plugins/<plugin>/skills/<skill>/SKILL.md` files and injects their content as extra system prompt context. The `AGENT_PLUGIN_MAP` determines which plugins augment each agent.

### Plugin System (`plugins/`)

Each plugin directory has a `skills/` subdirectory with one folder per skill, each containing a `SKILL.md`. The `SKILL.md` may have YAML frontmatter (stripped at load time). Available plugins: `business-dev`, `compliance`, `customer-support`, `data`, `design`, `development`, `enterprise-search`, `finance`, `hr`, `legal`, `marketing`, `pr`, `product`, `productivity`, `sales`, `security`.

### Storage (`lib/storage/conversations.ts`)

Client-only (`localStorage`). Two keys:
- `biz_api_key` — Anthropic API key string
- `biz_conversations` — JSON-serialized `ConversationStore`

Conversation title is auto-generated via `POST /api/generate-title` (Haiku, ≤30 chars) after the first exchange.

### Key Types (`lib/types.ts`)

`AgentKey` union type lists all 16 valid agent identifiers. `Message` tracks `agentsUsed: AgentKey[]` so the UI can display which agent responded (`AgentBadge` component).

### UI Components

- `OnboardingModal` — first-run flow to capture and validate the Anthropic API key (`/api/validate-key`)
- `AppSidebar` — conversation list, new chat, API key management
- `ChatArea` — message list + streaming bubble; hides the placeholder assistant message during streaming to avoid duplication
- `MessageItem` — renders markdown (via `react-markdown` + `remark-gfm`) for assistant messages; plain text for user messages
- `InputBar` — textarea with file/image attachment support (base64) and stop-generation button

### Path Aliases

`@/` maps to the project root (configured in `tsconfig.json`). All internal imports use this alias.
