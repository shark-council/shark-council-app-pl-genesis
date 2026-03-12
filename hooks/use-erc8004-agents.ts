import { AgentSummary } from "agent0-sdk";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

async function getAgents({
  signal,
}: {
  signal: AbortSignal;
}): Promise<AgentSummary[]> {
  console.log("[Hook] Getting ERC-8004 agents...");

  const { data } = await axios.get("/api/erc8004", { signal });

  return data.data.agents;
}

export function useErc8004Agents() {
  return useQuery({
    queryKey: ["erc8004-agents"],
    queryFn: ({ signal }) => getAgents({ signal }),
    retry: 2,
    refetchOnWindowFocus: false,
    refetchInterval: 30000,
  });
}
