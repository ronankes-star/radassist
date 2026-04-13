import Anthropic from "@anthropic-ai/sdk";
import { QUICK_READ_SYSTEM_PROMPT } from "./prompts";
import { AnalysisResult } from "@/lib/types";

function getClient() {
  // Next.js 16 may not auto-load .env.local for API routes in all cases
  // Try multiple sources for the API key
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    // Fallback: read directly from .env.local
    try {
      const fs = require("fs");
      const path = require("path");
      const envPath = path.join(process.cwd(), ".env.local");
      const envContent = fs.readFileSync(envPath, "utf-8");
      const match = envContent.match(/ANTHROPIC_API_KEY=(.+)/);
      if (match) {
        return new Anthropic({ apiKey: match[1].trim() });
      }
    } catch (e) {
      console.error("Failed to read .env.local:", e);
    }
    throw new Error("ANTHROPIC_API_KEY is not set");
  }
  return new Anthropic({ apiKey });
}

export async function analyzeImage(
  imageBase64: string,
  modality?: string,
  bodyRegion?: string
): Promise<AnalysisResult> {
  const match = imageBase64.match(
    /^data:(image\/(?:png|jpeg|gif|webp));base64,(.+)$/
  );
  if (!match) {
    throw new Error("Invalid base64 image format");
  }

  const mediaType = match[1] as
    | "image/png"
    | "image/jpeg"
    | "image/gif"
    | "image/webp";
  const data = match[2];

  let userPrompt = "Please analyze this medical image and provide a structured report as JSON.";
  if (modality) userPrompt += ` The imaging modality is ${modality}.`;
  if (bodyRegion) userPrompt += ` The body region is ${bodyRegion}.`;

  const response = await getClient().messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 2048,
    system: QUICK_READ_SYSTEM_PROMPT,
    messages: [
      {
        role: "user",
        content: [
          {
            type: "image",
            source: {
              type: "base64",
              media_type: mediaType,
              data,
            },
          },
          {
            type: "text",
            text: userPrompt,
          },
        ],
      },
    ],
  });

  const textBlock = response.content.find((block) => block.type === "text");
  if (!textBlock || textBlock.type !== "text") {
    throw new Error("No text response from Claude");
  }

  const analysis: AnalysisResult = JSON.parse(textBlock.text);
  return analysis;
}
