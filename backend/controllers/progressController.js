// controllers/progressController.js
import mongoose from "mongoose";
import Progress from "../models/Progress.js";
import Quiz from "../models/Quiz.js";
import User from "../models/User.js";

const getUserProgress = async (req, res) => {
  const { email } = req.params;

  try {
    const user = await User.findOne({ email })
      .populate({
        path: "userProgress.quiz", // Populating the quiz details
        select: "title", // Only select the 'title' field of the Quiz model
      })
      .select("userProgress"); // Only return the userProgress field

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Format the user progress data
    const progressData = user.userProgress.map((userProgress) => ({
      quiz: userProgress.name, // Quiz title
      score: userProgress.score, // User's score
      completed: userProgress.completed, // Whether the quiz was completed
      submittedAt: userProgress.submittedAt, // Submission time
    }));

    res.status(200).json({ progress: progressData });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching user progress" });
  }
};

const saveProgress = async (req, res) => {
  try {
    const {
      userId,
      quizId,
      answers,
      score,
      violationsCount,
      windowViolated,
      submittedAt,
      completed,
    } = req.body;

    // Validate that userId is provided
    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    console.log("Saving progress data:", req.body); // Log the incoming request body

    // Find the user and quiz in the database
    const user = await User.findById(userId);
    const quiz = await Quiz.findById(quizId);

    if (!user || !quiz) {
      return res.status(400).json({ message: "Invalid user or quiz" });
    }

    // Create a new progress document
    const progress = new Progress({
      user: userId,
      quiz: quiz._id,
      score,
      completed,
      windowViolated,
      violationsCount,
      submittedAt,
      answers,
    });

    // Save the progress record to the Progress collection
    await progress.save();

    // Now update the User model to include the new progress
    await User.findByIdAndUpdate(
      userId,
      {
        $push: { userProgress: progress._id }, // Push the progress ID to the user's progress array
      },
      { new: true } // Return the updated user document
    );

    res.status(200).json({ message: "Progress saved successfully", progress });
  } catch (error) {
    console.error("Error saving progress:", error); // Log error
    res.status(500).json({ message: "Error saving progress", error });
  }
};

const updateUserProgress = async (req, res) => {
  const { userId } = req.params;
  const { quiz, name, score, completed, submittedAt } = req.body;

  // Basic validation for required fields
  if (!quiz || !score || typeof completed !== "boolean" || !submittedAt) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  // Validate if quiz is a valid ObjectId
  if (!mongoose.Types.ObjectId.isValid(quiz)) {
    return res.status(400).json({ message: "Invalid quiz ID format" });
  }

  try {
    // Find the user and update their progress
    const user = await User.findByIdAndUpdate(
      userId,
      {
        $push: {
          userProgress: { quiz, name, score, completed, submittedAt }, // Push only quiz ObjectId
        },
      },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "User progress updated successfully.",
      user: user, // Optionally return the updated user or just a success message
    });
  } catch (error) {
    console.error("Error updating user progress:", error);
    res
      .status(500)
      .json({ message: "Error updating user progress", error: error.message });
  }
};

export { saveProgress, getUserProgress, updateUserProgress };
