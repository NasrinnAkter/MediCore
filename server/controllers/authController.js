import {
  registerUserService,
  loginUserService,
  getMeService,
} from "../services/authService.js";

import {
  updateProfileService,
  changePasswordService,
} from "../services/authService.js";

import { getPatientStatsService } from "../services/authService.js";

import { getAdminStatsService } from "../services/authService.js";

import { getPatientsService } from "../services/authService.js";

export const getPatients = async (req, res) => {
  try {
    const patients = await getPatientsService();
    res.json(patients);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const getAdminStats = async (req, res) => {
  try {
    const stats = await getAdminStatsService();
    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getPatientStats = async (req, res) => {
  try {
    const stats = await getPatientStatsService(req.user._id);
    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const updateProfile = async (req, res) => {
  try {
    const user = await updateProfileService(req.user._id, req.body);
    res.json(user);
  } catch (error) {
    const status = error.message === "User not found" ? 404 : 500;
    res.status(status).json({ message: error.message });
  }
};

export const changePassword = async (req, res) => {
  try {
    const result = await changePasswordService(req.user._id, req.body);
    res.json(result);
  } catch (error) {
    const status = error.message.includes("incorrect") ? 400 : 500;
    res.status(status).json({ message: error.message });
  }
};
export const registerUser = async (req, res) => {
  try {
    const result = await registerUserService(req.body);
    res.status(201).json(result);
  } catch (error) {
    const status = error.message === "Email already registered" ? 400 : 500;
    res.status(status).json({ message: error.message });
  }
};

export const loginUser = async (req, res) => {
  try {
    const result = await loginUserService(req.body);
    res.json(result);
  } catch (error) {
    const status = error.message === "Invalid email or password" ? 401 : 500;
    res.status(status).json({ message: error.message });
  }
};

export const getMe = async (req, res) => {
  try {
    const user = await getMeService(req.user.id);
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
