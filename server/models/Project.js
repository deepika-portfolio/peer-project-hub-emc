const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 120 },
    description: { type: String, required: true, maxlength: 3000 },
    tags: [{ type: String, trim: true, lowercase: true }],
    githubLink: {
      type: String,
      required: true,
      validate: {
        validator: (v) => /^https?:\/\/(www\.)?github\.com\/.+/.test(v),
        message: (props) => `${props.value} is not a valid GitHub URL`,
      },
    },
    liveDemoLink: {
      type: String,
      default: "",
      validate: {
        validator: (v) => !v || /^https?:\/\/.+/.test(v),
        message: (props) => `${props.value} is not a valid URL`,
      },
    },
    thumbnailUrl: { type: String, default: "" },
    ownerUid: { type: String, required: true, index: true },
    ownerName: { type: String, required: true },
    likesCount: { type: Number, default: 0 },
    ratingAverage: { type: Number, default: 0 },
    ratingCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// Text index to support keyword search on title/description/tags
projectSchema.index({ title: "text", description: "text", tags: "text" });

module.exports = mongoose.model("Project", projectSchema);
