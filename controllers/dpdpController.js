import DpdpRequest from "../model/dpdpModel.js";

// Submit a new DPDP Privacy Request (Public)
export const createDpdpRequest = async (req, res) => {
  try {
    const { requestType, name, email, phone, details } = req.body;

    if (!requestType || !name || !email || !details) {
      return res.status(400).json({
        success: false,
        message: "Request Type, Name, Email, and Details are required",
      });
    }

    const validTypes = [
      "view_data",
      "correct_data",
      "erasure",
      "withdraw_consent",
      "grievance",
    ];

    if (!validTypes.includes(requestType)) {
      return res.status(400).json({
        success: false,
        message: "Invalid DPDP request type",
      });
    }

    const dpdpRequest = new DpdpRequest({
      requestType,
      name,
      email,
      phone: phone || "",
      details,
      status: "Pending",
    });

    await dpdpRequest.save();

    res.status(201).json({
      success: true,
      message: "Your privacy request has been submitted successfully. Our Grievance Officer will review and respond within the statutory timeframe.",
      requestId: dpdpRequest._id,
    });
  } catch (error) {
    console.error("DPDP Request Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to submit privacy request",
      error: error.message,
    });
  }
};

// Get all DPDP Privacy Requests (Admin Protected)
export const getDpdpRequests = async (req, res) => {
  try {
    const requests = await DpdpRequest.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      requests,
    });
  } catch (error) {
    console.error("Get DPDP Requests Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch privacy requests",
      error: error.message,
    });
  }
};

// Update DPDP Request Status / Resolution (Admin Protected)
export const updateDpdpRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, resolutionNotes } = req.body;

    const updated = await DpdpRequest.findByIdAndUpdate(
      id,
      {
        ...(status && { status }),
        ...(resolutionNotes !== undefined && { resolutionNotes }),
      },
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: "Privacy request not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Privacy request updated successfully",
      request: updated,
    });
  } catch (error) {
    console.error("Update DPDP Request Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update privacy request",
      error: error.message,
    });
  }
};

// Delete DPDP Request (Admin Protected)
export const deleteDpdpRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await DpdpRequest.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Privacy request not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Privacy request deleted successfully",
      requestId: id,
    });
  } catch (error) {
    console.error("Delete DPDP Request Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete privacy request",
      error: error.message,
    });
  }
};
