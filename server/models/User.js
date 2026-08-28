const mongoose = require("mongoose");

// Local "profile" record mirroring the Firebase Auth user.
// Firebase handles the actual credentials; this stores app-specific info.
const userSchema = new mongoose.Schema(
  {
    uid: { type: String, required: true, unique: true, index: true }, // Firebase UID
    name: { type: String, required: true },
    email: { type: String, required: true },
    bio: { type: String, default: "", maxlength: 500 },
    avatarUrl: { type: String, default: "" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
