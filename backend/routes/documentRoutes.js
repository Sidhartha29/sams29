const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");
// Authentication middleware removed

const {
  uploadDocument,
  getStudentDocuments,
  getDocumentsByStudentId,
  verifyDocument,
  getAllDocuments,
  deleteDocument
} = require("../controllers/documentController");

// Upload document (protected)
router.post("/upload", upload.single("file"), uploadDocument);

// Get all documents (admin)
router.get("/all", getAllDocuments);

// Verify document (admin)
router.put("/verify/:id", verifyDocument);

// Delete document (admin)
router.delete("/:id", deleteDocument);

// Get documents by student ObjectId
router.get("/by-id/:studentId", getDocumentsByStudentId);

// Get student documents by regNo
router.get("/:studentId", getStudentDocuments);

module.exports = router;
