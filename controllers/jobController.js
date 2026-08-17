import Job from "../model/jobModel.js";

// Add a new job
export const createJob = async (req, res) => {
  try {
    const { title, location, type, description } = req.body;

    if (!title || !location || !type || !description) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const job = new Job({
      title,
      location,
      type,
      description,
    });

    await job.save();

    res.status(201).json({
      success: true,
      message: "Job added successfully",
      job,
    });
  } catch (error) {
    console.error("Create Job Error:", error);

    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

// Get all jobs
export const getJobs = async (req, res) => {
  try {
    const jobs = await Job.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      jobs,
    });
  } catch (error) {
    console.error("Get Jobs Error:", error);

    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};