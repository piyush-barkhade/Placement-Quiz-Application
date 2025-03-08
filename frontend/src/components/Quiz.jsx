import React, { useEffect, useState } from "react";
import axios from "axios";
import { NavLink } from "react-router-dom"; // Importing NavLink for routing
import "../styles/Quiz.css"; // Importing the CSS file

const Quiz = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [error, setError] = useState("");

  // Fetch quizzes from the backend
  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/quiz/`);
        setQuizzes(response.data); // assuming that the response is an array of quizzes
      } catch (err) {
        setError("Error fetching quizzes");
      }
    };
    fetchQuizzes();
  }, []);

  return (
    <div className="quiz-container">
      <div className="header">
        <h2>Available Quizzes</h2>
      </div>

      {/* Show error message if there's any error */}
      {error && <p className="error-message">{error}</p>}

      {/* Show quiz links based on the data */}
      {quizzes.length > 0 ? (
        <div className="quiz-links">
          {quizzes.map((quiz) => (
            <NavLink
              key={quiz.company}
              to={`/quiz/${quiz.company.toLowerCase()}`} // Use company name as part of the URL
              className="quiz-link"
            >
              <img
                src={`images/${quiz.company.toLowerCase()}.webp`} // Assuming company name matches image file name
                alt={`${quiz.company} logo`}
              />
              <p>Go to {quiz.company} Quiz</p>
            </NavLink>
          ))}
        </div>
      ) : (
        <p className="no-quizzes-message">No quizzes available</p>
      )}
    </div>
  );
};

export default Quiz;
