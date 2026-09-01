import Service from "../model/serviceModel.js";

// Default initial services to seed if database is empty
const defaultServices = [
  {
    title: "Web 3.0",
    description:
      "End-to-end digital solutions designed to enhance business efficiency, scalability, and online presence.",
    category: "Development",
    order: 1,
  },
  {
    title: "AI Solutions",
    description:
      "Result-driven AI-powered solutions that automate processes, analyze data, and enhance intelligent decision-making for modern businesses.",
    category: "AI & ML",
    order: 2,
  },
  {
    title: "Blockchain",
    description:
      "Secure and transparent blockchain solutions for decentralized applications, smart contracts, and enterprise-grade digital systems.",
    category: "Blockchain",
    order: 3,
  },
  {
    title: "CAD Design",
    description:
      "Precision-driven CAD design and product modeling services for manufacturing, engineering, and prototyping needs.",
    category: "Design",
    order: 4,
  },
  {
    title: "Cyber Security",
    description:
      "Advanced cybersecurity solutions that protect businesses from digital threats, cyber attacks, and data breaches.",
    category: "Security",
    order: 5,
  },
  {
    title: "Software Services",
    description:
      "Custom software development solutions tailored to meet business requirements, improve productivity, and streamline operations.",
    category: "Development",
    order: 6,
  },
  {
    title: "Embedded Systems",
    description:
      "Development of embedded systems for smart devices, industrial automation, and hardware-integrated applications.",
    category: "Hardware & IoT",
    order: 7,
  },
  {
    title: "IoT Solutions",
    description:
      "Internet of Things (IoT) solutions that connect devices, enable real-time monitoring, and automate smart business operations.",
    category: "Hardware & IoT",
    order: 8,
  },
  {
    title: "SaaS Solutions",
    description:
      "Scalable Software-as-a-Service (SaaS) platforms that deliver cloud-based applications, subscription services, and enterprise software solutions.",
    category: "Cloud",
    order: 9,
  },
];

// Get all services (with auto-seeding if collection is empty)
export const getServices = async (req, res) => {
  try {
    let services = await Service.find().sort({ order: 1, createdAt: 1 });

    if (services.length === 0) {
      try {
        await Service.insertMany(defaultServices);
        services = await Service.find().sort({ order: 1, createdAt: 1 });
      } catch (seedErr) {
        console.log("Could not auto-seed services, returning default list:", seedErr.message);
      }
    }

    res.status(200).json({
      success: true,
      services: services.length > 0 ? services : defaultServices,
    });
  } catch (error) {
    console.error("Get Services Error:", error);
    res.status(500).json({
      success: false,
      message: "Server Error fetching services",
      error: error.message,
    });
  }
};

// Create a new service
export const createService = async (req, res) => {
  try {
    const { title, description, image, category, order } = req.body;

    if (!title || !description) {
      return res.status(400).json({
        success: false,
        message: "Title and description are required",
      });
    }

    let imageUrl = image || "";
    if (req.file && req.file.path) {
      imageUrl = req.file.path;
    }

    const service = new Service({
      title,
      description,
      image: imageUrl,
      category: category || "General",
      order: order ? Number(order) : 0,
    });

    await service.save();

    res.status(201).json({
      success: true,
      message: "Service created successfully",
      service,
    });
  } catch (error) {
    console.error("Create Service Error:", error);
    res.status(500).json({
      success: false,
      message: "Server Error creating service",
      error: error.message,
    });
  }
};

// Update an existing service
export const updateService = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, image, category, order } = req.body;

    let updateData = {
      ...(title && { title }),
      ...(description && { description }),
      ...(category && { category }),
      ...(order !== undefined && { order: Number(order) }),
    };

    if (image !== undefined) {
      updateData.image = image;
    }

    if (req.file && req.file.path) {
      updateData.image = req.file.path;
    }

    const service = await Service.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!service) {
      return res.status(404).json({
        success: false,
        message: "Service not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Service updated successfully",
      service,
    });
  } catch (error) {
    console.error("Update Service Error:", error);
    res.status(500).json({
      success: false,
      message: "Server Error updating service",
      error: error.message,
    });
  }
};

// Delete a service
export const deleteService = async (req, res) => {
  try {
    const { id } = req.params;

    const service = await Service.findByIdAndDelete(id);

    if (!service) {
      return res.status(404).json({
        success: false,
        message: "Service not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Service deleted successfully",
      serviceId: id,
    });
  } catch (error) {
    console.error("Delete Service Error:", error);
    res.status(500).json({
      success: false,
      message: "Server Error deleting service",
      error: error.message,
    });
  }
};
