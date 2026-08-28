const Project = require("../models/Project");
const User = require("../models/User");

// @desc    Basic platform analytics
// @route   GET /api/stats
// @access  Public
const getStats = async (req, res, next) => {
  try {
    const [totalProjects, totalUsers, mostLiked, topRated] = await Promise.all([
      Project.countDocuments(),
      User.countDocuments(),
      Project.findOne().sort({ likesCount: -1 }),
      Project.findOne({ ratingCount: { $gt: 0 } }).sort({ ratingAverage: -1 }),
    ]);

    res.json({
      totalProjects,
      totalUsers,
      mostLikedProject: mostLiked,
      topRatedProject: topRated,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { getStats };
