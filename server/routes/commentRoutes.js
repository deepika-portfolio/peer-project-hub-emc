const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middleware/auth");
const { deleteComment } = require("../controllers/commentController");

// Standalone route for deleting a comment by its own ID
router.delete("/:commentId", verifyToken, deleteComment);

module.exports = router;
