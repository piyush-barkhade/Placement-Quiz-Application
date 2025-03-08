// models/Progress.js
import mongoose from "mongoose";

const progressSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  quiz: { type: mongoose.Schema.Types.ObjectId, ref: "Quiz", required: true },
  score: { type: Number, required: true },
  completed: { type: Boolean, required: true },
  windowViolated: { type: Boolean, required: true },
  violationsCount: { type: Number, required: true },
  submittedAt: { type: Date, required: true },
  answers: [
    {
      questionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Question",
        required: true,
      },
      selectedOption: { type: String },
      isCorrect: { type: Boolean, required: true },
    },
  ],
});

const Progress = mongoose.model("Progress", progressSchema);

export default Progress;
