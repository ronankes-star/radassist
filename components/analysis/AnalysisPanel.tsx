"use client";

import { AnalysisResult } from "@/lib/types";
import { ModalityBadge } from "./ModalityBadge";
import { FindingsList } from "./FindingsList";
import { DifferentialList } from "./DifferentialList";
import { NextStepsList } from "./NextStepsList";
import { AnalysisSkeleton } from "@/components/ui/AnalysisSkeleton";

interface AnalysisPanelProps {
  analysis: AnalysisResult | null;
  loading: boolean;
  error: string | null;
  onRetry: () => void;
}

export function AnalysisPanel({
  analysis,
  loading,
  error,
  onRetry,
}: AnalysisPanelProps) {
  if (loading) {
    return <AnalysisSkeleton />;
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-3">
        <p className="text-red-400 text-sm">{error}</p>
        <button
          onClick={onRetry}
          className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-200 rounded-lg text-sm"
        >
          Retry Analysis
        </button>
      </div>
    );
  }

  if (!analysis) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-500 text-sm">
          Upload an image to see AI analysis
        </p>
      </div>
    );
  }

  return (
    <div className="p-5 space-y-5 overflow-y-auto h-full">
      <div
        style={{ animation: "fadeSlideIn 0.3s ease forwards", animationDelay: "0ms", opacity: 0 }}
        className="text-blue-400 font-semibold text-sm"
      >
        AI Analysis
      </div>

      <div style={{ animation: "fadeSlideIn 0.3s ease forwards", animationDelay: "100ms", opacity: 0 }}>
        <ModalityBadge
          modality={analysis.modality}
          bodyRegion={analysis.body_region}
        />
      </div>

      <div style={{ animation: "fadeSlideIn 0.3s ease forwards", animationDelay: "200ms", opacity: 0 }}>
        <FindingsList findings={analysis.findings} />
      </div>

      <div style={{ animation: "fadeSlideIn 0.3s ease forwards", animationDelay: "300ms", opacity: 0 }}>
        <div className="text-gray-400 text-xs uppercase tracking-wider mb-2">
          Impression
        </div>
        <div className="bg-gray-900 rounded-lg p-3 text-gray-200 text-sm leading-relaxed">
          {analysis.impression}
        </div>
      </div>

      <div style={{ animation: "fadeSlideIn 0.3s ease forwards", animationDelay: "400ms", opacity: 0 }}>
        <DifferentialList differentials={analysis.differentials} />
      </div>

      <div style={{ animation: "fadeSlideIn 0.3s ease forwards", animationDelay: "500ms", opacity: 0 }}>
        <NextStepsList steps={analysis.next_steps} />
      </div>

      <div
        style={{ animation: "fadeSlideIn 0.3s ease forwards", animationDelay: "600ms", opacity: 0 }}
        className="pt-2 border-t border-gray-800"
      >
        <p className="text-gray-600 text-xs italic">
          ⚠️ For educational purposes only. Not a clinical diagnostic tool.
        </p>
      </div>
    </div>
  );
}
