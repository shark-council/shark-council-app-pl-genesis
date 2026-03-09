import { createFailedApiResponse, createSuccessApiResponse } from "@/lib/api";
import { getErrorString } from "@/lib/error";
import { NextRequest } from "next/server";
import z from "zod";

export async function POST(request: NextRequest) {
  try {
    console.log("[API] Sending message to sentiment analyst...");

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

    console.log(`[API] Received message for sentiment analysis: ${message}`);

    return createSuccessApiResponse("Ok");
  } catch (error) {
    console.error(
      `[API] Failed to send message to sentiment analyst, error: ${getErrorString(error)}`,
    );
    return createFailedApiResponse({ message: "Internal server error" }, 500);
  }
}
