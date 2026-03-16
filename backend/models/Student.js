const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const studentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [function () { return this.role !== "admin"; }, "Please add a name"],
      trim: true
    },

    regNo: {
      type: String,
      required: [function () { return this.role !== "admin"; }, "Please add registration number"],
      unique: true,
      trim: true
    },

    email: {
      type: String,
      required: [true, "Please add an email"],
      unique: true,
      lowercase: true,
      trim: true
    },

    phone: {
      type: String,
      trim: true
    },

    department: {
      type: String,
      trim: true
    },

    branch: {
      type: String,
      required: [function () { return this.role !== "admin"; }, "Please add a branch"],
      trim: true
    },

    program: {
      type: String,
      trim: true
    },

    admissionCategory: {
      type: String,
      trim: true
    },

    admissionType: {
      type: String,
      required: [function () { return this.role !== "admin"; }, "Please add an admission type"],
      trim: true
    },

    year: {
      type: Number,
      required: [function () { return this.role !== "admin"; }, "Please add a year"],
    },

    password: {
      type: String,
      required: [true, "Please add a password"],
      minlength: 6,
      select: false
    },

    role: {
      type: String,
      enum: ["student", "admin"],
      default: "student"
    }
  },
  {
    timestamps: true
  }
);


// 🔐 Hash password before saving
studentSchema.pre("save", async function () {
  if (!this.isModified("password")) return;

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});


// 🔑 Compare entered password with hashed password
studentSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};


module.exports = mongoose.model("Student", studentSchema);