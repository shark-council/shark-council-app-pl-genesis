"use client";

import { ChatInput } from "@/components/chat/ChatInput";
import { ChatMessage } from "@/components/chat/ChatMessage";
import { ChatMessage as ChatMessageType } from "@/types/chat";
import { useEffect, useRef, useState } from "react";

export default function ChatPage() {
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
    <div className="flex flex-col h-screen max-w-3xl mx-auto">
      <header className="border-b border-border px-4 py-3">
        <h1 className="text-lg font-semibold">🦈 Shark Council</h1>
        <p className="text-xs text-muted-foreground">
          Orchestrator · Sentiment Analyst · Technical Analyst
        </p>
      </header>

      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {messages.length === 0 && (
          <p className="text-center text-sm text-muted-foreground pt-12">
            Ask a question to start the council discussion.
          </p>
        )}
        {messages.map((m) => (
          <ChatMessage key={m.id} message={m} />
        ))}
        {isLoading && (
          <p className="text-xs text-muted-foreground animate-pulse pl-3">
            Council is deliberating...
          </p>
        )}
        <div ref={bottomRef} />
      </div>

      <ChatInput onSend={sendMessage} disabled={isLoading} />
    </div>
  );
}
