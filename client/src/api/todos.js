const API_BASE = import.meta.env.VITE_API_URL || "/api";

async function request(path, options = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { "Content-Type": "application/json", ...options.headers },
    ...options,
  });

  if (!res.ok) {
    let message = "Request failed";
    try {
      const body = await res.json();
      message = body.message ?? body.error ?? message;
    } catch {
      try {
        message = await res.text();
      } catch {
        /* Nothing */
      }
    }
    throw new Error(message || `Request failed (${res.status})`);
  }

  if (res.status === 204) return null;

  const text = await res.text();
  return text ? JSON.parse(text) : null;
}

export function normalizeTodo(doc) {
  if (!doc) return doc;
  const id = doc._id ?? doc.id;
  return {
    id: typeof id === "object" ? String(id) : String(id),
    text: doc.title ?? doc.text ?? "",
    completed: Boolean(doc.completed),
    createdAt: doc.time ?? doc.createdAt ?? null,
  };
}

function toCreateBody(text) {
  return { title: text.trim() };
}

function toUpdateBody(updates) {
  const body = {};
  if ("text" in updates) body.title = updates.text;
  if ("completed" in updates) body.completed = updates.completed;
  return body;
}

export async function fetchTodos() {
  const data = await request("/todos");
  return (Array.isArray(data) ? data : []).map(normalizeTodo);
}

export async function createTodo(text) {
  const trimmed = text.trim();
  if (!trimmed) throw new Error("Task cannot be empty");

  const data = await request("/todos", {
    method: "POST",
    body: JSON.stringify(toCreateBody(trimmed)),
  });
  return normalizeTodo(data);
}

export async function updateTodo(id, updates) {
  const data = await request(`/todos/${id}`, {
    method: "PATCH",
    body: JSON.stringify(toUpdateBody(updates)),
  });
  return normalizeTodo(data);
}

export async function deleteTodo(id) {
  await request(`/todos/${id}`, { method: "DELETE" });
}

export async function clearCompleted() {
  const data = await request("/todos/completed", { method: "DELETE" });
  return (Array.isArray(data) ? data : []).map(normalizeTodo);
}
