interface QuickActionsProps {
  onAction: (action: string) => void;
  disabled: boolean;
}

export function QuickActions({ onAction, disabled }: QuickActionsProps) {
  const actions = [
    { label: "💡 Give me a hint", value: "hint" },
    { label: "📋 Show answer", value: "show answer" },
    { label: "📖 Explain concept", value: "explain" },
  ];

  return (
    <div className="flex gap-2 px-4">
      {actions.map((action) => (
        <button
          key={action.value}
          onClick={() => onAction(action.value)}
          disabled={disabled}
          className="px-3 py-1.5 bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-gray-200 rounded-full text-xs transition disabled:opacity-50"
        >
          {action.label}
        </button>
      ))}
    </div>
  );
}
