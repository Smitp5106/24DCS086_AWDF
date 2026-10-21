const STATUSES = ["pending", "in-progress", "done"];

export default function TaskCard({ task, onStatusChange, onDelete }) {
  const currentIndex = STATUSES.indexOf(task.status);
  const priority = task.priority || "medium";

  return (
    <div className={`task-card-box status-${task.status}`} style={{ border: '1px solid var(--border)', padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px', background: 'transparent' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 1 }}>
          <h3 className="font-body-lg" style={{ fontWeight: '500', wordBreak: 'break-word', margin: 0 }}>
            {task.title}
          </h3>
          <div style={{ display: 'flex', gap: '6px', alignItems: 'center', flexWrap: 'wrap', marginTop: '2px' }}>
            <span style={{
              fontFamily: 'var(--font-mono, monospace)',
              fontSize: '10px',
              fontWeight: 700,
              padding: '2px 6px',
              borderRadius: '3px',
              letterSpacing: '0.04em',
              background: priority === 'urgent' ? 'rgba(248, 81, 73, 0.2)' :
                          priority === 'high' ? 'rgba(210, 153, 34, 0.2)' :
                          priority === 'low' ? 'rgba(63, 185, 80, 0.2)' : 'rgba(88, 166, 255, 0.2)',
              color: priority === 'urgent' ? '#f85149' :
                     priority === 'high' ? '#e3b341' :
                     priority === 'low' ? '#3fb950' : '#58a6ff'
            }}>
              {priority.toUpperCase()}
            </span>
            {task.suggestedDeadline && (
              <span style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '11px', color: 'var(--neutral)' }}>
                ⏱️ {task.suggestedDeadline}
              </span>
            )}
          </div>
        </div>
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
        <p className="font-body-md" style={{ color: 'var(--neutral)', fontSize: '14px', lineHeight: '1.4', whiteSpace: 'pre-line' }}>
          {task.description}
        </p>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '12px', borderTop: '1px solid var(--border-light)' }}>
        <span className="font-label-mono" style={{ color: 'var(--neutral)' }}>
          #{task.id ? task.id.slice(-6) : ""}
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
