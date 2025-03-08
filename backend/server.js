import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import cors from "cors";

dotenv.config();

const app = express();
app.use(express.json());
const PORT = process.env.PORT || 5000;

app.use(
  cors({
    origin: "http://localhost:5173", // Frontend URL
    methods: "GET,POST,PUT,DELETE", // Allowed HTTP methods
    credentials: true, // Allow cookies and headers
  })
);

app.get("/", (req, res) => {
  res.send("Server is ready");
});

import authRoutes from "./routes/authRoutes.js";
import quizRoutes from "./routes/quizRoutes.js";
import progressRoutes from "./routes/progressRoutes.js";
import leaderboardRoutes from "./routes/leaderboardRoute.js";

// Use routes in the app
app.use("/", authRoutes);
app.use("/", quizRoutes);
app.use("/", progressRoutes);
app.use("/", leaderboardRoutes);

// Start server
app.listen(PORT, () => {
  connectDB();
  console.log("Server started at http://localhost:" + PORT);
});

// Error handling middleware
app.use((req, res, next) => {
  res.status(404).json({ message: "Route not found" });
});
