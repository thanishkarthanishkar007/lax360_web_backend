import jwt from "jsonwebtoken";
import Job from "../model/jobModel.js";
import Service from "../model/serviceModel.js";
import Career from "../model/careerModel.js";
import Contact from "../model/contactModel.js";

const JWT_SECRET = process.env.JWT_SECRET || "lax360_super_secret_admin_token_key_2025";
const ADMIN_EMAIL = (process.env.ADMIN_EMAIL || "lax360salem@gmail.com").toLowerCase().trim();
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "lax360@salem";

// Admin Login
export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const trimmedEmail = email.toLowerCase().trim();

    if (trimmedEmail !== ADMIN_EMAIL || password !== ADMIN_PASSWORD) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Generate JWT Token (valid for 7 days)
    const token = jwt.sign(
      {
        email: trimmedEmail,
        role: "admin",
      },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(200).json({
      success: true,
      message: "Admin login successful",
      token,
      admin: {
        email: trimmedEmail,
        role: "admin",
        name: "LAX360 Administrator",
      },
    });
  } catch (error) {
    console.error("Admin Login Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error during admin login",
      error: error.message,
    });
  }
};

// Verify Admin Token
export const verifyAdmin = async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      valid: true,
      admin: req.admin,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Token verification failed",
      error: error.message,
    });
  }
};

// Get Dashboard Overview Statistics
export const getDashboardStats = async (req, res) => {
  try {
    const [
      totalJobs,
      totalServices,
      totalApplications,
      totalContacts,
      recentApplications,
      recentContacts,
    ] = await Promise.all([
      Job.countDocuments(),
      Service.countDocuments(),
      Career.countDocuments(),
      Contact.countDocuments(),
      Career.find().sort({ createdAt: -1 }).limit(5),
      Contact.find().sort({ createdAt: -1 }).limit(5),
    ]);

    res.status(200).json({
      success: true,
      stats: {
        totalJobs,
        totalServices,
        totalApplications,
        totalContacts,
        recentApplications,
        recentContacts,
      },
    });
  } catch (error) {
    console.error("Dashboard Stats Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to load dashboard statistics",
      error: error.message,
    });
  }
};
