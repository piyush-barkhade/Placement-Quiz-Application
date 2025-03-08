// backend/routes/quizRoutes.js
import express from "express";
import {
  getQuiz,
  getQuizzesByCompany,
  seedQuiz,
} from "../controllers/quizController.js";

const router = express.Router();

//seed quizzes
router.post("/seed", seedQuiz);

// Route to get all quizzes (useful for the Quiz component)
router.get("/quiz", getQuiz);

// Route to get quizzes by company
router.get("/quiz/:company", getQuizzesByCompany);

export default router;
