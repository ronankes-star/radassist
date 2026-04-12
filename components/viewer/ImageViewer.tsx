"use client";

import { useRef, useEffect } from "react";
import { initCornerstone } from "@/lib/cornerstone/init";
import { registerTools, createToolGroup } from "@/lib/cornerstone/tools";
import {
  setupViewport,
  getViewportId,
  destroyEngine,
} from "@/lib/cornerstone/loader";

interface ImageViewerProps {
  onViewportReady?: () => void;
}

export function ImageViewer({ onViewportReady }: ImageViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const initializedRef = useRef(false);

  useEffect(() => {
    if (initializedRef.current || !containerRef.current) return;
    initializedRef.current = true;

    async function init() {
      await initCornerstone();
      registerTools();

      if (containerRef.current) {
        setupViewport(containerRef.current);
        createToolGroup(getViewportId());
        onViewportReady?.();
      }
    }

    init();

    return () => {
      destroyEngine();
      initializedRef.current = false;
    };
  }, [onViewportReady]);

  return (
    <div className="relative w-full h-full bg-black">
      <div
        ref={containerRef}
        className="w-full h-full"
        onContextMenu={(e) => e.preventDefault()}
      />
    </div>
  );
}
