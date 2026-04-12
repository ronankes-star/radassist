export function FindingsList({ findings }: { findings: string[] }) {
  return (
    <div>
      <div className="text-gray-400 text-xs uppercase tracking-wider mb-2">
        Findings
      </div>
      <div className="bg-gray-900 rounded-lg p-3 space-y-1.5">
        {findings.map((finding, i) => (
          <div key={i} className="text-gray-200 text-sm leading-relaxed">
            • {finding}
          </div>
        ))}
      </div>
    </div>
  );
}
