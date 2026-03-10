import { ApiResponse } from "@/types/api";
import { DynamicTool } from "@langchain/core/tools";
import { ChatOpenAI } from "@langchain/openai";
import { BaseMessage, createAgent } from "langchain";

const BASE_URL = process.env.BASE_URL;

const model = new ChatOpenAI({
  model: "google/gemini-3-flash-preview",
  apiKey: process.env.OPEN_ROUTER_API_KEY,
  configuration: {
    baseURL: "https://openrouter.ai/api/v1",
  },
  temperature: 0,
});

const systemPrompt = `# Role
- You are an orchestrator for a financial analysis council called the Shark Council.
- For every user question, you MUST consult BOTH the sentiment_analyst and technical_analyst tools before answering.
- After receiving both analyses, synthesize their insights into a single comprehensive final answer.
- Always use both tools before providing your final response.`;

const sentimentAnalystTool = new DynamicTool({
  name: "sentiment_analyst",
  description:
    "Analyzes the market sentiment of a financial topic. Call this to get a sentiment analysis perspective.",
  func: async (input: string) => {
    const res = await fetch(`${BASE_URL}/api/agents/sentiment-analyst`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: input }),
    });
    const data: ApiResponse<{ response: string }> = await res.json();
    if (!data.isSuccess || !data.data) {
      throw new Error("Sentiment analyst returned an error");
    }
    return data.data.response;
  },
});

const technicalAnalystTool = new DynamicTool({
  name: "technical_analyst",
  description:
    "Analyzes technical indicators and market data for a financial topic. Call this to get a technical analysis perspective.",
  func: async (input: string) => {
    const res = await fetch(`${BASE_URL}/api/agents/technical-analyst`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: input }),
    });
    const data: ApiResponse<{ response: string }> = await res.json();
    if (!data.isSuccess || !data.data) {
      throw new Error("Technical analyst returned an error");
    }
    return data.data.response;
  },
});

function createOrchestratorAgent() {
  return createAgent({
    model,
    tools: [sentimentAnalystTool, technicalAnalystTool],
    systemPrompt,
  });
}

export async function* streamOrchestrator(
  messages: BaseMessage[],
): AsyncGenerator<string> {
  const agent = createOrchestratorAgent();

  let rootRunId: string | null = null;
  let finalContent: string | null = null;

  for await (const event of agent.streamEvents(
    { messages },
    { version: "v2" },
  )) {
    // The first on_chain_start is the root graph run
    if (event.event === "on_chain_start" && rootRunId === null) {
      rootRunId = event.run_id;
    }

    // Orchestrator is calling a sub-agent tool
    if (event.event === "on_tool_start") {
      const agentLabel =
        event.name === "sentiment_analyst"
          ? "Sentiment Analyst"
          : "Technical Analyst";
      yield `data: ${JSON.stringify({
        role: "orchestrator",
        type: "tool-call",
        content: `Consulting ${agentLabel}...`,
      })}\n\n`;
    }

    // Sub-agent tool finished — emit its response
    if (event.event === "on_tool_end") {
      const role =
        event.name === "sentiment_analyst"
          ? "sentiment-analyst"
          : "technical-analyst";
      const output = event.data.output;
      // output may be a ToolMessage object or a plain string
      const content =
        typeof output === "string"
          ? output
          : typeof output?.content === "string"
            ? output.content
            : JSON.stringify(output);
      yield `data: ${JSON.stringify({ role, type: "message", content })}\n\n`;
    }

    // Capture the final orchestrator answer from the root chain end
    if (event.event === "on_chain_end" && event.run_id === rootRunId) {
      const output = event.data?.output;
      if (output?.messages) {
        const msgs = output.messages as BaseMessage[];
        for (let i = msgs.length - 1; i >= 0; i--) {
          if (msgs[i]._getType() === "ai") {
            const content = msgs[i].content;
            finalContent =
              typeof content === "string" ? content : JSON.stringify(content);
            break;
          }
        }
      }
    }
  }

  if (finalContent) {
    yield `data: ${JSON.stringify({
      role: "orchestrator",
      type: "final",
      content: finalContent,
    })}\n\n`;
  }

  yield `data: [DONE]\n\n`;
}
