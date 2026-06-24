export const API_BASE =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// Helper: makes authenticated requests with the token automatically
export const authFetch = async (url, options = {}, token = null) => {
  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const res = await fetch(`${API_BASE}${url}`, { ...options, headers });
  const data = await res.json();

  if (!res.ok) throw new Error(data.message || "Something went wrong");
  return data;
};
