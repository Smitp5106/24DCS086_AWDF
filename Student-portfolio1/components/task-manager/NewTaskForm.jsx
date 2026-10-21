import { useState } from "react";

export default function NewTaskForm({ onCreate, submitting }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [expanded, setExpanded] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setError("Title cannot be empty");
      return;
    }
    setError("");
    await onCreate({ title: title.trim(), description: description.trim() });
    setTitle("");
    setDescription("");
    setExpanded(false);
  };

  return (
    <form className="new-task-form" onSubmit={handleSubmit} style={{ border: '1px solid var(--border)', padding: '32px' }}>
      <span className="font-label-mono" style={{ display: 'block', marginBottom: '16px', color: 'var(--neutral)' }}>
        [ CREATE NEW TASK ]
      </span>
      
      <div className="form-group">
        <label htmlFor="task-title-input" className="font-label-mono">Task Title</label>
        <div style={{ display: 'flex', gap: '16px' }}>
          <input
            id="task-title-input"
            className="input-bottom-border"
            placeholder="What needs to be done?"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onFocus={() => setExpanded(true)}
            required
            style={{ flex: 1 }}
          />
          <button className="btn-primary" type="submit" disabled={submitting}>
            {submitting ? "ADDING..." : "ADD TASK"}
          </button>
        </div>
      </div>

      {expanded && (
        <div className="form-group" style={{ marginTop: '16px' }}>
          <label htmlFor="task-desc-input" className="font-label-mono">Description (Optional)</label>
          <input
            id="task-desc-input"
            className="input-bottom-border"
            placeholder="Add task details..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
      )}

      {error && (
        <div className="font-label-mono" style={{ color: 'var(--neutral)', marginTop: '8px' }}>
          Error: {error}
        </div>
      )}
    </form>
  );
}
