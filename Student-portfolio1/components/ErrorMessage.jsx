function ErrorMessage({ message, retry }) {
  return (
    <div className="error-card">
      <div className="error-content">
        <span className="font-label-mono" style={{ color: 'var(--neutral)', display: 'block', marginBottom: '8px' }}>[ REQUEST ERROR ]</span>
        <h3 className="font-headline-md" style={{ marginBottom: '8px' }}>Failed to Load Repositories</h3>
        <p className="font-body-md" style={{ color: 'var(--neutral)', marginBottom: '24px' }}>
          {message || 'An unexpected network error occurred. Please check your internet connection.'}
        </p>
        
        {retry && (
          <button className="btn-primary" onClick={retry}>
            Try Again
          </button>
        )}
      </div>
    </div>
  );
}

export default ErrorMessage;
