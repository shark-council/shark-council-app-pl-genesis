import { createFailedApiResponse, createSuccessApiResponse } from "@/lib/api";
import { getErrorString } from "@/lib/error";
import { registerErc8004Agent } from "@/lib/erc8004";
import { NextRequest } from "next/server";
import z from "zod";

export async function POST(request: NextRequest) {
  try {
    console.log("[ERC-8004 API] Registering agent...");

    const bodySchema = z.object({
      name: z.string(),
      description: z.string(),
    });

    const body = await request.json();

    const bodyParseResult = bodySchema.safeParse(body);
    if (!bodyParseResult.success) {
      return createFailedApiResponse({ message: "Invalid request body" }, 400);
    }

    const { name, description } = bodyParseResult.data;

    const registrationFile = await registerErc8004Agent(name, description);

    return createSuccessApiResponse(registrationFile);
  } catch (error) {
    console.error(
      `[ERC-8004 API] Failed to register agent, error: ${getErrorString(error)}`,
    );
    return createFailedApiResponse({ message: "Internal server error" }, 500);
  }
}
