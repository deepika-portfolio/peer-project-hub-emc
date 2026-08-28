const Comment = require("../models/Comment");
const Project = require("../models/Project");

// @desc    Get all comments for a project
// @route   GET /api/projects/:id/comments
// @access  Public
const getComments = async (req, res, next) => {
  try {
    const comments = await Comment.find({ project: req.params.id }).sort({ createdAt: -1 });
    res.json(comments);
  } catch (err) {
    next(err);
  }
};

// @desc    Add a comment/review to a project
// @route   POST /api/projects/:id/comments
// @access  Private
const addComment = async (req, res, next) => {
  try {
    const { text, rating } = req.body;
    if (!text || !text.trim()) {
      res.status(400);
      throw new Error("Comment text is required");
    }

    const project = await Project.findById(req.params.id);
    if (!project) {
      res.status(404);
      throw new Error("Project not found");
    }

    const comment = await Comment.create({
      project: project._id,
      authorUid: req.user.uid,
      authorName: req.user.name,
      text,
      rating: rating || null,
    });

    res.status(201).json(comment);
  } catch (err) {
    next(err);
  }
};

// @desc    Delete a comment (author only)
// @route   DELETE /api/comments/:commentId
// @access  Private
const deleteComment = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.commentId);
    if (!comment) {
      res.status(404);
      throw new Error("Comment not found");
    }
    if (comment.authorUid !== req.user.uid) {
      res.status(403);
      throw new Error("Not authorized to delete this comment");
    }
    await comment.deleteOne();
    res.json({ message: "Comment deleted" });
  } catch (err) {
    next(err);
  }
};

module.exports = { getComments, addComment, deleteComment };
