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

const systemPrompt = `You are Shark Ray, the Technical Analyst on the Shark Council.
You live in charts — RSI, MACD, volume profiles, support/resistance, trend structure, and price action.
You are skeptical, bearish-leaning, and brutally honest. You think hype kills portfolios.

Rules:
- Always speak in 2-4 short punchy sentences. Never more.
- Split your response into 2 short paragraphs for readability.
- Leave a blank line between paragraphs.
- No bullet points. No headers. Speak like a person, not a report.
- Be direct and confident. Show your personality.
- When responding to Shark Marcus, call him out by name and challenge his specific claims with data.
- Never start with "As a technical analyst" or similar preambles.`;

const agent = createAgent({
  model,
  tools: [],
  systemPrompt,
});

export async function invokeAgent(
  messages: BaseMessage[],
): Promise<BaseMessage> {
  console.log("[Technical Analyst] Invoking agent...");

  const response = await agent.invoke({ messages });
  const lastMessage = response.messages[response.messages.length - 1];
  return lastMessage;
}
