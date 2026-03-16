const Student = require("../models/Student");


// JWT removed - no token generation


// @desc    Register a new student
// @route   POST /api/auth/register
exports.register = async (req, res) => {
  try {
    const { name, regNo, email, phone, department, branch, program, admissionCategory, admissionType, year, password, role } = req.body;

    // Check if student/admin already exists with the same email or regNo.
    // For admin registration, regNo may be undefined, so only include it when provided.
    const query = regNo ? { $or: [{ email }, { regNo }] } : { email };
    const existingStudent = await Student.findOne(query);
    if (existingStudent) {
      return res.status(400).json({ message: "User with this email or registration number already exists" });
    }

    const student = await Student.create({
      name,
      regNo,
      email,
      phone,
      department,
      branch,
      program,
      admissionCategory,
      admissionType,
      year,
      password,
      role: role || "student"
    });

    res.status(201).json({
      _id: student._id,
      name: student.name,
      regNo: student.regNo,
      email: student.email,
      role: student.role
    });
  } catch (error) {
    console.error("Register Error:", error);
    res.status(500).json({ message: "Registration failed", error: error.message });
  }
};

// @desc    Login student or admin
// @route   POST /api/auth/login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const student = await Student.findOne({ email }).select('+password');
    if (!student) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isMatch = await student.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    res.json({
      _id: student._id,
      name: student.name,
      regNo: student.regNo,
      email: student.email,
      role: student.role,
      branch: student.branch,
      department: student.department,
      year: student.year,
      phone: student.phone
    });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: "Login failed", error: error.message });
  }
};

// @desc    Get current user profile
// @route   GET /api/auth/me
exports.getMe = async (req, res) => {
  try {
    const student = await Student.findById(req.user._id).select("-password");
    if (!student) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(student);
  } catch (error) {
    res.status(500).json({ message: "Failed to get profile", error: error.message });
  }
};
