const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please provide your full name"],
    trim: true,
    maxlength: 60
  },
  email: {
    type: String,
    required: [true, "Please provide your email address"],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, "Please provide a valid email address"]
  },
  password: {
    type: String,
    required: [true, "Please provide a password"],
    minlength: 6
  },
  role: {
    type: String,
    enum: ["student", "admin"],
    default: "student"
  },
  college: { type: String, trim: true, default: "Chitkara University" },
  branch: { type: String, trim: true, default: "Computer Science Engineering" },
  academicYear: { type: String, trim: true, default: "3rd Year" },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.models.User || mongoose.model("User", userSchema);
