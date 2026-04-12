"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import { UserProgress } from "@/lib/types";

export default function ProgressPage() {
  const { user } = useAuth();
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    async function fetchProgress() {
      try {
        const res = await fetch(`/api/progress?user_id=${user!.id}`);
        if (res.ok) {
          const data = await res.json();
          setProgress(data);
        }
      } catch (err) {
        console.error("Failed to fetch progress:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchProgress();
  }, [user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-6 w-6 border-2 border-gray-600 border-t-blue-400" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-8">
      <h1 className="text-xl font-bold text-white mb-6">📊 Learning Progress</h1>

      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-5 text-center">
          <div className="text-3xl font-bold text-blue-400">
            {progress?.total_cases || 0}
          </div>
          <div className="text-gray-400 text-sm mt-1">Total Cases</div>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-5 text-center">
          <div className="text-3xl font-bold text-green-400">
            {progress?.accuracy_trend?.length
              ? `${progress.accuracy_trend[progress.accuracy_trend.length - 1]}%`
              : "—"}
          </div>
          <div className="text-gray-400 text-sm mt-1">Latest Accuracy</div>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-5 text-center">
          <div className="text-3xl font-bold text-purple-400">
            {Object.keys(progress?.modality_stats || {}).length}
          </div>
          <div className="text-gray-400 text-sm mt-1">Modalities Studied</div>
        </div>
      </div>

      {progress?.modality_stats &&
        Object.keys(progress.modality_stats).length > 0 && (
          <div className="mb-8">
            <h2 className="text-sm font-semibold text-gray-300 mb-3">
              Modality Breakdown
            </h2>
            <div className="bg-gray-900 border border-gray-800 rounded-lg p-4 space-y-3">
              {Object.entries(progress.modality_stats).map(([mod, count]) => (
                <div key={mod} className="flex justify-between items-center">
                  <span className="text-gray-300 text-sm">{mod}</span>
                  <span className="text-gray-500 text-sm">
                    {count as number} cases
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

      {progress?.weak_areas && progress.weak_areas.length > 0 && (
        <div>
          <h2 className="text-sm font-semibold text-gray-300 mb-3">
            Areas to Improve
          </h2>
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-4 space-y-2">
            {progress.weak_areas.map((area, i) => (
              <div
                key={i}
                className="text-yellow-400 text-sm flex items-center gap-2"
              >
                <span>⚠️</span> {area}
              </div>
            ))}
          </div>
        </div>
      )}

      {(!progress || progress.total_cases === 0) && (
        <div className="text-center py-8">
          <p className="text-gray-500">
            No progress data yet. Complete some learning sessions to see your
            stats.
          </p>
        </div>
      )}
    </div>
  );
}
