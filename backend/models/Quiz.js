// backend/models/Quiz.js
import mongoose from "mongoose";

// Define the schema for a quiz
const quizSchema = new mongoose.Schema(
  {
    company: { type: String, required: true },
    questions: [
      {
        // Each question will have its own fields
        question: { type: String, required: true },
        options: [{ type: String, required: true }],
        correctAnswer: { type: String, required: true },
        type: { type: String, required: true }, // "objective" or "coding"
        difficulty: { type: String, required: true }, // "easy", "medium", "hard"
      },
    ],
  },
  { timestamps: true }
);

// Create the model based on the schema
const Quiz = mongoose.model("Quiz", quizSchema);

export default Quiz;
