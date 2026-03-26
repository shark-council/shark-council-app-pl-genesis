import { createFailedApiResponse, createSuccessApiResponse } from "@/lib/api";
import {
  getErc8004AgentFeedback,
  giveErc8004AgentFeedback,
} from "@/lib/erc8004";
import { getErrorString } from "@/lib/error";
import { NextRequest } from "next/server";
import z from "zod";

export async function GET(request: NextRequest) {
  try {
    console.log("[ERC-8004 Feedback API] Getting agent feedback...");

    const querySchema = z.object({
      agentId: z.string().trim().min(1),
    });

    const queryParseResult = querySchema.safeParse({
      agentId: request.nextUrl.searchParams.get("agentId"),
    });

    if (!queryParseResult.success) {
      return createFailedApiResponse(
        { message: "Invalid query parameters" },
        400,
      );
    }

    const { agentId } = queryParseResult.data;

    const feedback = await getErc8004AgentFeedback(agentId);

    return createSuccessApiResponse({ feedback });
  } catch (error) {
    console.error(
      `[ERC-8004 Feedback API] Failed to get agent feedback, error: ${getErrorString(error)}`,
    );
    return createFailedApiResponse({ message: "Internal server error" }, 500);
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log("[ERC-8004 Feedback API] Giving feedback to agent...");

    const bodySchema = z.object({
      agentId: z.union([z.string(), z.number()]).transform(String),
      value: z.number(),
      text: z.string().trim().min(1).optional(),
    });

    const body = await request.json();

    const bodyParseResult = bodySchema.safeParse(body);
    if (!bodyParseResult.success) {
      return createFailedApiResponse({ message: "Invalid request body" }, 400);
    }

    const { agentId, value, text } = bodyParseResult.data;

    const feedback = await giveErc8004AgentFeedback(agentId, value, text);

    return createSuccessApiResponse({ feedback });
  } catch (error) {
    console.error(
      `[ERC-8004 Feedback API] Failed to give feedback to agent, error: ${getErrorString(error)}`,
    );
    return createFailedApiResponse({ message: "Internal server error" }, 500);
  }
}
