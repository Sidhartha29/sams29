const express = require("express");
const router = express.Router();

const {
  addStudent,
  getStudentByRegNo,
  getAllStudents,
  searchStudents,
  updateProfile
} = require("../controllers/studentController");

// Authentication middleware removed

// Public (legacy)
router.post("/", addStudent);

// Protected routes
router.get("/all", getAllStudents);
router.get("/search", searchStudents);
router.put("/profile", updateProfile);
router.get("/:regNo", getStudentByRegNo);

module.exports = router;
