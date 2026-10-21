import { useEffect, useState, useCallback } from "react";
import Header from "./Header.jsx";
import ActivityLog from "./ActivityLog.jsx";
import NewTaskForm from "./NewTaskForm.jsx";
import Board from "./Board.jsx";
import Toast from "./Toast.jsx";
import * as api from "./taskApi.js";

const formatTime = () =>
  new Date().toLocaleTimeString("en-US", { hour12: false });

export default function TaskManager() {
  const [tasks, setTasks] = useState([]);
  const [connected, setConnected] = useState(true);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [log, setLog] = useState([]);
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = "info") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const pushLog = useCallback((method, url) => {
    setLog((prev) => [{ method, url, time: formatTime() }, ...prev].slice(0, 8));
  }, []);

  const loadTasks = useCallback(async () => {
    try {
      const res = await api.fetchTasks();
      const fetchedTasks = res.data?.data || res.data || [];
      setTasks(fetchedTasks.map(t => ({ ...t, id: t._id || t.id })));
      setConnected(true);
      pushLog("GET", "/api/tasks");
      setError("");
    } catch (err) {
      setConnected(false);
      setError(
        "Cannot reach the API. Make sure the task manager backend is running on http://localhost:5000."
      );
    } finally {
      setLoading(false);
    }
  }, [pushLog]);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  const handleCreate = async ({ title, description }) => {
    setSubmitting(true);
    const tempId = Date.now().toString();
    const tempTask = { id: tempId, title, description, status: "pending" };
    setTasks((prev) => [...prev, tempTask]);
    
    try {
      const res = await api.createTask({ title, description });
      const newTask = res.data?.data || res.data;
      if (newTask) {
        setTasks((prev) => prev.map((t) => (t.id === tempId ? { ...newTask, id: newTask._id || newTask.id } : t)));
      }
      pushLog("POST", "/api/tasks");
      setConnected(true);
      setError("");
      addToast("Task created successfully", "success");
    } catch (err) {
      setTasks((prev) => prev.filter((t) => t.id !== tempId));
      const errMsg = err.message || "Failed to create task";
      setError(errMsg);
      addToast(errMsg, "error");
    } finally {
      setSubmitting(false);
    }
  };

  const handleStatusChange = async (task, status) => {
    const previous = tasks;
    setTasks((prev) => prev.map((t) => (t.id === task.id ? { ...t, status } : t)));
    try {
      await api.updateTask(task.id, { status });
      pushLog("PUT", `/api/tasks/${task.id}`);
      setConnected(true);
      setError("");
      addToast("Task status updated", "success");
    } catch (err) {
      setTasks(previous);
      const errMsg = err.message || "Failed to update task status";
      setError(errMsg);
      addToast(errMsg, "error");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this task?")) {
      return;
    }
    const previous = tasks;
    setTasks((prev) => prev.filter((t) => t.id !== id));
    try {
      await api.deleteTask(id);
      pushLog("DELETE", `/api/tasks/${id}`);
      setConnected(true);
      setError("");
      addToast("Task deleted successfully", "success");
    } catch (err) {
      setTasks(previous);
      const errMsg = err.message || "Failed to delete task";
      setError(errMsg);
      addToast(errMsg, "error");
    }
  };

  return (
    <div className="page-container task-manager-page">
      <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '40px' }}>
        <Header connected={connected} taskCount={tasks.length} />
        
        <div className="swiss-grid-2" style={{ marginBottom: '40px' }}>
          <NewTaskForm onCreate={handleCreate} submitting={submitting} />
          <ActivityLog entries={log} />
        </div>

        {error && (
          <div className="success-banner" style={{ borderColor: 'var(--border)', marginBottom: '32px', color: 'var(--primary)' }}>
            {error}
          </div>
        )}

        {loading ? (
          <div className="spinner-container">
            <div className="spinner"></div>
            <p className="spinner-text">Loading tasks...</p>
          </div>
        ) : (
          <Board tasks={tasks} onStatusChange={handleStatusChange} onDelete={handleDelete} />
        )}
      </div>
      
      <div className="toast-container">
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            message={toast.message}
            type={toast.type}
            onClose={() => removeToast(toast.id)}
          />
        ))}
      </div>
    </div>
  );
}
