const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema(
  {
    project: { type: mongoose.Schema.Types.ObjectId, ref: "Project", required: true, index: true },
    authorUid: { type: String, required: true },
    authorName: { type: String, required: true },
    text: { type: String, required: true, maxlength: 1000 },
    rating: { type: Number, min: 1, max: 5, default: null }, // optional star rating attached to a review
  },
  { timestamps: true }
);

module.exports = mongoose.model("Comment", commentSchema);
