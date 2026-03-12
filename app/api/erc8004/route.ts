import { createFailedApiResponse, createSuccessApiResponse } from "@/lib/api";
import { getErc8004Agents, registerErc8004Agent } from "@/lib/erc8004";
import { getErrorString } from "@/lib/error";
import { NextRequest } from "next/server";
import z from "zod";

export async function GET() {
  try {
    console.log("[ERC-8004 API] Getting agents...");

    const agents = await getErc8004Agents();

    return createSuccessApiResponse({ agents });
  } catch (error) {
    console.error(
      `[ERC-8004 API] Failed to get agents, error: ${getErrorString(error)}`,
    );
    return createFailedApiResponse({ message: "Internal server error" }, 500);
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log("[ERC-8004 API] Registering agent...");

    const bodySchema = z.object({
      image: z.string(),
      name: z.string(),
      description: z.string(),
    });

    const body = await request.json();

    const bodyParseResult = bodySchema.safeParse(body);
    if (!bodyParseResult.success) {
      return createFailedApiResponse({ message: "Invalid request body" }, 400);
    }

    const { image, name, description } = bodyParseResult.data;

    const registrationFile = await registerErc8004Agent(
      image,
      name,
      description,
    );

    return createSuccessApiResponse(registrationFile);
  } catch (error) {
    console.error(
      `[ERC-8004 API] Failed to register agent, error: ${getErrorString(error)}`,
    );
    return createFailedApiResponse({ message: "Internal server error" }, 500);
  }
}
