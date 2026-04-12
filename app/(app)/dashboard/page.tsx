"use client";

import { useState, useCallback } from "react";
import { ImageViewer } from "@/components/viewer/ImageViewer";
import { ViewerToolbar } from "@/components/viewer/ViewerToolbar";
import { ImageUpload } from "@/components/viewer/ImageUpload";
import { AnalysisPanel } from "@/components/analysis/AnalysisPanel";
import { ModeToggle } from "@/components/ui/ModeToggle";
import { exportViewportAsBase64 } from "@/lib/cornerstone/loader";
import { UploadedImage, AnalysisResult, CaseMode } from "@/lib/types";
import toast from "react-hot-toast";

export default function DashboardPage() {
  const [mode, setMode] = useState<CaseMode>("quick_read");
  const [image, setImage] = useState<UploadedImage | null>(null);
  const [viewportReady, setViewportReady] = useState(false);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [analysisLoading, setAnalysisLoading] = useState(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);

  const handleViewportReady = useCallback(() => {
    setViewportReady(true);
  }, []);

  async function runAnalysis() {
    setAnalysisLoading(true);
    setAnalysisError(null);
    setAnalysis(null);

    try {
      const base64 = exportViewportAsBase64();
      if (!base64) {
        throw new Error("Could not export viewport image");
      }

      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          imageBase64: base64,
          modality: image?.dicomMetadata?.["Modality"],
          bodyRegion: image?.dicomMetadata?.["Body Part Examined"],
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Analysis failed");
      }

      const result: AnalysisResult = await res.json();
      setAnalysis(result);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Analysis failed. Please try again.";
      setAnalysisError(message);
      toast.error(message);
    } finally {
      setAnalysisLoading(false);
    }
  }

  function handleImageLoaded(uploadedImage: UploadedImage) {
    setImage(uploadedImage);
    setAnalysis(null);
    setAnalysisError(null);

    if (mode === "quick_read") {
      setTimeout(() => runAnalysis(), 500);
    }
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-4 py-2 bg-gray-900/50 border-b border-gray-800">
        <ModeToggle mode={mode} onModeChange={setMode} />
        {image && mode === "quick_read" && !analysisLoading && (
          <button
            onClick={runAnalysis}
            className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-medium"
          >
            Re-analyze
          </button>
        )}
      </div>

      <div className="flex flex-1 overflow-hidden">
        <div className="flex flex-col w-[60%] border-r border-gray-800">
          <ViewerToolbar />
          <div className="relative flex-1">
            <ImageViewer onViewportReady={handleViewportReady} />
            {!image && viewportReady && (
              <ImageUpload onImageLoaded={handleImageLoaded} />
            )}
          </div>
        </div>

        <div className="w-[40%] bg-gray-950">
          {mode === "quick_read" ? (
            <AnalysisPanel
              analysis={analysis}
              loading={analysisLoading}
              error={analysisError}
              onRetry={runAnalysis}
            />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500 text-sm">
              Learning Mode — coming in next task
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
