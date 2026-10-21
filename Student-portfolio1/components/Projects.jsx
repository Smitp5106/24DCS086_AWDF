import { useState, useEffect } from 'react';
import Spinner from './Spinner';
import ErrorMessage from './ErrorMessage';
import RepoList from './RepoList';

function Projects() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [username, setUsername] = useState('Smitp5106');

  const fetchRepos = async (targetUser = username) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`https://api.github.com/users/${targetUser}/repos?sort=updated&per_page=12`);
      
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error(`GitHub user "${targetUser}" was not found.`);
        } else if (response.status === 403) {
          throw new Error('API rate limit exceeded. Please try again later.');
        } else {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
      }

      const result = await response.json();
      setData(result);
    } catch (err) {
      setError(err.message || 'Failed to fetch repositories from server.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRepos();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (username.trim()) {
      fetchRepos(username.trim());
    }
  };

  return (
    <div className="page-container projects-page">
      <div className="projects-header">
        <h1 className="font-display">Selected Work</h1>
        <p className="font-body-lg" style={{ color: 'var(--neutral)' }}>
          Dynamically fetching live repository data from the GitHub REST API.
        </p>
        
        <form className="github-search-form" onSubmit={handleSearch} style={{ marginTop: '32px' }}>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <div className="search-input-group" style={{ display: 'flex', gap: '12px' }}>
              <input
                id="github-user-input"
                type="text"
                className="input-bottom-border"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter GitHub username..."
                required
                style={{ flex: 1 }}
              />
              <button type="submit" className="btn-primary" style={{ borderRadius: '16px !important' }}>Fetch Repos</button>
            </div>
          </div>
        </form>
      </div>

      {loading ? (
        <Spinner />
      ) : error ? (
        <ErrorMessage message={error} retry={() => fetchRepos(username)} />
      ) : (
        <RepoList data={data} />
      )}
    </div>
  );
}

export default Projects;
