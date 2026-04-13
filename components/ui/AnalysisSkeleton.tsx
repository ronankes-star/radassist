export function AnalysisSkeleton() {
  return (
    <div className="p-5 space-y-5 animate-pulse">
      {/* Header */}
      <div className="h-4 w-24 bg-gray-800 rounded" />

      {/* Modality badge */}
      <div className="h-6 w-32 bg-gray-800 rounded-full" />

      {/* Findings */}
      <div className="space-y-2">
        <div className="h-3 w-16 bg-gray-700 rounded" />
        <div className="bg-gray-900 rounded-lg p-3 space-y-2">
          <div className="h-3 w-full bg-gray-800 rounded" />
          <div className="h-3 w-5/6 bg-gray-800 rounded" />
          <div className="h-3 w-4/6 bg-gray-800 rounded" />
          <div className="h-3 w-5/6 bg-gray-800 rounded" />
        </div>
      </div>

      {/* Impression */}
      <div className="space-y-2">
        <div className="h-3 w-20 bg-gray-700 rounded" />
        <div className="bg-gray-900 rounded-lg p-3 space-y-2">
          <div className="h-3 w-full bg-gray-800 rounded" />
          <div className="h-3 w-3/4 bg-gray-800 rounded" />
        </div>
      </div>

      {/* Differentials */}
      <div className="space-y-2">
        <div className="h-3 w-36 bg-gray-700 rounded" />
        <div className="bg-gray-900 rounded-lg p-3 space-y-2">
          <div className="h-3 w-full bg-gray-800 rounded" />
          <div className="h-3 w-5/6 bg-gray-800 rounded" />
          <div className="h-3 w-4/6 bg-gray-800 rounded" />
        </div>
      </div>

      {/* Next steps */}
      <div className="space-y-2">
        <div className="h-3 w-32 bg-gray-700 rounded" />
        <div className="bg-gray-900 rounded-lg p-3 space-y-2">
          <div className="h-3 w-full bg-gray-800 rounded" />
          <div className="h-3 w-5/6 bg-gray-800 rounded" />
          <div className="h-3 w-4/6 bg-gray-800 rounded" />
        </div>
      </div>
    </div>
  );
}
