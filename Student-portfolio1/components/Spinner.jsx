function Spinner() {
  return (
    <div className="spinner-container">
      <div className="spinner"></div>
      <p className="spinner-text">Fetching Live Repositories from GitHub API...</p>
    </div>
  );
}

export default Spinner;
