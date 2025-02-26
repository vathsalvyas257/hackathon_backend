const mongoose = require("mongoose");
const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    password: { type: String, required: function () { return !this.googleId; } },
    googleId: { type: String, unique: true, sparse: true }, // Only unique if exists
    role: { type: String, enum: ["faculty", "student", "alumni"], default: "student" },
    image: { type: String, required: false }, // Stores image as Base64
  },
  { timestamps: true }
);

const User = mongoose.model("User", UserSchema);

module.exports = User;
