export type ChatMessageRole =
  | "user"
  | "orchestrator"
  | "sentiment-analyst"
  | "technical-analyst";

export type ChatMessageType = "thinking" | "tool-call" | "message" | "final";

export type ChatUiMessageType = ChatMessageType | "swap-card";

export type ChatMessage = {
  id: string;
  role: ChatMessageRole;
  content: string;
  type: ChatMessageType;
};

export type ChatUiMessage = {
  id: string;
  role: ChatMessageRole;
  content: string;
  type: ChatUiMessageType;
};

export type OrchestratorRequestBody = {
  message: string;
  history: Pick<ChatMessage, "role" | "content" | "type">[];
};
