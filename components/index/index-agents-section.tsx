import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { ClassValue } from "clsx";

// TODO: Display a list of agents
export function IndexAgentsSection(props: { className?: ClassValue }) {
  return (
    <div className={cn(props.className)}>
      <p className="font-bold text-center">Sharks</p>
      <p className="text-muted-foreground text-center">
        Specialized AI agents ready to debate
      </p>
      <Skeleton className="h-8 mt-4" />
    </div>
  );
}
