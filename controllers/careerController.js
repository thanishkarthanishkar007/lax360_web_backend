import Career from "../model/careerModel.js";
import { sendCareerEmail } from "../utils/sendCareerEmail.js";
import { saveCareerToSheet } from "../utils/googleSheets.js";

export const applyJob = async (req, res) => {
  try {
    console.log("========== APPLY JOB ==========");
    console.log("BODY:", req.body);
    console.log("FILE:", req.file);

    const {
      firstName,
      lastName,
      email,
      phone,
      address,
      city,
      state,
      zip,
      jobTitle,
    } = req.body;

    if (!firstName || !email || !req.file) {
      return res.status(400).json({
        success: false,
        message: "First Name, Email and Resume are required",
      });
    }

    const resumeUrl = req.file.path;

    console.log("Resume URL:", resumeUrl);

    const application = new Career({
      firstName,
      lastName,
      email,
      phone,
      address,
      city,
      state,
      zip,
      jobTitle,
      resume: resumeUrl,
    });

    console.log("Saving application to MongoDB...");

    await application.save();

    console.log("Application saved to MongoDB.");

    // Respond immediately
    res.status(201).json({
      success: true,
      message: "Application submitted successfully",
      resumeUrl,
    });

    // Background email
    sendCareerEmail(application)
      .then(() => {
        console.log("✅ Career email sent");
      })
      .catch((err) => {
        console.error("❌ Career email error:", err);
      });

    // Background Google Sheet
    saveCareerToSheet(application)
      .then(() => {
        console.log("✅ Application saved to Google Sheets");
      })
      .catch((err) => {
        console.error("❌ Google Sheets error:", err);
      });

  } catch (error) {
    console.error("❌ Apply Job Error:", error);

    return res.status(500).json({
      success: false,
      message: error?.message || "Server Error",
    });
  }
};

// Get all applications (Admin)
export const getApplications = async (req, res) => {
  try {
    const applications = await Career.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      applications,
    });
  } catch (error) {
    console.error("Get Applications Error:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

// Delete an application (Admin)
export const deleteApplication = async (req, res) => {
  try {
    const { id } = req.params;
    const application = await Career.findByIdAndDelete(id);

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Application deleted successfully",
      applicationId: id,
    });
  } catch (error) {
    console.error("Delete Application Error:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};