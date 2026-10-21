const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const logger = require("./middleware/logger");
const validateContentType = require("./middleware/validateContentType");
const errorHandler = require("./middleware/errorHandler");
const taskRoutes = require("./routes/taskRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

// ---- Core middleware ----
app.use(cors());
app.use(express.json());
app.use(logger);
app.use(validateContentType);

// ---- Routes ----
app.get("/", (req, res) => {
  res.json({ message: "Task Manager API is running", docs: "/api/tasks" });
});

app.use("/api/tasks", taskRoutes);

// ---- 404 handler for undefined routes ----
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: `Route ${req.originalUrl} not found`
  });
});

// ---- Global error handler (must be LAST) ----
app.use(errorHandler);

const connectDB = async (retries = 5, delay = 3000) => {
  const mongoUri = process.env.MONGO_URI || "mongodb://mongodb:27017/task-manager";
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const conn = await mongoose.connect(mongoUri);
      console.log(`MongoDB Connected: ${conn.connection.host}`);
      return;
    } catch (error) {
      console.error(`MongoDB connection attempt ${attempt}/${retries} failed: ${error.message}`);
      if (attempt < retries) {
        console.log(`Retrying connection in ${delay / 1000}s...`);
        await new Promise((res) => setTimeout(res, delay));
      } else {
        process.exit(1);
      }
    }
  }
};

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
});
