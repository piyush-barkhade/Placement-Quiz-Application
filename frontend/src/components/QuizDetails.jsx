import React, { useEffect, useState } from "react";
import axios from "axios";
import Confetti from "react-confetti";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx"; // Import useAuth hook
import "../styles/QuizDetails.css";

const QuizDetails = () => {
  const { company } = useParams();
  const { authToken, userId, email } = useAuth(); // Get authToken and userId from context
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [quizStarted, setQuizStarted] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showRules, setShowRules] = useState(true);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [windowHeight, setWindowHeight] = useState(window.innerHeight);
  const [warningCount, setWarningCount] = useState(0); // Track window violations
  const [isCooldownActive, setIsCooldownActive] = useState(false); // Flag to check cooldown state

  // Redirect if the user is not logged in
  useEffect(() => {
    if (!authToken) {
      alert("You need to be logged in to take the quiz.");
      navigate("/login"); // Redirect to login page
    }
  }, [authToken, navigate]);

  useEffect(() => {
    const fetchQuiz = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `http://localhost:5000/quiz/${company}`
        );
        setQuiz(response.data);
      } catch (err) {
        setError("Error fetching quiz");
      } finally {
        setLoading(false);
      }
    };

    fetchQuiz();
  }, [company]);

  // Track window size changes for Confetti
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      setWindowHeight(window.innerHeight);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Consolidated violation handling in a single useEffect
  useEffect(() => {
    if (!quizStarted || isSubmitted) return;

    const handleViolation = () => {
      if (isCooldownActive) return; // Ignore event if in cooldown period

      setIsCooldownActive(true); // Activate cooldown

      setWarningCount((prevCount) => {
        const newCount = prevCount + 1;

        if (newCount > 2) {
          alert(
            "You have violated the window switching rule too many times. The quiz will be submitted automatically."
          );
          saveProgress();
          setIsSubmitted(true); // Auto-submit quiz
          return newCount; // Prevent further warnings
        } else {
          alert(
            `Warning: Switching windows or focus is not allowed. You have ${
              2 - newCount
            } warnings left.`
          );
          return newCount;
        }
      });

      // Reset cooldown after 1 second
      setTimeout(() => {
        setIsCooldownActive(false);
      }, 1000); // Cooldown period of 1 second
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        console.log("hidden");
        handleViolation();
      }
    };

    const handleBlur = () => {
      console.log("Blur");
      handleViolation();
    };

    const handleResizeCheck = () => {
      if (
        window.innerWidth < window.screen.width * 0.8 ||
        window.innerHeight < window.screen.height * 0.8
      ) {
        console.log("resize");
        handleViolation();
      }
    };

    // Add event listeners for all violations
    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("blur", handleBlur);
    window.addEventListener("resize", handleResizeCheck);

    return () => {
      // Clean up event listeners
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("blur", handleBlur);
      window.removeEventListener("resize", handleResizeCheck);
    };
  }, [quizStarted, isSubmitted, isCooldownActive]);

  const handleOptionClick = (option) => {
    if (answers[currentQuestionIndex]) {
      return;
    }

    const answerData = {
      selectedOption: option,
    };

    setAnswers((prevAnswers) => {
      const newAnswers = [...prevAnswers];
      newAnswers[currentQuestionIndex] = answerData;
      return newAnswers;
    });
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const previousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const startQuiz = () => {
    setShowRules(false);
    setQuizStarted(true);
    setAnswers(Array(quiz.questions.length).fill(null));
  };

  const submitQuiz = () => {
    const allAnswered = answers.every((answer) => answer !== null);

    if (allAnswered) {
      // Only save progress if not already submitted
      if (!isSubmitted) {
        saveProgress(); // Save progress before submitting

        setIsSubmitted(true);
      } else {
        console.log("Quiz already submitted.");
      }
    } else {
      console.log("Please answer all questions before submitting the quiz.");
    }
  };

  const saveProgress = async () => {
    if (!userId) {
      console.error("User ID is missing. Cannot save progress.");
      return;
    }

    // Prevent saving twice if already submitted
    if (isSubmitted) {
      console.log("Quiz already submitted, not saving again.");
      return;
    }

    const score = calculateScore();
    const progressData = {
      userId: userId, // Now it should be valid
      quizId: quiz._id,
      answers: answers.map((answer, index) => {
        if (answer === null) {
          // If the answer is null, return a default value (null or empty)
          return {
            questionId: quiz.questions[index]._id,
            selectedOption: null,
            isCorrect: false, // No answer selected, so it's incorrect
          };
        }

        // If the answer is not null, continue as normal
        return {
          questionId: quiz.questions[index]._id,
          selectedOption: answer.selectedOption,
          isCorrect:
            answer.selectedOption === quiz.questions[index].correctAnswer,
        };
      }),
      score,
      violationsCount: warningCount,
      windowViolated: warningCount > 0,
      completed: true,
      submittedAt: new Date(), // Add submitted at timestamp
    };

    console.log("Sending progress data: ", progressData); // Log the progress data

    const userProgress = {
      quiz: quiz._id, // Ensure quiz._id is available
      name: quiz.company,
      score: score, // Ensure score is a number
      completed: true, // or false based on the user's progress
      submittedAt: new Date(), // Date when the progress was submitted
    };

    console.log("User Progress Data:", userProgress);

    try {
      await saveUserProgress(userProgress);
      await saveQuizProgress(progressData);
      await saveLeaderboardData(score); // Save leaderboard data
    } catch (err) {
      console.error("Error saving progress:", err); // Log any errors from Axios
    }
  };

  const saveQuizProgress = async (progressData) => {
    try {
      const response = await axios.post(
        "http://localhost:5000/progress",
        progressData,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      console.log("Progress saved:", response); // Log the response from the server
    } catch (err) {
      throw new Error("Error saving quiz progress");
    }
  };

  const saveUserProgress = async (userProgress) => {
    try {
      const userProgressData = await axios.put(
        `http://localhost:5000/users/${userId}/update-progress`,
        userProgress, // Send progress data directly
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      console.log("User progress data success", userProgressData);
    } catch (err) {
      throw new Error("Error saving user progress");
    }
  };

  const saveLeaderboardData = async (score) => {
    try {
      const userResponse = await axios.get(
        `http://localhost:5000/user/${email}`
      );
      const user = userResponse.data; // Assuming the backend sends user data

      const leaderboardData = {
        userId: userId, // The user's ID
        userName: user.username, // You can replace this with the actual username if available in your context
        quizId: quiz._id, // The quiz ID
        score: score, // The score achieved
        submittedAt: new Date(), // Timestamp of when the quiz was submitted
      };

      // Post the leaderboard data to the server
      const response = await axios.post(
        "http://localhost:5000/updateLeaderboard",
        leaderboardData,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      console.log("Leaderboard saved successfully:", response);
    } catch (err) {
      console.error("Error saving leaderboard data:", err);
    }
  };

  const calculateScore = () => {
    return answers.reduce((score, answer, index) => {
      if (
        answer &&
        quiz.questions[index].correctAnswer === answer.selectedOption
      ) {
        return score + 1;
      }
      return score;
    }, 0);
  };

  const calculateTotalPoints = () => {
    return calculateScore() * 10;
  };

  const generateScoreMessage = () => {
    const score = calculateScore();
    const totalQuestions = quiz.questions.length;

    let message = "";
    let className = "";

    if (score === totalQuestions) {
      message = "Exceptional! You've mastered the content.";
      className = "exceptional";
    } else if (score >= totalQuestions * 0.75) {
      message = "Great work! You're very close to perfection.";
      className = "great";
    } else if (score >= totalQuestions * 0.5) {
      message = "Good effort! A little more practice will get you there.";
      className = "good";
    } else {
      message = "Keep going! Every attempt sharpens your skills.";
      className = "keep-going";
    }

    return (
      <div className="score-message">
        <p className={className}>{message}</p>
      </div>
    );
  };

  const isSubmitEnabled = quiz && answers.every((answer) => answer !== null);

  return (
    <div className="quiz-details-container">
      <h2 className="quiz-name">{company.toUpperCase()} Quiz</h2>

      {loading && <p className="loading-message">Loading quiz...</p>}
      {error && <p className="error-message">{error}</p>}

      {showRules && quiz && (
        <div className="quiz-rules">
          <h2>Quiz Rules</h2>
          {quiz.rules &&
            quiz.rules.map((rule, index) => <p key={index}>{rule}</p>)}
          {!quiz.rules && (
            <>
              <p>1. Answer all the questions.</p>
              <p>2. You cannot change your answer once submitted.</p>
              <p>3. Each question carries 10 points.</p>
            </>
          )}
          <button onClick={startQuiz} className="start-button">
            Start Quiz
          </button>
        </div>
      )}

      {!showRules && !quizStarted && quiz && (
        <button className="start-button" onClick={startQuiz}>
          Start Quiz
        </button>
      )}

      {quizStarted && !isSubmitted && quiz && (
        <div className="quiz-question">
          <h3>
            Q{currentQuestionIndex + 1}.&nbsp;
            {quiz.questions[currentQuestionIndex].question}
          </h3>
          <ul>
            {quiz.questions[currentQuestionIndex].options.map((option, idx) => {
              const answer = answers[currentQuestionIndex];
              const isSelected = answer && answer.selectedOption === option;

              return (
                <li
                  key={idx}
                  className={`option ${
                    isSelected
                      ? quiz.questions[currentQuestionIndex].correctAnswer ===
                        option
                        ? "correct"
                        : "incorrect"
                      : ""
                  }`}
                  onClick={() => handleOptionClick(option)}
                >
                  {option}
                </li>
              );
            })}
          </ul>

          {answers[currentQuestionIndex] && (
            <>
              <p
                className={`feedback ${
                  quiz.questions[currentQuestionIndex].correctAnswer ===
                  answers[currentQuestionIndex].selectedOption
                    ? "correct"
                    : "incorrect"
                }`}
              >
                {quiz.questions[currentQuestionIndex].correctAnswer ===
                answers[currentQuestionIndex].selectedOption
                  ? "Correct!"
                  : "Incorrect!"}
              </p>
              <p
                className="correct-answer"
                style={{
                  display:
                    quiz.questions[currentQuestionIndex].correctAnswer !==
                    answers[currentQuestionIndex].selectedOption
                      ? "block"
                      : "none",
                }}
              >
                The correct answer is:{" "}
                {quiz.questions[currentQuestionIndex].correctAnswer}
              </p>
            </>
          )}

          <div className="navigation-buttons">
            <button
              onClick={previousQuestion}
              disabled={currentQuestionIndex === 0}
            >
              Previous
            </button>
            <button
              onClick={nextQuestion}
              disabled={currentQuestionIndex === quiz.questions.length - 1}
            >
              Next
            </button>
          </div>
        </div>
      )}

      {isSubmitted && (
        <div className="score">
          <h3>
            Your Score: <span>{calculateScore()}</span> /{" "}
            {quiz.questions.length}
          </h3>
          <br />
          <h3>Total Points Earned: {calculateTotalPoints()} Points</h3>
          {generateScoreMessage()}
        </div>
      )}

      {quizStarted &&
        !isSubmitted &&
        currentQuestionIndex === quiz.questions.length - 1 && (
          <button
            onClick={submitQuiz}
            className="submit-button"
            disabled={!isSubmitEnabled}
          >
            Submit Quiz
          </button>
        )}

      {isSubmitted && <Confetti width={windowWidth} height={windowHeight} />}
    </div>
  );
};

export default QuizDetails;
