import axios from "axios";
import { useEffect, useState } from "react";

export type AgentURIData = {
  name?: string;
  description?: string;
  image?: string;
};

export function useAgentURIData(agentURI?: string) {
  const [data, setData] = useState<AgentURIData | null>(null);

  useEffect(() => {
    if (!agentURI) {
      return;
    }
    axios
      .get<AgentURIData>(agentURI)
      .then((response) => setData(response.data))
      .catch(() => {});
  }, [agentURI]);

  return data;
}
