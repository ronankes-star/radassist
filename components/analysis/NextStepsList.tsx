export function NextStepsList({ steps }: { steps: string[] }) {
  return (
    <div>
      <div className="text-gray-400 text-xs uppercase tracking-wider mb-2">
        Suggested Next Steps
      </div>
      <div className="bg-gray-900 rounded-lg p-3 space-y-1.5">
        {steps.map((step, i) => (
          <div key={i} className="text-gray-200 text-sm leading-relaxed">
            • {step}
          </div>
        ))}
      </div>
    </div>
  );
}
