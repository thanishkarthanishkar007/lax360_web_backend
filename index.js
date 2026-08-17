import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import dns from "node:dns";
import multer from "multer";

import connectDB from "./database/dbConfig.js";
import contactRoutes from "./Routes/contactRoutes.js";
import careerRoutes from "./Routes/careerRoutes.js";
import jobRoutes from "./Routes/jobRoutes.js";

// Force IPv4
dns.setDefaultResultOrder("ipv4first");

// Load environment variables
dotenv.config();

const app = express();

// ===============================
// MIDDLEWARE
// ===============================

app.use(cors());

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

// ===============================
// REQUEST LOGGER
// ===============================

app.use((req, res, next) => {
    console.log("\n==============================");
    console.log("🔥 REQUEST RECEIVED");
    console.log("Method :", req.method);
    console.log("URL    :", req.originalUrl);
    console.log("Body   :", req.body);
    console.log("==============================\n");

    next();
});

// ===============================
// DEFAULT ROUTE
// ===============================

app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message: "Welcome to LAX360 Backend",
    });
});

// ===============================
// API ROUTES
// ===============================

app.use("/api/contacts", contactRoutes);

app.use("/api/careers", careerRoutes);

app.use("/api/jobs", jobRoutes);

// ===============================
// 404 HANDLER
// ===============================

app.use((req, res) => {
    console.log("❌ ROUTE NOT FOUND:", req.method, req.originalUrl);

    res.status(404).json({
        success: false,
        message: "Route not found",
        route: req.originalUrl,
    });
});

// ===============================
// GLOBAL ERROR HANDLER
// ===============================

app.use((err, req, res, next) => {
    console.error("\n❌❌ GLOBAL ERROR ❌❌");
    console.error("Message:", err.message);
    console.error("Stack:", err.stack);
    console.error("========================\n");

    const isMulterError = err instanceof multer.MulterError;

    const statusCode = isMulterError
        ? 400
        : err.statusCode || 500;

    res.status(statusCode).json({
        success: false,
        message: isMulterError
            ? err.message
            : err.message || "Internal server error",
    });
});

// ===============================
// SERVER
// ===============================

const port = process.env.PORT || 5000;

const startServer = async () => {

    try {

        console.log("🔄 Connecting to MongoDB...");

        await connectDB();

        console.log("✅ Database connection completed");

    } catch (error) {

        console.error("❌ DATABASE CONNECTION ERROR");
        console.error("Message:", error.message);
        console.error("Stack:", error.stack);

        console.log(
            "⚠️ Starting server without database connection..."
        );
    }

    app.listen(port, () => {

        console.log("\n=================================");
        console.log(`🚀 Server running on port ${port}`);
        console.log(`🌐 http://localhost:${port}`);
        console.log("=================================\n");

    });
};

// ===============================
// PROCESS ERROR HANDLERS
// ===============================

process.on("uncaughtException", (error) => {

    console.error("\n❌ UNCAUGHT EXCEPTION");
    console.error("Message:", error.message);
    console.error("Stack:", error.stack);

});

process.on("unhandledRejection", (reason) => {

    console.error("\n❌ UNHANDLED PROMISE REJECTION");
    console.error(reason);

});

// ===============================
// START SERVER
// ===============================

startServer();