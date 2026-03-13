"use client";

import { AgentCard } from "@/components/agents/agent-card";
import EntityList from "@/components/ui-extra/entity-list";
import EntityListDefaultNoEntitiesCard from "@/components/ui-extra/entity-list-default-no-entities-card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useErc8004Agents } from "@/hooks/use-erc8004-agents";
import { cn } from "@/lib/utils";
import { AgentSummary } from "agent0-sdk";
import { ClassValue } from "clsx";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

export function CouncilNewForm({ className }: { className?: ClassValue }) {
  const router = useRouter();
  const { data: agents, isLoading: isAgentsLoading } = useErc8004Agents();
  const [selectedAgentIds, setSelectedAgentIds] = useState<string[]>([]);

  const onToggleAgent = (agentId: string) => {
    setSelectedAgentIds((current) =>
      current.includes(agentId)
        ? current.filter((id) => id !== agentId)
        : [...current, agentId],
    );
  };

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    router.push("/councils/chat");
  };

  return (
    <form className={cn("flex flex-col gap-4", className)} onSubmit={onSubmit}>
      {isAgentsLoading || !agents ? (
        <div className="flex flex-col gap-4">
          <Skeleton className="h-24 rounded-2xl" />
          <Skeleton className="h-24 rounded-2xl" />
          <Skeleton className="h-24 rounded-2xl" />
        </div>
      ) : (
        <EntityList<AgentSummary>
          entities={agents}
          renderEntityCard={(agent) => {
            const isSelected = selectedAgentIds.includes(agent.agentId);

            return (
              <div
                key={agent.agentId}
                role="button"
                tabIndex={0}
                onClick={() => onToggleAgent(agent.agentId)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    onToggleAgent(agent.agentId);
                  }
                }}
                className={cn(
                  "rounded-2xl cursor-pointer transition-colors",
                  isSelected ? "ring-2 ring-primary" : "hover:bg-muted/20",
                )}
              >
                <AgentCard agent={agent} />
              </div>
            );
          }}
          noEntitiesCard={
            <EntityListDefaultNoEntitiesCard noEntitiesText="No agents found" />
          }
        />
      )}

      <p className="text-sm text-muted-foreground">
        {selectedAgentIds.length} agent
        {selectedAgentIds.length === 1 ? "" : "s"} selected
      </p>

      <Button type="submit">Convene the Council</Button>
    </form>
  );
}
