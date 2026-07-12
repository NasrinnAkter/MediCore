import express from "express";
import {
  submitContact,
  getContacts,
} from "../controllers/contactController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", submitContact);
router.get("/", protect, adminOnly, getContacts);

export default router;
