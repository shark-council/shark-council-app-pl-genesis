import {
  AgentSummary,
  EndpointType,
  Feedback,
  RegistrationFile,
  SDK,
  buildErc8004RegistrationJson,
} from "agent0-sdk";
import { erc8004Config } from "../config/erc8004";
import { uploadContentToStoracha } from "./storacha";

const MANAGER_PRIVATE_KEY = process.env.ERC8004_MANAGER_PRIVATE_KEY as string;
const MANAGER_ADDRESS = process.env.MANAGER_ADDRESS as string;
const REVIEWER_PRIVATE_KEY = process.env.ERC8004_REVIEWER_PRIVATE_KEY as string;

export function getAgent0Sdk(privateKey: string): SDK {
  return new SDK({
    chainId: erc8004Config.chain.id,
    rpcUrl: erc8004Config.chain.rpcUrls.default.http[0] as string,
    privateKey: privateKey,
  });
}

export async function registerErc8004Agent(
  image: string,
  name: string,
  description: string,
  endpoint: string,
): Promise<RegistrationFile> {
  console.log("[ERC-8004] Registering agent...");

  const sdk = getAgent0Sdk(MANAGER_PRIVATE_KEY);
  const agent = sdk.createAgent(name, description, image);
  const registrationFile = agent.getRegistrationFile();
  registrationFile.endpoints.push({
    type: "web" as EndpointType,
    value: endpoint,
    meta: { version: "2.0" },
  });

  const registrationJson = buildErc8004RegistrationJson(registrationFile, {
    chainId: erc8004Config.chain.id,
    identityRegistryAddress: sdk.identityRegistryAddress(),
  });
  const registrationFileString = JSON.stringify(registrationJson, null, 2);
  const { url } = await uploadContentToStoracha(registrationFileString);

  const tx = await agent.registerHTTP(url);
  console.log(`[ERC-8004] TX: ${tx.hash}`);

  await tx.waitConfirmed();
  console.log(`[ERC-8004] Agent ID: ${registrationFile.agentId}`);
  console.log(`[ERC-8004] Agent URI: ${registrationFile.agentURI}`);

  return registrationFile;
}

export async function giveErc8004AgentFeedback(
  agentId: string,
  value: number,
): Promise<Feedback> {
  console.log("[ERC-8004] Giving feedback to agent...");

  const sdk = getAgent0Sdk(REVIEWER_PRIVATE_KEY);
  const tx = await sdk.giveFeedback(agentId, value);
  console.log(`[ERC-8004] TX: ${tx.hash}`);

  const { result: feedback } = await tx.waitConfirmed();
  console.log(`[ERC-8004] Feedback ID: ${feedback.id}`);

  return feedback;
}

export async function getErc8004Agents(): Promise<AgentSummary[]> {
  console.log("[ERC-8004] Getting agents...");

  const sdk = getAgent0Sdk(MANAGER_PRIVATE_KEY);

  const subgraphClient = sdk.subgraphClient;
  if (!subgraphClient) {
    console.error("[ERC-8004] Subgraph client not initialized");
    return [];
  }

  const agentSummaries = await subgraphClient.getAgents({
    where: { owner: MANAGER_ADDRESS },
  });

  // `createdAt` may be in seconds depending on subgraph mapping; normalize to ms.
  const minCreatedAtMs = erc8004Config.minCreatedAt.getTime();
  const filteredAgentSummaries = agentSummaries.filter((agentSummary) => {
    if (agentSummary.createdAt == null) {
      return false;
    }

    const createdAtMs =
      agentSummary.createdAt < 1_000_000_000_000
        ? agentSummary.createdAt * 1000
        : agentSummary.createdAt;

    return createdAtMs >= minCreatedAtMs;
  });

  console.log(
    `[ERC-8004] Found ${filteredAgentSummaries.length}/${agentSummaries.length} agents after minCreatedAt filter`,
  );

  return filteredAgentSummaries;
}
