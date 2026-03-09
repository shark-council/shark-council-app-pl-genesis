import { invokeAgent } from "@/lib/agents/sentiment-analyst";
import { createFailedApiResponse, createSuccessApiResponse } from "@/lib/api";
import { getErrorString } from "@/lib/error";
import { HumanMessage } from "langchain";
import { NextRequest } from "next/server";
import z from "zod";

export async function POST(request: NextRequest) {
  try {
    console.log("[Agents API] Sending message to sentiment analyst...");

    // Define the schema for request body validation
    const bodySchema = z.object({
      message: z.string(),
    });

    // Extract request body
    const body = await request.json();

    // Validate request body using schema
    const bodyParseResult = bodySchema.safeParse(body);
    if (!bodyParseResult.success) {
      return createFailedApiResponse({ message: "Invalid request body" }, 400);
    }

    // Extract validated data
    const { message } = bodyParseResult.data;

    // Invoke the agent
    const response = await invokeAgent([new HumanMessage(message)]);

    return createSuccessApiResponse({ response });
  } catch (error) {
    console.error(
      `[Agents API] Failed to send message to sentiment analyst, error: ${getErrorString(error)}`,
    );
    return createFailedApiResponse({ message: "Internal server error" }, 500);
  }
}
