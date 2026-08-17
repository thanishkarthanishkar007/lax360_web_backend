import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../utils/cloudinary.js";

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    const firstName = req.body.firstName || "candidate";
    const jobTitle = req.body.jobTitle || "job";

    const cleanName = `${firstName}_${jobTitle}`
      .replace(/\s+/g, "_")
      .toLowerCase();

    return {
      folder: "lax360_resumes",
      resource_type: "auto", 
      public_id: `${cleanName}_${Date.now()}`,
    };
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

export default upload;
