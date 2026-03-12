import * as Client from "@storacha/client";
import { StoreMemory } from "@storacha/client/stores/memory";
import * as Proof from "@storacha/client/proof";
import { Signer } from "@storacha/client/principal/ed25519";

let _client: Awaited<ReturnType<typeof Client.create>> | null = null;

async function getClient() {
  if (_client) return _client;

  const principal = Signer.parse(process.env.STORACHA_KEY!);
  const store = new StoreMemory();
  const client = await Client.create({ principal, store });

  const proof = await Proof.parse(process.env.STORACHA_PROOF!);
  const space = await client.addSpace(proof);
  await client.setCurrentSpace(space.did());

  _client = client;
  return _client;
}

export async function uploadContentToStoracha(
  content: string,
): Promise<{ cid: string; url: string }> {
  console.log("[Storacha] Uploading content...");

  const client = await getClient();
  const blob = new Blob([content], { type: "application/json" });
  const cid = await client.uploadFile(blob);

  const cidString = cid.toString();
  const url = `https://${cidString}.ipfs.storacha.link`;

  return { cid: cidString, url };
}
