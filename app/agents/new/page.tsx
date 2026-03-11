import { AgentNewHeroCard } from "@/components/agents/agent-new-hero-card";
import { Skeleton } from "@/components/ui/skeleton";

// TODO: Add a form to create a new agent
export default function AgentNewPage() {
  return (
    <div className="max-w-xl mx-auto px-4 py-8">
      <AgentNewHeroCard />
      <Skeleton className="h-8 mt-4" />
    </div>
  );
}
