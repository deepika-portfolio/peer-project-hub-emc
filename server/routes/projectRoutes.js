const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middleware/auth");
const {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
  toggleLike,
  toggleFavorite,
  getMyFavorites,
  rateProject,
} = require("../controllers/projectController");
const { getComments, addComment } = require("../controllers/commentController");

// IMPORTANT: /me/favorites must be declared before /:id to avoid Express
// interpreting "me" as an :id param
router.get("/me/favorites", verifyToken, getMyFavorites);

router.route("/").get(getProjects).post(verifyToken, createProject);

router
  .route("/:id")
  .get(getProjectById)
  .put(verifyToken, updateProject)
  .delete(verifyToken, deleteProject);

router.post("/:id/like", verifyToken, toggleLike);
router.post("/:id/favorite", verifyToken, toggleFavorite);
router.post("/:id/rate", verifyToken, rateProject);

router.route("/:id/comments").get(getComments).post(verifyToken, addComment);

module.exports = router;
