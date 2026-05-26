import { useEffect, useRef, useState } from "react";
import Button from "./Button";

export default function Task({
  id,
  text,
  completed,
  isRemoving,
  onToggle,
  onEdit,
  onDelete,
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(text);
  const inputRef = useRef(null);

  useEffect(() => {
    if (!editing) setDraft(text);
  }, [text, editing]);

  useEffect(() => {
    if (editing) inputRef.current?.focus();
  }, [editing]);

  const saveEdit = async () => {
    if (draft.trim() === text.trim()) {
      setEditing(false);
      return;
    }
    const ok = await onEdit(id, draft);
    if (ok) setEditing(false);
    else setDraft(text);
  };

  const cancelEdit = () => {
    setDraft(text);
    setEditing(false);
  };

  return (
    <li
      className={[
        "group flex items-center gap-3 rounded-xl border border-transparent px-3 py-3 sm:px-4",
        "bg-[var(--color-surface-raised)] hover:border-[var(--color-border)] hover:bg-[var(--color-surface-hover)]",
        "transition-all duration-200",
        isRemoving ? "task-exit" : "task-enter",
        completed && !editing ? "opacity-60" : "",
      ].join(" ")}
    >
      <button
        type="button"
        onClick={() => onToggle(id)}
        aria-label={completed ? "Mark as incomplete" : "Mark as complete"}
        className={[
          "shrink-0 flex h-5 w-5 items-center justify-center rounded-full border-2 transition-all duration-200",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-surface-raised)]",
          completed
            ? "border-white bg-white text-black"
            : "border-neutral-600 hover:border-white",
        ].join(" ")}
      >
        {completed && (
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="M20 6L9 17l-5-5" />
          </svg>
        )}
      </button>

      {editing ? (
        <input
          ref={inputRef}
          type="text"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onBlur={saveEdit}
          onKeyDown={(e) => {
            if (e.key === "Enter") saveEdit();
            if (e.key === "Escape") cancelEdit();
          }}
          className="flex-1 min-w-0 bg-transparent text-sm sm:text-base text-white focus:outline-none border-b border-white pb-0.5"
        />
      ) : (
        <span
          onDoubleClick={() => setEditing(true)}
          className={[
            "flex-1 min-w-0 text-sm sm:text-base cursor-default select-none truncate",
            completed ? "line-through text-[var(--color-muted)]" : "text-white",
          ].join(" ")}
        >
          {text}
        </span>
      )}

      <div
        className={[
          "flex items-center gap-0.5 shrink-0",
          "opacity-100 sm:opacity-0 sm:group-hover:opacity-100 sm:group-focus-within:opacity-100",
          "transition-opacity duration-200",
        ].join(" ")}
      >
        {!editing && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setEditing(true)}
            aria-label="Edit task"
            title="Edit"
          >
            <EditIcon />
          </Button>
        )}
        <Button
          variant="danger"
          size="icon"
          onClick={() => onDelete(id)}
          aria-label="Delete task"
          title="Delete"
        >
          <TrashIcon />
        </Button>
      </div>
    </li>
  );
}

function EditIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    </svg>
  );
}
