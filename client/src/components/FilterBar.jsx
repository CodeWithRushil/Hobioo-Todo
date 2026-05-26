import Button from "./Button";

const tabs = [
  { key: "all", label: "All" },
  { key: "active", label: "Active" },
  { key: "completed", label: "Done" },
];

export default function FilterBar({
  filter,
  onFilterChange,
  activeCount,
  completedCount,
  onClearCompleted,
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 mt-6 mb-4 px-1 min-h-[2.5rem]">
      <div className="flex gap-1 p-1 rounded-xl bg-[var(--color-surface-raised)] border border-[var(--color-border)]">
        {tabs.map(({ key, label }) => (
          <button
            key={key}
            type="button"
            onClick={() => onFilterChange(key)}
            className={[
              "px-3.5 py-1.5 text-xs sm:text-sm font-medium rounded-lg transition-all duration-200",
              filter === key
                ? "bg-white text-black shadow-md shadow-[var(--color-accent-glow)]"
                : "text-[var(--color-muted)] hover:text-white",
            ].join(" ")}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-3 text-xs sm:text-sm text-[var(--color-muted)]">
        <span>
          <strong className="text-neutral-200 tabular-nums">{activeCount}</strong> left
        </span>
        {completedCount > 0 && (
          <Button variant="ghost" size="sm" onClick={onClearCompleted}>
            Clear completed
          </Button>
        )}
      </div>
    </div>
  );
}
