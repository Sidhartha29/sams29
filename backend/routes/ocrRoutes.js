const express = require("express");
const router = express.Router();

const upload = require("../middleware/upload");
// Authentication middleware removed
const { suggestActivityType } = require("../controllers/ocrController");

// POST /api/ocr/suggest
router.post("/suggest", upload.single("file"), suggestActivityType);

module.exports = router;
