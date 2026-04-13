"use client";

import { LoadingSpinner } from "@/components/ui/LoadingSpinner";

interface ComparisonResult {
  image_a: {
    modality: string;
    body_region: string;
    key_findings: string[];
  };
  image_b: {
    modality: string;
    body_region: string;
    key_findings: string[];
  };
  comparison: {
    changes: string[];
    progression: string;
    summary: string;
  };
}

interface ComparisonPanelProps {
  result: ComparisonResult | null;
  loading: boolean;
  error: string | null;
  onRetry: () => void;
}

const progressionColors: Record<string, string> = {
  improved: "text-green-400 bg-green-400/10",
  worsened: "text-red-400 bg-red-400/10",
  stable: "text-blue-400 bg-blue-400/10",
  indeterminate: "text-gray-400 bg-gray-400/10",
};

export function ComparisonPanel({ result, loading, error, onRetry }: ComparisonPanelProps) {
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-3">
        <LoadingSpinner size="lg" />
        <p className="text-gray-400 text-sm">Comparing images...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-3">
        <p className="text-red-400 text-sm">{error}</p>
        <button onClick={onRetry} className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-200 rounded-lg text-sm">
          Retry
        </button>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-500 text-sm">Upload a second image to compare</p>
      </div>
    );
  }

  const progClass = progressionColors[result.comparison.progression] || progressionColors.indeterminate;

  return (
    <div className="p-5 space-y-5 overflow-y-auto h-full">
      <div className="text-blue-400 font-semibold text-sm">Comparison Analysis</div>

      {/* Progression badge */}
      <div style={{ animation: "fadeSlideIn 0.3s ease forwards", opacity: 0 }}>
        <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium capitalize ${progClass}`}>
          {result.comparison.progression}
        </span>
      </div>

      {/* Summary */}
      <div style={{ animation: "fadeSlideIn 0.3s ease forwards", animationDelay: "100ms", opacity: 0 }}>
        <div className="text-gray-400 text-xs uppercase tracking-wider mb-2">Summary</div>
        <div className="bg-gray-900 rounded-lg p-3 text-gray-200 text-sm leading-relaxed">
          {result.comparison.summary}
        </div>
      </div>

      {/* Changes */}
      <div style={{ animation: "fadeSlideIn 0.3s ease forwards", animationDelay: "200ms", opacity: 0 }}>
        <div className="text-gray-400 text-xs uppercase tracking-wider mb-2">Changes Detected</div>
        <div className="bg-gray-900 rounded-lg p-3 space-y-1.5">
          {result.comparison.changes.map((change, i) => (
            <div key={i} className="text-gray-200 text-sm leading-relaxed">• {change}</div>
          ))}
        </div>
      </div>

      {/* Image A findings */}
      <div style={{ animation: "fadeSlideIn 0.3s ease forwards", animationDelay: "300ms", opacity: 0 }}>
        <div className="text-gray-400 text-xs uppercase tracking-wider mb-2">
          Image A — {result.image_a.body_region} {result.image_a.modality}
        </div>
        <div className="bg-gray-900 rounded-lg p-3 space-y-1.5">
          {result.image_a.key_findings.map((f, i) => (
            <div key={i} className="text-gray-200 text-sm leading-relaxed">• {f}</div>
          ))}
        </div>
      </div>

      {/* Image B findings */}
      <div style={{ animation: "fadeSlideIn 0.3s ease forwards", animationDelay: "400ms", opacity: 0 }}>
        <div className="text-gray-400 text-xs uppercase tracking-wider mb-2">
          Image B — {result.image_b.body_region} {result.image_b.modality}
        </div>
        <div className="bg-gray-900 rounded-lg p-3 space-y-1.5">
          {result.image_b.key_findings.map((f, i) => (
            <div key={i} className="text-gray-200 text-sm leading-relaxed">• {f}</div>
          ))}
        </div>
      </div>

      {/* Disclaimer */}
      <div className="pt-2 border-t border-gray-800">
        <p className="text-gray-600 text-xs italic">
          For educational purposes only. Not a clinical diagnostic tool.
        </p>
      </div>
    </div>
  );
}
