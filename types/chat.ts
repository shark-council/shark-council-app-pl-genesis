export type ChatMessageRole =
  | "user"
  | "orchestrator"
  | "sentiment-analyst"
  | "technical-analyst";

export type ChatMessageType = "thinking" | "tool-call" | "message" | "final";

export type ChatMessage = {
  id: string;
  role: ChatMessageRole;
  content: string;
  type: ChatMessageType;
};

export type OrchestratorRequestBody = {
  message: string;
  history: Pick<ChatMessage, "role" | "content" | "type">[];
};
