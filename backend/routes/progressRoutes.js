// routes/progressRoutes.js
import express from "express";
import {
  getUserProgress,
  saveProgress,
  updateUserProgress,
} from "../controllers/progressController.js";

const router = express.Router();

router.post("/progress", saveProgress);

//Route to get user progress
router.get("/get-user-progress/:email", getUserProgress);

// Update user progress
router.put("/users/:userId/update-progress", updateUserProgress);

export default router;
