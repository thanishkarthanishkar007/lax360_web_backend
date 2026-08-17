import express from "express";
import { createJob, getJobs } from "../controllers/jobController.js";

const router = express.Router();

router.post("/createJob", createJob);
router.get("/getJob", getJobs);

export default router;
