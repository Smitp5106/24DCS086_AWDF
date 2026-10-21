import Column from "./Column.jsx";

const COLUMNS = [
  { status: "pending", label: "PENDING" },
  { status: "in-progress", label: "IN PROGRESS" },
  { status: "done", label: "DONE" }
];

export default function Board({ tasks, onStatusChange, onDelete }) {
  return (
    <div className="task-board-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '32px' }}>
      {COLUMNS.map((col) => (
        <Column
          key={col.status}
          status={col.status}
          label={col.label}
          tasks={tasks.filter((t) => t.status === col.status)}
          onStatusChange={onStatusChange}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
