import { AgentSummary, Feedback, RegistrationFile, SDK } from "agent0-sdk";
import { erc8004Config } from "../config/erc8004";
import { uploadContentToStoracha } from "./storacha";

export function getAgent0Sdk(): SDK {
  return new SDK({
    chainId: erc8004Config.chain.id,
    rpcUrl: erc8004Config.chain.rpcUrls.default.http[0] as string,
    privateKey: process.env.ERC8004_OWNER_PRIVATE_KEY,
  });
}

// TODO: Add endpoint value (e.g., https://testnet.8004scan.io/agents/base-sepolia/17?tab=metadata)
export async function registerErc8004Agent(
  image: string,
  name: string,
  description: string,
): Promise<RegistrationFile> {
  console.log("[ERC-8004] Registering agent...");

  const sdk = getAgent0Sdk();
  const agent = sdk.createAgent(name, description, image);
  const registrationFile = agent.getRegistrationFile();

  const registrationFileString = JSON.stringify(registrationFile, null, 2);
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

  const sdk = getAgent0Sdk();
  const tx = await sdk.giveFeedback(agentId, value);
  console.log(`[ERC-8004] TX: ${tx.hash}`);

  const { result: feedback } = await tx.waitConfirmed();
  console.log(`[ERC-8004] Feedback ID: ${feedback.id}`);

  return feedback;
}

export async function getErc8004Agents(): Promise<AgentSummary[]> {
  console.log("[ERC-8004] Getting agents...");

  const sdk = getAgent0Sdk();
  const agentSummaries = await sdk.subgraphClient?.getAgents({
    where: { owner: process.env.ERC8004_OWNER_ADDRESS as string },
  });
  console.log(`[ERC-8004] Found ${agentSummaries || [].length} agents`);

  return agentSummaries || [];
}

export async function getErc8004AgentReputationSummary(
  agentId: string,
): Promise<{ count: number; averageValue: number }> {
  console.log("[ERC-8004] Getting agent reputation summary...");

  const sdk = getAgent0Sdk();
  const { count, averageValue } = await sdk.getReputationSummary(agentId);
  console.log(
    `[ERC-8004] Agent ${agentId} has ${count} feedback entries with an average value of ${averageValue}`,
  );

  return { count, averageValue };
}
