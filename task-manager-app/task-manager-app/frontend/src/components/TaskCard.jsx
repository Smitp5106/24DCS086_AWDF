const STATUSES = ["pending", "in-progress", "done"];

export default function TaskCard({ task, onStatusChange, onDelete }) {
  const currentIndex = STATUSES.indexOf(task.status);
  const priority = task.priority || "medium";

  return (
    <div className={`task-card task-card--${task.status}`}>
      <div className="task-card__top">
        <div className="task-card__header-content">
          <h3>{task.title}</h3>
          <div className="task-card__tags">
            <span className={`priority-tag priority-tag--${priority}`}>
              {priority.toUpperCase()}
            </span>
            {task.suggestedDeadline && (
              <span className="task-card__deadline-tag" title="Suggested Deadline">
                ⏱️ {task.suggestedDeadline}
              </span>
            )}
          </div>
        </div>
        <button
          className="task-card__delete"
          onClick={() => onDelete(task.id)}
          aria-label={`Delete ${task.title}`}
          title="Delete task"
        >
          ×
        </button>
      </div>

      {task.description && (
        <p className="task-card__desc" style={{ whiteSpace: "pre-line" }}>
          {task.description}
        </p>
      )}

      <div className="task-card__footer">
        <span className="task-card__id">#{task.id ? task.id.slice(-6) : ""}</span>
        <div className="task-card__actions">
          {currentIndex > 0 && (
            <button onClick={() => onStatusChange(task, STATUSES[currentIndex - 1])}>
              ← {STATUSES[currentIndex - 1]}
            </button>
          )}
          {currentIndex < STATUSES.length - 1 && (
            <button onClick={() => onStatusChange(task, STATUSES[currentIndex + 1])}>
              {STATUSES[currentIndex + 1]} →
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
