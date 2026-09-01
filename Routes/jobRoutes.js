import express from "express";
import {
  createJob,
  getJobs,
  getJobById,
  updateJob,
  deleteJob,
} from "../controllers/jobController.js";
import { verifyAdminToken } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Public routes (read jobs)
router.get("/", getJobs);
router.get("/getJob", getJobs);
router.get("/:id", getJobById);

// Job creation (supports both open API and authenticated admin)
router.post("/", createJob);
router.post("/createJob", createJob);

// Admin modification routes
router.put("/:id", verifyAdminToken, updateJob);
router.put("/updateJob/:id", verifyAdminToken, updateJob);

router.delete("/:id", verifyAdminToken, deleteJob);
router.delete("/deleteJob/:id", verifyAdminToken, deleteJob);

export default router;
