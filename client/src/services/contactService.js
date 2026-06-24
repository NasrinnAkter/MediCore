import { authFetch } from "./api.js";

export const submitContactApi = (data) =>
  authFetch("/contact", { method: "POST", body: JSON.stringify(data) });