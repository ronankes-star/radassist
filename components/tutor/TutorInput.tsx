"use client";

import { useState } from "react";

interface TutorInputProps {
  onSend: (message: string) => void;
  disabled: boolean;
}

export function TutorInput({ onSend, disabled }: TutorInputProps) {
  const [text, setText] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = text.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setText("");
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex items-center gap-2 px-4 py-3 border-t border-gray-800"
    >
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Describe what you see..."
        disabled={disabled}
        className="flex-1 bg-gray-900 border border-gray-700 rounded-lg px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 disabled:opacity-50"
      />
      <button
        type="submit"
        disabled={disabled || !text.trim()}
        className="px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm font-medium disabled:opacity-50"
      >
        Send
      </button>
    </form>
  );
}
