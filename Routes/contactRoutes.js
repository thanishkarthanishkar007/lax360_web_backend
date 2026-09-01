import express from "express";
import {
  createContact,
  getContacts,
  deleteContact,
} from "../controllers/contactController.js";
import { verifyAdminToken } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Public submission
router.post("/", createContact);
router.post("/createContact", createContact);

// Admin management
router.get("/", verifyAdminToken, getContacts);
router.get("/getContacts", verifyAdminToken, getContacts);
router.delete("/:id", verifyAdminToken, deleteContact);

export default router;
