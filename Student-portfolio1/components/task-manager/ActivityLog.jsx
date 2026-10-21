export default function ActivityLog({ entries }) {
  return (
    <div className="activity-log" style={{ border: '1px solid var(--border)', padding: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-light)', paddingBottom: '12px', marginBottom: '16px' }}>
        <span className="font-label-mono" style={{ fontWeight: 'bold' }}>[ SERVER ACTIVITY LOG ]</span>
        <span className="font-label-mono" style={{ color: 'var(--neutral)' }}>EXPRESS_LOG_PROMPT</span>
      </div>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontFamily: 'var(--font-mono)', fontSize: '12px' }}>
        {entries.length === 0 && (
          <div style={{ color: 'var(--neutral)', fontStyle: 'italic' }}>
            Waiting for requests...
          </div>
        )}
        {entries.map((entry, i) => (
          <div key={i} style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed var(--border-light)', paddingBottom: '4px' }}>
            <div>
              <span className={`method-badge method-${entry.method.toLowerCase()}`} style={{ marginRight: '12px', fontWeight: 'bold', color: 'var(--secondary)' }}>
                {entry.method}
              </span>
              <span style={{ color: 'var(--primary)' }}>{entry.url}</span>
            </div>
            <span style={{ color: 'var(--neutral)' }}>{entry.time}</span>
          </div>
        ))}
        <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
          <span>$</span>
          <span className="blink" style={{ animation: 'blink-anim 1s step-end infinite' }}>_</span>
        </div>
      </div>
    </div>
  );
}
