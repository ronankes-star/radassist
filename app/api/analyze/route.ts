import { NextRequest, NextResponse } from "next/server";
import { analyzeImage } from "@/lib/claude/analyze";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { imageBase64, modality, bodyRegion } = body;

    if (!imageBase64) {
      return NextResponse.json(
        { error: "imageBase64 is required" },
        { status: 400 }
      );
    }

    const analysis = await analyzeImage(imageBase64, modality, bodyRegion);

    return NextResponse.json(analysis);
  } catch (error) {
    console.error("Analysis error:", error);

    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { error: "Failed to parse AI response. Please try again." },
        { status: 502 }
      );
    }

    return NextResponse.json(
      { error: "Analysis failed. Please try again." },
      { status: 500 }
    );
  }
}
