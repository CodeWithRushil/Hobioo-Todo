export default function Header({ activeCount, totalCount }) {
  const progress =
    totalCount === 0 ? 0 : Math.round(((totalCount - activeCount) / totalCount) * 100);

  return (
    <header className="fade-in mb-8">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <div className="flex items-center gap-2.5 mb-1">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 text-white border border-[var(--color-border)]">
              <ChecklistIcon />
            </span>
            <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-white">
              Hobioo - ToDo
            </h1>
          </div>
          <p className="text-[var(--color-muted)] text-sm sm:text-base pl-[2.875rem]">
            Stay on top of what matters
          </p>
        </div>

        {totalCount > 0 && (
          <div className="text-right min-w-[120px]">
            <p className="text-2xl font-semibold text-white tabular-nums">{progress}%</p>
            <p className="text-xs text-[var(--color-muted)]">completed</p>
            <div className="mt-2 h-1.5 w-full rounded-full bg-[var(--color-surface-hover)] overflow-hidden">
              <div
                className="h-full rounded-full bg-white transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

function ChecklistIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M9 11l3 3L22 4" />
      <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
    </svg>
  );
}
