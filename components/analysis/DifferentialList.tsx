import { Differential } from "@/lib/types";
import { confidenceColor } from "@/lib/utils";

export function DifferentialList({
  differentials,
}: {
  differentials: Differential[];
}) {
  return (
    <div>
      <div className="text-gray-400 text-xs uppercase tracking-wider mb-2">
        Differential Diagnosis
      </div>
      <div className="bg-gray-900 rounded-lg p-3 space-y-1.5">
        {differentials.map((dx, i) => (
          <div key={i} className="text-gray-200 text-sm flex justify-between">
            <span>
              {i + 1}. {dx.diagnosis}
            </span>
            <span className={`text-xs ${confidenceColor(dx.confidence)}`}>
              ● {dx.confidence.charAt(0).toUpperCase() + dx.confidence.slice(1)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
