import { AgentNewForm } from "@/components/agents/agent-new-form";
import { AgentNewHeroCard } from "@/components/agents/agent-new-hero-card";

export default function AgentNewPage() {
  return (
    <div className="max-w-xl mx-auto px-4 py-8">
      <AgentNewHeroCard />
      <AgentNewForm className="mt-4" />
    </div>
  );
}
