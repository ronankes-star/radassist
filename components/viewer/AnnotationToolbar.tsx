"use client";

import { AnnotationTool, AnnotationColor } from "@/lib/types";

interface AnnotationToolbarProps {
  activeTool: AnnotationTool;
  activeColor: AnnotationColor;
  onToolChange: (tool: AnnotationTool) => void;
  onColorChange: (color: AnnotationColor) => void;
  onClear: () => void;
  annotationsVisible: boolean;
  onToggleVisibility: () => void;
  findingLabelsVisible: boolean;
  onToggleFindingLabels: () => void;
}

const tools: { tool: AnnotationTool; label: string; icon: string }[] = [
  { tool: "select", label: "Select", icon: "👆" },
  { tool: "arrow", label: "Arrow", icon: "↗" },
  { tool: "circle", label: "Circle", icon: "⭕" },
  { tool: "text", label: "Text", icon: "T" },
];

const colors: AnnotationColor[] = ["#ef4444", "#eab308", "#22c55e", "#3b82f6"];

export function AnnotationToolbar({
  activeTool,
  activeColor,
  onToolChange,
  onColorChange,
  onClear,
  annotationsVisible,
  onToggleVisibility,
  findingLabelsVisible,
  onToggleFindingLabels,
}: AnnotationToolbarProps) {
  return (
    <div className="absolute top-3 left-3 flex flex-col gap-2 z-40">
      {/* Tools */}
      <div className="flex items-center gap-1 bg-gray-900/90 backdrop-blur-sm rounded-lg px-2 py-1.5 border border-gray-700">
        {tools.map((t) => (
          <button
            key={t.tool}
            onClick={() => onToolChange(t.tool)}
            className={`w-8 h-8 rounded flex items-center justify-center text-xs transition ${
              activeTool === t.tool
                ? "bg-blue-600 text-white"
                : "bg-gray-800 text-gray-400 hover:bg-gray-700"
            }`}
            title={t.label}
          >
            {t.icon}
          </button>
        ))}

        <div className="w-px h-5 bg-gray-700 mx-1" />

        {/* Colors */}
        {colors.map((c) => (
          <button
            key={c}
            onClick={() => onColorChange(c)}
            className={`w-6 h-6 rounded-full border-2 transition ${
              activeColor === c ? "border-white scale-110" : "border-transparent"
            }`}
            style={{ backgroundColor: c }}
          />
        ))}

        <div className="w-px h-5 bg-gray-700 mx-1" />

        <button
          onClick={onToggleVisibility}
          className={`px-2 py-1 rounded text-xs ${
            annotationsVisible ? "bg-gray-700 text-gray-200" : "bg-gray-800 text-gray-500"
          }`}
          title="Toggle annotations"
        >
          {annotationsVisible ? "👁" : "👁‍🗨"}
        </button>

        <button
          onClick={onToggleFindingLabels}
          className={`px-2 py-1 rounded text-xs ${
            findingLabelsVisible ? "bg-yellow-600/30 text-yellow-300" : "bg-gray-800 text-gray-500"
          }`}
          title="Toggle AI finding labels"
        >
          AI
        </button>

        <button
          onClick={onClear}
          className="px-2 py-1 rounded text-xs bg-gray-800 text-red-400 hover:bg-red-900/30"
          title="Clear all annotations"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
