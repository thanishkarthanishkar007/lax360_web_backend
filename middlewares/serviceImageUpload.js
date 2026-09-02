import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../utils/cloudinary.js";

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    const title = req.body?.title || "service";
    const cleanTitle = title
      .replace(/[^a-zA-Z0-9_-]/g, "_")
      .replace(/_+/g, "_")
      .toLowerCase();

    return {
      folder: "lax360_services",
      public_id: `${cleanTitle}_${Date.now()}`,
      allowed_formats: ["jpg", "jpeg", "png", "webp", "svg", "gif"],
    };
  },
});

const uploadServiceImage = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files (JPG, PNG, WEBP, SVG, GIF) are allowed."));
    }
  },
});

export default uploadServiceImage;
