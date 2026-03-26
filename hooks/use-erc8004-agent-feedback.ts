import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { ApiResponse } from "@/types/api";
import {
  Erc8004AgentFeedbackSummary,
  GetErc8004AgentFeedbackApiData,
} from "@/types/erc8004";

async function getAgentFeedback({
  agentId,
  signal,
}: {
  agentId: string;
  signal: AbortSignal;
}): Promise<Erc8004AgentFeedbackSummary> {
  console.log("[Hook] Getting ERC-8004 agent feedback...");

  const { data } = await axios.get<ApiResponse<GetErc8004AgentFeedbackApiData>>(
    "/api/erc8004/feedback",
    {
      params: { agentId },
      signal,
    },
  );

  if (!data.isSuccess || !data.data?.feedback) {
    throw new Error(data.error?.message ?? "Failed to get agent feedback");
  }

  return data.data.feedback;
}

export function useErc8004AgentFeedback(agentId?: string) {
  return useQuery({
    queryKey: ["erc8004-agent-feedback", agentId],
    queryFn: ({ signal }) =>
      getAgentFeedback({ agentId: agentId as string, signal }),
    enabled: Boolean(agentId),
    retry: 2,
    refetchOnWindowFocus: false,
    refetchInterval: 30000,
  });
}
