import { AgentList } from "@/components/agents/agent-list";
import { cn } from "@/lib/utils";
import { ClassValue } from "clsx";

export function IndexAgentsSection(props: { className?: ClassValue }) {
  return (
    <div className={cn(props.className)}>
      <p className="font-bold text-center">Sharks</p>
      <p className="text-muted-foreground text-center">
        Specialized AI agents ready to debate
      </p>
      <AgentList className="mt-4" />
    </div>
  );
}
