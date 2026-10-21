const STATUSES = ["pending", "in-progress", "done"];

export default function TaskCard({ task, onStatusChange, onDelete }) {
  const currentIndex = STATUSES.indexOf(task.status);

  return (
    <div className={`task-card-box status-${task.status}`} style={{ border: '1px solid var(--border)', padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px', background: 'transparent' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px' }}>
        <h3 className="font-body-lg" style={{ fontWeight: '500', wordBreak: 'break-word' }}>
          {task.title}
        </h3>
        <button
          onClick={() => onDelete(task.id)}
          aria-label={`Delete ${task.title}`}
          title="Delete task"
          style={{ background: 'transparent', border: 'none', color: 'var(--neutral)', cursor: 'pointer', fontSize: '20px', padding: '0 4px', lineHeight: 1 }}
        >
          ×
        </button>
      </div>

      {task.description && (
        <p className="font-body-md" style={{ color: 'var(--neutral)', fontSize: '14px', lineHeight: '1.4' }}>
          {task.description}
        </p>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '12px', borderTop: '1px solid var(--border-light)' }}>
        <span className="font-label-mono" style={{ color: 'var(--neutral)' }}>
          #{task.id}
        </span>
        <div style={{ display: 'flex', gap: '8px' }}>
          {currentIndex > 0 && (
            <button 
              className="theme-toggle-btn" 
              style={{ padding: '4px 8px', fontSize: '10px' }}
              onClick={() => onStatusChange(task, STATUSES[currentIndex - 1])}
            >
              ← {STATUSES[currentIndex - 1]}
            </button>
          )}
          {currentIndex < STATUSES.length - 1 && (
            <button 
              className="theme-toggle-btn"
              style={{ padding: '4px 8px', fontSize: '10px' }}
              onClick={() => onStatusChange(task, STATUSES[currentIndex + 1])}
            >
              {STATUSES[currentIndex + 1]} →
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
