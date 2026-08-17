import Career from "../model/careerModel.js";
import { sendCareerEmail } from "../utils/sendCareerEmail.js";
import { saveCareerToSheet } from "../utils/googleSheets.js";

export const applyJob = async (req, res) => {
  try {
    // console.log("BODY:", req.body);
    // console.log("FILE:", req.file);

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

    // Correct Cloudinary URL
    const resumeUrl = req.file.path;
    // console.log(req.file.path);

    // console.log("Resume URL:", resumeUrl);

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

    console.log("Saving application to PostgreSQL...");
    await application.save();
    console.log("Application saved to PostgreSQL.");

    // Return response promptly
    res.status(201).json({
      success: true,
      message: "Application submitted successfully",
      resumeUrl,
    });

    // Handle third-party calls in the background
    console.log("Initiating background tasks: Email and Google Sheets...");
    
    sendCareerEmail(application)
      .then(() => console.log("Success: Sent Career Email Notification"))
      .catch(err => console.error("Error: Failed to send career email:", err.message));

    saveCareerToSheet(application)
      .then(() => console.log("Success: Saved to Career Google Sheets"))
      .catch(err => console.error("Error: Failed to save to career sheet:", err.message));

  } catch (error) {
    console.error("Apply Job Error:", error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};
