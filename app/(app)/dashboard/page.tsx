"use client";

import { useState } from "react";
import { ImageUpload } from "@/components/viewer/ImageUpload";
import { ImageControls } from "@/components/viewer/ImageControls";
import { ImageInfoBar } from "@/components/viewer/ImageInfoBar";
import { AnnotationOverlay } from "@/components/viewer/AnnotationOverlay";
import { AnnotationToolbar } from "@/components/viewer/AnnotationToolbar";
import { FindingLabels } from "@/components/viewer/FindingLabels";
import { AnalysisPanel } from "@/components/analysis/AnalysisPanel";
import { ModeToggle } from "@/components/ui/ModeToggle";
import { fileToBase64 } from "@/lib/utils";
import { UploadedImage, AnalysisResult, CaseMode, Annotation, AnnotationTool, AnnotationColor } from "@/lib/types";
import { TutorPanel } from "@/components/tutor/TutorPanel";
import { useAuth } from "@/components/auth/AuthProvider";
import toast from "react-hot-toast";

export default function DashboardPage() {
  const { user } = useAuth();
  const [mode, setMode] = useState<CaseMode>("quick_read");
  const [image, setImage] = useState<UploadedImage | null>(null);
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [analysisLoading, setAnalysisLoading] = useState(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });
  const [inverted, setInverted] = useState(false);
  const [imageDimensions, setImageDimensions] = useState<{ width: number; height: number } | null>(null);
  const [annotations, setAnnotations] = useState<Annotation[]>([]);
  const [annotationTool, setAnnotationTool] = useState<AnnotationTool>("select");
  const [annotationColor, setAnnotationColor] = useState<AnnotationColor>("#ef4444");
  const [annotationsVisible, setAnnotationsVisible] = useState(true);
  const [findingLabelsVisible, setFindingLabelsVisible] = useState(true);

  function handleZoomIn() {
    setZoom((z) => Math.min(z + 0.5, 5));
  }

  function handleZoomOut() {
    setZoom((z) => Math.max(z - 0.5, 0.5));
  }

  function handleResetView() {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  }

  function handleWheel(e: React.WheelEvent) {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.25 : 0.25;
    setZoom((z) => Math.min(Math.max(z + delta, 0.5), 5));
  }

  function handleMouseDown(e: React.MouseEvent) {
    if (zoom <= 1) return;
    setIsPanning(true);
    setPanStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  }

  function handleMouseMove(e: React.MouseEvent) {
    if (!isPanning) return;
    setPan({ x: e.clientX - panStart.x, y: e.clientY - panStart.y });
  }

  function handleMouseUp() {
    setIsPanning(false);
  }

  function handleImageLoad(e: React.SyntheticEvent<HTMLImageElement>) {
    const img = e.currentTarget;
    setImageDimensions({ width: img.naturalWidth, height: img.naturalHeight });
  }

  function handleAddAnnotation(annotation: Annotation) {
    setAnnotations((prev) => [...prev, annotation]);
  }

  async function runAnalysis(base64Override?: string) {
    const base64 = base64Override || imageBase64;
    if (!base64) {
      toast.error("No image loaded. Please upload an image first.");
      return;
    }

    setAnalysisLoading(true);
    setAnalysisError(null);
    setAnalysis(null);

    try {
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

  async function saveCase() {
    if (!user || !image) return;

    try {
      const { supabase } = await import("@/lib/supabase/client");
      const fileName = `${user.id}/${Date.now()}-${image.file.name}`;

      const { error: uploadError } = await supabase.storage
        .from("case-images")
        .upload(fileName, image.file);

      if (uploadError) throw uploadError;

      const {
        data: { publicUrl },
      } = supabase.storage.from("case-images").getPublicUrl(fileName);

      await fetch("/api/cases", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: user.id,
          image_url: publicUrl,
          modality: image.dicomMetadata?.["Modality"] || analysis?.modality || "",
          body_region:
            image.dicomMetadata?.["Body Part Examined"] ||
            analysis?.body_region ||
            "",
          dicom_metadata: image.dicomMetadata,
          analysis,
          mode,
        }),
      });

      toast.success("Case saved!");
    } catch (err) {
      console.error("Save error:", err);
      toast.error("Failed to save case");
    }
  }

  async function handleImageLoaded(uploadedImage: UploadedImage) {
    setImage(uploadedImage);
    setAnalysis(null);
    setAnalysisError(null);

    let base64: string | null = null;
    try {
      base64 = await fileToBase64(uploadedImage.file);
      setImageBase64(base64);
    } catch {
      console.error("Failed to convert image to base64");
    }

    if (mode === "quick_read" && base64) {
      runAnalysis(base64);
    }
  }

  function clearImage() {
    if (image?.previewUrl) {
      URL.revokeObjectURL(image.previewUrl);
    }
    setImage(null);
    setImageBase64(null);
    setAnalysis(null);
    setAnalysisError(null);
    setZoom(1);
    setPan({ x: 0, y: 0 });
    setInverted(false);
    setImageDimensions(null);
    setAnnotations([]);
  }

  return (
    <div className="flex flex-col h-full">
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 py-2 bg-gray-900/50 border-b border-gray-800">
        <ModeToggle mode={mode} onModeChange={setMode} />
        <div className="flex gap-2">
          {image && mode === "quick_read" && !analysisLoading && (
            <button
              onClick={() => runAnalysis()}
              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-medium"
            >
              Re-analyze
            </button>
          )}
          {image && (
            <>
              <button
                onClick={saveCase}
                className="px-3 py-1.5 bg-gray-700 hover:bg-gray-600 text-gray-200 rounded-lg text-xs font-medium"
              >
                Save Case
              </button>
              <button
                onClick={clearImage}
                className="px-3 py-1.5 bg-gray-800 hover:bg-gray-700 text-gray-400 rounded-lg text-xs font-medium"
              >
                New Image
              </button>
            </>
          )}
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left: Image viewer (60%) */}
        <div className="w-[60%] border-r border-gray-800 bg-black relative">
          {image && image.previewUrl ? (
            <>
              <div
                className="absolute inset-0 overflow-hidden"
                style={{ cursor: zoom > 1 ? (isPanning ? "grabbing" : "grab") : "default" }}
                onWheel={handleWheel}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                onDoubleClick={handleResetView}
              >
                <div className="w-full h-full flex items-center justify-center">
                  <img
                    src={image.previewUrl}
                    alt="Uploaded medical image"
                    className="max-w-full max-h-full object-contain select-none"
                    style={{
                      transform: `scale(${zoom}) translate(${pan.x / zoom}px, ${pan.y / zoom}px)`,
                      transition: isPanning ? "none" : "transform 0.2s ease",
                      filter: inverted ? "invert(1)" : "none",
                    }}
                    draggable={false}
                    onLoad={handleImageLoad}
                  />
                </div>
              </div>
              <ImageControls
                zoom={zoom}
                onZoomIn={handleZoomIn}
                onZoomOut={handleZoomOut}
                onReset={handleResetView}
                onInvert={() => setInverted(!inverted)}
                inverted={inverted}
              />
              <AnnotationToolbar
                activeTool={annotationTool}
                activeColor={annotationColor}
                onToolChange={setAnnotationTool}
                onColorChange={setAnnotationColor}
                onClear={() => setAnnotations([])}
                annotationsVisible={annotationsVisible}
                onToggleVisibility={() => setAnnotationsVisible(!annotationsVisible)}
                findingLabelsVisible={findingLabelsVisible}
                onToggleFindingLabels={() => setFindingLabelsVisible(!findingLabelsVisible)}
              />
              <AnnotationOverlay
                annotations={annotations}
                onAddAnnotation={handleAddAnnotation}
                activeTool={annotationTool}
                activeColor={annotationColor}
                visible={annotationsVisible}
              />
              {analysis?.positioned_findings && (
                <FindingLabels
                  findings={analysis.positioned_findings}
                  visible={findingLabelsVisible}
                />
              )}
              <ImageInfoBar
                filename={image.file.name}
                fileSize={image.file.size}
                fileType={image.fileType}
                dimensions={imageDimensions || undefined}
              />
            </>
          ) : (
            <ImageUpload onImageLoaded={handleImageLoaded} />
          )}
        </div>

        {/* Right: Analysis / Tutor Panel (40%) */}
        <div className="w-[40%] bg-gray-950">
          {mode === "quick_read" ? (
            <AnalysisPanel
              analysis={analysis}
              loading={analysisLoading}
              error={analysisError}
              onRetry={() => runAnalysis()}
              imageBase64={imageBase64}
            />
          ) : (
            <TutorPanel hasImage={!!image} imageBase64={imageBase64} />
          )}
        </div>
      </div>
    </div>
  );
}
