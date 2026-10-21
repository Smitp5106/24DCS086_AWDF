const API_BASE_URL = "http://localhost:5000/api/tasks";

// Helper to get headers
const getHeaders = () => {
  return {
    "Content-Type": "application/json",
  };
};

const handleResponse = async (res) => {
  if (res.status === 401) {
    // Dispatch an event to handle logout/redirect globally
    window.dispatchEvent(new Event("unauthorized"));
    throw new Error("Unauthorized");
  }
  if (!res.ok) {
    const errorResult = await res.json().catch(() => ({}));
    throw new Error(errorResult.message || errorResult.error || "API Request Failed");
  }
  return await res.json();
};

export const fetchTasks = async () => {
  const res = await fetch(API_BASE_URL, { headers: getHeaders(), credentials: 'include' });
  const result = await handleResponse(res);
  return { data: result };
};

export const createTask = async (task) => {
  const res = await fetch(API_BASE_URL, {
    method: "POST",
    headers: getHeaders(),
    credentials: 'include',
    body: JSON.stringify(task)
  });
  const result = await handleResponse(res);
  return { data: result };
};

export const updateTask = async (id, task) => {
  const res = await fetch(`${API_BASE_URL}/${id}`, {
    method: "PUT",
    headers: getHeaders(),
    credentials: 'include',
    body: JSON.stringify(task)
  });
  const result = await handleResponse(res);
  return { data: result };
};

export const deleteTask = async (id) => {
  const res = await fetch(`${API_BASE_URL}/${id}`, {
    method: "DELETE",
    headers: getHeaders(),
    credentials: 'include'
  });
  const result = await handleResponse(res);
  return { data: result };
};

export const getAiSuggestions = async (payload) => {
  const res = await fetch(`${API_BASE_URL}/ai-suggest`, {
    method: "POST",
    headers: getHeaders(),
    credentials: 'include',
    body: JSON.stringify(payload)
  });
  const result = await handleResponse(res);
  return { data: result };
};

