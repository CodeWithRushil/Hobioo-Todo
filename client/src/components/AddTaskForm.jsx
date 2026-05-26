import { useState } from "react";
import Button from "./Button";

export default function AddTaskForm({ onAdd }) {
  const [text, setText] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim() || submitting) return;

    setSubmitting(true);
    const ok = await onAdd(text);
    if (ok) setText("");
    setSubmitting(false);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="glass rounded-2xl p-1.5 flex gap-2 shadow-xl shadow-black/20 fade-in"
    >
      <label htmlFor="new-task" className="sr-only">
        New task
      </label>
      <input
        id="new-task"
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="What needs to be done?"
        autoComplete="off"
        className="flex-1 min-w-0 bg-transparent px-4 py-3 text-sm sm:text-base text-white placeholder:text-neutral-600 focus:outline-none"
      />
      <Button type="submit" size="lg" disabled={!text.trim() || submitting} className="shrink-0">
        <PlusIcon />
        <span className="hidden sm:inline">Add task</span>
        <span className="sm:hidden">Add</span>
      </Button>
    </form>
  );
}

function PlusIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden>
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}
