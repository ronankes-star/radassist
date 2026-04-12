"use client";

import { CaseMode } from "@/lib/types";

interface ModeToggleProps {
  mode: CaseMode;
  onModeChange: (mode: CaseMode) => void;
}

export function ModeToggle({ mode, onModeChange }: ModeToggleProps) {
  return (
    <div className="flex gap-1 bg-gray-900 rounded-lg p-1">
      <button
        onClick={() => onModeChange("quick_read")}
        className={`px-4 py-1.5 rounded-md text-xs font-semibold transition ${
          mode === "quick_read"
            ? "bg-blue-600 text-white"
            : "text-gray-400 hover:text-gray-200"
        }`}
      >
        ⚡ Quick Read
      </button>
      <button
        onClick={() => onModeChange("learning")}
        className={`px-4 py-1.5 rounded-md text-xs font-semibold transition ${
          mode === "learning"
            ? "bg-purple-600 text-white"
            : "text-gray-400 hover:text-gray-200"
        }`}
      >
        📚 Learning Mode
      </button>
    </div>
  );
}
