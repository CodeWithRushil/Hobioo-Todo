export default function EmptyState({ filter }) {
  const messages = {
    all: {
      title: "No tasks yet",
      body: "Add your first task above and start getting things done.",
    },
    active: {
      title: "All caught up",
      body: "You have no active tasks. Time to relax or add something new.",
    },
    completed: {
      title: "Nothing completed",
      body: "Finished tasks will show up here once you check them off.",
    },
  };

  const { title, body } = messages[filter] ?? messages.all;

  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center fade-in">
      <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-2xl bg-[var(--color-surface-raised)] border border-[var(--color-border)]">
        <svg
          width="40"
          height="40"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          className="text-[var(--color-muted)]"
          aria-hidden
        >
          <rect x="3" y="3" width="18" height="18" rx="3" />
          <path d="M9 12l2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      <h2 className="text-lg font-medium text-neutral-200 mb-1">{title}</h2>
      <p className="text-sm text-[var(--color-muted)] max-w-xs">{body}</p>
    </div>
  );
}
