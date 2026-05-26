import { useCallback, useEffect, useMemo, useState } from "react";
import * as api from "./api/todos";
import AddTaskForm from "./components/AddTaskForm";
import FilterBar from "./components/FilterBar";
import Header from "./components/Header";
import TaskList from "./components/TaskList";

const FILTER_ALL = "all";
const FILTER_ACTIVE = "active";
const FILTER_COMPLETED = "completed";

export default function Dashboard() {
  const [todos, setTodos] = useState([]);
  const [filter, setFilter] = useState(FILTER_ALL);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [removingIds, setRemovingIds] = useState(() => new Set());

  const loadTodos = useCallback(async () => {
    setError(null);
    try {
      const data = await api.fetchTodos();
      setTodos(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message ?? "Could not load tasks");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTodos();
  }, [loadTodos]);

  const addTodo = async (text) => {
    setError(null);
    try {
      const todo = await api.createTodo(text);
      setTodos((prev) => [todo, ...prev]);
      return true;
    } catch (err) {
      setError(err.message ?? "Could not add task");
      return false;
    }
  };

  const toggleTodo = async (id) => {
    const target = todos.find((t) => t.id === id);
    if (!target) return;

    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );

    try {
      await api.updateTodo(id, { completed: !target.completed });
    } catch {
      setTodos((prev) =>
        prev.map((t) =>
          t.id === id ? { ...t, completed: target.completed } : t
        )
      );
      setError("Could not update task");
    }
  };

  const editTodo = async (id, text) => {
    const trimmed = text.trim();
    if (!trimmed) return false;

    const previous = todos.find((t) => t.id === id);
    setTodos((list) =>
      list.map((t) => (t.id === id ? { ...t, text: trimmed } : t))
    );

    try {
      await api.updateTodo(id, { text: trimmed });
      return true;
    } catch {
      if (previous) {
        setTodos((list) =>
          list.map((t) => (t.id === id ? { ...t, text: previous.text } : t))
        );
      }
      setError("Could not save changes");
      return false;
    }
  };

  const removeTodo = async (id) => {
    setRemovingIds((s) => new Set(s).add(id));
    await new Promise((r) => setTimeout(r, 250));

    let snapshot;
    setTodos((prev) => {
      snapshot = prev;
      return prev.filter((t) => t.id !== id);
    });

    try {
      await api.deleteTodo(id);
    } catch {
      setTodos(snapshot);
      setError("Could not delete task");
    } finally {
      setRemovingIds((s) => {
        const next = new Set(s);
        next.delete(id);
        return next;
      });
    }
  };

  const clearCompleted = async () => {
    let snapshot;
    setTodos((prev) => {
      snapshot = prev;
      return prev.filter((t) => !t.completed);
    });

    try {
      const remaining = await api.clearCompleted();
      if (Array.isArray(remaining)) setTodos(remaining);
    } catch {
      setTodos(snapshot);
      setError("Could not clear completed tasks");
    }
  };

  const filteredTodos = useMemo(() => {
    return todos.filter((t) => {
      if (filter === FILTER_ACTIVE) return !t.completed;
      if (filter === FILTER_COMPLETED) return t.completed;
      return true;
    });
  }, [todos, filter]);

  const activeCount = todos.filter((t) => !t.completed).length;
  const completedCount = todos.length - activeCount;

  return (
    <div className="min-h-screen flex flex-col items-center px-4 py-10 sm:py-16">
      <main className="w-full max-w-xl">
        <Header activeCount={activeCount} totalCount={todos.length} />

        <AddTaskForm onAdd={addTodo} />

        {error && (
          <div
            role="alert"
            className="mt-4 flex items-center justify-between gap-3 rounded-xl border border-neutral-600 bg-neutral-900 px-4 py-3 text-sm text-neutral-300 fade-in"
          >
            <span>{error}</span>
            <button
              type="button"
              onClick={() => setError(null)}
              className="shrink-0 text-neutral-500 hover:text-white transition-colors"
              aria-label="Dismiss error"
            >
              ✕
            </button>
          </div>
        )}

        {loading ? (
          <div className="mt-12 flex flex-col items-center gap-3 text-[var(--color-muted)]">
            <div className="h-8 w-8 rounded-full border-2 border-[var(--color-border)] border-t-white animate-spin" />
            <p className="text-sm">Loading your tasks…</p>
          </div>
        ) : (
          <>
            <FilterBar
              filter={filter}
              onFilterChange={setFilter}
              activeCount={activeCount}
              completedCount={completedCount}
              onClearCompleted={clearCompleted}
            />

            <TaskList
              todos={filteredTodos}
              filter={filter}
              removingIds={removingIds}
              onToggle={toggleTodo}
              onEdit={editTodo}
              onDelete={removeTodo}
            />
          </>
        )}

        <footer className="mt-12 text-center text-xs text-[var(--color-muted)]">
          Double-click a task to edit · Built for Hobioo by Rushil Sharma
        </footer>
      </main>
    </div>
  );
}
