// backend/controllers/quizController.js
import Quiz from "../models/Quiz.js";
import seedQuizzes from "../seedData.js";

//seed quizzes
const seedQuiz = async (req, res) => {
  try {
    console.log("Seeding quizzes...");
    await seedQuizzes(); // Call the function that seeds the data
    res.status(200).send("Quizzes seeded successfully!");
  } catch (error) {
    console.error("Error while seeding quizzes:", error);
    res.status(500).send("Error while seeding quizzes");
  }
};

//get quiz
const getQuiz = async (req, res) => {
  try {
    const quizzes = await Quiz.find(); // Fetch all quizzes
    res.status(200).json(quizzes);
  } catch (error) {
    console.error("Error fetching quizzes:", error);
    res.status(500).send("Error fetching quizzes");
  }
};

// Route to fetch quizzes based on company name
const getQuizzesByCompany = async (req, res) => {
  try {
    const companyName = req.params.company; // Get the company name from the URL

    // Find the quiz by company name
    const quiz = await Quiz.findOne({ company: companyName });

    if (!quiz) {
      return res
        .status(404)
        .json({ message: `No quiz found for ${companyName}.` });
    }

    // Return the quiz data
    res.status(200).json(quiz);
  } catch (error) {
    console.error("Error fetching quiz:", error);
    res.status(500).send("Error fetching quiz");
  }
};

export { getQuizzesByCompany, seedQuiz, getQuiz };
