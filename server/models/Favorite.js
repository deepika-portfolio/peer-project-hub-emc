const mongoose = require("mongoose");

const favoriteSchema = new mongoose.Schema(
  {
    userUid: { type: String, required: true, index: true },
    project: { type: mongoose.Schema.Types.ObjectId, ref: "Project", required: true },
  },
  { timestamps: true }
);

favoriteSchema.index({ userUid: 1, project: 1 }, { unique: true });

module.exports = mongoose.model("Favorite", favoriteSchema);
