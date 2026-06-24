import { authFetch } from "./api.js";

export const loginApi = (email, password) =>
  authFetch("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });

export const registerApi = (formData) =>
  authFetch("/auth/register", {
    method: "POST",
    body: JSON.stringify(formData),
  });

export const getMeApi = (token) => authFetch("/auth/me", {}, token);

export const updateProfileApi = (data, token) =>
  authFetch(
    "/auth/profile",
    {
      method: "PUT",
      body: JSON.stringify(data),
    },
    token,
  );

export const changePasswordApi = (data, token) =>
  authFetch(
    "/auth/change-password",
    {
      method: "PUT",
      body: JSON.stringify(data),
    },
    token,
  );

export const getPatientStatsApi = (token) =>
  authFetch("/auth/patient-stats", {}, token);

export const getAdminStatsApi = (token) =>
  authFetch("/auth/admin-stats", {}, token);

export const getPatientsApi = (token) => authFetch("/auth/patients", {}, token);
