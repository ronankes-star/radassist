"use client";

import { useState, useRef } from "react";
import { Annotation, AnnotationTool, AnnotationColor } from "@/lib/types";

interface AnnotationOverlayProps {
  annotations: Annotation[];
  onAddAnnotation: (annotation: Annotation) => void;
  activeTool: AnnotationTool;
  activeColor: AnnotationColor;
  visible: boolean;
}

export function AnnotationOverlay({
  annotations,
  onAddAnnotation,
  activeTool,
  activeColor,
  visible,
}: AnnotationOverlayProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [drawing, setDrawing] = useState(false);
  const [startPoint, setStartPoint] = useState<{ x: number; y: number } | null>(null);
  const [currentPoint, setCurrentPoint] = useState<{ x: number; y: number } | null>(null);

  if (!visible) return null;

  function getPercentCoords(e: React.MouseEvent<SVGSVGElement>) {
    const svg = svgRef.current;
    if (!svg) return { x: 0, y: 0 };
    const rect = svg.getBoundingClientRect();
    return {
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    };
  }

  function handleMouseDown(e: React.MouseEvent<SVGSVGElement>) {
    if (activeTool === "select") return;
    const point = getPercentCoords(e);

    if (activeTool === "text") {
      const content = prompt("Enter annotation text:");
      if (content) {
        onAddAnnotation({
          id: crypto.randomUUID(),
          type: "text",
          color: activeColor,
          x: point.x,
          y: point.y,
          content,
        });
      }
      return;
    }

    setDrawing(true);
    setStartPoint(point);
    setCurrentPoint(point);
  }

  function handleMouseMove(e: React.MouseEvent<SVGSVGElement>) {
    if (!drawing) return;
    setCurrentPoint(getPercentCoords(e));
  }

  function handleMouseUp() {
    if (!drawing || !startPoint || !currentPoint) return;
    setDrawing(false);

    if (activeTool === "arrow") {
      onAddAnnotation({
        id: crypto.randomUUID(),
        type: "arrow",
        color: activeColor,
        startX: startPoint.x,
        startY: startPoint.y,
        endX: currentPoint.x,
        endY: currentPoint.y,
      });
    } else if (activeTool === "circle") {
      const dx = currentPoint.x - startPoint.x;
      const dy = currentPoint.y - startPoint.y;
      const radius = Math.sqrt(dx * dx + dy * dy);
      onAddAnnotation({
        id: crypto.randomUUID(),
        type: "circle",
        color: activeColor,
        cx: startPoint.x,
        cy: startPoint.y,
        radius,
      });
    }

    setStartPoint(null);
    setCurrentPoint(null);
  }

  return (
    <svg
      ref={svgRef}
      className="absolute inset-0 w-full h-full z-30"
      style={{
        cursor: activeTool === "select" ? "default" : "crosshair",
        pointerEvents: activeTool === "select" ? "none" : "auto",
      }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={() => { setDrawing(false); setStartPoint(null); }}
    >
      <defs>
        <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="10" refY="3.5" orient="auto">
          <polygon points="0 0, 10 3.5, 0 7" fill="currentColor" />
        </marker>
      </defs>

      {/* Existing annotations */}
      {annotations.map((ann) => {
        if (ann.type === "arrow" && ann.startX != null && ann.startY != null && ann.endX != null && ann.endY != null) {
          return (
            <line
              key={ann.id}
              x1={`${ann.startX}%`}
              y1={`${ann.startY}%`}
              x2={`${ann.endX}%`}
              y2={`${ann.endY}%`}
              stroke={ann.color}
              strokeWidth="2"
              markerEnd="url(#arrowhead)"
              style={{ color: ann.color }}
            />
          );
        }
        if (ann.type === "circle" && ann.cx != null && ann.cy != null && ann.radius != null) {
          return (
            <circle
              key={ann.id}
              cx={`${ann.cx}%`}
              cy={`${ann.cy}%`}
              r={`${ann.radius}%`}
              stroke={ann.color}
              strokeWidth="2"
              fill="none"
            />
          );
        }
        if (ann.type === "text" && ann.x != null && ann.y != null) {
          return (
            <text
              key={ann.id}
              x={`${ann.x}%`}
              y={`${ann.y}%`}
              fill={ann.color}
              fontSize="14"
              fontWeight="bold"
              style={{ textShadow: "0 1px 3px rgba(0,0,0,0.8)" }}
            >
              {ann.content}
            </text>
          );
        }
        return null;
      })}

      {/* Drawing preview */}
      {drawing && startPoint && currentPoint && activeTool === "arrow" && (
        <line
          x1={`${startPoint.x}%`}
          y1={`${startPoint.y}%`}
          x2={`${currentPoint.x}%`}
          y2={`${currentPoint.y}%`}
          stroke={activeColor}
          strokeWidth="2"
          strokeDasharray="4"
          opacity={0.7}
        />
      )}
      {drawing && startPoint && currentPoint && activeTool === "circle" && (
        <circle
          cx={`${startPoint.x}%`}
          cy={`${startPoint.y}%`}
          r={`${Math.sqrt(
            Math.pow(currentPoint.x - startPoint.x, 2) +
            Math.pow(currentPoint.y - startPoint.y, 2)
          )}%`}
          stroke={activeColor}
          strokeWidth="2"
          strokeDasharray="4"
          fill="none"
          opacity={0.7}
        />
      )}
    </svg>
  );
}
