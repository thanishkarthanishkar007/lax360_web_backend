import mongoose from "mongoose";

const dpdpSchema = new mongoose.Schema(
  {
    requestType: {
      type: String,
      required: true,
      enum: [
        "view_data",
        "correct_data",
        "erasure",
        "withdraw_consent",
        "grievance",
      ],
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    phone: {
      type: String,
      default: "",
      trim: true,
    },
    details: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ["Pending", "In Review", "Resolved"],
      default: "Pending",
    },
    resolutionNotes: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

const DpdpRequest = mongoose.model("DpdpRequest", dpdpSchema);

export default DpdpRequest;
