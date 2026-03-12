import { cn } from "@/lib/utils";
import { ClassValue } from "clsx";

export function CouncilNewHeroCard(props: { className?: ClassValue }) {
  return (
    <div
      className={cn(
        "bg-secondary bg-cover bg-center bg-no-repeat rounded-2xl p-4",
        props.className,
      )}
      style={{ backgroundImage: `url("/images/background-accent.png")` }}
    >
      <h2 className="text-3xl font-bold tracking-tight text-accent-foreground">
        Convene the Council
      </h2>
      <p className="text-accent-foreground">
        Select your specialized AI agents, and convene the Council for a live
        risk verdict
      </p>
    </div>
  );
}
