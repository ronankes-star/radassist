import { TutorMessage as TutorMessageType } from "@/lib/types";

export function TutorMessage({ message }: { message: TutorMessageType }) {
  const isAssistant = message.role === "assistant";

  return (
    <div
      className={`rounded-xl p-3.5 max-w-[90%] ${
        isAssistant
          ? "bg-purple-500/10 border border-purple-500/20 self-start"
          : "bg-gray-900 border border-gray-700 self-end"
      }`}
    >
      <div
        className={`text-xs mb-1 ${
          isAssistant ? "text-purple-400" : "text-blue-400"
        }`}
      >
        {isAssistant ? "RadAssist Tutor" : "You"}
      </div>
      <div className="text-gray-200 text-sm leading-relaxed whitespace-pre-wrap">
        {message.content}
      </div>
    </div>
  );
}
