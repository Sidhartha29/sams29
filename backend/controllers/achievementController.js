const Achievement = require("../models/Achievement");
const cloudinary = require("cloudinary").v2;
const fs = require("fs");

exports.addAchievement = async (req, res) => {
  try {
    let certificateUrl = null;

    // Upload certificate to Cloudinary if file provided
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "student_certificates"
      });
      certificateUrl = result.secure_url;
      fs.unlinkSync(req.file.path);
    }

    const achievement = new Achievement({
      studentId: req.body.studentId || req.user._id,
      title: req.body.title,
      category: req.body.category,
      activityType: req.body.activityType || (req.body.category ? req.body.category.toLowerCase() : undefined),
      year: req.body.year,
      academicYear: req.body.academicYear,
      semester: req.body.semester,
      description: req.body.description,
      certificateUrl: certificateUrl
    });

    await achievement.save();
    res.status(201).json(achievement);
  } catch (error) {
    console.error("Add Achievement Error:", error);
    res.status(500).json({ message: "Failed to add achievement", error: error.message });
  }
};

exports.getAchievements = async (req, res) => {
  try {
    const achievements = await Achievement.find({
      studentId: req.params.studentId
    }).sort({ createdAt: -1 });

    res.json(achievements);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch achievements", error: error.message });
  }
};

// Get all achievements (admin)
exports.getAllAchievements = async (req, res) => {
  try {
    const achievements = await Achievement.find()
      .populate("studentId", "name regNo")
      .sort({ createdAt: -1 });
    res.json(achievements);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch achievements", error: error.message });
  }
};

// Delete achievement
exports.deleteAchievement = async (req, res) => {
  try {
    const achievement = await Achievement.findById(req.params.id);
    if (!achievement) {
      return res.status(404).json({ message: "Achievement not found" });
    }

    // Only owner or admin can delete
    if (achievement.studentId.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized to delete this achievement" });
    }

    await Achievement.findByIdAndDelete(req.params.id);
    res.json({ message: "Achievement deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Delete failed", error: error.message });
  }
};
