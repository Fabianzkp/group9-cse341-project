require("dotenv").config();
const express = require("express");
const connectDB = require("./data/database");
const app = express();
const bodyParser = require("body-parser");
const { swaggerUi, swaggerSpec } = require("./swagger");
const studentRoutes = require("./routes/studentRoutes");
const session = require("express-session");
const passport = require("passport");
const authRoutes = require("./routes/authRoutes");
const instructorRoutes = require("./routes/instructorRoutes");
const libraryRoutes = require("./routes/libraryRoutes");
const playerRoutes = require("./routes/playerRoutes");
const courseRoutes = require("./routes/courseRoutes");
const routes = require("./routes/index");
const mongoose = require("mongoose"); // Import mongoose for disconnection
const attendanceRoutes = require("./routes/attendanceRoutes");

const port = process.env.PORT || 3000;

// Import authentication middleware
const { ensureAuthenticated } = require("./middleware/auth");

app.use(bodyParser.json());
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

Routes
app.use("/", routes);
app.use("/auth", authRoutes);
app.use("/student", ensureAuthenticated, studentRoutes);
app.use("/instructor", ensureAuthenticated, instructorRoutes);
app.use("/library", ensureAuthenticated, libraryRoutes);
app.use("/player", ensureAuthenticated, playerRoutes);
app.use("/course", ensureAuthenticated, courseRoutes);
app.use("/attendance", ensureAuthenticated, attendanceRoutes);

// app.use("/", routes);
// app.use("/auth", authRoutes);
// app.use("/student", studentRoutes);
// app.use("/instructor", instructorRoutes);
// app.use("/library", libraryRoutes);
// app.use("/player", playerRoutes);
// app.use("/course", courseRoutes);
// app.use("/attendance", attendanceRoutes);

// Start server only if run directly (not required as a module)
if (require.main === module) {
  connectDB()
    .then(() => {
      require("./config/passport"); // Load Passport after DB connection
      app.listen(port, "0.0.0.0", () => {
      console.log(`Server running at http://localhost:${port}`);
      console.log(
        `Swagger Docs available at http://localhost:${port}/api-docs`
        );
      });
    })
    .catch((err) => {
      console.error("Failed to connect to the database", err);
      process.exit(1); // Ensure exit on DB connection failure
    });
}

// Function to close the database connection
const closeDB = async () => {
  await mongoose.disconnect();
  console.log("MongoDB Disconnected");
};

// Export the app, connectDB, and closeDB for testing
module.exports = { app, connectDB, closeDB };
