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
      try {
        await initCornerstone();
        await registerTools();

        if (containerRef.current) {
          await setupViewport(containerRef.current);
          await createToolGroup(getViewportId());
          onViewportReady?.();
        }
      } catch (err) {
        console.error("Cornerstone init failed:", err);
        initializedRef.current = false;
      }
    }

    init();

    return () => {
      destroyEngine();
      initializedRef.current = false;
    };
  }, [onViewportReady]);

  return (
    <div className="relative w-full h-full bg-black" style={{ minHeight: "400px" }}>
      <div
        ref={containerRef}
        style={{ width: "100%", height: "100%", position: "absolute", top: 0, left: 0 }}
        onContextMenu={(e) => e.preventDefault()}
      />
    </div>
  );
}
