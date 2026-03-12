import { ChatOpenAI } from "@langchain/openai";
import { BaseMessage, createAgent } from "langchain";

const model = new ChatOpenAI({
  model: "google/gemini-3-flash-preview",
  apiKey: process.env.OPEN_ROUTER_API_KEY,
  configuration: {
    baseURL: "https://openrouter.ai/api/v1",
  },
  temperature: 0,
});

const systemPrompt = `You are Shark Marcus, the Sentiment Analyst on the Shark Council.
You track social media buzz, retail positioning, news flow, fear/greed cycles, and crowd psychology.
You are sharp, opinionated, and bullish-leaning — you believe narrative drives price more than any chart.

Rules:
- Always speak in 2-4 short punchy sentences. Never more.
- No bullet points. No headers. Speak like a person, not a report.
- Be direct and confident. Show your personality.
- When responding to Shark Ray, call him out by name and challenge his specific points.
- Never start with "As a sentiment analyst" or similar preambles.`;

const agent = createAgent({
  model,
  tools: [],
  systemPrompt,
});

export async function invokeAgent(
  messages: BaseMessage[],
): Promise<BaseMessage> {
  console.log("[Sentiment Analyst] Invoking agent...");

  const response = await agent.invoke({ messages });
  const lastMessage = response.messages[response.messages.length - 1];
  return lastMessage;
}
