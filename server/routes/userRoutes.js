const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middleware/auth");
const { upsertProfile, getUserProfile } = require("../controllers/userController");

router.post("/profile", verifyToken, upsertProfile);
router.get("/:uid", getUserProfile);

module.exports = router;
