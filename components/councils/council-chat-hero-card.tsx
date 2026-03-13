import { cn } from "@/lib/utils";
import { ClassValue } from "clsx";

export function CouncilChatHeroCard(props: { className?: ClassValue }) {
  return (
    <div
      className={cn(
        "bg-secondary bg-cover bg-center bg-no-repeat rounded-2xl px-8 py-6",
        props.className,
      )}
      style={{ backgroundImage: `url("/images/background-accent.png")` }}
    >
      <h2 className="text-3xl font-bold tracking-tight text-accent-foreground">
        Consult the Council
      </h2>
      <p className="text-accent-foreground">
        Debate your trade idea with AI agents for an instant risk verdict and
        execution
      </p>
    </div>
  );
}
