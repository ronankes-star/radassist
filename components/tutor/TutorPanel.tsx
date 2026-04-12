"use client";

import { useState, useRef, useEffect } from "react";
import { TutorMessage as TutorMessageType } from "@/lib/types";
import { TutorMessage } from "./TutorMessage";
import { TutorInput } from "./TutorInput";
import { QuickActions } from "./QuickActions";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { exportViewportAsBase64 } from "@/lib/cornerstone/loader";
import toast from "react-hot-toast";

interface TutorPanelProps {
  hasImage: boolean;
}

export function TutorPanel({ hasImage }: TutorPanelProps) {
  const [messages, setMessages] = useState<TutorMessageType[]>([]);
  const [loading, setLoading] = useState(false);
  const [sessionStarted, setSessionStarted] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  async function sendMessage(content: string) {
    const base64 = exportViewportAsBase64();
    if (!base64) {
      toast.error("No image loaded");
      return;
    }

    const userMessage: TutorMessageType = {
      role: "user",
      content,
      timestamp: new Date().toISOString(),
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setLoading(true);

    try {
      const res = await fetch("/api/tutor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          imageBase64: base64,
          messages: updatedMessages,
        }),
      });

      if (!res.ok) {
        throw new Error("Tutor session failed");
      }

      const data = await res.json();
      setMessages([...updatedMessages, data.message]);
    } catch (err) {
      toast.error("Failed to get tutor response. Please try again.");
      setMessages(messages);
    } finally {
      setLoading(false);
    }
  }

  async function startSession() {
    setSessionStarted(true);
    setMessages([]);

    const base64 = exportViewportAsBase64();
    if (!base64) {
      toast.error("No image loaded");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/tutor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageBase64: base64, messages: [] }),
      });

      if (!res.ok) throw new Error("Failed to start session");

      const data = await res.json();
      setMessages([data.message]);
    } catch {
      toast.error("Failed to start learning session.");
      setSessionStarted(false);
    } finally {
      setLoading(false);
    }
  }

  if (!hasImage) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-500 text-sm">
          Upload an image to start a learning session
        </p>
      </div>
    );
  }

  if (!sessionStarted) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4">
        <div className="text-purple-400 font-semibold">🎓 Learning Mode</div>
        <p className="text-gray-400 text-sm text-center max-w-xs">
          Start an interactive session where the AI tutor will guide you through
          reading this image using the Socratic method.
        </p>
        <button
          onClick={startSession}
          className="px-6 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium"
        >
          Start Learning Session
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="px-4 py-3 border-b border-gray-800">
        <div className="text-purple-400 font-semibold text-sm">
          🎓 Learning Session
        </div>
      </div>

      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-3"
      >
        {messages.map((msg, i) => (
          <TutorMessage key={i} message={msg} />
        ))}
        {loading && (
          <div className="flex items-center gap-2 self-start">
            <LoadingSpinner size="sm" />
            <span className="text-gray-500 text-xs">Thinking...</span>
          </div>
        )}
      </div>

      <QuickActions onAction={sendMessage} disabled={loading} />

      <TutorInput onSend={sendMessage} disabled={loading} />
    </div>
  );
}
