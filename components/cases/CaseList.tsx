"use client";

import { Case } from "@/lib/types";
import { CaseCard } from "./CaseCard";

interface CaseListProps {
  cases: Case[];
  loading: boolean;
}

export function CaseList({ cases, loading }: CaseListProps) {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-6 w-6 border-2 border-gray-600 border-t-blue-400" />
      </div>
    );
  }

  if (cases.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No cases yet.</p>
        <p className="text-gray-600 text-sm mt-1">
          Upload an image on the dashboard to create your first case.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-3">
      {cases.map((c) => (
        <CaseCard key={c.id} caseData={c} />
      ))}
    </div>
  );
}
