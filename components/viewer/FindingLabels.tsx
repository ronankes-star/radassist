"use client";

import { FindingWithPosition } from "@/lib/types";

interface FindingLabelsProps {
  findings: FindingWithPosition[];
  visible: boolean;
}

const positionMap: Record<string, { left: string; top: string }> = {
  "top-left": { left: "12%", top: "12%" },
  "top-center": { left: "50%", top: "12%" },
  "top-right": { left: "88%", top: "12%" },
  "center-left": { left: "12%", top: "50%" },
  "center": { left: "50%", top: "50%" },
  "center-right": { left: "88%", top: "50%" },
  "bottom-left": { left: "12%", top: "85%" },
  "bottom-center": { left: "50%", top: "85%" },
  "bottom-right": { left: "88%", top: "85%" },
};

export function FindingLabels({ findings, visible }: FindingLabelsProps) {
  if (!visible || findings.length === 0) return null;

  return (
    <div className="absolute inset-0 pointer-events-none z-20">
      {findings.map((finding, i) => {
        const pos = positionMap[finding.position] || positionMap["center"];
        return (
          <div
            key={i}
            className="absolute -translate-x-1/2 -translate-y-1/2"
            style={{
              left: pos.left,
              top: pos.top,
              animation: `fadeSlideIn 0.3s ease forwards`,
              animationDelay: `${i * 150}ms`,
              opacity: 0,
            }}
          >
            <div className="flex items-start gap-1.5 max-w-[180px]">
              <div className="w-2.5 h-2.5 rounded-full bg-yellow-400 mt-0.5 shrink-0 shadow-lg shadow-yellow-400/30" />
              <span className="text-[11px] text-yellow-200 bg-black/70 backdrop-blur-sm px-2 py-1 rounded-md leading-tight shadow-lg">
                {finding.text.length > 60 ? finding.text.substring(0, 60) + "..." : finding.text}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
