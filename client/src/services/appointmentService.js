import { authFetch } from "./api.js";

export const createAppointmentApi = (data, token) =>
  authFetch(
    "/appointments",
    {
      method: "POST",
      body: JSON.stringify(data),
    },
    token,
  );

export const getAppointmentsApi = (token) =>
  authFetch("/appointments", {}, token);

export const getMyAppointmentsApi = (token) =>
  authFetch("/appointments/my", {}, token);

export const updateAppointmentStatusApi = (id, status, token) =>
  authFetch(
    `/appointments/${id}/status`,
    {
      method: "PUT",
      body: JSON.stringify({ status }),
    },
    token,
  );

export const cancelAppointmentApi = (id, token) =>
  authFetch(
    `/appointments/${id}/cancel`,
    {
      method: "PUT",
    },
    token,
  );

export const deleteAppointmentApi = (id, token) =>
  authFetch(`/appointments/${id}`, { method: "DELETE" }, token);
