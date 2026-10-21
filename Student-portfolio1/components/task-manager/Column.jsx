import TaskCard from "./TaskCard.jsx";

export default function Column({ status, label, tasks, onStatusChange, onDelete }) {
  return (
    <section className={`task-column col-${status}`} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border)', paddingBottom: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ width: '8px', height: '8px', background: status === 'done' ? 'var(--secondary)' : 'var(--neutral)', display: 'inline-block' }}></span>
          <h2 className="font-label-mono" style={{ fontSize: '14px', fontWeight: 'bold' }}>{label}</h2>
        </div>
        <span className="font-label-mono" style={{ background: 'var(--surface-container-low)', padding: '2px 8px' }}>
          {tasks.length}
        </span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {tasks.length === 0 && (
          <div className="font-body-md" style={{ color: 'var(--neutral)', fontStyle: 'italic', padding: '16px 0' }}>
            No tasks here yet
          </div>
        )}
        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onStatusChange={onStatusChange}
            onDelete={onDelete}
          />
        ))}
      </div>
    </section>
  );
}
