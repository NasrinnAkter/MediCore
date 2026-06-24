import express from "express";
import {
  createAppointment,
  getAppointments,
  getMyAppointments,
  updateAppointmentStatus,
  cancelAppointment,
  deleteAppointment,
} from "../controllers/appointmentController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, createAppointment);
router.get("/", protect, adminOnly, getAppointments);
router.get("/my", protect, getMyAppointments);
router.put("/:id/status", protect, adminOnly, updateAppointmentStatus);
router.put("/:id/cancel", protect, cancelAppointment);
router.delete("/:id", protect, adminOnly, deleteAppointment);

export default router;
