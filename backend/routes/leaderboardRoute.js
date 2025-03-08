// backend/routes/leaderboardRoute.js
import express from "express";
import {
  getLeaderboard,
  updateLeaderboard,
} from "../controllers/leaderboardController.js";

const router = express.Router();

// Route to fetch the leaderboard
router.get("/leaderboard", getLeaderboard);
router.post("/updateLeaderboard", updateLeaderboard);

export default router;
