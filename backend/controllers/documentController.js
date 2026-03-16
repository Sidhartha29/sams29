const Document = require("../models/Document");
const Student = require("../models/Student");
const cloudinary = require("cloudinary").v2;
const fs = require("fs");

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET
});


/* ---------------------- Upload Document ---------------------- */

exports.uploadDocument = async (req, res) => {
  try {

    // Check file
    if (!req.file) {
      return res.status(400).json({
        message: "No file uploaded"
      });
    }

    // Find student using registration number
    const student = await Student.findOne({
      regNo: req.body.studentId
    });

    if (!student) {
      return res.status(404).json({
        message: "Student not found"
      });
    }

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "student_documents"
    });

    // Save document in MongoDB
    const newDocument = new Document({
      studentId: student._id,
      docType: req.body.docType,
      fileUrl: result.secure_url
    });

    await newDocument.save();

    // Remove local file
    fs.unlinkSync(req.file.path);

    res.status(200).json({
      message: "Document uploaded successfully",
      url: result.secure_url,
      document: newDocument
    });

  } catch (error) {

    console.error("Upload Error:", error);

    res.status(500).json({
      message: "Upload failed",
      error: error.message
    });

  }
};


/* ---------------------- Get Student Documents ---------------------- */

exports.getStudentDocuments = async (req, res) => {
  try {

    const student = await Student.findOne({
      regNo: req.params.studentId
    });

    if (!student) {
      return res.status(404).json({
        message: "Student not found"
      });
    }

    const docs = await Document.find({
      studentId: student._id
    });

    res.status(200).json(docs);

  } catch (error) {

    console.error("Fetch Error:", error);

    res.status(500).json({
      message: "Failed to fetch documents",
      error: error.message
    });

  }
};


/* ---------------------- Get Documents by Student ID (ObjectId) ---------------------- */

exports.getDocumentsByStudentId = async (req, res) => {
  try {
    const docs = await Document.find({
      studentId: req.params.studentId
    }).sort({ uploadedAt: -1 });

    res.status(200).json(docs);
  } catch (error) {
    console.error("Fetch Error:", error);
    res.status(500).json({
      message: "Failed to fetch documents",
      error: error.message
    });
  }
};


/* ---------------------- Verify Document (Admin) ---------------------- */

exports.verifyDocument = async (req, res) => {
  try {
    const doc = await Document.findById(req.params.id);
    if (!doc) {
      return res.status(404).json({ message: "Document not found" });
    }

    doc.verified = true;
    doc.verifiedAt = new Date();
    await doc.save();

    res.status(200).json({ message: "Document verified successfully", document: doc });
  } catch (error) {
    console.error("Verify Error:", error);
    res.status(500).json({ message: "Verification failed", error: error.message });
  }
};


/* ---------------------- Get All Documents (Admin) ---------------------- */

exports.getAllDocuments = async (req, res) => {
  try {
    const docs = await Document.find()
      .populate("studentId", "name regNo")
      .sort({ uploadedAt: -1 });
    res.status(200).json(docs);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch documents", error: error.message });
  }
};

/* ---------------------- Delete Document (Admin) ---------------------- */

exports.deleteDocument = async (req, res) => {
  try {
    const doc = await Document.findById(req.params.id);
    if (!doc) {
      return res.status(404).json({ message: "Document not found" });
    }

    // Extract public ID from Cloudinary URL
    const urlParts = doc.fileUrl.split('/');
    const publicIdWithExt = urlParts[urlParts.length - 1];
    const publicId = `student_documents/${publicIdWithExt.split('.')[0]}`;

    // Delete from Cloudinary
    await cloudinary.uploader.destroy(publicId);

    // Delete from database
    await Document.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: "Document deleted successfully" });
  } catch (error) {
    console.error("Delete Error:", error);
    res.status(500).json({ message: "Deletion failed", error: error.message });
  }
};
