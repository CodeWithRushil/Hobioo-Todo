import EmptyState from "./EmptyState";
import Task from "./Task";

export default function TaskList({
  todos,
  filter,
  removingIds,
  onToggle,
  onEdit,
  onDelete,
}) {
  if (todos.length === 0) {
    return <EmptyState filter={filter} />;
  }

  return (
    <ul className="flex flex-col gap-2" role="list">
      {todos.map((todo) => (
        <Task
          key={todo.id}
          id={todo.id}
          text={todo.text}
          completed={todo.completed}
          isRemoving={removingIds.has(todo.id)}
          onToggle={onToggle}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </ul>
  );
}
