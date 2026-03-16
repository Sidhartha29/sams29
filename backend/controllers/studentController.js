const Student = require("../models/Student");

// Add student (legacy - kept for backward compat)
exports.addStudent = async (req, res) => {
  try {
    const student = new Student(req.body);
    await student.save();
    res.json(student);
  } catch (error) {
    res.status(500).json(error);
  }
};

// Get student by registration number
exports.getStudentByRegNo = async (req, res) => {
  try {
    const student = await Student.findOne({
      regNo: req.params.regNo
    }).select("-password");
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }
    res.json(student);
  } catch (error) {
    res.status(500).json(error);
  }
};

// Get all students (admin)
exports.getAllStudents = async (req, res) => {
  try {
    const students = await Student.find({ role: "student" }).select("-password");
    res.json(students);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch students", error: error.message });
  }
};

// Search students by regNo (partial match)
exports.searchStudents = async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) {
      return res.status(400).json({ message: "Search query is required" });
    }
    const students = await Student.find({
      regNo: { $regex: q, $options: "i" }
    }).select("-password");
    res.json(students);
  } catch (error) {
    res.status(500).json({ message: "Search failed", error: error.message });
  }
};

// Update student profile
exports.updateProfile = async (req, res) => {
  try {
    const { name, phone, branch, department, program, admissionType, year } = req.body;
    const student = await Student.findById(req.user._id);
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }
    if (name) student.name = name;
    if (phone) student.phone = phone;
    if (branch) student.branch = branch;
    if (department) student.department = department;
    if (program) student.program = program;
    if (admissionType) student.admissionType = admissionType;
    if (year) student.year = year;

    await student.save();
    const updated = await Student.findById(req.user._id).select("-password");
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: "Update failed", error: error.message });
  }
};
