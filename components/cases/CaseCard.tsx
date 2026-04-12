import { Case } from "@/lib/types";

interface CaseCardProps {
  caseData: Case;
}

export function CaseCard({ caseData }: CaseCardProps) {
  const date = new Date(caseData.created_at).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const modeLabel =
    caseData.mode === "quick_read" ? "⚡ Quick Read" : "📚 Learning";
  const modeColor =
    caseData.mode === "quick_read" ? "text-blue-400" : "text-purple-400";

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-lg p-4 hover:border-gray-600 transition cursor-pointer">
      <div className="flex justify-between items-start mb-2">
        <div>
          <span className="text-gray-200 font-medium text-sm">
            {caseData.body_region || "Unknown Region"}
          </span>
          {caseData.modality && (
            <span className="ml-2 text-gray-500 text-xs">
              {caseData.modality}
            </span>
          )}
        </div>
        <span className={`text-xs font-medium ${modeColor}`}>{modeLabel}</span>
      </div>

      {caseData.analysis && (
        <p className="text-gray-400 text-xs line-clamp-2 mb-2">
          {caseData.analysis.impression}
        </p>
      )}

      <div className="text-gray-600 text-xs">{date}</div>
    </div>
  );
}
