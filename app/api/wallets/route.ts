import { generatePrivateKey, privateKeyToAccount } from "viem/accounts";
import { NextResponse } from "next/server";

export async function POST() {
  const privateKey = generatePrivateKey();
  const account = privateKeyToAccount(privateKey);

  return NextResponse.json({
    address: account.address,
    privateKey,
  });
}
