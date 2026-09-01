import express from "express";
import {
  adminLogin,
  verifyAdmin,
  getDashboardStats,
} from "../controllers/adminController.js";
import { verifyAdminToken } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Public route for login
router.post("/login", adminLogin);

// Protected routes
router.get("/verify", verifyAdminToken, verifyAdmin);
router.get("/stats", verifyAdminToken, getDashboardStats);

export default router;
