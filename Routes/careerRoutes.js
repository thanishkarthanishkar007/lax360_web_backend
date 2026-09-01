import express from "express";
import {
  applyJob,
  getApplications,
  deleteApplication,
} from "../controllers/careerController.js";
import upload from "../middlewares/resumeUploads.js";
import { verifyAdminToken } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Candidate application submission
router.post("/apply", upload.single("resume"), applyJob);

// Admin application management
router.get("/applications", verifyAdminToken, getApplications);
router.delete("/applications/:id", verifyAdminToken, deleteApplication);

export default router;
