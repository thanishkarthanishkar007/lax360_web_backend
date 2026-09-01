import express from "express";
import {
  getServices,
  createService,
  updateService,
  deleteService,
} from "../controllers/serviceController.js";
import { verifyAdminToken } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Public routes for fetching services
router.get("/", getServices);
router.get("/getServices", getServices);

// Protected routes for admin management
router.post("/", verifyAdminToken, createService);
router.post("/createService", verifyAdminToken, createService);

router.put("/:id", verifyAdminToken, updateService);
router.put("/updateService/:id", verifyAdminToken, updateService);

router.delete("/:id", verifyAdminToken, deleteService);
router.delete("/deleteService/:id", verifyAdminToken, deleteService);

export default router;
