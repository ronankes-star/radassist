"use client";

import { useState } from "react";
import { setActiveTool, ActiveToolName } from "@/lib/cornerstone/tools";
import { resetViewport, invertImage } from "@/lib/cornerstone/loader";

const tools: { name: ActiveToolName; label: string; shortcut: string }[] = [
  { name: "WindowLevel", label: "W/L", shortcut: "1" },
  { name: "Zoom", label: "Zoom", shortcut: "2" },
  { name: "Pan", label: "Pan", shortcut: "3" },
  { name: "Length", label: "Measure", shortcut: "4" },
  { name: "Angle", label: "Angle", shortcut: "5" },
  { name: "ArrowAnnotate", label: "Annotate", shortcut: "6" },
];

export function ViewerToolbar() {
  const [activeTool, setActiveToolState] = useState<ActiveToolName>("WindowLevel");

  function handleToolClick(toolName: ActiveToolName) {
    setActiveTool(toolName);
    setActiveToolState(toolName);
  }

  return (
    <div className="flex items-center gap-1 px-3 py-2 bg-gray-900/80 border-b border-gray-800">
      {tools.map((tool) => (
        <button
          key={tool.name}
          onClick={() => handleToolClick(tool.name)}
          className={`px-3 py-1.5 rounded text-xs font-medium transition ${
            activeTool === tool.name
              ? "bg-blue-600 text-white"
              : "bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-gray-200"
          }`}
          title={`${tool.label} (${tool.shortcut})`}
        >
          {tool.label}
        </button>
      ))}

      <div className="w-px h-5 bg-gray-700 mx-1" />

      <button
        onClick={invertImage}
        className="px-3 py-1.5 rounded text-xs font-medium bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-gray-200 transition"
        title="Invert (I)"
      >
        Invert
      </button>
      <button
        onClick={resetViewport}
        className="px-3 py-1.5 rounded text-xs font-medium bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-gray-200 transition"
        title="Reset (R)"
      >
        Reset
      </button>
    </div>
  );
}
