import express from "express";
import { applyJob } from "../controllers/careerController.js";
import upload from "../middlewares/resumeUploads.js";

const router = express.Router();

router.post("/apply", upload.single("resume"), applyJob);

export default router;
