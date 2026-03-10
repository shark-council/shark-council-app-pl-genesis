import { cn } from "@/lib/utils";
import { ChatMessage as ChatMessageType } from "@/types/chat";

const ROLE_LABELS: Record<ChatMessageType["role"], string> = {
  user: "You",
  orchestrator: "Orchestrator",
  "sentiment-analyst": "Sentiment Analyst",
  "technical-analyst": "Technical Analyst",
};

const ROLE_BADGE_STYLES: Record<ChatMessageType["role"], string> = {
  user: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  orchestrator: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  "sentiment-analyst": "bg-green-500/20 text-green-400 border-green-500/30",
  "technical-analyst": "bg-orange-500/20 text-orange-400 border-orange-500/30",
};

export function ChatMessage({ message }: { message: ChatMessageType }) {
  const isFinal = message.type === "final";
  const isToolCall = message.type === "tool-call";

  return (
    <div
      className={cn(
        "flex flex-col gap-1.5 rounded-lg p-3",
        isFinal && "border border-purple-500/40 bg-purple-500/5",
        isToolCall && "opacity-60",
      )}
    >
      <span
        className={cn(
          "w-fit rounded border px-1.5 py-0.5 text-xs font-medium",
          ROLE_BADGE_STYLES[message.role],
        )}
      >
        {ROLE_LABELS[message.role]}
        {isFinal && " · Final Answer"}
        {isToolCall && " · Calling..."}
      </span>
      <p className="text-sm leading-relaxed whitespace-pre-wrap">
        {message.content}
      </p>
    </div>
  );
}
