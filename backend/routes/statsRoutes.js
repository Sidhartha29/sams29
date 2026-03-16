const express = require("express");
const router = express.Router();
// Authentication middleware removed
const { getStudentStats, getAdminStats } = require("../controllers/statsController");

// GET /api/stats/student
router.get("/student", getStudentStats);

// GET /api/stats/admin
router.get("/admin", getAdminStats);

module.exports = router;
