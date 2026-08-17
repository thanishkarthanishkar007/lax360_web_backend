import Contact from "../model/contactModel.js";
import mongoose from "mongoose";

import { sendContactEmail } from "../utils/sendContactEmail.js";
import { sendWhatsAppMessage } from "../utils/sendWhatsAppMessage.js";
import { saveContactToSheet } from "../utils/googleSheets.js";

export const createContact = async (req, res) => {
  console.log("\n==============================");
  console.log("🔥 CREATE CONTACT API HIT");
  console.log("📦 BODY:", req.body);
  console.log("🟢 MongoDB state:", mongoose.connection.readyState);
  console.log("==============================");

  try {
    const {
      Name,
      email,
      phone,
      service,
      message,
    } = req.body;

    // Required fields
    if (!Name || !email || !message) {
      console.log("❌ Required fields missing");

      return res.status(400).json({
        success: false,
        message: "Name, Email and Message are required",
      });
    }

    // Check MongoDB connection
    if (mongoose.connection.readyState !== 1) {
      console.log("❌ MongoDB is NOT connected");

      return res.status(500).json({
        success: false,
        message: "MongoDB is not connected",
      });
    }

    // Create MongoDB document
    const contact = new Contact({
      Name,
      email,
      phone: phone || "",
      service: service || "",
      message,
    });

    console.log("💾 Saving contact to MongoDB...");

    const savedContact = await contact.save();

    console.log("✅ Contact saved successfully!");
    console.log("🆔 MongoDB ID:", savedContact._id);

    // Send response immediately
    res.status(201).json({
      success: true,
      message: "Contact submitted successfully",
      data: savedContact,
    });

    // ==============================
    // BACKGROUND TASKS
    // ==============================

    console.log("🚀 Starting background services...");

    // Email
    sendContactEmail({
      Name,
      email,
      phone,
      service,
      message,
    })
      .then((result) => {
        if (result?.success) {
          console.log("✅ Contact email sent successfully");
        } else {
          console.log("❌ Contact email failed:", result?.error);
        }
      })
      .catch((error) => {
        console.error("❌ Contact email error:", error.message);
      });

    // WhatsApp
    sendWhatsAppMessage({
      Name,
      email,
      phone,
      service,
      message,
    })
      .then(() => {
        console.log("✅ WhatsApp notification sent successfully");
      })
      .catch((error) => {
        console.error("❌ WhatsApp notification error:", error.message);
      });

    // Google Sheets
    saveContactToSheet(savedContact)
      .then(() => {
        console.log("✅ Contact saved to Google Sheets");
      })
      .catch((error) => {
        console.error(
          "❌ Google Sheets error:",
          error.message
        );
      });

  } catch (error) {
    console.error("\n❌ CREATE CONTACT ERROR");
    console.error("Message:", error.message);
    console.error("Name:", error.name);
    console.error("Stack:", error.stack);

    return res.status(500).json({
      success: false,
      message: "Contact save failed",
      error: error.message,
    });
  }
};