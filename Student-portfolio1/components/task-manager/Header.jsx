export default function Header({ connected, taskCount }) {
  return (
    <div className="task-app-header" style={{ borderBottom: '1px solid var(--border)', paddingBottom: '24px', marginBottom: '32px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <span className="font-label-mono" style={{ color: 'var(--neutral)', display: 'block', marginBottom: '8px' }}>
            ~/task-manager
          </span>
          <h1 className="font-headline-md" style={{ textTransform: 'uppercase' }}>
            Task Board
          </h1>
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px', textAlign: 'right' }}>
          <span className="font-label-mono" style={{ fontSize: '14px' }}>
            {taskCount} task{taskCount === 1 ? "" : "s"}
          </span>
          <span className="font-label-mono" style={{ color: connected ? 'var(--secondary)' : 'var(--neutral)' }}>
            {connected ? '[ API CONNECTED ]' : '[ API OFFLINE ]'}
          </span>
        </div>
      </div>
    </div>
  );
}
