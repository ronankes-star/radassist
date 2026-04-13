"use client";

interface ImageControlsProps {
  zoom: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onReset: () => void;
  onInvert: () => void;
  inverted: boolean;
}

export function ImageControls({
  zoom,
  onZoomIn,
  onZoomOut,
  onReset,
  onInvert,
  inverted,
}: ImageControlsProps) {
  return (
    <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex items-center gap-1 bg-gray-900/90 backdrop-blur-sm rounded-lg px-2 py-1.5 border border-gray-700 z-10">
      <button
        onClick={onZoomOut}
        className="px-2.5 py-1 rounded text-xs font-medium bg-gray-800 text-gray-300 hover:bg-gray-700"
        title="Zoom Out"
      >
        −
      </button>
      <span className="text-xs text-gray-400 w-12 text-center font-mono">
        {zoom.toFixed(1)}x
      </span>
      <button
        onClick={onZoomIn}
        className="px-2.5 py-1 rounded text-xs font-medium bg-gray-800 text-gray-300 hover:bg-gray-700"
        title="Zoom In"
      >
        +
      </button>
      <div className="w-px h-4 bg-gray-700 mx-1" />
      <button
        onClick={onReset}
        className="px-2.5 py-1 rounded text-xs font-medium bg-gray-800 text-gray-300 hover:bg-gray-700"
        title="Fit to Screen"
      >
        Fit
      </button>
      <button
        onClick={onInvert}
        className={`px-2.5 py-1 rounded text-xs font-medium ${
          inverted ? "bg-blue-600 text-white" : "bg-gray-800 text-gray-300 hover:bg-gray-700"
        }`}
        title="Invert Colors"
      >
        Invert
      </button>
    </div>
  );
}
