function RepoList({ data }) {
  if (!data || data.length === 0) {
    return (
      <div className="no-repos">
        <p className="font-label-mono">No public repositories found.</p>
      </div>
    );
  }

  return (
    <div className="repo-grid">
      {data.map((repo, index) => {
        const formattedIndex = String(index + 1).padStart(2, '0');
        return (
          <div key={repo.id} className="repo-card">
            
            <div className="repo-header">
              <span className="repo-index">{formattedIndex}</span>
              
              <div className="repo-thumbnail">
                {/* Placeholder thumbnail with first letter of repo */}
                {repo.name.charAt(0).toUpperCase()}
              </div>

              <div className="repo-info-container">
                <h3 className="repo-title">
                  {repo.name}
                </h3>
              </div>
            </div>

            <div className="repo-meta">
              <span className="category">{repo.language || 'Documentation'}</span>
              <span className="year">{new Date(repo.updated_at).getFullYear()}</span>
            </div>

            <a 
              href={repo.html_url} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="repo-action-btn"
              title="View on GitHub"
            >
              ↗
            </a>

          </div>
        );
      })}
    </div>
  );
}

export default RepoList;
