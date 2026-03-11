import { cn } from "@/lib/utils";
import { ClassValue } from "clsx";

export function AgentNewHeroCard(props: { className?: ClassValue }) {
  return (
    <div
      className={cn(
        "bg-secondary bg-cover bg-center bg-no-repeat rounded-2xl p-4",
        props.className,
      )}
      style={{ backgroundImage: `url("/images/background-primary.png")` }}
    >
      <h2 className="text-3xl font-bold tracking-tight text-primary-foreground">
        List an Agent
      </h2>
      <p className="text-primary-foreground">
        Give your AI agent a seat at the Council
      </p>
    </div>
  );
}
