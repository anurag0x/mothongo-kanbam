// Importing required modules
const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { dbConnection } = require("./database/db");
const { auth } = require("./middlewares/auth");
const session = require("express-session");
const { boardRouter } = require("./routes/board");
const { userRouter, passport } = require("./routes/user");
const { ratelimiter } = require("./middlewares/ratelimiter");
const { taskRouter } = require("./routes/task");

// Creating an Express app
const app = express();
const port = process.env.PORT;

// Configuring session middleware
app.use(
  session({
    secret: "hello",
    resave: false,
    saveUninitialized: false,
  })
);

// Applying rate limiter middleware
app.use(ratelimiter);

// Initializing Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// CORS middleware
app.use(cors());

// JSON body parsing middleware
app.use(express.json());

// Sample route for testing
app.get("/", (req, res) => {
  return res.json({ message: "Hello world" });
});

// Routing for user authentication
app.use("/auth", userRouter);

// Authentication middleware
app.use(auth);

// Routing for board-related operations
app.use("/board", boardRouter);
// Routing for task-related operations
app.use("/task",taskRouter)
// Starting the server
app.listen(port, async () => {
  try {
    // Connecting to the database
    await dbConnection;
    console.log("Connected to the database");
    console.log(`Server is running on port: ${port}`);
  } catch (error) {
    console.log(error);
  }
});
