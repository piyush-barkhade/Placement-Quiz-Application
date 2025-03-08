// backend/utils/seedLogic.js
import Quiz from "./models/Quiz.js";
import quizData from "./data/quizData.js"; // Import the quiz data

const seedQuizzes = async () => {
  try {
    // Iterate through the quizzes
    for (const quiz of quizData) {
      console.log("Seeding quiz for:", quiz.company);

      // Find the existing quiz in the database
      const existingQuiz = await Quiz.findOne({ company: quiz.company });

      // If the quiz does not exist, create a new one
      if (!existingQuiz) {
        const newQuiz = new Quiz(quiz);
        await newQuiz.save();
        console.log(`Quiz for ${quiz.company} saved successfully!`);
      } else {
        // If quiz exists, check for new questions
        for (const question of quiz.questions) {
          // Check if the question already exists
          const existingQuestion = existingQuiz.questions.find(
            (q) => q.question === question.question
          );

          if (!existingQuestion) {
            // If question doesn't exist, add it to the existing quiz
            existingQuiz.questions.push(question);
            console.log(
              `New question added to ${quiz.company}: ${question.question}`
            );
          } else {
            console.log(
              `Question already exists for ${quiz.company}: ${question.question}`
            );
          }
        }

        // Save the updated quiz
        await existingQuiz.save();
        console.log(`Updated quiz for ${quiz.company} saved successfully!`);
      }
    }
  } catch (error) {
    console.error("Error while seeding quizzes:", error);
  }
};

export default seedQuizzes;
