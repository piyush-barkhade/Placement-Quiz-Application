import mongoose from "mongoose";

const leaderboardSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  userName: { type: String, required: true },
  quizId: { type: mongoose.Schema.Types.ObjectId, ref: "Quiz", required: true },
  score: { type: Number, required: true },
  submittedAt: { type: Date, required: true },
});

const Leaderboard = mongoose.model("Leaderboard", leaderboardSchema);
export default Leaderboard;
