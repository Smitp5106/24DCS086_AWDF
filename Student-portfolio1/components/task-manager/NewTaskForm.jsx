import { useState } from "react";
import * as api from "./taskApi";

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
      setError("Title cannot be empty");
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
      setError("Please enter a task title first so the AI can analyze it.");
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

      const suggestionData = res.data?.data || res.data;
      if (suggestionData) {
        setAiSuggestion(suggestionData);
      } else {
        setAiNotice("Could not generate AI suggestions, please continue manually.");
      }
    } catch (err) {
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <form className="new-task-form" onSubmit={handleSubmit} style={{ border: '1px solid var(--border)', padding: '32px' }}>
        <span className="font-label-mono" style={{ display: 'block', marginBottom: '16px', color: 'var(--neutral)' }}>
          [ CREATE NEW TASK ]
        </span>
        
        <div className="form-group">
          <label htmlFor="task-title-input" className="font-label-mono">Task Title</label>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <input
              id="task-title-input"
              className="input-bottom-border"
              placeholder="What needs to be done? (e.g. Homework)"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onFocus={() => setExpanded(true)}
              required
              style={{ flex: '1 1 200px' }}
            />
            <button
              type="button"
              className="btn-ai-assist"
              onClick={handleAiAssist}
              disabled={aiLoading}
              title="Auto-generate description, priority, and deadline with AI"
              style={{
                background: 'linear-gradient(135deg, #8b5cf6, #3b82f6)',
                color: '#fff',
                border: 'none',
                padding: '10px 18px',
                borderRadius: '8px',
                fontFamily: 'var(--font-mono, monospace)',
                fontSize: '12px',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                whiteSpace: 'nowrap'
              }}
            >
              {aiLoading ? (
                <span>✨ Analyzing…</span>
              ) : (
                <span>✨ AI Assist</span>
              )}
            </button>
            <button className="btn-primary" type="submit" disabled={submitting}>
              {submitting ? "ADDING..." : "ADD TASK"}
            </button>
          </div>
        </div>

        {expanded && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '20px' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label htmlFor="task-desc-input" className="font-label-mono">Description (Optional)</label>
              <textarea
                id="task-desc-input"
                className="input-bottom-border"
                placeholder="Add task details or click ✨ AI Assist above…"
                value={description}
                rows={3}
                onChange={(e) => setDescription(e.target.value)}
                style={{ width: '100%', resize: 'vertical', fontFamily: 'inherit', padding: '8px 0' }}
              />
            </div>

            <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', alignItems: 'center' }}>
              <div>
                <label className="font-label-mono" style={{ display: 'block', marginBottom: '6px' }}>Priority</label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  style={{
                    background: 'var(--surface, #1e1e1e)',
                    color: 'var(--text, #fff)',
                    border: '1px solid var(--border, #333)',
                    padding: '6px 12px',
                    borderRadius: '6px',
                    fontFamily: 'var(--font-mono, monospace)',
                    fontSize: '12px'
                  }}
                >
                  <option value="low">🟢 Low</option>
                  <option value="medium">🔵 Medium</option>
                  <option value="high">🟠 High</option>
                  <option value="urgent">🔴 Urgent</option>
                </select>
              </div>

              <div style={{ flex: 1 }}>
                <label className="font-label-mono" style={{ display: 'block', marginBottom: '6px' }}>Deadline</label>
                <input
                  className="input-bottom-border"
                  placeholder="e.g. Tomorrow, Friday, etc."
                  value={suggestedDeadline}
                  onChange={(e) => setSuggestedDeadline(e.target.value)}
                  style={{ width: '100%' }}
                />
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="font-label-mono" style={{ color: 'var(--danger, #f85149)', marginTop: '8px' }}>
            Error: {error}
          </div>
        )}
        {aiNotice && (
          <div className="font-label-mono" style={{ color: '#3fb950', marginTop: '8px' }}>
            {aiNotice}
          </div>
        )}
      </form>

      {/* AI Suggestion Card Display Panel */}
      {aiSuggestion && (
        <div style={{
          background: 'var(--surface, #1e2229)',
          border: '1px solid rgba(139, 92, 246, 0.4)',
          borderRadius: '12px',
          padding: '24px',
          boxShadow: '0 8px 24px rgba(0,0,0,0.35)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid var(--border)', paddingBottom: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '16px' }}>✨</span>
              <strong style={{ fontFamily: 'var(--font-display, inherit)' }}>AI Task Proposal</strong>
              <span style={{
                fontFamily: 'var(--font-mono, monospace)',
                fontSize: '11px',
                background: 'rgba(139, 92, 246, 0.2)',
                color: '#c084fc',
                border: '1px solid rgba(139, 92, 246, 0.35)',
                padding: '2px 8px',
                borderRadius: '12px'
              }}>
                {aiSuggestion.source === "gemini" ? "Gemini AI" : aiSuggestion.source === "openai" ? "OpenAI" : "Smart Assistant"}
              </span>
            </div>
            <button
              type="button"
              onClick={() => setAiSuggestion(null)}
              style={{ background: 'none', border: 'none', color: 'var(--neutral)', fontSize: '20px', cursor: 'pointer' }}
            >
              ×
            </button>
          </div>

          <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap', marginBottom: '12px' }}>
            <span style={{
              fontFamily: 'var(--font-mono, monospace)',
              fontSize: '11px',
              fontWeight: 700,
              padding: '3px 10px',
              borderRadius: '4px',
              background: aiSuggestion.suggestedPriority === 'urgent' ? 'rgba(248, 81, 73, 0.2)' :
                          aiSuggestion.suggestedPriority === 'high' ? 'rgba(210, 153, 34, 0.2)' :
                          aiSuggestion.suggestedPriority === 'low' ? 'rgba(63, 185, 80, 0.2)' : 'rgba(88, 166, 255, 0.2)',
              color: aiSuggestion.suggestedPriority === 'urgent' ? '#f85149' :
                     aiSuggestion.suggestedPriority === 'high' ? '#e3b341' :
                     aiSuggestion.suggestedPriority === 'low' ? '#3fb950' : '#58a6ff'
            }}>
              PRIORITY: {aiSuggestion.suggestedPriority?.toUpperCase()}
            </span>
            {aiSuggestion.suggestedDeadline && (
              <span style={{
                fontFamily: 'var(--font-mono, monospace)',
                fontSize: '11px',
                padding: '3px 10px',
                borderRadius: '4px',
                background: 'rgba(255,255,255,0.06)',
                color: 'var(--neutral, #aaa)'
              }}>
                ⏱️ {aiSuggestion.suggestedDeadline} ({aiSuggestion.estimatedTime || "2h"})
              </span>
            )}
          </div>

          {aiSuggestion.priorityReason && (
            <p style={{ fontSize: '13px', color: 'var(--neutral)', margin: '4px 0 12px', fontStyle: 'italic' }}>
              Why: {aiSuggestion.priorityReason}
            </p>
          )}

          <div style={{ marginBottom: '14px' }}>
            <span className="font-label-mono" style={{ display: 'block', fontSize: '11px', marginBottom: '4px', color: 'var(--neutral)' }}>
              PROPOSED DESCRIPTION
            </span>
            <div style={{
              background: 'rgba(0,0,0,0.2)',
              borderLeft: '3px solid #8b5cf6',
              padding: '10px 14px',
              fontSize: '13px',
              lineHeight: 1.5
            }}>
              {aiSuggestion.suggestedDescription}
            </div>
          </div>

          {aiSuggestion.subtasks?.length > 0 && (
            <div style={{ marginBottom: '16px' }}>
              <span className="font-label-mono" style={{ display: 'block', fontSize: '11px', marginBottom: '6px', color: 'var(--neutral)' }}>
                RECOMMENDED CHECKLIST
              </span>
              <ul style={{ margin: 0, paddingLeft: '20px', fontFamily: 'var(--font-mono, monospace)', fontSize: '12px', color: '#93c5fd' }}>
                {aiSuggestion.subtasks.map((st, i) => (
                  <li key={i} style={{ marginBottom: '4px' }}>{st}</li>
                ))}
              </ul>
            </div>
          )}

          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', borderTop: '1px solid var(--border)', paddingTop: '14px' }}>
            <button
              type="button"
              onClick={() => handleApplyAi(true)}
              style={{
                background: '#238636',
                color: '#fff',
                border: 'none',
                padding: '8px 16px',
                borderRadius: '6px',
                fontFamily: 'var(--font-mono, monospace)',
                fontSize: '12px',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              ⚡ Apply All to Task
            </button>
            <button
              type="button"
              onClick={() => handleApplyAi(false)}
              style={{
                background: 'rgba(255,255,255,0.08)',
                color: 'inherit',
                border: '1px solid var(--border)',
                padding: '8px 14px',
                borderRadius: '6px',
                fontFamily: 'var(--font-mono, monospace)',
                fontSize: '12px',
                cursor: 'pointer'
              }}
            >
              📝 Description Only
            </button>
            <button
              type="button"
              onClick={() => setAiSuggestion(null)}
              style={{
                background: 'none',
                color: 'var(--neutral)',
                border: 'none',
                fontFamily: 'var(--font-mono, monospace)',
                fontSize: '12px',
                cursor: 'pointer'
              }}
            >
              Dismiss
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
