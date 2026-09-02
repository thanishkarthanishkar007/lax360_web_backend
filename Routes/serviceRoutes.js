import express from "express";
import {
  getServices,
  createService,
  updateService,
  deleteService,
} from "../controllers/serviceController.js";
import { verifyAdminToken } from "../middlewares/authMiddleware.js";
import uploadServiceImage from "../middlewares/serviceImageUpload.js";

const router = express.Router();

// Public routes for fetching services
router.get("/", getServices);
router.get("/getServices", getServices);

// Protected routes for admin management (with image upload support)
router.post(
  "/",
  verifyAdminToken,
  uploadServiceImage.single("image"),
  createService
);
router.post(
  "/createService",
  verifyAdminToken,
  uploadServiceImage.single("image"),
  createService
);

router.put(
  "/:id",
  verifyAdminToken,
  uploadServiceImage.single("image"),
  updateService
);
router.put(
  "/updateService/:id",
  verifyAdminToken,
  uploadServiceImage.single("image"),
  updateService
);

router.delete("/:id", verifyAdminToken, deleteService);
router.delete("/deleteService/:id", verifyAdminToken, deleteService);

export default router;
