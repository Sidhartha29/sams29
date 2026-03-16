const mongoose = require("mongoose");

const achievementSchema = new mongoose.Schema({

  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student",
    required: true
  },

  title: {
    type: String,
    required: true
  },

  description: {
    type: String
  },

  category: {
    type: String,
    enum: [
      "Hackathon",
      "Internship",
      "Research",
      "Technical Competition",
      "Workshop",
      "Sports",
      "Cultural",
      "Other"
    ],
    required: true
  },

  activityType: {
    type: String,
    enum: ["hackathon", "internship", "research", "sports", "workshop", "cultural", "technical", "other"]
  },

  year: {
    type: Number,
    required: true
  },

  academicYear: {
    type: String
  },

  semester: {
    type: Number,
    required: true
  },

  certificateUrl: {
    type: String
  }

}, { timestamps: true });

module.exports = mongoose.model("Achievement", achievementSchema);
