"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Spinner } from "@/components/ui/spinner";
import { erc8004Config } from "@/config/erc8004";
import { useAgentURIData } from "@/hooks/use-agent-uri-data";
import { useErc8004AgentFeedback } from "@/hooks/use-erc8004-agent-feedback";
import { AgentSummary } from "agent0-sdk";
import {
  ExternalLinkIcon,
  MessageSquareTextIcon,
  StarIcon,
} from "lucide-react";
import Link from "next/link";

export function AgentCard({ agent }: { agent: AgentSummary }) {
  const uriData = useAgentURIData(agent.agentURI);
  const { data: feedback, isLoading: isFeedbackLoading } =
    useErc8004AgentFeedback(agent.agentId);

  const name = uriData?.name ?? agent.name;
  const description = uriData?.description ?? agent.description;
  const image = uriData?.image ?? agent.image;
  const formattedAverageValue = feedback
    ? Number.isInteger(feedback.averageValue)
      ? feedback.averageValue.toFixed(0)
      : feedback.averageValue.toFixed(1)
    : null;

  const explorerLink = `${erc8004Config.explorer}/${agent.agentId.split(":").pop()}`;
  const stopPropagation = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.stopPropagation();
  };

  const stopSelectionHotkeys = (
    event: React.KeyboardEvent<HTMLAnchorElement>,
  ) => {
    if (event.key === "Enter" || event.key === " ") {
      event.stopPropagation();
    }
  };

  return (
    <div className="bg-card border rounded-2xl p-4">
      <div className="flex flex-row gap-4">
        {/* Image */}
        <Avatar className="size-10">
          <AvatarImage src={image} alt={name} />
          <AvatarFallback className="bg-accent text-accent-foreground">
            {name[0].toUpperCase()}
          </AvatarFallback>
        </Avatar>
        {/* Content */}
        <div className="w-full">
          <p className="font-bold">{name}</p>
          <p className="text-sm text-muted-foreground">{description}</p>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            {isFeedbackLoading ? (
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Spinner className="size-3" />
                Loading feedback
              </div>
            ) : feedback?.count ? (
              <>
                <Badge variant="default" className="gap-1.5">
                  <StarIcon className="size-3 fill-current" />
                  {formattedAverageValue}/100
                </Badge>
                <Badge variant="outline" className="gap-1.5">
                  <MessageSquareTextIcon className="size-3" />
                  {feedback.count} {feedback.count === 1 ? "review" : "reviews"}
                </Badge>
              </>
            ) : (
              <Badge variant="outline">No feedback yet</Badge>
            )}
          </div>
          {explorerLink && (
            <>
              <Separator className="mt-4" />
              <Link
                href={explorerLink}
                target="_blank"
                rel="noopener noreferrer"
                onClick={stopPropagation}
                onKeyDown={stopSelectionHotkeys}
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
