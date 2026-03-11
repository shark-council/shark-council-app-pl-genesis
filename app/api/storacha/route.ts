import { createFailedApiResponse, createSuccessApiResponse } from "@/lib/api";
import { getErrorString } from "@/lib/error";
import { uploadContentToStoracha } from "@/lib/storacha";
import { NextRequest } from "next/server";
import z from "zod";

export async function POST(request: NextRequest) {
  try {
    console.log("[Storacha API] Uploading content to Storacha...");

    const bodySchema = z.object({
      content: z.string(),
    });

    const body = await request.json();

    const bodyParseResult = bodySchema.safeParse(body);
    if (!bodyParseResult.success) {
      return createFailedApiResponse({ message: "Invalid request body" }, 400);
    }

    const { content } = bodyParseResult.data;

    const { cid, url } = await uploadContentToStoracha(content);

    return createSuccessApiResponse({ cid, url });
  } catch (error) {
    console.error(
      `[Storacha API] Failed to upload content to Storacha, error: ${getErrorString(error)}`,
    );
    return createFailedApiResponse({ message: "Internal server error" }, 500);
  }
}
