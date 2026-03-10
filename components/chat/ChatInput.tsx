import { cn } from "@/lib/utils";
import { useRef } from "react";

export function ChatInput({
  onSend,
  disabled,
}: {
  onSend: (message: string) => void;
  disabled: boolean;
}) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      submit();
    }
  }

  function submit() {
    const value = textareaRef.current?.value.trim();
    if (!value || disabled) return;
    onSend(value);
    if (textareaRef.current) textareaRef.current.value = "";
  }

  return (
    <div className="flex gap-2 items-end border-t border-border p-4 bg-background">
      <textarea
        ref={textareaRef}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        placeholder="Ask the council... (Enter to send, Shift+Enter for newline)"
        rows={2}
        className={cn(
          "flex-1 resize-none rounded-md border border-input bg-transparent px-3 py-2 text-sm",
          "placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring",
          "disabled:cursor-not-allowed disabled:opacity-50",
        )}
      />
      <button
        onClick={submit}
        disabled={disabled}
        className={cn(
          "rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground",
          "hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50",
        )}
      >
        Send
      </button>
    </div>
  );
}
