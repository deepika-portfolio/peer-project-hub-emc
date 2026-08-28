const Project = require("../models/Project");
const Comment = require("../models/Comment");
const Favorite = require("../models/Favorite");
const Like = require("../models/Like");

// @desc    Create a new project
// @route   POST /api/projects
// @access  Private
const createProject = async (req, res, next) => {
  try {
    const { title, description, tags, githubLink, liveDemoLink, thumbnailUrl } = req.body;

    if (!title || !description || !githubLink) {
      res.status(400);
      throw new Error("Title, description, and GitHub link are required");
    }

    const project = await Project.create({
      title,
      description,
      tags: Array.isArray(tags) ? tags : (tags || "").split(",").map((t) => t.trim()).filter(Boolean),
      githubLink,
      liveDemoLink,
      thumbnailUrl,
      ownerUid: req.user.uid,
      ownerName: req.user.name,
    });

    res.status(201).json(project);
  } catch (err) {
    next(err);
  }
};

// @desc    Get paginated project feed with optional search/filter
// @route   GET /api/projects?page=1&limit=10&tag=react&q=chat&owner=uid&sort=recent
// @access  Public
const getProjects = async (req, res, next) => {
  try {
    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const limit = Math.min(parseInt(req.query.limit) || 10, 50);
    const { tag, q, owner, sort } = req.query;

    const filter = {};
    if (tag) filter.tags = tag.toLowerCase();
    if (owner) filter.ownerUid = owner;
    if (q) filter.$text = { $search: q };

    let sortOption = { createdAt: -1 }; // most recent first (default)
    if (sort === "mostLiked") sortOption = { likesCount: -1 };
    if (sort === "topRated") sortOption = { ratingAverage: -1 };

    const [projects, total] = await Promise.all([
      Project.find(filter)
        .sort(sortOption)
        .skip((page - 1) * limit)
        .limit(limit),
      Project.countDocuments(filter),
    ]);

    res.json({
      projects,
      page,
      totalPages: Math.ceil(total / limit),
      totalResults: total,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get single project by ID
// @route   GET /api/projects/:id
// @access  Public
const getProjectById = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      res.status(404);
      throw new Error("Project not found");
    }
    res.json(project);
  } catch (err) {
    next(err);
  }
};

// @desc    Update a project (owner only)
// @route   PUT /api/projects/:id
// @access  Private
const updateProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      res.status(404);
      throw new Error("Project not found");
    }
    // Server-side ownership check — critical, never trust the frontend alone
    if (project.ownerUid !== req.user.uid) {
      res.status(403);
      throw new Error("Not authorized to edit this project");
    }

    const { title, description, tags, githubLink, liveDemoLink, thumbnailUrl } = req.body;
    if (title !== undefined) project.title = title;
    if (description !== undefined) project.description = description;
    if (tags !== undefined) {
      project.tags = Array.isArray(tags) ? tags : tags.split(",").map((t) => t.trim()).filter(Boolean);
    }
    if (githubLink !== undefined) project.githubLink = githubLink;
    if (liveDemoLink !== undefined) project.liveDemoLink = liveDemoLink;
    if (thumbnailUrl !== undefined) project.thumbnailUrl = thumbnailUrl;

    const updated = await project.save();
    res.json(updated);
  } catch (err) {
    next(err);
  }
};

// @desc    Delete a project (owner only)
// @route   DELETE /api/projects/:id
// @access  Private
const deleteProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      res.status(404);
      throw new Error("Project not found");
    }
    if (project.ownerUid !== req.user.uid) {
      res.status(403);
      throw new Error("Not authorized to delete this project");
    }

    await Promise.all([
      project.deleteOne(),
      Comment.deleteMany({ project: project._id }),
      Favorite.deleteMany({ project: project._id }),
      Like.deleteMany({ project: project._id }),
    ]);

    res.json({ message: "Project deleted" });
  } catch (err) {
    next(err);
  }
};

// @desc    Toggle like on a project
// @route   POST /api/projects/:id/like
// @access  Private
const toggleLike = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      res.status(404);
      throw new Error("Project not found");
    }

    const existing = await Like.findOne({ userUid: req.user.uid, project: project._id });
    if (existing) {
      await existing.deleteOne();
      project.likesCount = Math.max(0, project.likesCount - 1);
      await project.save();
      return res.json({ liked: false, likesCount: project.likesCount });
    }

    await Like.create({ userUid: req.user.uid, project: project._id });
    project.likesCount += 1;
    await project.save();
    res.json({ liked: true, likesCount: project.likesCount });
  } catch (err) {
    next(err);
  }
};

// @desc    Toggle favorite/bookmark on a project
// @route   POST /api/projects/:id/favorite
// @access  Private
const toggleFavorite = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      res.status(404);
      throw new Error("Project not found");
    }

    const existing = await Favorite.findOne({ userUid: req.user.uid, project: project._id });
    if (existing) {
      await existing.deleteOne();
      return res.json({ favorited: false });
    }

    await Favorite.create({ userUid: req.user.uid, project: project._id });
    res.json({ favorited: true });
  } catch (err) {
    next(err);
  }
};

// @desc    Get current user's favorited projects
// @route   GET /api/projects/me/favorites
// @access  Private
const getMyFavorites = async (req, res, next) => {
  try {
    const favorites = await Favorite.find({ userUid: req.user.uid }).populate("project");
    res.json(favorites.map((f) => f.project).filter(Boolean));
  } catch (err) {
    next(err);
  }
};

// @desc    Rate a project (1-5 stars). Recalculates running average.
// @route   POST /api/projects/:id/rate
// @access  Private
const rateProject = async (req, res, next) => {
  try {
    const { rating } = req.body;
    if (!rating || rating < 1 || rating > 5) {
      res.status(400);
      throw new Error("Rating must be between 1 and 5");
    }

    const project = await Project.findById(req.params.id);
    if (!project) {
      res.status(404);
      throw new Error("Project not found");
    }

    // Simple running average update
    const newCount = project.ratingCount + 1;
    const newAverage = (project.ratingAverage * project.ratingCount + rating) / newCount;
    project.ratingCount = newCount;
    project.ratingAverage = Math.round(newAverage * 10) / 10;
    await project.save();

    res.json({ ratingAverage: project.ratingAverage, ratingCount: project.ratingCount });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
  toggleLike,
  toggleFavorite,
  getMyFavorites,
  rateProject,
};
