import Leaderboard from "../models/Leaderboard.js";

const getLeaderboard = async (req, res) => {
  try {
    const leaderboard = await Leaderboard.find()
      .sort({ score: -1 })
      .limit(10)
      .populate("userId", "username");

    res.status(200).json(leaderboard);
  } catch (error) {
    console.error("Error fetching leaderboard:", error);
    res.status(500).json({ message: "Error fetching leaderboard" });
  }
};

const updateLeaderboard = async (req, res) => {
  // Modified to use req, res
  try {
    const { userId, userName, quizId, score, submittedAt } = req.body; // get data from req.body

    if (!userId || !userName || !quizId || !score || !submittedAt) {
      return res.status(400).json({ message: "Missing required fields" }); // send error to client
    }

    const existingLeaderboardEntry = await Leaderboard.findOne({
      userId,
    });

    if (existingLeaderboardEntry) {
      existingLeaderboardEntry.score += score;
      existingLeaderboardEntry.submittedAt = submittedAt;
      await existingLeaderboardEntry.save();
    } else {
      const newLeaderboardEntry = new Leaderboard({
        userId,
        userName,
        quizId,
        score,
        submittedAt,
      });
      await newLeaderboardEntry.save();
    }
    res.status(200).json({ message: "Leaderboard updated successfully" });
  } catch (err) {
    console.error("Error updating leaderboard:", err);
    res
      .status(500)
      .json({ message: err.message || "Error updating leaderboard" }); // send error to client
  }
};

export { getLeaderboard, updateLeaderboard };
