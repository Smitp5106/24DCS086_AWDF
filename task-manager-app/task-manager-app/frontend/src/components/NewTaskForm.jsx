import { useState } from "react";
import * as api from "../api/taskApi";

export default function NewTaskForm({ onCreate, submitting, onLog }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("medium");
  const [suggestedDeadline, setSuggestedDeadline] = useState("");
  const [expanded, setExpanded] = useState(false);
  const [error, setError] = useState("");

  // AI states
  const [aiLoading, setAiLoading] = useState(false);
  const [aiSuggestion, setAiSuggestion] = useState(null);
  const [aiNotice, setAiNotice] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setError("Title can't be empty");
      return;
    }
    setError("");
    await onCreate({
      title: title.trim(),
      description: description.trim(),
      priority,
      suggestedDeadline
    });
    setTitle("");
    setDescription("");
    setPriority("medium");
    setSuggestedDeadline("");
    setAiSuggestion(null);
    setAiNotice("");
    setExpanded(false);
  };

  const handleAiAssist = async () => {
    if (!title.trim()) {
      setError("Please type a task title first so the AI can analyze it.");
      return;
    }
    setError("");
    setAiNotice("");
    setAiLoading(true);
    setExpanded(true);

    try {
      if (onLog) onLog("POST", "/api/tasks/ai-suggest");
      const res = await api.getAiSuggestions({
        title: title.trim(),
        description: description.trim()
      });

      if (res.data?.success && res.data.data) {
        setAiSuggestion(res.data.data);
      } else {
        setAiNotice("Could not generate AI suggestions, but you can continue manually.");
      }
    } catch (err) {
      // Graceful error handling: core task creation NEVER breaks
      console.warn("AI generation error:", err);
      setAiNotice("AI service is currently unavailable. You can still create and edit tasks normally.");
    } finally {
      setAiLoading(false);
    }
  };

  const handleApplyAi = (includeSubtasks = true) => {
    if (!aiSuggestion) return;

    let newDesc = aiSuggestion.suggestedDescription || description;
    if (includeSubtasks && aiSuggestion.subtasks?.length > 0) {
      const checklistText = "\n\nActionable Checklist:\n" + 
        aiSuggestion.subtasks.map((st) => `• [ ] ${st}`).join("\n");
      newDesc = `${newDesc.trim()}${checklistText}`;
    }

    setDescription(newDesc);
    if (aiSuggestion.suggestedPriority) {
      setPriority(aiSuggestion.suggestedPriority);
    }
    if (aiSuggestion.suggestedDeadline) {
      setSuggestedDeadline(aiSuggestion.suggestedDeadline);
    }
    setAiSuggestion(null);
    setAiNotice("✓ AI suggestions applied to your task form!");
  };

  return (
    <div className="new-task-wrapper">
      <form className="new-task" onSubmit={handleSubmit}>
        <div className="new-task__row">
          <span className="new-task__prompt">＋</span>
          <input
            className="new-task__input"
            placeholder="Add a task title and press enter…"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onFocus={() => setExpanded(true)}
          />
          <button
            type="button"
            className="btn-ai-assist"
            onClick={handleAiAssist}
            disabled={aiLoading}
            title="Auto-generate description, priority, and deadline with AI"
          >
            {aiLoading ? (
              <>
                <span className="ai-spinner"></span>
                <span>AI Analyzing…</span>
              </>
            ) : (
              <>
                <span className="ai-sparkle">✨</span>
                <span>AI Assist</span>
              </>
            )}
          </button>
          <button className="new-task__submit" type="submit" disabled={submitting}>
            {submitting ? "Adding…" : "Add task"}
          </button>
        </div>

        {expanded && (
          <div className="new-task__expanded-fields">
            <textarea
              className="new-task__description"
              placeholder="Task description or notes (or click ✨ AI Assist above)…"
              value={description}
              rows={3}
              onChange={(e) => setDescription(e.target.value)}
            />

            <div className="new-task__meta-row">
              <div className="new-task__meta-item">
                <label className="meta-label">Priority:</label>
                <select
                  className={`priority-select priority-select--${priority}`}
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                >
                  <option value="low">🟢 Low</option>
                  <option value="medium">🔵 Medium</option>
                  <option value="high">🟠 High</option>
                  <option value="urgent">🔴 Urgent</option>
                </select>
              </div>

              <div className="new-task__meta-item">
                <label className="meta-label">Deadline:</label>
                <input
                  className="deadline-input"
                  placeholder="e.g. In 2 days, Friday, etc."
                  value={suggestedDeadline}
                  onChange={(e) => setSuggestedDeadline(e.target.value)}
                />
              </div>
            </div>
          </div>
        )}

        {error && <div className="new-task__error">{error}</div>}
        {aiNotice && <div className="new-task__notice">{aiNotice}</div>}
      </form>

      {/* AI Suggestion Display Panel (Displayed meaningfully, not raw JSON) */}
      {aiSuggestion && (
        <div className="ai-suggestion-card">
          <div className="ai-suggestion-card__header">
            <div className="ai-suggestion-card__title">
              <span className="ai-badge-icon">✨</span>
              <strong>AI Task Proposal</strong>
              <span className="ai-source-badge">
                {aiSuggestion.source === "gemini"
                  ? "Powered by Gemini 1.5"
                  : aiSuggestion.source === "openai"
                  ? "Powered by OpenAI"
                  : "Smart Assistant"}
              </span>
            </div>
            <button
              type="button"
              className="ai-close-btn"
              onClick={() => setAiSuggestion(null)}
              title="Dismiss suggestion"
            >
              ×
            </button>
          </div>

          <div className="ai-suggestion-card__body">
            <div className="ai-pill-row">
              <span className={`ai-priority-pill ai-priority-pill--${aiSuggestion.suggestedPriority}`}>
                Priority: {aiSuggestion.suggestedPriority?.toUpperCase()}
              </span>
              {aiSuggestion.suggestedDeadline && (
                <span className="ai-deadline-pill">
                  ⏱️ {aiSuggestion.suggestedDeadline} ({aiSuggestion.estimatedTime || "Est. 2h"})
                </span>
              )}
            </div>

            {aiSuggestion.priorityReason && (
              <p className="ai-reason">
                <em>Why: {aiSuggestion.priorityReason}</em>
              </p>
            )}

            <div className="ai-desc-block">
              <span className="ai-desc-label">Proposed Description:</span>
              <p className="ai-desc-text">{aiSuggestion.suggestedDescription}</p>
            </div>

            {aiSuggestion.subtasks?.length > 0 && (
              <div className="ai-subtasks-block">
                <span className="ai-subtasks-label">Recommended Subtasks:</span>
                <ul className="ai-subtasks-list">
                  {aiSuggestion.subtasks.map((st, i) => (
                    <li key={i}>{st}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className="ai-suggestion-card__actions">
            <button
              type="button"
              className="btn-apply-ai"
              onClick={() => handleApplyAi(true)}
            >
              ⚡ Apply All to Task
            </button>
            <button
              type="button"
              className="btn-apply-desc"
              onClick={() => handleApplyAi(false)}
            >
              📝 Description Only
            </button>
            <button
              type="button"
              className="btn-dismiss-ai"
              onClick={() => setAiSuggestion(null)}
            >
              Dismiss
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
