require("dotenv").config();

const express = require("express");

const cors = require("cors");

const connectDB = require("./config/db");

const {

  notFound,

  errorHandler,

} = require("./middleware/errorHandler");

const projectRoutes = require("./routes/projectRoutes");

const commentRoutes = require("./routes/commentRoutes");

const userRoutes = require("./routes/userRoutes");

const statsRoutes = require("./routes/statsRoutes");

const app = express();

// Allow the deployed frontend and local frontend

const allowedOrigins = [

  process.env.CLIENT_URL,

  "http://localhost:5173",

].filter(Boolean);

app.use(

  cors({

    origin: function (origin, callback) {

      // Allow requests without an origin, such as direct browser/API tests

      if (!origin || allowedOrigins.includes(origin)) {

        callback(null, true);

      } else {

        callback(new Error("CORS blocked this origin"));

      }

    },

    credentials: true,

  })

);

app.use(express.json());

// Connect to MongoDB before processing API requests

let databaseConnection;

app.use(async (req, res, next) => {

  try {

    if (!databaseConnection) {

      databaseConnection = connectDB();

    }

    await databaseConnection;

    next();

  } catch (error) {

    next(error);

  }

});

app.get("/", (req, res) => {

  res.json({

    message: "Peer Project Hub API is running",

  });

});

app.use("/api/projects", projectRoutes);

app.use("/api/comments", commentRoutes);

app.use("/api/users", userRoutes);

app.use("/api/stats", statsRoutes);

app.use(notFound);

app.use(errorHandler);

// Run a normal server only during local development

if (process.env.NODE_ENV !== "production") {

  const PORT = process.env.PORT || 5000;

  app.listen(PORT, () => {

    console.log(`Server running on port ${PORT}`);

  });

}

// Required for Vercel

module.exports = app;
 
