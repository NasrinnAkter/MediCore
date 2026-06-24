import { authFetch } from "./api.js";

export const getServicesApi = () => authFetch("/services");

export const getServiceByIdApi = (id) => authFetch(`/services/${id}`);

export const createServiceApi = (data, token) =>
  authFetch("/services", { method: "POST", body: JSON.stringify(data) }, token);

export const updateServiceApi = (id, data, token) =>
  authFetch(`/services/${id}`, { method: "PUT", body: JSON.stringify(data) }, token);

export const deleteServiceApi = (id, token) =>
  authFetch(`/services/${id}`, { method: "DELETE" }, token);
