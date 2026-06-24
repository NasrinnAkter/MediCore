import express from "express";
import {
  registerUser,
  loginUser,
  getMe,
  updateProfile,
  changePassword,
  getPatientStats,
  getAdminStats,
  getPatients, // <-- Added this controller import right here!
} from "../controllers/authController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

// Base path mapped in server.js: /api/auth
router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/me", protect, getMe);
router.put("/profile", protect, updateProfile);
router.put("/change-password", protect, changePassword);
router.get("/patient-stats", protect, getPatientStats);
router.get("/admin-stats", protect, adminOnly, getAdminStats);
router.get("/patients", protect, adminOnly, getPatients);

export default router;
