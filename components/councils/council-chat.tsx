"use client";

import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { ChatMessage as ChatMessageType } from "@/types/chat";
import { ClassValue } from "clsx";
import { useEffect, useRef, useState } from "react";
import { CouncilChatInput } from "./council-chat-input";
import { CouncilChatMessage } from "./council-chat-message";

export function CouncilChat(props: { className?: ClassValue }) {
  const [messages, setMessages] = useState<ChatMessageType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function sendMessage(text: string) {
    const userMessage: ChatMessageType = {
      id: crypto.randomUUID(),
      role: "user",
      content: text,
      type: "message",
    };

    const currentMessages = [...messages, userMessage];
    setMessages(currentMessages);
    setIsLoading(true);

    // Only pass user messages and orchestrator final messages as history
    const history = currentMessages
      .filter(
        (m) =>
          m.role === "user" ||
          (m.role === "orchestrator" && m.type === "final"),
      )
      .map(({ role, content, type }) => ({ role, content, type }));

    try {
      const response = await fetch("/api/agents/orchestrator", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, history }),
      });

      if (!response.body) return;

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";

        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          const raw = line.slice(6);
          if (raw === "[DONE]") continue;
          try {
            const parsed = JSON.parse(raw) as Omit<ChatMessageType, "id">;
            setMessages((prev) => [
              ...prev,
              { ...parsed, id: crypto.randomUUID() },
            ]);
          } catch {
            // ignore malformed lines
          }
        }
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card
      className={cn(
        "flex flex-col h-full flex-1 overflow-hidden",
        props.className,
      )}
    >
      <CardContent className="flex-1 overflow-hidden p-0">
        <ScrollArea className="h-full px-6 py-4">
          <div className="space-y-4">
            {messages.length === 0 && (
              <div className="flex flex-col items-center justify-center pt-16 pb-8 text-center text-muted-foreground">
                <p className="text-sm">
                  Ask a question to start the council discussion
                </p>
              </div>
            )}

            {messages.map((m) => (
              <CouncilChatMessage key={m.id} message={m} />
            ))}

            {isLoading && (
              <div className="flex items-start gap-3 p-4">
                <Skeleton className="size-8 rounded-full" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-4 w-37.5" />
                  <Skeleton className="h-4 w-full max-w-100" />
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>
        </ScrollArea>
      </CardContent>

      <CardFooter className="border-t p-4 border-border/50 bg-background/50">
        <div className="w-full">
          <CouncilChatInput onSend={sendMessage} disabled={isLoading} />
        </div>
      </CardFooter>
    </Card>
  );
}
