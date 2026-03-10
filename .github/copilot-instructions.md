# GitHub Copilot Instructions

- **Mandatory Verification:** Always use `context7` or web search to fetch the latest documentation for external libraries or APIs. Do not guess API signatures or configurations.
- **Search Strategy:** First try `context7` for specialized library documentation. If missing or outdated, use web search tools for the most current information.
- **Project Structure & Context:** Always read the root `README.md` and any sub-project `README.md` files to understand the project's purpose, architecture, and specific development workflows.

# Project Overview

This is a Next.js prototype app for the Shark Council project.

Shark Council is an AI-powered risk management platform that gamifies trade analysis for retail crypto investors. By pitting specialized AI agents against each other in live, highly visual debates, the platform stress-tests plain-English trade ideas. It synthesizes real-time technicals, onchain data, and social sentiment to prevent emotional execution, deliver actionable risk verdicts, and seamlessly route verified trades through integrated DEX aggregators.

# Project Stack

- Next.js 16 (App Router)
- React 19
- TypeScript
- Tailwind CSS v4
- shadcn/ui
- LangChain
- OpenRouter

# Multi-Agent Chat Workflow

The app implements a real-time multi-agent discussion system:

1. **User** sends a message via `app/chat/page.tsx` (POST to `/api/agents/orchestrator`)
2. **Orchestrator** (`lib/agents/orchestrator.ts`) receives the request and calls both sub-agents as tools via HTTP:
   - `POST /api/agents/sentiment-analyst` — market sentiment analysis
   - `POST /api/agents/technical-analyst` — technical indicator analysis
3. Sub-agent routes invoke their LangChain agents and return `{ response: string }`
4. Orchestrator synthesizes both responses into a final answer
5. All intermediate steps stream back to the client as **SSE (Server-Sent Events)**

## SSE Message Format

Each `data:` line carries a JSON object:

```ts
{ role: "user" | "orchestrator" | "sentiment-analyst" | "technical-analyst", type: "thinking" | "tool-call" | "message" | "final", content: string }
```

Stream ends with `data: [DONE]`.

## History / Multi-Turn

Only `role: "user"` and `role: "orchestrator", type: "final"` messages are passed as history on subsequent turns. Intermediate messages (tool-call, thinking, sub-agent responses) are display-only.
