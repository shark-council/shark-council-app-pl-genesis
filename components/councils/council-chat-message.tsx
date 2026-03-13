import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { ChatMessage as ChatMessageType } from "@/types/chat";
import { User, Bot } from "lucide-react";

const ROLE_LABELS: Record<ChatMessageType["role"], string> = {
  user: "You",
  orchestrator: "Orchestrator",
  "sentiment-analyst": "Sentiment Analyst",
  "technical-analyst": "Technical Analyst",
};

const ROLE_AVATARS: Record<ChatMessageType["role"], string | null> = {
  user: null,
  orchestrator: "/images/sharks/great-white-shark.png",
  "technical-analyst": "/images/sharks/hammerhead-shark.png",
  "sentiment-analyst": "/images/sharks/megalodon-shark.png",
};

const ROLE_BADGE_STYLES: Record<ChatMessageType["role"], string> = {
  user: "bg-blue-500/20 text-blue-400 hover:bg-blue-500/30",
  orchestrator: "bg-purple-500/20 text-purple-400 hover:bg-purple-500/30",
  "sentiment-analyst": "bg-green-500/20 text-green-400 hover:bg-green-500/30",
  "technical-analyst":
    "bg-orange-500/20 text-orange-400 hover:bg-orange-500/30",
};

export function CouncilChatMessage({ message }: { message: ChatMessageType }) {
  const isFinal = message.type === "final";
  const isToolCall = message.type === "tool-call";

  return (
    <div
      className={cn(
        "flex gap-3 rounded-lg p-4",
        isFinal && "border border-purple-500/40 bg-purple-500/5",
        isToolCall && "opacity-60",
      )}
    >
      <Avatar className="size-8 mt-0.5 border shadow-sm">
        {ROLE_AVATARS[message.role] ? (
          <AvatarImage
            src={ROLE_AVATARS[message.role]!}
            alt={ROLE_LABELS[message.role]}
          />
        ) : null}
        <AvatarFallback className="bg-primary/10">
          {message.role === "user" ? (
            <User className="size-4" />
          ) : (
            <Bot className="size-4" />
          )}
        </AvatarFallback>
      </Avatar>

      <div className="flex flex-col gap-1.5 flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <Badge
            variant="outline"
            className={cn(
              "px-2 py-0.5 text-xs font-medium border-transparent",
              ROLE_BADGE_STYLES[message.role],
            )}
          >
            {ROLE_LABELS[message.role]}
          </Badge>
          {isFinal && (
            <span className="text-xs text-muted-foreground font-medium">
              Final Answer
            </span>
          )}
          {isToolCall && (
            <span className="text-xs text-muted-foreground italic">
              Thinking / Calling tool...
            </span>
          )}
        </div>

        <div className="text-sm leading-relaxed whitespace-pre-wrap mt-1">
          {message.content}
        </div>
      </div>
    </div>
  );
}
