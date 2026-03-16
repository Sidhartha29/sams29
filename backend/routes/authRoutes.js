const express = require("express");
const router = express.Router();

const { register, login, getMe } = require("../controllers/authController");
// Authentication middleware removed

// POST /api/auth/register
router.post("/register", register);

// POST /api/auth/login
router.post("/login", login);



module.exports = router;
