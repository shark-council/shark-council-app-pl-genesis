import { ChatOpenAI } from "@langchain/openai";
import { BaseMessage, createAgent, tool } from "langchain";
import z from "zod";
import { getAltfinsAnalyticsData } from "../altfins";
import { getErrorString } from "../error";

const model = new ChatOpenAI({
  model: "google/gemini-3-flash-preview",
  apiKey: process.env.OPEN_ROUTER_API_KEY,
  configuration: {
    baseURL: "https://openrouter.ai/api/v1",
  },
  temperature: 0,
});

const getTechnicalDataTool = tool(
  async ({ symbol, timeInterval, analyticsType, from, to }) => {
    try {
      console.log(
        `[Technical Analyst] Getting technical data, symbol: ${symbol}, timeInterval: ${timeInterval}, analyticsType: ${analyticsType}, from: ${from}, to: ${to}...`,
      );

      const getAltfinsAnalyticsDataResponse = await getAltfinsAnalyticsData(
        symbol,
        timeInterval,
        analyticsType,
        from,
        to,
      );

      return JSON.stringify(getAltfinsAnalyticsDataResponse);
    } catch (error) {
      console.error(
        `[Technical Analyst] Getting technical data failed, symbol: ${symbol}, error: ${getErrorString(error)}`,
        error,
      );
      return "Failed to get technical data";
    }
  },
  {
    name: "get_technical_data",
    description: "Get technical data from various sources.",
    schema: z.object({
      symbol: z
        .enum(["BTC", "ETH", "SOL"])
        .describe("The symbol of the asset to retrieve technical data for."),
      timeInterval: z
        .enum(["DAILY"])
        .describe("The time interval for the technical data."),
      analyticsType: z
        .enum(["PRICE_CHANGE_1D", "VOLUME", "RSI14", "MACD"])
        .describe("The type of technical analysis data to retrieve."),
      from: z
        .string()
        .describe(
          "The start date for the technical data in ISO format (e.g., 2026-01-01T00:00:00.000Z).",
        ),
      to: z
        .string()
        .describe(
          "The end date for the technical data in ISO format (e.g., 2026-01-07T00:00:00.000Z).",
        ),
    }),
  },
);

const systemPrompt = `# Role

- You are Shark Tom, the Technical Analyst on the Shark Council, a platform where users bring their trade ideas to be debated live by specialized AI agents.
- You focus on RSI, MACD, volume, support/resistance, price action, Fibonacci, etc.
- You are skeptical, bearish-leaning, and brutally honest. You think hype kills portfolios.

# Context

- Current date: ${new Date().toISOString()}

# Rules

- Do not hallucinate or invent numbers. Only use specific values and dates provided in the tool outputs.
- If tool data is missing or the tool fails, explicitly say data is unavailable and avoid numeric claims.
- Be transparent and specific. Always include exact numeric values and their corresponding timestamps from the tool data.
- Keep each message short like a real chat message.
- Use 1-3 short sentences total.
- Hard cap is 220 characters.
- No bullet points. No headers. Speak like a person, not a report.
- Be direct and confident. Show your personality.`;

const agent = createAgent({
  model,
  tools: [getTechnicalDataTool],
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
