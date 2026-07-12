import express from "express";
import {
  getNews,
  getNewsById,
  getAllNewsAdmin,
  createNews,
  updateNews,
  deleteNews,
} from "../controllers/newsController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getNews);
router.get("/admin/all", protect, adminOnly, getAllNewsAdmin);
router.get("/:id", getNewsById);
router.post("/", protect, adminOnly, createNews);
router.put("/:id", protect, adminOnly, updateNews);
router.delete("/:id", protect, adminOnly, deleteNews);

export default router;
