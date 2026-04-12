import Anthropic from "@anthropic-ai/sdk";
import type { MessageParam } from "@anthropic-ai/sdk/resources/messages/messages";
import { LEARNING_MODE_SYSTEM_PROMPT } from "./prompts";
import { TutorMessage } from "@/lib/types";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
});

export async function tutorConversation(
  imageBase64: string,
  messages: TutorMessage[]
): Promise<string> {
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

  const claudeMessages: MessageParam[] = [];

  if (messages.length === 0) {
    claudeMessages.push({
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
          text: "I have a new case to review. Please start the learning session.",
        },
      ],
    });
  } else {
    claudeMessages.push({
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
          text: messages[0].content,
        },
      ],
    });

    for (let i = 1; i < messages.length; i++) {
      claudeMessages.push({
        role: messages[i].role === "user" ? "user" : "assistant",
        content: messages[i].content,
      });
    }
  }

  const response = await anthropic.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 1024,
    system: LEARNING_MODE_SYSTEM_PROMPT,
    messages: claudeMessages,
  });

  const textBlock = response.content.find((block) => block.type === "text");
  if (!textBlock || textBlock.type !== "text") {
    throw new Error("No text response from Claude");
  }

  return textBlock.text;
}
