const mongoose = require("mongoose");

const likeSchema = new mongoose.Schema(
  {
    userUid: { type: String, required: true, index: true },
    project: { type: mongoose.Schema.Types.ObjectId, ref: "Project", required: true },
  },
  { timestamps: true }
);

// Prevent the same user from liking the same project twice
likeSchema.index({ userUid: 1, project: 1 }, { unique: true });

module.exports = mongoose.model("Like", likeSchema);
