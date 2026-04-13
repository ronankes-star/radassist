import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

function getClient() {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
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

const COMPARISON_PROMPT = `You are a board-certified radiologist comparing two medical images. Analyze both images and provide a comparison.

Respond as valid JSON with this structure:
{
  "image_a": {
    "modality": "string",
    "body_region": "string",
    "key_findings": ["array of key findings"]
  },
  "image_b": {
    "modality": "string",
    "body_region": "string",
    "key_findings": ["array of key findings"]
  },
  "comparison": {
    "changes": ["array of changes/differences between the two images"],
    "progression": "improved | worsened | stable | indeterminate",
    "summary": "Brief comparison summary"
  }
}

Respond ONLY with the JSON object.`;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { imageABase64, imageBBase64 } = body;

    if (!imageABase64 || !imageBBase64) {
      return NextResponse.json(
        { error: "Both images are required" },
        { status: 400 }
      );
    }

    function parseBase64(b64: string) {
      const match = b64.match(/^data:(image\/(?:png|jpeg|gif|webp));base64,(.+)$/);
      if (!match) throw new Error("Invalid image format");
      return { mediaType: match[1] as "image/png" | "image/jpeg" | "image/gif" | "image/webp", data: match[2] };
    }

    const imgA = parseBase64(imageABase64);
    const imgB = parseBase64(imageBBase64);

    const response = await getClient().messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 2048,
      system: COMPARISON_PROMPT,
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: "Image A (first/original):" },
            { type: "image", source: { type: "base64", media_type: imgA.mediaType, data: imgA.data } },
            { type: "text", text: "Image B (second/follow-up):" },
            { type: "image", source: { type: "base64", media_type: imgB.mediaType, data: imgB.data } },
            { type: "text", text: "Please compare these two images and provide your analysis as JSON." },
          ],
        },
      ],
    });

    const textBlock = response.content.find((b) => b.type === "text");
    if (!textBlock || textBlock.type !== "text") {
      throw new Error("No response from Claude");
    }

    const result = JSON.parse(textBlock.text);
    return NextResponse.json(result);
  } catch (error) {
    console.error("Compare error:", error);
    return NextResponse.json(
      { error: "Comparison failed. Please try again." },
      { status: 500 }
    );
  }
}
