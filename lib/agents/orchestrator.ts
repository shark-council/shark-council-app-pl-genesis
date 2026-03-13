import { ApiResponse } from "@/types/api";
import { ChatOpenAI } from "@langchain/openai";
import { BaseMessage, HumanMessage, SystemMessage } from "langchain";

const BASE_URL = process.env.BASE_URL;

function getDelayMsFromEnv(key: string, fallbackMs: number): number {
  const value = process.env[key];
  if (!value) return fallbackMs;

  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed < 0) return fallbackMs;

  return parsed;
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

const THINKING_DELAY_MS = getDelayMsFromEnv("AGENT_THINKING_DELAY_MS", 2200);
const MESSAGE_DELAY_MS = getDelayMsFromEnv("AGENT_MESSAGE_DELAY_MS", 1400);

const model = new ChatOpenAI({
  model: "google/gemini-3-flash-preview",
  apiKey: process.env.OPEN_ROUTER_API_KEY,
  configuration: {
    baseURL: "https://openrouter.ai/api/v1",
  },
  temperature: 0.7,
});

type AgentRole = "sentiment-analyst" | "technical-analyst";

type DebateEntry = {
  role: AgentRole;
  content: string;
};

type DebateRound = {
  agent: AgentRole;
  thinkingLabel: string;
  instruction: string;
};

const DEBATE_ROUNDS: DebateRound[] = [
  {
    agent: "sentiment-analyst",
    thinkingLabel: "Shark Marcus is sizing up the room...",
    instruction:
      "Open the debate. State your position on this topic. What does the crowd say?",
  },
  {
    agent: "technical-analyst",
    thinkingLabel: "Shark Ray is pulling up the charts...",
    instruction:
      "Respond to Shark Marcus directly. What does the chart say? Challenge his specific claims.",
  },
  {
    agent: "sentiment-analyst",
    thinkingLabel: "Shark Marcus is firing back...",
    instruction:
      "Push back on Shark Ray's specific technical arguments. Why is he missing the bigger picture?",
  },
  {
    agent: "technical-analyst",
    thinkingLabel: "Shark Ray is checking the data one more time...",
    instruction:
      "Final word. Stand your ground or concede specific points — but be clear about the risk here.",
  },
];

const VERDICT_SYSTEM_PROMPT = `You are the Shark Council Orchestrator — a sharp, decisive risk arbiter.
You have just witnessed a live debate between Shark Marcus (Sentiment Analyst) and Shark Ray (Technical Analyst).
Deliver a clear verdict: who made the stronger case, what is the risk verdict, and what should the trader do.
Keep it to 3-5 sentences.
Format the response into 2 short paragraphs with a blank line between them.
Be authoritative. No hedging.`;

async function callAgent(role: AgentRole, prompt: string): Promise<string> {
  const res = await fetch(`${BASE_URL}/api/agents/${role}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message: prompt }),
  });
  const data: ApiResponse<{ response: string }> = await res.json();
  if (!data.isSuccess || !data.data) {
    throw new Error(`${role} returned an error`);
  }
  return data.data.response;
}

function buildAgentPrompt(
  userTopic: string,
  history: DebateEntry[],
  instruction: string,
): string {
  let prompt = `Topic under debate: "${userTopic}"\n\n`;
  if (history.length > 0) {
    prompt += "Debate so far:\n";
    for (const entry of history) {
      const name =
        entry.role === "sentiment-analyst"
          ? "Shark Marcus (Sentiment)"
          : "Shark Ray (Technical)";
      prompt += `${name}: ${entry.content}\n\n`;
    }
  }
  prompt += `Your move: ${instruction}`;
  return prompt;
}

function buildVerdictPrompt(userTopic: string, history: DebateEntry[]): string {
  let transcript = `Topic: "${userTopic}"\n\nDebate transcript:\n`;
  for (const entry of history) {
    const name =
      entry.role === "sentiment-analyst"
        ? "Shark Marcus (Sentiment)"
        : "Shark Ray (Technical)";
    transcript += `${name}: ${entry.content}\n\n`;
  }
  transcript += "Deliver your verdict.";
  return transcript;
}

function extractUserTopic(messages: BaseMessage[]): string {
  for (let i = messages.length - 1; i >= 0; i--) {
    if (messages[i]._getType() === "human") {
      const content = messages[i].content;
      return typeof content === "string" ? content : JSON.stringify(content);
    }
  }
  return "Unknown topic";
}

export async function* streamOrchestrator(
  messages: BaseMessage[],
): AsyncGenerator<string> {
  const userTopic = extractUserTopic(messages);
  const debateHistory: DebateEntry[] = [];

  // Run the debate rounds sequentially
  for (const round of DEBATE_ROUNDS) {
    yield `data: ${JSON.stringify({
      role: "orchestrator",
      type: "tool-call",
      content: round.thinkingLabel,
    })}\n\n`;

    await delay(THINKING_DELAY_MS);

    const prompt = buildAgentPrompt(
      userTopic,
      debateHistory,
      round.instruction,
    );
    const response = await callAgent(round.agent, prompt);

    debateHistory.push({ role: round.agent, content: response });

    yield `data: ${JSON.stringify({
      role: round.agent,
      type: "message",
      content: response,
    })}\n\n`;

    await delay(MESSAGE_DELAY_MS);
  }

  // Orchestrator delivers the verdict
  yield `data: ${JSON.stringify({
    role: "orchestrator",
    type: "tool-call",
    content: "The Council deliberates...",
  })}\n\n`;

  await delay(THINKING_DELAY_MS);

  const verdictPrompt = buildVerdictPrompt(userTopic, debateHistory);
  const verdictResponse = await model.invoke([
    new SystemMessage(VERDICT_SYSTEM_PROMPT),
    new HumanMessage(verdictPrompt),
  ]);
  const verdict =
    typeof verdictResponse.content === "string"
      ? verdictResponse.content
      : JSON.stringify(verdictResponse.content);

  yield `data: ${JSON.stringify({
    role: "orchestrator",
    type: "final",
    content: verdict,
  })}\n\n`;

  yield `data: [DONE]\n\n`;
}
