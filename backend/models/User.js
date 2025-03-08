// backend/models/User.js
import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, minlength: 8 },
    userProgress: [
      {
        quiz: { type: mongoose.Schema.Types.ObjectId, ref: "Quiz" }, // Reference to the Quiz model
        name: { type: String, required: true },
        score: { type: Number, required: true },
        completed: { type: Boolean, required: true },
        submittedAt: { type: Date, required: true },
      },
    ],
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
export default User;
