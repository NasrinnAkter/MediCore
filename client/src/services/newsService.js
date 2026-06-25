import { authFetch } from "./api.js";

export const getNewsApi = (params = {}) => {
  const query = new URLSearchParams(params);
  return authFetch(`/news?${query.toString()}`);
};

export const getNewsByIdApi = (id) => authFetch(`/news/${id}`);

export const getAllNewsAdminApi = (token) =>
  authFetch("/news/admin/all", {}, token);

export const createNewsApi = (data, token) =>
  authFetch("/news", { method: "POST", body: JSON.stringify(data) }, token);

export const updateNewsApi = (id, data, token) =>
  authFetch(`/news/${id}`, { method: "PUT", body: JSON.stringify(data) }, token);

export const deleteNewsApi = (id, token) =>
  authFetch(`/news/${id}`, { method: "DELETE" }, token);
