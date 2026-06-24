import express from "express";
import {
  getServices,
  getServiceById,
  createService,
  updateService,
  deleteService,
} from "../controllers/serviceController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getServices); // public
router.get("/:id", getServiceById); // public
router.post("/", protect, adminOnly, createService); // admin only
router.put("/:id", protect, adminOnly, updateService); // admin only
router.delete("/:id", protect, adminOnly, deleteService); // admin only

export default router;
