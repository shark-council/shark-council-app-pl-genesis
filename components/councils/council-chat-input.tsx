import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { useRef } from "react";

export function CouncilChatInput({
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
    <div className="flex gap-2 items-end pt-2">
      <Textarea
        ref={textareaRef}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        placeholder="Ask the council..."
        rows={2}
        className={cn(
          "flex-1 resize-none min-h-15",
          "disabled:cursor-not-allowed disabled:opacity-50",
        )}
      />
      <Button onClick={submit} disabled={disabled} className="h-auto py-3 px-6">
        {disabled ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Wait
          </>
        ) : (
          "Send"
        )}
      </Button>
    </div>
  );
}
