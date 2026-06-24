import { authFetch } from "./api.js";

export const getDoctorsApi = ({ search = "", department = "" } = {}, token = null) => {
  const params = new URLSearchParams();
  if (search) params.append("search", search);
  if (department && department !== "All") params.append("department", department);
  return authFetch(`/doctors?${params.toString()}`, {}, token);
};

export const getDoctorByIdApi = (id) => authFetch(`/doctors/${id}`);

export const createDoctorApi = (data, token) =>
  authFetch("/doctors", { method: "POST", body: JSON.stringify(data) }, token);

export const updateDoctorApi = (id, data, token) =>
  authFetch(`/doctors/${id}`, { method: "PUT", body: JSON.stringify(data) }, token);

export const deleteDoctorApi = (id, token) =>
  authFetch(`/doctors/${id}`, { method: "DELETE" }, token);
