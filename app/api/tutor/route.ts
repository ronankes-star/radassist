import { NextRequest, NextResponse } from "next/server";
import { tutorConversation } from "@/lib/claude/tutor";
import { TutorMessage } from "@/lib/types";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { imageBase64, messages } = body as {
      imageBase64: string;
      messages: TutorMessage[];
    };

    if (!imageBase64) {
      return NextResponse.json(
        { error: "imageBase64 is required" },
        { status: 400 }
      );
    }

    const response = await tutorConversation(imageBase64, messages || []);

    return NextResponse.json({
      message: {
        role: "assistant",
        content: response,
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error("Tutor error:", error);

    return NextResponse.json(
      { error: "Tutor session failed. Please try again." },
      { status: 500 }
    );
  }
}
