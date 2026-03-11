import { RegistrationFile, SDK } from "agent0-sdk";
import { erc8004Config } from "../config/erc8004";
import { uploadContentToStoracha } from "./storacha";

export async function registerErc8004Agent(
  name: string,
  description: string,
): Promise<RegistrationFile> {
  console.log("[ERC-8004] Registering agent...");

  const sdk = getAgent0Sdk();
  const agent = sdk.createAgent(name, description);
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

function getAgent0Sdk(): SDK {
  return new SDK({
    chainId: erc8004Config.chain.id,
    rpcUrl: erc8004Config.chain.rpcUrls.default.http[0] as string,
    privateKey: process.env.ERC8004_PRIVATE_KEY,
  });
}
