import express from "express";
import {
  createDpdpRequest,
  getDpdpRequests,
  updateDpdpRequest,
  deleteDpdpRequest,
} from "../controllers/dpdpController.js";
import { verifyAdminToken } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Public submission
router.post("/request", createDpdpRequest);

// Admin endpoints
router.get("/requests", verifyAdminToken, getDpdpRequests);
router.put("/requests/:id", verifyAdminToken, updateDpdpRequest);
router.delete("/requests/:id", verifyAdminToken, deleteDpdpRequest);

export default router;
