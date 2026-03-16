const mongoose = require("mongoose");

const documentSchema = new mongoose.Schema({

  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student",
    required: true,
    index: true
  },

  docType: {
    type: String,
    required: true,
    enum: [
      "Aadhaar",
      "PAN",
      "MarkMemo",
      "VoterID",
      "ABC",
      "Passport",
      "Other"
    ]
  },

  fileUrl: {
    type: String,
    required: true
  },

  fileName: {
    type: String
  },

  verified: {
    type: Boolean,
    default: false
  },

  verifiedAt: {
    type: Date
  },

  uploadedAt: {
    type: Date,
    default: Date.now
  }

}, {
  timestamps: true
});

module.exports = mongoose.model("Document", documentSchema);