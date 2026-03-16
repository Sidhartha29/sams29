const express = require("express");
const router = express.Router();

const upload = require("../middleware/upload");
// Authentication middleware removed

const {
  addAchievement,
  getAchievements,
  getAllAchievements,
  deleteAchievement
} = require("../controllers/achievementController");

// Public routes
router.post("/", upload.single("file"), addAchievement);
router.get("/all", getAllAchievements);
router.get("/:studentId", getAchievements);
router.delete("/:id", deleteAchievement);

module.exports = router;
