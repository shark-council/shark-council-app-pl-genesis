"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { erc8004Config } from "@/config/erc8004";
import { AgentSummary } from "agent0-sdk";
import { ExternalLinkIcon } from "lucide-react";
import Link from "next/link";

export function AgentCard({ agent }: { agent: AgentSummary }) {
  const explorerLink = `${erc8004Config.explorer}/${agent.agentId.split(":").pop()}`;

  return (
    <div className="bg-card border rounded-2xl p-4">
      <div className="flex flex-row gap-4">
        {/* Image */}
        <Avatar className="size-10">
          <AvatarImage src={agent.image} alt={agent.name} />
          <AvatarFallback className="bg-accent text-accent-foreground">
            {agent.name[0].toUpperCase()}
          </AvatarFallback>
        </Avatar>
        {/* Content */}
        <div className="w-full">
          <p className="font-bold">{agent.name}</p>
          <p className="text-sm text-muted-foreground">{agent.description}</p>
          {explorerLink && (
            <>
              <Separator className="mt-4" />
              <Link
                href={explorerLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 mt-4 text-sm text-primary hover:underline"
              >
                ERC-8004 Explorer
                <ExternalLinkIcon className="size-3" />
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
