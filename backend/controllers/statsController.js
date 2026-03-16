const Student = require("../models/Student");
const Achievement = require("../models/Achievement");
const Document = require("../models/Document");

// @desc    Get stats for logged-in student
// @route   GET /api/stats/student
exports.getStudentStats = async (req, res) => {
  try {
    const studentId = req.query.studentId || req.body.studentId;
    if (!studentId) return res.status(400).json({ message: "studentId required" });
    const [achievements, documents, pendingDocs] = await Promise.all([
      Achievement.countDocuments({ studentId }),
      Document.countDocuments({ studentId }),
      Document.countDocuments({ studentId, verified: false })
    ]);
    res.json({ achievements, documents, pendingDocs });
  } catch (error) {
    res.status(500).json({ message: "Failed to get stats", error: error.message });
  }
};

// @desc    Get stats for admin dashboard
// @route   GET /api/stats/admin
exports.getAdminStats = async (req, res) => {
  try {
    const [students, achievements, documents, pendingDocs] = await Promise.all([
      Student.countDocuments({ role: "student" }),
      Achievement.countDocuments(),
      Document.countDocuments(),
      Document.countDocuments({ verified: false })
    ]);
    res.json({ students, achievements, documents, pendingDocs });
  } catch (error) {
    res.status(500).json({ message: "Failed to get stats", error: error.message });
  }
};
