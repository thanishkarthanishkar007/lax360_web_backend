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