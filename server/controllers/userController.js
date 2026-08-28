const User = require("../models/User");

const Project = require("../models/Project");



// Create or update the logged-in user's profile

const upsertProfile = async (req, res, next) => {

  try {

    const { name, email, bio, avatarUrl } = req.body;



    const userName =

      name ||

      req.user.name ||

      req.user.email ||

      "User";



    const userEmail =

      email ||

      req.user.email ||

      "";



    if (!req.user.uid) {

      res.status(400);

      throw new Error("Firebase user ID is missing");

    }



    if (!userEmail) {

      res.status(400);

      throw new Error("User email is missing");

    }



    const user = await User.findOneAndUpdate(

      { uid: req.user.uid },

      {

        uid: req.user.uid,

        name: userName,

        email: userEmail,

        ...(bio !== undefined && { bio }),

        ...(avatarUrl !== undefined && { avatarUrl }),

      },

      {

        new: true,

        upsert: true,

        setDefaultsOnInsert: true,

        runValidators: true,

      }

    );



    res.json(user);

  } catch (err) {

    next(err);

  }

};



// Get a public user profile and posted projects

const getUserProfile = async (req, res, next) => {

  try {

    const user = await User.findOne({

      uid: req.params.uid,

    });



    if (!user) {

      res.status(404);

      throw new Error("User not found");

    }



    const projects = await Project.find({

      ownerUid: req.params.uid,

    }).sort({ createdAt: -1 });



    res.json({

      user,

      projects,

    });

  } catch (err) {

    next(err);

  }

};



module.exports = {

  upsertProfile,

  getUserProfile,

};